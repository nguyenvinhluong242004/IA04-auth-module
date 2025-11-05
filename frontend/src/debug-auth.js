/**
 * Test script to verify auth flow
 * Run this in browser console after logging in
 */

console.log('=== Auth State Check ===');

// Check localStorage
const storedUser = localStorage.getItem('user');
console.log('📦 LocalStorage user:', storedUser ? JSON.parse(storedUser) : 'Not found');

// Check cookies
const cookies = document.cookie.split(';').reduce((acc, cookie) => {
  const [key, value] = cookie.trim().split('=');
  acc[key] = value;
  return acc;
}, {});

console.log('🍪 Cookies:', cookies);
console.log('🎫 Access Token:', cookies.accessToken || 'Not found');
console.log('🔄 Refresh Token:', cookies.refreshToken || 'Not found');

// Check if user is in AuthContext
console.log('👤 AuthContext user:', window.__REACT_DEVTOOLS_GLOBAL_HOOK__ ? 'Check React DevTools' : 'React DevTools not available');

console.log('=== End Check ===');
