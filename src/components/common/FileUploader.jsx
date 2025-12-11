import React, { useState } from 'react';
import { FaTrash, FaFilePdf, FaVideo, FaImage, FaFile } from 'react-icons/fa';

const FILE_TYPES = ['PDF', 'VIDEO', 'IMAGE', 'DOCUMENT'];

const FileUploader = ({ onFilesChange, onTypesChange, accept = '.pdf,.doc,.docx,.mp4,.avi,.jpg,.png,.jpeg' }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: autoDetectType(file.name)
    }));

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }
    if (onTypesChange) {
      onTypesChange(updatedFiles.map(f => f.type));
    }
    
    e.target.value = ''; // Reset input
  };

  const autoDetectType = (fileName) => {
    const name = fileName.toLowerCase();
    if (name.endsWith('.pdf')) return 'PDF';
    if (name.match(/\.(mp4|avi|mov|wmv|flv|mkv)$/)) return 'VIDEO';
    if (name.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/)) return 'IMAGE';
    return 'DOCUMENT';
  };

  const removeFile = (fileId) => {
    const updatedFiles = selectedFiles.filter(f => f.id !== fileId);
    setSelectedFiles(updatedFiles);
    
    if (onFilesChange) {
      onFilesChange(updatedFiles.map(f => f.file));
    }
    if (onTypesChange) {
      onTypesChange(updatedFiles.map(f => f.type));
    }
  };

  const changeFileType = (fileId, newType) => {
    const updatedFiles = selectedFiles.map(f =>
      f.id === fileId ? { ...f, type: newType } : f
    );
    setSelectedFiles(updatedFiles);
    
    if (onTypesChange) {
      onTypesChange(updatedFiles.map(f => f.type));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF': return <FaFilePdf className="text-red-600" />;
      case 'VIDEO': return <FaVideo className="text-blue-600" />;
      case 'IMAGE': return <FaImage className="text-green-600" />;
      default: return <FaFile className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
            </p>
            <p className="text-xs text-gray-500">PDF, Vidéo, Image, Document</p>
          </div>
          <input
            type="file"
            multiple
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Fichiers sélectionnés ({selectedFiles.length})</h4>
          {selectedFiles.map(file => (
            <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-2xl">
                {getFileIcon(file.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>

              <select
                value={file.type}
                onChange={(e) => changeFileType(file.id, e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {FILE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
