# Deploy Guide - Cross-Domain Authentication

## 🌐 Architecture

- **Frontend**: `https://auth-login-v2-xyz.vercel.app`
- **Backend**: `https://api-auth-login-v2-xyz.vercel.app`
- **Database**: Neon PostgreSQL

---

## 📋 Deployment Checklist

### Backend Deployment

1. **Environment Variables** (Vercel Dashboard)
   ```env
   DATABASE_URL=postgresql://...
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL_PRODUCTION=https://auth-login-v2-xyz.vercel.app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_ACCESS_TOKEN_EXPIRATION=15m
   JWT_REFRESH_TOKEN_EXPIRATION=7d
   ```

2. **Vercel Settings**
   - Root Directory: `backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Frontend Deployment

1. **Environment Variables** (Vercel Dashboard)
   ```env
   VITE_API_URL=https://api-auth-login-v2-xyz.vercel.app
   ```

2. **Vercel Settings**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Important Files**
   - ✅ `vercel.json` - SPA routing config (already created)
   - ✅ `.env.production` - Production API URL

---

## 🍪 Cross-Domain Cookie Configuration

### Key Points:

1. **SameSite**: Must be `'none'` in production for cross-domain
2. **Secure**: Must be `true` (HTTPS only)
3. **HttpOnly**: `true` for security
4. **CORS**: Both domains must be whitelisted

### Backend Cookie Config:
```typescript
const cookieOptions = {
  httpOnly: true,
  secure: true, // Production = HTTPS
  sameSite: 'none', // Cross-domain
  maxAge: 15 * 60 * 1000
};
```

---

## 🔧 Troubleshooting

### Issue 1: 404 on Page Reload
**Solution**: `vercel.json` with rewrites (✅ Fixed)

### Issue 2: Cookies Not Set
**Symptoms**: Login success but cookies not saved
**Check**:
- Browser DevTools → Application → Cookies
- Backend must use `sameSite: 'none'` and `secure: true`
- CORS must include frontend domain

### Issue 3: CORS Errors
**Symptoms**: `Blocked by CORS policy`
**Check**:
- Backend `main.ts` - allowed origins list
- Frontend must use `withCredentials: true` in API calls

### Issue 4: Token Not Verified
**Symptoms**: Redirect to login after page reload
**Check**:
- `/user/verify` endpoint working
- Cookies being sent with request
- Backend receiving cookies in `req.cookies`

---

## 🧪 Testing Flow

### 1. Local Testing
```bash
# Backend
cd backend
npm run start:dev

# Frontend
cd frontend
npm run dev
```

### 2. Production Testing
1. Login → Check cookies in DevTools
2. Reload page → Should stay logged in
3. Navigate to `/dashboard` → Should work
4. Logout → Cookies should be cleared

---

## 📝 Important Notes

1. **Don't commit `.env` files** with real credentials
2. **Update CORS origins** if frontend URL changes
3. **Test cookies** in incognito mode
4. **Monitor logs** in Vercel dashboard for errors
5. **Database migrations** - run before deploying backend changes

---

## 🚀 Deploy Commands

```bash
# Push to main branch
git add .
git commit -m "Update: Cross-domain auth config"
git push origin main

# Vercel will auto-deploy
```

---

## 📚 API Endpoints

- `POST /user/register` - Register new user
- `POST /user/login` - Login (sets httpOnly cookies)
- `GET /user/verify` - Verify token (checks cookies)
- `POST /user/refresh` - Refresh access token
- `POST /user/logout` - Logout (clears cookies)
- `GET /user/profile` - Get user profile (protected)

All endpoints support CORS with credentials.
