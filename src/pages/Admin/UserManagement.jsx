import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import { AdminService } from '../../services/AdminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FiTrash2, FiSearch } from 'react-icons/fi';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const { execute, loading } = useApi();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await execute(AdminService.getAllUsers);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, roleFilter, users]);

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          (user.nom && user.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.prenom && user.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir désactiver cet utilisateur ?')) {
      return;
    }

    try {
      const deactivatedUser = await AdminService.deactivateUser(userId);
      toast.success('Utilisateur désactivé avec succès');
      // Update the user in the list
      setUsers(users.map((u) => u.id === userId ? deactivatedUser : u));
    } catch (error) {
      toast.error('Erreur lors de la désactivation de l\'utilisateur');
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      'ADMIN': 'bg-purple-100 text-purple-800',
      'TEACHER': 'bg-blue-100 text-blue-800',
      'STUDENT': 'bg-green-100 text-green-800',
      'Administrateur': 'bg-purple-100 text-purple-800',
      'CreateurDeCours': 'bg-blue-100 text-blue-800',
      'Apprenant': 'bg-green-100 text-green-800',
    };

    const labels = {
      'ADMIN': 'Admin',
      'TEACHER': 'Créateur',
      'STUDENT': 'Apprenant',
      'Administrateur': 'Admin',
      'CreateurDeCours': 'Créateur',
      'Apprenant': 'Apprenant',
    };

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[role] || 'bg-gray-100 text-gray-800'}`}>
        {labels[role] || role}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des utilisateurs..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
        <p className="mt-2 text-gray-600">
          Gérez tous les utilisateurs de la plateforme
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Role filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="ALL">Tous les rôles</option>
              <option value="STUDENT">Apprenant</option>
              <option value="TEACHER">Créateur</option>
              <option value="ADMIN">Administrateur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Total utilisateurs</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">{users.length}</div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Utilisateurs actifs</div>
            <div className="mt-1 text-3xl font-semibold text-green-600">
              {users.filter((u) => u.actif).length}
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Apprenants</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              {users.filter((u) => u.role === 'STUDENT' || u.role === 'Apprenant').length}
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="text-sm font-medium text-gray-500">Créateurs</div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              {users.filter((u) => u.role === 'TEACHER' || u.role === 'CreateurDeCours').length}
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.actif ? 'bg-green-500' : 'bg-red-500'}`} title={user.actif ? 'Actif' : 'Inactif'}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.prenom && user.nom ? `${user.prenom} ${user.nom}` : user.username}
                        </div>
                        {user.username && (user.prenom || user.nom) && (
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeactivateUser(user.id)}
                      className={`${user.actif ? 'text-red-600 hover:text-red-700' : 'text-gray-400 cursor-not-allowed'}`}
                      title={user.actif ? 'Désactiver' : 'Déjà désactivé'}
                      disabled={!user.actif}
                    >
                      <FiTrash2 className="h-5 w-5" />
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

export default UserManagement;
