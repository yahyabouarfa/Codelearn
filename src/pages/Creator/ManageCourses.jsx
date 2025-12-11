import React, { useState, useEffect } from 'react';
import { FaBook, FaCheckCircle, FaClock, FaTimesCircle, FaPlus, FaEdit, FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreateurService from '../../services/CreateurService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, validated, pending, rejected
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING COURSES ===');
      console.log('API URL:', process.env.REACT_APP_CREATEUR_API);
      
      const data = await CreateurService.getAllCourses();
      
      console.log('=== API RESPONSE ===');
      console.log('Response type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', data?.length);
      console.log('Full response:', JSON.stringify(data, null, 2));
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('=== FIRST COURSE ===');
        console.log(JSON.stringify(data[0], null, 2));
        console.log('All course IDs:', data.map(c => c.id));
        console.log('All course titles:', data.map(c => c.titre));
      }
      
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('=== ERROR FETCHING COURSES ===');
      console.error('Error object:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      toast.error('Erreur lors du chargement des cours');
      setCourses([]);
    } finally {
      setLoading(false);
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Cours</h1>
          <p className="text-gray-600">Gérez et suivez vos cours créés</p>
        </div>
        <button
          onClick={() => navigate('/creator/courses/create')}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
        >
          <FaPlus /> Nouveau Cours
        </button>
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

      {/* Course List */}
      {filteredCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Aucun cours trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'all'
              ? 'Commencez par créer votre premier cours'
              : `Aucun cours ${filter === 'validated' ? 'validé' : filter === 'pending' ? 'en attente' : 'rejeté'}`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/creator/courses/create')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Créer un cours
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Titre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <FaBook className="text-indigo-600 text-xl mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{course.titre}</div>
                        <div className="text-sm text-gray-500">ID: {course.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <ValidationBadge status={course.valideParAdmin} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/creator/courses/${course.id}`)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FaEye /> Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;
