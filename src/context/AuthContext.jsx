import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthService } from '../services/AuthService';
import { roleUtils } from '../utils/roleUtils';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../config/constants';

const AuthContext = createContext({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  hasRole: () => false,
  updateUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const token = AuthService.getToken();
    const storedUser = localStorage.getItem('user');
    
    console.log('=== INITIALIZING AUTH ===');
    console.log('Token exists:', !!token);
    console.log('Stored user exists:', !!storedUser);
    
    if (token) {
      // First, set user from localStorage immediately (optimistic update)
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          console.log('Set user from localStorage (optimistic):', userData);
        } catch (e) {
          console.error('Failed to parse stored user:', e);
        }
      }
      
      // Then try to fetch fresh user data from API
      try {
        const userData = await AuthService.getCurrentUser();
        console.log('Got fresh user data from API:', userData);
        console.log('User role from API:', userData?.role);
        
        // Update with fresh data
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to fetch user:', error);
        console.error('Error details:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        // Only remove token and logout if it's definitely invalid
        if (error.response?.status === 401) {
          console.log('Token is invalid (401 Unauthorized), logging out');
          AuthService.removeToken();
          localStorage.removeItem('user');
          setUser(null);
        } else if (error.response?.status === 403) {
          // For 403, show warning but keep using cached data
          console.warn('Token rejected by backend (403 Forbidden) - this might be a backend issue');
          console.warn('Keeping user logged in with cached data');
          toast.error('Impossible de vérifier votre session. Veuillez vous reconnecter si vous rencontrez des problèmes.', {
            duration: 5000
          });
          
          // If we don't have cached user data, logout
          if (!storedUser) {
            console.log('No cached user data, logging out');
            AuthService.removeToken();
            setUser(null);
          }
        } else {
          // Network or server error - keep using cached data
          console.log('Error fetching user but keeping session (might be temporary)');
          if (!storedUser) {
            console.warn('No cached user data available');
          }
        }
      }
    } else {
      console.log('No token found, user not authenticated');
    }
    
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await AuthService.login(email, password);
      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', response);
      console.log('Response token:', response.token);
      console.log('Response user:', response.user);
      
      if (response.token) {
        console.log('Storing token:', response.token);
        AuthService.setToken(response.token);
        
        // Verify token was stored
        const storedToken = AuthService.getToken();
        console.log('Token stored successfully:', !!storedToken);
        console.log('Stored token matches:', storedToken === response.token);
      } else {
        console.warn('No token in response!');
      }
      
      const userData = response.user || response;
      console.log('User data being set:', userData);
      console.log('User role:', userData.role);
      
      // Store user data in localStorage for fallback on refresh
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User data stored in localStorage');
      
      setUser(userData);
      toast.success(TOAST_MESSAGES.SUCCESS.LOGIN);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      console.log('Register response:', response);
      
      if (response.token) {
        AuthService.setToken(response.token);
      }
      
      const userDataObj = response.user || response;
      console.log('User data being set:', userDataObj);
      console.log('User role:', userDataObj.role);
      
      // Store user data in localStorage for fallback on refresh
      localStorage.setItem('user', JSON.stringify(userDataObj));
      
      setUser(userDataObj);
      toast.success(TOAST_MESSAGES.SUCCESS.REGISTER);
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      toast.success(TOAST_MESSAGES.SUCCESS.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      setUser(null);
      AuthService.removeToken();
    }
  };

  const hasRole = (requiredRole) => {
    return roleUtils.hasRole(user, requiredRole);
  };

  const updateUser = (updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData,
    }));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    hasRole,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
