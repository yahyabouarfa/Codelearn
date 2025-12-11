import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaBook, FaFilePdf, FaVideo, FaImage, FaArrowLeft, FaDownload, FaUser, FaExternalLinkAlt } from 'react-icons/fa';
import ApprenantService from '../../services/ApprenantService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ApprenantCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingSupport, setDownloadingSupport] = useState(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const data = await ApprenantService.getCourseById(id);
      setCourse(data);
    } catch (err) {
      console.error('Error fetching course:', err);
      toast.error('Erreur lors du chargement du cours');
      navigate('/apprenant/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSupport = async (supportId, supportTitle, supportType) => {
    try {
      setDownloadingSupport(supportId);
      const data = await ApprenantService.accessSupport(supportId);
      
      // Open the temporary URL in a new tab
      window.open(data.temporaryUrl, '_blank');
      
      toast.success(`Ouverture de ${supportTitle}...`);
    } catch (error) {
      console.error('Error accessing support:', error);
      toast.error('Erreur lors de l\'accès au support');
    } finally {
      setDownloadingSupport(null);
    }
  };

  const getSupportIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return <FaFilePdf className="text-red-500" />;
      case 'VIDEO':
        return <FaVideo className="text-purple-500" />;
      case 'IMAGE':
        return <FaImage className="text-green-500" />;
      default:
        return <FaBook className="text-blue-500" />;
    }
  };

  const getSupportTypeLabel = (type) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return 'Document PDF';
      case 'VIDEO':
        return 'Vidéo';
      case 'IMAGE':
        return 'Image';
      case 'LINK':
        return 'Lien externe';
      case 'PRESENTATION':
        return 'Présentation';
      case 'CODE':
        return 'Code source';
      default:
        return 'Autre';
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return null;

  const supports = course.supports || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/apprenant/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
        >
          <FaArrowLeft /> Retour aux cours
        </button>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-8 text-white">
          <div className="flex items-start gap-4">
            <FaBook className="text-5xl opacity-80 flex-shrink-0" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
              <div className="flex items-center gap-2 text-blue-100">
                <FaUser />
                <span>Par {course.authorName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              <p className="text-red-100 text-sm mb-1">Documents PDF</p>
              <p className="text-4xl font-bold">
                {supports.filter(s => s.type?.toUpperCase() === 'PDF').length}
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
                {supports.filter(s => s.type?.toUpperCase() === 'VIDEO').length}
              </p>
            </div>
            <FaVideo className="text-5xl text-purple-200 opacity-50" />
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
          📝 Description du cours
        </h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{course.description}</p>
      </div>

      {/* Supports Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
            <FaBook className="text-blue-600" />
            Supports Pédagogiques
          </h2>
          <p className="text-gray-600 text-sm">
            {supports.length} fichier{supports.length !== 1 ? 's' : ''} disponible{supports.length !== 1 ? 's' : ''} pour ce cours
          </p>
        </div>

        {supports.length === 0 ? (
          <div className="text-center py-12">
            <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-500">Aucun support pédagogique disponible pour ce cours</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {supports.map((support, index) => (
              <div
                key={support.id}
                className="bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl mt-1">
                        {getSupportIcon(support.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">
                          {support.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                            {getSupportTypeLabel(support.type)}
                          </span>
                          <span>Support #{support.id}</span>
                        </div>
                        {support.description && (
                          <p className="text-gray-600 text-sm">{support.description}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleDownloadSupport(support.id, support.title, support.type)}
                      disabled={downloadingSupport === support.id}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingSupport === support.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Chargement...</span>
                        </>
                      ) : (
                        <>
                          {support.type?.toUpperCase() === 'VIDEO' ? (
                            <>
                              <FaExternalLinkAlt />
                              <span>Voir la vidéo</span>
                            </>
                          ) : (
                            <>
                              <FaDownload />
                              <span>Télécharger</span>
                            </>
                          )}
                        </>
                      )}
                    </button>
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

export default ApprenantCourseDetail;
