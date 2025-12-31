import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateTokenExpiry, isTokenExpired, clearAuthStorage } from '../utils/tokenUtils';
import * as authApi from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedTokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (storedUser && storedToken && storedTokenExpiry) {
      const expiryTimestamp = parseInt(storedTokenExpiry, 10);
      
      // Check if token has expired (client-side check)
      if (isTokenExpired(expiryTimestamp)) {
        console.log('Token expired, clearing storage');
        clearAuthStorage();
        setLoading(false);
        return;
      }
      
      // Token not expired, restore session
      const userData = JSON.parse(storedUser);
      // Normalize user data - ensure 'role' field exists
      const normalizedUser = {
        ...userData,
        role: userData.role || userData.user_role
      };
      setUser(normalizedUser);
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    // Normalize user data - ensure 'role' field exists for consistency
    const normalizedUser = {
      ...userData,
      role: userData.role || userData.user_role // Use 'role' if exists, otherwise use 'user_role'
    };
    
    // Calculate token expiry (24 hours from now)
    const tokenExpiry = calculateTokenExpiry();
    
    setUser(normalizedUser);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', authToken);
    localStorage.setItem('tokenExpiry', tokenExpiry.toString());
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authApi.logout();
    } catch (error) {
      // Log error but continue with client-side logout
      console.error('Backend logout failed:', error);
    } finally {
      // Always clear client-side data regardless of backend response
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      clearAuthStorage();
    }
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
