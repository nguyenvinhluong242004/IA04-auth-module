import Cookies from 'js-cookie';

/**
 * Debug function to check all auth-related data
 * Call this in browser console: window.debugAuth()
 */
export const debugAuth = () => {
  console.log('=== 🔍 AUTH DEBUG ===');
  
  // Check all cookies
  console.log('\n📦 All Cookies:');
  const allCookies = Cookies.get();
  console.log(allCookies);
  
  // Check specific tokens
  console.log('\n🎫 Tokens:');
  console.log('Access Token:', Cookies.get('accessToken') || '❌ Not found');
  console.log('Refresh Token:', Cookies.get('refreshToken') || '❌ Not found');
  
  // Check localStorage
  console.log('\n💾 LocalStorage:');
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      console.log('User:', user);
    } catch (e) {
      console.log('User (invalid JSON):', storedUser);
    }
  } else {
    console.log('User: ❌ Not found');
  }
  
  // Check raw document.cookie
  console.log('\n🍪 Raw document.cookie:');
  console.log(document.cookie || '(empty)');
  
  console.log('\n=== END DEBUG ===\n');
};

// Make it available globally for easy debugging
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
}
