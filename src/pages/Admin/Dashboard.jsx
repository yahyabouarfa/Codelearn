import React, { useState, useEffect } from 'react';
import { AdminService } from '../../services/AdminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiDatabase, FiUsers, FiBook, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * Admin Dashboard - Test Connection and View Stats
 * This component tests the connection to the Admin API and displays basic statistics
 */
const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    activeUsers: 0,
    courses: 0,
    pendingCourses: 0,
    approvedCourses: 0,
    rejectedCourses: 0,
    students: 0,
    teachers: 0,
    admins: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Test database connection
      const dbTest = await AdminService.testConnection();
      setDbStatus(dbTest);

      // Load statistics
      const [users, courses, pendingCourses, approvedCourses, rejectedCourses] = await Promise.all([
        AdminService.getAllUsers(),
        AdminService.getAllCourses(),
        AdminService.getPendingCourses(),
        AdminService.getApprovedCourses(),
        AdminService.getRejectedCourses(),
      ]);

      setStats({
        users: users.length,
        activeUsers: users.filter(u => u.actif).length,
        courses: courses.length,
        pendingCourses: pendingCourses.length,
        approvedCourses: approvedCourses.length,
        rejectedCourses: rejectedCourses.length,
        students: users.filter(u => u.role === 'STUDENT' || u.role === 'Apprenant').length,
        teachers: users.filter(u => u.role === 'TEACHER' || u.role === 'CreateurDeCours').length,
        admins: users.filter(u => u.role === 'ADMIN' || u.role === 'Administrateur').length,
      });

      toast.success('Dashboard chargé avec succès');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Erreur lors du chargement du dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement du dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Administrateur</h1>
        <p className="mt-2 text-gray-600">
          Vue d'ensemble de la plateforme et état de la connexion API
        </p>
      </div>

      {/* Database Connection Status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FiDatabase className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">État de la Base de Données</h3>
              <p className="text-sm text-gray-500">Admin API - Port 8083</p>
            </div>
          </div>
          {dbStatus?.connected ? (
            <div className="flex items-center space-x-2 text-green-600">
              <FiCheckCircle className="h-6 w-6" />
              <span className="font-medium">Connecté</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-red-600">
              <FiXCircle className="h-6 w-6" />
              <span className="font-medium">Déconnecté</span>
            </div>
          )}
        </div>

        {dbStatus && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Base de données:</span>
              <span className="ml-2 font-medium text-gray-900">
                {dbStatus.databaseProductName} {dbStatus.databaseProductVersion}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Driver:</span>
              <span className="ml-2 font-medium text-gray-900">
                {dbStatus.driverName} v{dbStatus.driverVersion}
              </span>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-500">URL:</span>
              <span className="ml-2 font-mono text-xs text-gray-900">
                {dbStatus.url}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUsers className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Utilisateurs
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.users}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Actifs:</span>
                <span className="font-medium text-green-600">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Apprenants:</span>
                <span className="font-medium text-gray-900">{stats.students}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Créateurs:</span>
                <span className="font-medium text-gray-900">{stats.teachers}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiBook className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Cours
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.courses}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <a
              href="/admin/courses"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Voir tous les cours →
            </a>
          </div>
        </div>

        {/* Approved Courses */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Cours Approuvés
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-green-600">
                      {stats.approvedCourses}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm text-gray-500">
              Validés et publiés
            </div>
          </div>
        </div>

        {/* Pending Courses */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiCheckCircle className="h-6 w-6 text-orange-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    En Attente
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-orange-600">
                      {stats.pendingCourses}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <a
              href="/admin/courses/validation"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Valider les cours →
            </a>
          </div>
        </div>
      </div>
      
      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Cours Rejetés</div>
            <FiXCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-red-600">{stats.rejectedCourses}</div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Taux d'Approbation</div>
            <FiCheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.courses > 0 ? Math.round((stats.approvedCourses / stats.courses) * 100) : 0}%
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-gray-500">Taux d'Activité</div>
            <FiUsers className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {stats.users > 0 ? Math.round((stats.activeUsers / stats.users) * 100) : 0}%
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiUsers className="mr-2 h-5 w-5" />
            Gérer les Utilisateurs
          </a>
          <a
            href="/admin/courses/validation"
            className="flex items-center justify-center px-4 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
          >
            <FiCheckCircle className="mr-2 h-5 w-5" />
            Valider les Cours
          </a>
          <button
            onClick={loadDashboardData}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiDatabase className="mr-2 h-5 w-5" />
            Recharger les Données
          </button>
        </div>
      </div>

      {/* API Endpoint Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          🔧 Information API
        </h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>
            <strong>Base URL:</strong> {process.env.REACT_APP_ADMIN_API || 'http://localhost:8083/api/admin'}
          </p>
          <p>
            <strong>Endpoints actifs:</strong> ✅ Users, Courses, Pending Courses, DB Test
          </p>
          <p>
            <strong>Statut CORS:</strong> ✅ Configuré pour toutes les origines
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
