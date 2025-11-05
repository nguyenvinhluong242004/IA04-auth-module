import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { userAPI, getAccessToken, getRefreshToken } from '../services/api';
import { useEffect } from 'react';

const Dashboard = () => {
  const { logout: contextLogout, user: authUser } = useAuth();
  const navigate = useNavigate();

  // Debug: Log auth state on mount
  useEffect(() => {
    console.log('📊 Dashboard mounted');
    console.log('👤 AuthUser:', authUser);
    console.log('🎫 Access Token:', getAccessToken() ? '✅ Present' : '❌ Missing');
    console.log('🔄 Refresh Token:', getRefreshToken() ? '✅ Present' : '❌ Missing');
  }, [authUser]);

  // Fetch user profile using React Query
  const { data: user, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['userProfile'],
    queryFn: userAPI.getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // Retry on 401 (token might be refreshing)
      if (error?.response?.status === 401 && failureCount < 2) {
        return true;
      }
      return false;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: userAPI.logout,
    onSuccess: () => {
      contextLogout();
      navigate('/');
    },
    onError: () => {
      // Even if API call fails, clear local tokens and redirect
      contextLogout();
      navigate('/');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-center">
            <span className="text-4xl mb-4 block">❌</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
            <p className="text-gray-600 mb-4">{error?.message || 'Failed to load user data'}</p>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Welcome back! 👋
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">User ID:</span> {user?.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Registered:</span>{' '}
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Profile Complete</h3>
              <p className="text-blue-100">
                Your account is active and ready to use.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Security</h3>
              <p className="text-indigo-100">
                Your password is securely encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
