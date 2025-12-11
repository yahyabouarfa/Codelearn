import { format, formatDistance, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format utilities for data display
 */

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'dd/MM/yyyy')
 * @returns {string}
 */
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '-';
    return format(dateObj, formatStr, { locale: fr });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '-';
  }
};

/**
 * Format date and time
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatDateTime = (date) => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

/**
 * Format date to relative time (e.g., "il y a 2 heures")
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export const formatRelativeTime = (date) => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '-';
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: fr });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '-';
  }
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format duration in minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return '0 min';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  
  return `${hours}h ${mins}min`;
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places
 * @returns {string}
 */
export const formatPercentage = (value, total, decimals = 0) => {
  if (!total || total === 0) return '0%';
  
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format number with thousand separators
 * @param {number} number - Number to format
 * @returns {string}
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return new Intl.NumberFormat('fr-FR').format(number);
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string}
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Format course status to display text
 * @param {string} status - Course status
 * @returns {string}
 */
export const formatCourseStatus = (status) => {
  const statusMap = {
    'DRAFT': 'Brouillon',
    'PENDING': 'En attente',
    'APPROVED': 'Approuvé',
    'REJECTED': 'Rejeté',
  };
  return statusMap[status] || status;
};

/**
 * Format programming language display name
 * @param {string} language - Programming language code
 * @returns {string}
 */
export const formatLanguage = (language) => {
  const languageMap = {
    'JAVA': 'Java',
    'PYTHON': 'Python',
    'JAVASCRIPT': 'JavaScript',
    'TYPESCRIPT': 'TypeScript',
    'CSHARP': 'C#',
    'CPP': 'C++',
    'PHP': 'PHP',
    'RUBY': 'Ruby',
    'GO': 'Go',
    'RUST': 'Rust',
    'KOTLIN': 'Kotlin',
    'SWIFT': 'Swift',
  };
  return languageMap[language] || language;
};

export const formatters = {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatFileSize,
  formatDuration,
  formatPercentage,
  formatNumber,
  truncateText,
  formatCourseStatus,
  formatLanguage,
};

export default formatters;
