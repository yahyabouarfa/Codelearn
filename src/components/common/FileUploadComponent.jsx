import React, { useState } from 'react';
import { CreateurService } from '../../services/CreateurService';
import { FiUpload, FiFile, FiVideo } from 'react-icons/fi';
import toast from 'react-hot-toast';

/**
 * File Upload Component for Course Supports
 * Supports PDF and Video uploads to Cloudinary (max 50MB)
 */
const FileUploadComponent = ({ coursId, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [typeSupport, setTypeSupport] = useState('PDF');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Le fichier doit faire moins de 50MB');
      return;
    }

    // Validate file type
    if (typeSupport === 'PDF' && file.type !== 'application/pdf') {
      toast.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    if (typeSupport === 'Video' && !file.type.startsWith('video/')) {
      toast.error('Veuillez sélectionner un fichier vidéo');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const result = await CreateurService.uploadSupport(
        coursId,
        selectedFile,
        typeSupport,
        (percent) => setProgress(percent)
      );

      toast.success(`Fichier uploadé avec succès!`);
      console.log('Upload result:', result);
      
      // Reset form
      setSelectedFile(null);
      setProgress(0);
      
      // Callback to parent
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Ajouter un support pédagogique
      </h3>

      <div className="space-y-4">
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de support
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                setTypeSupport('PDF');
                setSelectedFile(null);
              }}
              disabled={uploading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                typeSupport === 'PDF'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <FiFile className="h-5 w-5" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTypeSupport('Video');
                setSelectedFile(null);
              }}
              disabled={uploading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                typeSupport === 'Video'
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <FiVideo className="h-5 w-5" />
              <span>Vidéo</span>
            </button>
          </div>
        </div>

        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner un fichier
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept={typeSupport === 'PDF' ? '.pdf' : 'video/*'}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            {typeSupport === 'PDF' ? 'Formats acceptés: PDF' : 'Formats acceptés: MP4, AVI, MOV, WMV, FLV, WEBM'} 
            {' '} • Taille maximum: 50MB
          </p>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
              {typeSupport === 'PDF' ? (
                <FiFile className="h-8 w-8 text-blue-600" />
              ) : (
                <FiVideo className="h-8 w-8 text-purple-600" />
              )}
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-700">Upload en cours...</span>
              <span className="font-medium text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiUpload className="h-5 w-5" />
          <span>{uploading ? 'Upload en cours...' : 'Uploader'}</span>
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          ℹ️ Les fichiers sont stockés sur Cloudinary. L'URL sera automatiquement générée après l'upload.
        </p>
      </div>
    </div>
  );
};

export default FileUploadComponent;
