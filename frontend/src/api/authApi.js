import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
authApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

/**
 * Login user
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise} Response with user data and token
 */
export const login = async (username, password) => {
  const response = await authApi.post('/login', { username, password });
  
  // Store token and user data
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  
  return response.data;
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response with created user data
 */
export const register = async (userData) => {
  const response = await authApi.post('/register', userData);
  return response.data;
};

/**
 * Verify JWT token
 * @returns {Promise} Response with user data
 */
export const verifyToken = async () => {
  const response = await authApi.get('/verify');
  return response.data;
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} Response
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await authApi.post('/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};

/**
 * Logout user - call backend endpoint to log the logout action
 * @returns {Promise} Response from logout endpoint
 */
export const logout = async () => {
  try {
    const response = await authApi.post('/logout');
    return response.data;
  } catch (error) {
    // Even if backend call fails, we want to clear client-side data
    console.error('Logout API call failed:', error);
    return { success: true, message: 'Client-side logout completed' };
  }
};

export default {
  login,
  register,
  verifyToken,
  changePassword,
  logout
};
