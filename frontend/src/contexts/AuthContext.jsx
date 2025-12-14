import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    
    if (storedUser && storedToken) {
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
    
    setUser(normalizedUser);
    setToken(authToken);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
