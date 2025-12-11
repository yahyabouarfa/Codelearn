import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { roleUtils } from '../../utils/roleUtils';
import { ROLES } from '../../config/constants';
import {
  FiHome,
  FiBook,
  FiBarChart2,
  FiUser,
  FiPlusCircle,
  FiCheckCircle,
  FiUsers,
  FiX,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const primaryRole = roleUtils.getPrimaryRole(user);

  const getNavigationItems = () => {
    switch (primaryRole) {
      case ROLES.APPRENANT:
        return [
          { path: '/apprenant/dashboard', label: 'Mes Cours', icon: FiBook },
        ];
      
      case ROLES.CREATEUR:
        return [
          { path: '/creator/courses', label: 'Mes cours', icon: FiBook },
          { path: '/creator/courses/create', label: 'Créer un cours', icon: FiPlusCircle },
        ];
      
      case ROLES.ADMIN:
        return [
          { path: '/admin/courses', label: 'Tous les cours', icon: FiBook },
          { path: '/admin/courses/validation', label: 'Validation des cours', icon: FiCheckCircle },
          { path: '/admin/users', label: 'Gestion des utilisateurs', icon: FiUsers },
        ];
      
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 lg:hidden border-b border-gray-200">
            <span className="text-lg font-bold text-gray-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.prenom} {user?.nom}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {roleUtils.getRoleDisplayName(primaryRole)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
