import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { setAccessToken, setRefreshToken, clearTokens, getRefreshToken, getAccessToken, userAPI } from '../services/api';
import { debugAuth } from '../utils/debugAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('🔍 AuthContext init - calling backend verify...');
        
        // Call backend verify API - nó sẽ check httpOnly cookies
        const response = await userAPI.verify();
        
        console.log('� Verify response:', response);
        
        if (response.authenticated && response.user) {
          // Backend xác nhận có token hợp lệ
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('✅ User authenticated:', response.user.email);
          
          if (response.refreshed) {
            console.log('🔄 Tokens were refreshed');
          }
        } else {
          // Không authenticated
          console.log('❌ Not authenticated:', response.message);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('❌ Verify error:', error.message);
        // Không có token hoặc token invalid
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);

  const login = (userData) => {
    console.log('🔐 Login called with user:', userData);
    
    // Store user data in localStorage
    // Tokens are in httpOnly cookies set by backend - we don't need to handle them
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ User saved to localStorage');
    
    toast.success('Login successful!');
  };

  const logout = async () => {
    setUser(null);
    clearTokens();
    toast.success('Logged out successfully!');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
