import React, { useState } from 'react';
import { FiUpload, FiX, FiFileText, FiVideo, FiAlertCircle } from 'react-icons/fi';
import { CreateurService } from '../../services/CreateurService';
import toast from 'react-hot-toast';

const BulkFileUpload = ({ coursId, onUploadSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];

    files.forEach(file => {
      // Check file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} dépasse 50MB`);
        return;
      }

      // Check file type
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isVideo = file.type.startsWith('video/') || 
        ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'].some(ext => 
          file.name.toLowerCase().endsWith(ext)
        );

      if (!isPDF && !isVideo) {
        toast.error(`${file.name} n'est pas un PDF ou une vidéo valide`);
        return;
      }

      validFiles.push({
        file,
        type: isPDF ? 'PDF' : 'VIDEO',
        name: file.name,
        size: file.size,
      });
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle upload
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Veuillez sélectionner au moins un fichier');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const files = selectedFiles.map(f => f.file);
      const types = selectedFiles.map(f => f.type);

      const updatedCourse = await CreateurService.addFilesToCourse(
        coursId,
        files,
        types,
        setUploadProgress
      );

      toast.success(`${selectedFiles.length} fichier(s) ajouté(s) avec succès!`);
      setSelectedFiles([]);
      
      if (onUploadSuccess) {
        onUploadSuccess(updatedCourse);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error(error.response?.data?.error || error.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
        <div className="flex">
          <FiAlertCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Vous pouvez sélectionner plusieurs fichiers PDF et vidéo à la fois (max 50MB chacun).
            </p>
          </div>
        </div>
      </div>

      {/* File Input */}
      <div>
        <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
          <div className="flex flex-col items-center">
            <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
            <span className="text-sm font-medium text-gray-700">
              Cliquez pour sélectionner des fichiers
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Plusieurs fichiers PDF ou vidéo (max 50MB chacun)
            </span>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,video/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              Fichiers sélectionnés ({selectedFiles.length})
            </h3>
            <button
              type="button"
              onClick={() => setSelectedFiles([])}
              disabled={uploading}
              className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              Tout effacer
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((fileInfo, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {fileInfo.type === 'PDF' ? (
                    <FiFileText className="w-6 h-6 text-red-500 flex-shrink-0" />
                  ) : (
                    <FiVideo className="w-6 h-6 text-blue-500 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileInfo.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fileInfo.type} • {formatFileSize(fileInfo.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  className="ml-2 p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                  title="Retirer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && uploadProgress > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-700">Upload en cours...</span>
            <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <FiUpload />
          {uploading ? `Upload... ${uploadProgress}%` : `Uploader ${selectedFiles.length} fichier(s)`}
        </button>
      </div>
    </div>
  );
};

export default BulkFileUpload;
