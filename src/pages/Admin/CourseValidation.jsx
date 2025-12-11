import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { AdminService } from '../../services/AdminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const CourseValidation = () => {
  const [pendingCourses, setPendingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { execute, loading } = useApi();

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const fetchPendingCourses = async () => {
    try {
      const data = await execute(AdminService.getPendingCourses);
      setPendingCourses(data);
    } catch (error) {
      console.error('Error fetching pending courses:', error);
    }
  };

  const handleValidate = async (courseId, approved) => {
    try {
      if (approved) {
        await AdminService.approveCourse(courseId);
        toast.success('Cours approuvé avec succès');
      } else {
        await AdminService.rejectCourse(courseId);
        toast.success('Cours rejeté');
      }
      setPendingCourses(pendingCourses.filter((c) => c.id !== courseId));
      setShowModal(false);
      setSelectedCourse(null);
    } catch (error) {
      toast.error('Erreur lors de la validation du cours');
      console.error('Validation error:', error);
    }
  };

  const openModal = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des cours en attente..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Validation des Cours</h1>
        <p className="mt-2 text-gray-600">
          Examinez et approuvez les cours soumis par les créateurs
        </p>
      </div>

      {/* Pending Courses */}
      {pendingCourses.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucun cours en attente de validation.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Créateur
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {course.titre}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-md">
                        {course.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {course.createur ? (
                        course.createur.prenom && course.createur.nom 
                          ? `${course.createur.prenom} ${course.createur.nom}`
                          : course.createur.username || course.createur.email
                      ) : (
                        course.createurId ? `Créateur #${course.createurId}` : 'N/A'
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {course.createur?.email || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => openModal(course)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Voir les détails"
                      >
                        <FiEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleValidate(course.id, true)}
                        className="text-green-600 hover:text-green-700"
                        title="Approuver"
                      >
                        <FiCheck className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => handleValidate(course.id, false)}
                        className="text-red-600 hover:text-red-700"
                        title="Rejeter"
                      >
                        <FiX className="h-6 w-6" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for course details */}
      {showModal && selectedCourse && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={closeModal}></div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-3xl w-full z-20">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails du cours
                </h3>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Titre</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCourse.titre}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedCourse.description}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Créateur</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedCourse.createur ? (
                      <>
                        {selectedCourse.createur.prenom && selectedCourse.createur.nom 
                          ? `${selectedCourse.createur.prenom} ${selectedCourse.createur.nom}`
                          : selectedCourse.createur.username || selectedCourse.createur.email
                        }
                        {selectedCourse.createur.email && (
                          <span className="text-gray-500 ml-2">({selectedCourse.createur.email})</span>
                        )}
                      </>
                    ) : (
                      selectedCourse.createurId ? `Créateur #${selectedCourse.createurId}` : 'N/A'
                    )}
                  </p>
                </div>
                
                {selectedCourse.language && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Langage</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedCourse.language}</p>
                  </div>
                )}
                
                {selectedCourse.modules && selectedCourse.modules.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Modules</h4>
                    <ul className="mt-2 space-y-2">
                      {selectedCourse.modules.map((module, index) => (
                        <li key={index} className="text-sm text-gray-900 pl-4 border-l-2 border-primary-200">
                          <strong>{module.titre}</strong>: {module.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="px-6 py-4 bg-gray-50 flex items-center justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleValidate(selectedCourse.id, false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <FiX className="h-5 w-5" />
                  <span>Rejeter</span>
                </button>
                <button
                  onClick={() => handleValidate(selectedCourse.id, true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FiCheck className="h-5 w-5" />
                  <span>Approuver</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseValidation;
