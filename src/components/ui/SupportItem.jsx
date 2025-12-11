import React from 'react';
import { FiFile, FiDownload, FiExternalLink } from 'react-icons/fi';

const SupportItem = ({ support, onAccess, isAccessing }) => {
  const { id, nom, type, description } = support;

  // Get icon based on type
  const getIcon = () => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FiFile className="h-5 w-5 text-red-600" />;
      case 'video':
        return <FiFile className="h-5 w-5 text-blue-600" />;
      case 'document':
        return <FiFile className="h-5 w-5 text-green-600" />;
      default:
        return <FiFile className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get type label
  const getTypeLabel = () => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return 'PDF';
      case 'video':
        return 'Vidéo';
      case 'document':
        return 'Document';
      default:
        return type || 'Fichier';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-1">{getIcon()}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900">{nom}</h4>
          {description && (
            <p className="mt-1 text-xs text-gray-600 line-clamp-2">{description}</p>
          )}
          
          {/* Type Badge */}
          <div className="mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {getTypeLabel()}
            </span>
          </div>
        </div>
      </div>

      {/* Access Button */}
      <button
        onClick={() => onAccess(id)}
        disabled={isAccessing}
        className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isAccessing ? (
          <>Chargement...</>
        ) : (
          <>
            <FiExternalLink className="h-4 w-4" />
            <span>Accéder</span>
          </>
        )}
      </button>
    </div>
  );
};

export default SupportItem;
