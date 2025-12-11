import axios from "axios";

// Use Vite proxy in development, direct URL in production
const baseURL = "/api/apprenant";

export const http = axios.create({
  baseURL,
  timeout: 60000, // 60 seconds to match proxy timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Add request interceptor for debugging
http.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
http.interceptors.response.use(
  (response) => {
    console.log(`[API] Response ${response.status}:`, response.data);
    return response;
  },
  (error) => {
    console.error('[API] Response error:', error.message);
    return Promise.reject(error);
  }
);
