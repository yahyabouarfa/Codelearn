import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSave, FaUpload, FaFilePdf, FaVideo, FaTimes, FaArrowLeft, FaBook } from 'react-icons/fa';
import CreateurService from '../../services/CreateurService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const FILE_SIZE_LIMIT = 50 * 1024 * 1024; // 50MB
const ACCEPTED_FILE_TYPES = {
  PDF: ['.pdf'],
  VIDEO: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.mkv']
};

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

const CreateCourse = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [withFiles, setWithFiles] = useState(false);

  const initialValues = {
    titre: '',
    description: '',
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    
    files.forEach(file => {
      // Check file size
      if (file.size > FILE_SIZE_LIMIT) {
        toast.error(`${file.name} dépasse la limite de 50MB`);
        return;
      }
      
      // Auto-detect type based on extension
      const isPdf = file.name.toLowerCase().endsWith('.pdf');
      const type = isPdf ? 'PDF' : 'VIDEO';
      
      validFiles.push({
        file,
        type,
        name: file.name,
        size: file.size,
        id: Date.now() + Math.random()
      });
    });
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    event.target.value = ''; // Reset input
  };

  const removeFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const changeFileType = (fileId, newType) => {
    setSelectedFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, type: newType } : f
    ));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setUploadProgress(0);

    try {
      const courseData = {
        titre: values.titre,
        description: values.description
      };

      let response;

      if (withFiles && selectedFiles.length > 0) {
        // Create course with files
        const files = selectedFiles.map(sf => sf.file);
        const types = selectedFiles.map(sf => sf.type);

        response = await CreateurService.createCourseWithFiles(
          courseData,
          files,
          types,
          setUploadProgress
        );

        toast.success(`Cours créé avec ${selectedFiles.length} fichier(s) !`);
      } else {
        // Create simple course without files
        response = await CreateurService.createCourse(courseData);
        toast.success('Cours créé avec succès ! (En attente de validation)');
      }

      // Navigate to courses list after successful creation
      setTimeout(() => {
        navigate('/creator/courses');
      }, 1500);
    } catch (error) {
      console.error('Error creating course:', error);
      
      // Check if it's a 401 error
      if (error.response?.status === 401) {
        toast.error('Session expirée. Veuillez vous reconnecter.');
      } else {
        toast.error(error.response?.data?.error || error.response?.data?.message || error.message || 'Erreur lors de la création du cours');
      }
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FaBook className="text-indigo-600 text-3xl" />
          <h1 className="text-3xl font-bold text-gray-800">Créer un Nouveau Cours</h1>
        </div>
        <p className="text-gray-600">Remplissez les informations du cours et ajoutez des fichiers (optionnel)</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={courseValidationSchema}
          onSubmit={handleSubmit}
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
                  placeholder="Ex: Introduction à React.js"
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
                  placeholder="Décrivez votre cours en détail..."
                  disabled={submitting}
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* File Upload Toggle */}
              <div className="border-t pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="withFiles"
                    checked={withFiles}
                    onChange={(e) => setWithFiles(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                    disabled={submitting}
                  />
                  <label htmlFor="withFiles" className="text-sm font-semibold text-gray-700">
                    Ajouter des fichiers (PDF/Vidéo) maintenant
                  </label>
                </div>

                {withFiles && (
                  <div className="space-y-4">
                    {/* File Input */}
                    <div>
                      <label className="flex items-center justify-center w-full px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors bg-gray-50">
                        <div className="text-center">
                          <FaUpload className="mx-auto text-gray-400 text-4xl mb-3" />
                          <p className="text-sm text-gray-600 mb-1">
                            Cliquez pour sélectionner des fichiers
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF ou Vidéo (Max 50MB par fichier)
                          </p>
                        </div>
                        <input
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          accept=".pdf,.mp4,.avi,.mov,.wmv,.flv,.mkv"
                          disabled={submitting}
                        />
                      </label>
                    </div>

                    {/* Selected Files List */}
                    {selectedFiles.length > 0 && (
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-700">
                          Fichiers sélectionnés ({selectedFiles.length})
                        </h3>
                        {selectedFiles.map((fileItem) => (
                          <div
                            key={fileItem.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {fileItem.type === 'PDF' ? (
                                <FaFilePdf className="text-red-600 text-xl" />
                              ) : (
                                <FaVideo className="text-blue-600 text-xl" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">
                                  {fileItem.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatFileSize(fileItem.size)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {/* Type Toggle */}
                              <select
                                value={fileItem.type}
                                onChange={(e) => changeFileType(fileItem.id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                                disabled={submitting}
                              >
                                <option value="PDF">PDF</option>
                                <option value="VIDEO">VIDEO</option>
                              </select>
                              {/* Remove Button */}
                              <button
                                type="button"
                                onClick={() => removeFile(fileItem.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                                disabled={submitting}
                              >
                                <FaTimes />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

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

              {/* Submit Button */}
              <div className="flex justify-end pt-6 border-t">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={submitting || !isValid}
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {withFiles && selectedFiles.length > 0 ? 'Upload en cours...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <FaSave />
                      {withFiles && selectedFiles.length > 0
                        ? `Créer avec ${selectedFiles.length} fichier(s)`
                        : 'Créer le Cours'}
                    </>
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateCourse;
