import React from 'react';
import { FiCheckCircle, FiCircle } from 'react-icons/fi';

const ModuleItem = ({ module, index, onComplete, isCompleting }) => {
  const { id, titre, description, ordre, completed } = module;

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        completed
          ? 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200 hover:border-primary-300'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-1">
          {completed ? (
            <FiCheckCircle className="h-6 w-6 text-green-600" />
          ) : (
            <FiCircle className="h-6 w-6 text-gray-400" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                Module {ordre !== undefined ? ordre : index + 1}: {titre}
              </h3>
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
            </div>

            {/* Complete Button */}
            {!completed && (
              <button
                onClick={() => onComplete(id)}
                disabled={isCompleting}
                className="flex-shrink-0 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCompleting ? 'Chargement...' : 'Marquer complété'}
              </button>
            )}
          </div>

          {/* Completed Status */}
          {completed && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Complété
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleItem;
