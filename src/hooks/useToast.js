import { useNotification } from '../context/NotificationContext';

/**
 * Custom hook for toast notifications
 */
export const useToast = () => {
  const notification = useNotification();

  return {
    success: notification.showSuccess,
    error: notification.showError,
    info: notification.showInfo,
    warning: notification.showWarning,
    loading: notification.showLoading,
    dismiss: notification.dismiss,
  };
};

export default useToast;
