import React, { useState, useEffect } from 'react';
import { FaBook, FaCheckCircle, FaClock, FaTimesCircle, FaChevronDown, FaChevronUp, FaExternalLinkAlt, FaFilePdf, FaVideo, FaImage, FaFile } from 'react-icons/fa';
import CreateurService from '../../services/CreateurService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCourseId, setExpandedCourseId] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await CreateurService.getAllCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      toast.error('Erreur lors du chargement des cours');
      setCourses([]);
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

  const getSupportIcon = (typeSupport) => {
    switch (typeSupport) {
      case 'PDF': return <FaFilePdf className="text-red-600 text-xl" />;
      case 'VIDEO': return <FaVideo className="text-blue-600 text-xl" />;
      case 'IMAGE': return <FaImage className="text-green-600 text-xl" />;
      case 'DOCUMENT': return <FaFile className="text-purple-600 text-xl" />;
      default: return <FaFile className="text-gray-600 text-xl" />;
    }
  };

  const toggleExpand = (courseId) => {
    setExpandedCourseId(expandedCourseId === courseId ? null : courseId);
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
    rejected: courses.filter(c => c.valideParAdmin === false).length,
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Liste des Cours</h1>
        <p className="text-gray-600">Consultez tous les cours et leurs supports</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <FaBook className="text-indigo-600 text-4xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Validés</p>
              <p className="text-3xl font-bold text-green-600">{stats.validated}</p>
            </div>
            <FaCheckCircle className="text-green-600 text-4xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">En attente</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <FaClock className="text-yellow-600 text-4xl" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Rejetés</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <FaTimesCircle className="text-red-600 text-4xl" />
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
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter('validated')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'validated'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Validés ({stats.validated})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'pending'
                ? 'text-yellow-600 border-b-2 border-yellow-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            En attente ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'rejected'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Rejetés ({stats.rejected})
          </button>
        </div>
      </div>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun cours trouvé</h3>
          <p className="text-gray-500">
            {filter === 'all'
              ? 'Aucun cours disponible'
              : `Aucun cours ${filter === 'validated' ? 'validé' : filter === 'pending' ? 'en attente' : 'rejeté'}`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredCourses.map(course => {
              const isExpanded = expandedCourseId === course.id;
              const supports = course.supports || [];

              return (
                <div key={course.id}>
                  {/* Course Header */}
                  <div
                    className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => toggleExpand(course.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <FaBook className="text-indigo-600 text-2xl flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 truncate">
                            {course.titre}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-gray-500">ID: {course.id}</span>
                            <span className="text-sm text-gray-500">
                              {supports.length} support(s)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <ValidationBadge status={course.valideParAdmin} />
                        {isExpanded ? (
                          <FaChevronUp className="text-gray-400 text-xl" />
                        ) : (
                          <FaChevronDown className="text-gray-400 text-xl" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content - Supports */}
                  {isExpanded && (
                    <div className="px-6 pb-6 bg-gray-50 border-t border-gray-200">
                      <div className="pt-4">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          Supports Pédagogiques ({supports.length})
                        </h4>
                        {supports.length === 0 ? (
                          <p className="text-gray-500 text-center py-6">
                            Aucun support pédagogique pour ce cours
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {supports.map((support, index) => (
                              <div
                                key={support.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {getSupportIcon(support.typeSupport)}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-800 truncate">
                                      {support.titre || support.fileName || `Support ${index + 1}`}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-500 truncate">
                                        {support.fileName}
                                      </span>
                                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                                        {support.typeSupport}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <a
                                  href={support.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm ml-4"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <FaExternalLinkAlt /> Ouvrir
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesList;
