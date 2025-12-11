import React from 'react';
import { FiBook, FiClock, FiUser } from 'react-icons/fi';

const CourseCard = ({ course, onClick, viewMode = 'grid' }) => {
  const { id, titre, description, createurNom, modules = [], supports = [] } = course;

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => onClick(id)}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{titre}</h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {createurNom && (
                <div className="flex items-center gap-1">
                  <FiUser className="h-4 w-4" />
                  <span>{createurNom}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <FiBook className="h-4 w-4" />
                <span>{modules.length} modules</span>
              </div>
              <div className="flex items-center gap-1">
                <FiClock className="h-4 w-4" />
                <span>{supports.length} supports</span>
              </div>
            </div>
          </div>
          
          <button
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors whitespace-nowrap"
            onClick={(e) => {
              e.stopPropagation();
              onClick(id);
            }}
          >
            Voir le cours
          </button>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      onClick={() => onClick(id)}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
          {titre}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <FiBook className="h-4 w-4" />
            <span>{modules.length} modules</span>
          </div>
          <div className="flex items-center gap-1">
            <FiClock className="h-4 w-4" />
            <span>{supports.length} supports</span>
          </div>
        </div>

        {createurNom && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <FiUser className="h-4 w-4" />
            <span>Par {createurNom}</span>
          </div>
        )}

        <button
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
        >
          Voir le cours
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
