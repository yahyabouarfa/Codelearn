import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaArrowLeft, FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import CreateurService from '../../services/CreateurService';
import FileUploader from '../../components/common/FileUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const courseValidationSchema = Yup.object().shape({
  titre: Yup.string()
    .required('Le titre est requis')
    .min(5, 'Le titre doit contenir au moins 5 caractères')
    .max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  description: Yup.string()
    .required('La description est requise')
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(5000, 'La description ne peut pas dépasser 5000 caractères'),
});

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newFiles, setNewFiles] = useState([]);
  const [newFileTypes, setNewFileTypes] = useState([]);
  const [showAddFiles, setShowAddFiles] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await CreateurService.getCourseById(id);
      setCourse(data);
    } catch (err) {
      console.error('Error fetching course:', err);
      toast.error('Erreur lors du chargement du cours');
      navigate('/creator/courses');
    } finally {
      setLoading(false);
    }
  };

  const ValidationBadge = ({ status }) => {
    if (status === true) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex items-center gap-1">
          <FaCheckCircle /> Validé
        </span>
      );
    }
    if (status === false) {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold flex items-center gap-1">
          <FaTimesCircle /> Rejeté
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold flex items-center gap-1">
        <FaClock /> En attente
      </span>
    );
  };

  const handleUpdateCourse = async (values) => {
    if (!window.confirm('⚠️ Attention: Modifier ce cours réinitialisera le statut de validation à "En attente". Le cours devra être validé à nouveau par un administrateur. Continuer?')) {
      return;
    }

    setSubmitting(true);
    try {
      await CreateurService.updateCourse(id, {
        titre: values.titre,
        description: values.description
      });
      toast.success('Cours modifié avec succès ! Validation réinitialisée.');
      navigate('/creator/courses');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la modification du cours');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddFiles = async () => {
    if (newFiles.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier');
      return;
    }

    if (!window.confirm(`⚠️ Ajouter ${newFiles.length} fichier(s) réinitialisera le statut de validation à "En attente". Continuer?`)) {
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      await CreateurService.addFilesToCourse(id, newFiles, newFileTypes, setUploadProgress);
      toast.success(`${newFiles.length} fichier(s) ajouté(s) avec succès !`);
      setNewFiles([]);
      setNewFileTypes([]);
      setShowAddFiles(false);
      fetchCourse(); // Reload course data
    } catch (error) {
      console.error('Error adding files:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout des fichiers');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/creator/courses')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <FaArrowLeft /> Retour à mes cours
        </button>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Modifier le Cours</h1>
          <ValidationBadge status={course.valideParAdmin} />
        </div>
        <p className="text-gray-600">ID du cours: {course.id}</p>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-yellow-600 text-xl mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Attention</h3>
            <p className="text-sm text-yellow-700">
              Modifier ce cours réinitialisera le statut de validation à "En attente". 
              Le cours devra être validé à nouveau par un administrateur.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Informations du Cours</h2>
        <Formik
          initialValues={{
            titre: course.titre,
            description: course.description
          }}
          validationSchema={courseValidationSchema}
          onSubmit={handleUpdateCourse}
          enableReinitialize
        >
          {({ errors, touched, isValid }) => (
            <Form className="space-y-6">
              {/* Titre */}
              <div>
                <label htmlFor="titre" className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre du Cours *
                </label>
                <Field
                  id="titre"
                  name="titre"
                  type="text"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.titre && touched.titre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                <ErrorMessage name="titre" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows="6"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.description && touched.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={submitting}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate('/creator/courses')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
                  disabled={submitting || !isValid}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <FaSave /> Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Existing Supports */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Supports pédagogiques ({course.supports?.length || 0})
        </h2>
        {course.supports && course.supports.length > 0 ? (
          <div className="space-y-3">
            {course.supports.map((support, index) => (
              <div key={support.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{support.fileName || `Support ${index + 1}`}</p>
                  <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded mt-1 inline-block">
                    {support.typeSupport}
                  </span>
                </div>
                <a
                  href={support.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Voir
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Aucun support pédagogique</p>
        )}
      </div>

      {/* Add New Files */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Ajouter des fichiers</h2>
          <button
            onClick={() => setShowAddFiles(!showAddFiles)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            disabled={submitting}
          >
            {showAddFiles ? 'Annuler' : 'Ajouter des fichiers'}
          </button>
        </div>

        {showAddFiles && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-700">
                ⚠️ L'ajout de fichiers réinitialisera le statut de validation à "En attente"
              </p>
            </div>

            <FileUploader
              onFilesChange={setNewFiles}
              onTypesChange={setNewFileTypes}
            />

            {newFiles.length > 0 && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setNewFiles([]);
                    setNewFileTypes([]);
                    setShowAddFiles(false);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={submitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddFiles}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={submitting}
                >
                  {submitting ? 'Upload en cours...' : `Ajouter ${newFiles.length} fichier(s)`}
                </button>
              </div>
            )}

            {/* Upload Progress */}
            {submitting && uploadProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Upload en cours...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditCourse;
