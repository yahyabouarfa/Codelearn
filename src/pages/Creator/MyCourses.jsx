import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiPlus, FiEye, FiEdit, FiClock, FiCheckCircle, FiXCircle, FiFileText, FiVideo, FiImage, FiFile } from 'react-icons/fi';
import CreateurService from '../../services/CreateurService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await CreateurService.getMyCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Erreur lors du chargement des cours');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (valideParAdmin) => {
    if (valideParAdmin === null) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <FiClock className="mr-1" />
          En attente
        </span>
      );
    } else if (valideParAdmin === true) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <FiCheckCircle className="mr-1" />
          Validé
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <FiXCircle className="mr-1" />
          Rejeté
        </span>
      );
    }
  };

  const getSupportIcon = (typeSupport) => {
    switch (typeSupport?.toUpperCase()) {
      case 'PDF':
        return <FiFileText className="text-red-500" />;
      case 'VIDEO':
        return <FiVideo className="text-blue-500" />;
      case 'IMAGE':
        return <FiImage className="text-green-500" />;
      default:
        return <FiFile className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'validated') return course.valideParAdmin === true;
    if (filter === 'pending') return course.valideParAdmin === null;
    if (filter === 'rejected') return course.valideParAdmin === false;
    return true;
  });
  const stats = {
    total: courses.length,
    validated: courses.filter(c => c.valideParAdmin === true).length,
    pending: courses.filter(c => c.valideParAdmin === null).length,
    rejected: courses.filter(c => c.valideParAdmin === false).length
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des cours..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Mes Cours</h1>
          <p className="text-gray-600 mt-2">Gérez et consultez tous vos cours</p>
        </div>
        <button
          onClick={() => navigate('/creator/courses/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus />
          Créer un cours
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FiBook className="text-4xl text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Validés</p>
              <p className="text-3xl font-bold text-green-600">{stats.validated}</p>
            </div>
            <FiCheckCircle className="text-4xl text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <FiClock className="text-4xl text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejetés</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <FiXCircle className="text-4xl text-red-500" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter('validated')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'validated'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Validés ({stats.validated})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'pending'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            En attente ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'rejected'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rejetés ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FiBook className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg mb-4">Aucun cours trouvé</p>
          <button
            onClick={() => navigate('/creator/courses/create')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Créer votre premier cours
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                {/* Status Badge */}
                <div className="mb-3">
                  {getStatusBadge(course.valideParAdmin)}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {course.titre}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                {/* Supports */}
                {course.supports && course.supports.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="text-sm text-gray-500">Supports:</span>
                    {course.supports.slice(0, 3).map((support, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-sm">
                        {getSupportIcon(support.typeSupport)}
                      </span>
                    ))}
                    {course.supports.length > 3 && (
                      <span className="text-sm text-gray-500">
                        +{course.supports.length - 3} plus
                      </span>
                    )}
                  </div>
                )}

                {/* Date */}
                <div className="text-sm text-gray-500 mb-4">
                  Créé le {formatDate(course.dateCreation)}
                  {course.dateModification && (
                    <span className="block">Modifié le {formatDate(course.dateModification)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/creator/courses/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <FiEye />
                    Voir
                  </button>
                  <button
                    onClick={() => navigate(`/creator/courses/edit/${course.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <FiEdit />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
