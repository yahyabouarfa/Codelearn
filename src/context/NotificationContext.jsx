import React, { createContext, useState, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext({
  showSuccess: () => {},
  showError: () => {},
  showInfo: () => {},
  showWarning: () => {},
  showLoading: () => {},
  dismiss: () => {},
});

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [activeToasts, setActiveToasts] = useState([]);

  const showSuccess = useCallback((message, options = {}) => {
    const id = toast.success(message, {
      duration: 4000,
      position: 'top-right',
      ...options,
    });
    setActiveToasts(prev => [...prev, id]);
    return id;
  }, []);

  const showError = useCallback((message, options = {}) => {
    const id = toast.error(message, {
      duration: 5000,
      position: 'top-right',
      ...options,
    });
    setActiveToasts(prev => [...prev, id]);
    return id;
  }, []);

  const showInfo = useCallback((message, options = {}) => {
    const id = toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: 'ℹ️',
      ...options,
    });
    setActiveToasts(prev => [...prev, id]);
    return id;
  }, []);

  const showWarning = useCallback((message, options = {}) => {
    const id = toast(message, {
      duration: 4000,
      position: 'top-right',
      icon: '⚠️',
      style: {
        background: '#FFF3CD',
        color: '#856404',
      },
      ...options,
    });
    setActiveToasts(prev => [...prev, id]);
    return id;
  }, []);

  const showLoading = useCallback((message, options = {}) => {
    const id = toast.loading(message, {
      position: 'top-right',
      ...options,
    });
    setActiveToasts(prev => [...prev, id]);
    return id;
  }, []);

  const dismiss = useCallback((toastId) => {
    if (toastId) {
      toast.dismiss(toastId);
      setActiveToasts(prev => prev.filter(id => id !== toastId));
    } else {
      toast.dismiss();
      setActiveToasts([]);
    }
  }, []);

  const value = {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    dismiss,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
