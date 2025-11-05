import { useEffect, useState } from 'react';
import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken, clearTokens } from '../services/api';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const useTokenRefresh = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAndRefreshToken = async () => {
      try {
        const accessToken = getAccessToken();
        const refreshToken = getRefreshToken();

        // Nếu không có refresh token -> chưa đăng nhập
        if (!refreshToken) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Nếu có access token -> OK
        if (accessToken) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Nếu có refresh token nhưng không có access token -> Refresh!
        console.log('🔄 No access token, refreshing from refresh token...');
        try {
          const response = await axios.post(
            `${API_BASE_URL}/user/refresh`,
            { refreshToken },
            { withCredentials: true }
          );

          if (response.data.accessToken) {
            setAccessToken(response.data.accessToken);
            if (response.data.refreshToken) {
              setRefreshToken(response.data.refreshToken);
            }
            console.log('✅ Access token refreshed successfully');
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('❌ Failed to refresh token:', error);
          clearTokens();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndRefreshToken();
  }, []);

  return { isAuthenticated, isLoading };
};
