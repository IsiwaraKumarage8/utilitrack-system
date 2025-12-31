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
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      const storedTokenExpiry = localStorage.getItem('tokenExpiry');
      
      if (storedUser && storedToken && storedTokenExpiry) {
        const expiryTimestamp = parseInt(storedTokenExpiry, 10);
        
        // First check: Client-side expiry validation (fast)
        if (isTokenExpired(expiryTimestamp)) {
          console.log('Token expired, clearing storage');
          clearAuthStorage();
          setLoading(false);
          return;
        }
        
        // Second check: Backend token validation (authoritative)
        try {
          const response = await authApi.verifyToken();
          
          if (response.success && response.data?.user) {
            // Token is valid, restore session
            const userData = response.data.user;
            const normalizedUser = {
              ...userData,
              role: userData.role || userData.user_role
            };
            setUser(normalizedUser);
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // Invalid response format
            console.log('Invalid token verification response');
            clearAuthStorage();
          }
        } catch (error) {
          // Backend validation failed
          console.log('Token verification failed:', error.message);
          
          // Handle specific error cases
          if (error.response?.status === 401 || error.response?.status === 403) {
            // Token invalid or user no longer has access
            console.log('Token invalid or unauthorized');
          } else {
            // Network error or server down
            console.log('Network error during token verification');
          }
          
          // Clear storage and require re-login
          clearAuthStorage();
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
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
