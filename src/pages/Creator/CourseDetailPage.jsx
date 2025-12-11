import React, { useState, useEffect } from 'react';
import { FaBook, FaFilePdf, FaVideo, FaImage, FaFile, FaEdit, FaCheckCircle, FaClock, FaTimesCircle, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import CreateurService from '../../services/CreateurService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [supports, setSupports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSupports, setLoadingSupports] = useState(true);

  useEffect(() => {
    fetchCourse();
    fetchSupports();
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

  const fetchSupports = async () => {
    try {
      setLoadingSupports(true);
      const data = await CreateurService.getCourseSupports(id);
      console.log('Fetched supports:', data);
      setSupports(data);
    } catch (err) {
      console.error('Error fetching supports:', err);
      toast.error('Erreur lors du chargement des supports');
      setSupports([]);
    } finally {
      setLoadingSupports(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const getSupportIcon = (type) => {
    switch (type) {
      case 'PDF': return <FaFilePdf className="text-red-600 text-2xl" />;
      case 'VIDEO': return <FaVideo className="text-blue-600 text-2xl" />;
      case 'IMAGE': return <FaImage className="text-green-600 text-2xl" />;
      default: return <FaFile className="text-gray-600 text-2xl" />;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/creator/courses')}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <FaArrowLeft /> Retour à mes cours
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-800">{course.titre}</h1>
                <ValidationBadge status={course.valideParAdmin} />
              </div>
              <p className="text-gray-600 text-lg mb-4">{course.description}</p>
              
              {/* Metadata */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">ID:</span>
                  <span className="ml-2 font-medium text-gray-700">{course.id}</span>
                </div>
                <div>
                  <span className="text-gray-500">Créateur:</span>
                  <span className="ml-2 font-medium text-gray-700">{course.createurId}</span>
                </div>
                <div>
                  <span className="text-gray-500">Supports:</span>
                  <span className="ml-2 font-medium text-gray-700">{supports.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Créé le:</span>
                  <span className="ml-2 font-medium text-gray-700">
                    {course.dateCreation ? new Date(course.dateCreation).toLocaleDateString('fr-FR') : 'N/A'}
                  </span>
                </div>
              </div>

              {course.dateModification && (
                <div className="text-sm text-gray-500 mt-3">
                  Dernière modification: {formatDate(course.dateModification)}
                </div>
              )}
            </div>
            
            <button
              onClick={() => navigate(`/creator/courses/${course.id}/edit`)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              <FaEdit /> Modifier
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Supports</p>
              <p className="text-4xl font-bold">{supports.length}</p>
            </div>
            <FaBook className="text-5xl text-blue-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-1">Fichiers PDF</p>
              <p className="text-4xl font-bold">
                {supports.filter(s => s.typeSupport === 'PDF').length}
              </p>
            </div>
            <FaFilePdf className="text-5xl text-red-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Vidéos</p>
              <p className="text-4xl font-bold">
                {supports.filter(s => s.typeSupport === 'VIDEO').length}
              </p>
            </div>
            <FaVideo className="text-5xl text-purple-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Images</p>
              <p className="text-4xl font-bold">
                {supports.filter(s => s.typeSupport === 'IMAGE').length}
              </p>
            </div>
            <FaImage className="text-5xl text-green-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          📝 Description du cours
        </h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</p>
      </div>

      {/* Supports Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
              <FaBook className="text-indigo-600" />
              Supports Pédagogiques Détaillés
            </h2>
            <p className="text-gray-600 text-sm">
              {loadingSupports ? 'Chargement...' : `${supports.length} fichier${supports.length !== 1 ? 's' : ''} disponible${supports.length !== 1 ? 's' : ''} pour ce cours`}
            </p>
          </div>
          <button
            onClick={() => navigate(`/creator/courses/edit/${course.id}`)}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
          >
            + Ajouter des fichiers
          </button>
        </div>

        {loadingSupports ? (
          <div className="text-center py-12">
            <LoadingSpinner />
          </div>
        ) : supports.length === 0 ? (
          <div className="text-center py-12">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Aucun support pédagogique pour ce cours</p>
            <button
              onClick={() => navigate(`/creator/courses/edit/${course.id}`)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ajouter des fichiers
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {supports.map((support, index) => (
              <div
                key={support.id}
                className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-white rounded-lg shadow-sm">
                        {getSupportIcon(support.typeSupport)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-800 mb-1">
                          {support.fileName || `Support ${index + 1}`}
                        </h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-full">
                            {support.typeSupport}
                          </span>
                          <span className="text-sm text-gray-500">
                            Support #{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={support.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium whitespace-nowrap"
                    >
                      <FaExternalLinkAlt /> Ouvrir
                    </a>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">ID Support</p>
                      <p className="font-mono text-sm font-semibold text-gray-800">{support.id}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Type de fichier</p>
                      <p className="text-sm font-semibold text-gray-800">
                        {support.typeSupport === 'PDF' && '📄 Document PDF'}
                        {support.typeSupport === 'VIDEO' && '🎥 Fichier Vidéo'}
                        {support.typeSupport === 'IMAGE' && '🖼️ Fichier Image'}
                        {support.typeSupport === 'DOCUMENT' && '📃 Document'}
                        {!['PDF', 'VIDEO', 'IMAGE', 'DOCUMENT'].includes(support.typeSupport) && '📎 Fichier'}
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Nom du fichier</p>
                      <p className="text-sm font-semibold text-gray-800 truncate" title={support.fileName}>
                        {support.fileName || 'Sans nom'}
                      </p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg md:col-span-2 lg:col-span-3">
                      <p className="text-xs text-gray-500 mb-1">URL Cloudinary</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 truncate flex-1 font-mono bg-gray-50 px-2 py-1 rounded" title={support.url}>
                          {support.url}
                        </p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(support.url);
                            toast.success('URL copiée !');
                          }}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors whitespace-nowrap"
                        >
                          Copier
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                    <a
                      href={support.url}
                      download
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                      Télécharger
                    </a>
                    <a
                      href={support.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      Prévisualiser
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
