import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Get access token from cookie
export const getAccessToken = () => {
  return Cookies.get('accessToken');
};

// Set access token in cookie
export const setAccessToken = (token) => {
  if (token) {
    const options = {
      expires: 1/96, // 15 minutes
      sameSite: 'lax',
      path: '/',
    };
    // Only set secure flag on HTTPS
    if (window.location.protocol === 'https:') {
      options.secure = true;
    }
    Cookies.set('accessToken', token, options);
    
    // Verify immediately
    const saved = Cookies.get('accessToken');
    console.log('🍪 Set accessToken:', saved ? '✅ SUCCESS' : '❌ FAILED');
    if (!saved) {
      console.error('❌ Cookie not saved! Token length:', token?.length);
    }
  } else {
    Cookies.remove('accessToken');
  }
};

// Get refresh token from cookie
export const getRefreshToken = () => {
  return Cookies.get('refreshToken');
};

// Set refresh token in cookie
export const setRefreshToken = (token) => {
  if (token) {
    const options = {
      expires: 7, // 7 days
      sameSite: 'lax',
      path: '/',
    };
    // Only set secure flag on HTTPS
    if (window.location.protocol === 'https:') {
      options.secure = true;
    }
    Cookies.set('refreshToken', token, options);
    
    // Verify immediately
    const saved = Cookies.get('refreshToken');
    console.log('🍪 Set refreshToken:', saved ? '✅ SUCCESS' : '❌ FAILED');
    if (!saved) {
      console.error('❌ Cookie not saved! Token length:', token?.length);
    }
  } else {
    Cookies.remove('refreshToken');
  }
};

// Clear all tokens
export const clearTokens = () => {
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  localStorage.removeItem('user');
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: send cookies with requests
});

// Request interceptor - attach access token from cookie
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Cookies are automatically sent with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Send refresh request with cookies
        const response = await axios.post(
          `${API_BASE_URL}/user/refresh`,
          { refreshToken }, // Also send in body as fallback
          { withCredentials: true } // Send cookies
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        // Cookies are set by backend, but also set client-side as backup
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const userAPI = {
  register: async (userData) => {
    const response = await api.post('/user/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/user/login', credentials);
    return response.data;
  },
  
  // Verify token - backend will check httpOnly cookies
  verify: async () => {
    const response = await axios.get(`${API_BASE_URL}/user/verify`, {
      withCredentials: true, // Important: send cookies
    });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/user/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },
  
  getAllUsers: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    // Use axios directly to avoid interceptor loop
    const response = await axios.post(
      `${API_BASE_URL}/user/refresh`, 
      { refreshToken },
      { withCredentials: true }
    );
    return response.data;
  },
};

export default api;
