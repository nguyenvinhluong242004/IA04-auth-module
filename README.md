# 🔐 React Authentication with JWT (Access + Refresh Tokens)

**Complete JWT Authentication System** với Access Token và Refresh Token được lưu trong **HTTP-only Cookies** để bảo mật tối đa.

[![React](https://img.shields.io/badge/React-19.1-blue.svg)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.0-red.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

## 🎯 Mục tiêu Assignment

Xây dựng ứng dụng React SPA với hệ thống xác thực JWT đầy đủ bao gồm:
- ✅ Login/Logout mechanism
- ✅ JWT Access Token (15 phút) + Refresh Token (7 ngày)
- ✅ Token storage trong **HTTP-only Cookies** 🍪
- ✅ Axios interceptor tự động refresh token
- ✅ React Query cho server state management
- ✅ React Hook Form với validation
- ✅ Protected routes với authentication
- ✅ Automatic token refresh khi page reload
- ✅ Error handling đầy đủ
- ✅ Public deployment ready

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React App                                              │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Login      │  │  Dashboard   │  │  Protected   │ │ │
│  │  │   (Public)   │  │  (Protected) │  │   Routes     │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │         │                  │                  │         │ │
│  │         └──────────────────┴──────────────────┘         │ │
│  │                           │                              │ │
│  │  ┌────────────────────────▼────────────────────────┐   │ │
│  │  │  useTokenRefresh Hook (Middleware)              │   │ │
│  │  │  • Check access token trong cookie              │   │ │
│  │  │  • Nếu không có → refresh từ refresh token     │   │ │
│  │  │  • Nếu refresh fail → redirect /login           │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  │                           │                              │ │
│  │  ┌────────────────────────▼────────────────────────┐   │ │
│  │  │  Axios Interceptors                              │   │ │
│  │  │  • Request: attach access token từ cookie       │   │ │
│  │  │  • Response: auto refresh khi 401               │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────▼────────────────────────────┐    │
│  │  HTTP-only Cookies 🍪                               │    │
│  │  • accessToken  (15m, httpOnly, secure, sameSite)  │    │
│  │  • refreshToken (7d,  httpOnly, secure, sameSite)  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND API                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  NestJS + JWT Strategy                                  │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │ POST /login  │  │ POST /refresh│  │ GET /profile │ │ │
│  │  │ → Set cookies│  │ → New tokens │  │ @UseGuards() │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                           │                                  │
│  ┌────────────────────────▼────────────────────────────┐    │
│  │  PostgreSQL (Neon)                                   │    │
│  │  • users table với refreshToken (hashed)            │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Cấu trúc dự án

```
BT_4/
├── backend/                           # NestJS Backend
│   ├── src/
│   │   ├── auth/                     # 🔐 JWT Authentication Module
│   │   │   ├── jwt.strategy.ts       # JWT validation (cookie + header)
│   │   │   ├── jwt-auth.guard.ts     # Route protection guard
│   │   │   └── auth.module.ts        # Auth config
│   │   │
│   │   ├── user/                     # 👤 User Module
│   │   │   ├── dto/
│   │   │   │   ├── register-user.dto.ts
│   │   │   │   └── login-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts    # User + refreshToken field
│   │   │   ├── user.controller.ts    # 🍪 Set/clear cookies
│   │   │   ├── user.service.ts       # JWT generation + validation
│   │   │   └── user.module.ts
│   │   │
│   │   ├── main.ts                   # cookie-parser setup
│   │   └── app.module.ts
│   │
│   ├── .env                          # JWT_SECRET, expiration times
│   └── package.json
│
└── frontend/                          # React Frontend
    ├── src/
    │   ├── hooks/
    │   │   └── useTokenRefresh.js    # 🔑 Auto refresh middleware
    │   │
    │   ├── components/
    │   │   └── ProtectedRoute.jsx    # Route guard với useTokenRefresh
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx       # User state management
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx             # 📝 React Hook Form + React Query
    │   │   ├── SignUp.jsx
    │   │   └── Dashboard.jsx         # 🔒 Protected page
    │   │
    │   ├── services/
    │   │   └── api.js                # 🔄 Axios + Interceptors + js-cookie
    │   │
    │   ├── App.jsx                   # React Query setup
    │   └── main.jsx
    │
    ├── .env                          # VITE_API_URL
    └── package.json
```

## 🚀 Cài đặt & Chạy

### 1️⃣ Backend Setup

```bash
cd backend

# Cài đặt dependencies
npm install

# Dependencies chính:
# - @nestjs/jwt @nestjs/passport passport passport-jwt
# - cookie-parser
# - bcrypt, typeorm, pg

# Tạo .env file
cp .env.example .env

# Cập nhật .env
DATABASE_URL=postgresql://username:password@host/database
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d
PORT=3001
FRONTEND_URL=http://localhost:5173

# Chạy server
npm run start:dev
```

**Backend chạy tại**: http://localhost:3001

### 2️⃣ Frontend Setup

```bash
cd frontend

# Cài đặt dependencies
npm install

# Dependencies chính:
# - react, react-router-dom
# - @tanstack/react-query (React Query)
# - react-hook-form
# - axios, js-cookie
# - react-hot-toast
# - tailwindcss

# Tạo .env file
cp .env.example .env

# Cập nhật .env
VITE_API_URL=http://localhost:3001

# Chạy dev server
npm run dev
# hoặc
npx vite
```

**Frontend chạy tại**: http://localhost:5173

## 🔐 Authentication Flow Chi tiết

### 1. Login Process

```javascript
// User nhập email/password → Submit form
POST /user/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Backend response + Set cookies
Set-Cookie: accessToken=eyJhbG...; HttpOnly; Secure; SameSite=Lax; Max-Age=900
Set-Cookie: refreshToken=eyJhbG...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800

Response: {
  "user": { "id": "...", "email": "..." },
  "accessToken": "eyJhbG...",  // Cũng trả về cho client backup
  "refreshToken": "eyJhbG..."
}

// Frontend:
// 1. Cookies tự động được browser lưu
// 2. User data → localStorage
// 3. Redirect → /dashboard
```

### 2. Protected Route Access (Đây là điểm quan trọng!)

```javascript
// User vào /dashboard
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>

// useTokenRefresh hook chạy:
const { isAuthenticated, isLoading } = useTokenRefresh();

// Logic:
1. Check accessToken trong cookie
   → ✅ Có → isAuthenticated = true → Vào trang
   
2. Check accessToken không có, nhưng có refreshToken
   → 🔄 POST /user/refresh { refreshToken }
   → Backend trả access + refresh token mới
   → Set cookies mới
   → ✅ isAuthenticated = true → Vào trang
   
3. Không có cả 2 tokens
   → ❌ isAuthenticated = false → Redirect /login
```

### 3. API Request với Authenticated Endpoint

```javascript
// Dashboard component
const { data: user } = useQuery({
  queryKey: ['userProfile'],
  queryFn: () => userAPI.getProfile(), // GET /user/profile
});

// Axios request interceptor tự động:
GET /user/profile
Headers: {
  Authorization: Bearer <accessToken_from_cookie>
}
Cookie: accessToken=...; refreshToken=...

// Backend JWT Guard validate token từ cookie hoặc header
```

### 4. Auto Token Refresh khi 401

```javascript
// Scenario: Access token hết hạn (sau 15 phút)
GET /user/profile
← 401 Unauthorized

// Axios response interceptor bắt lỗi:
if (status === 401) {
  const refreshToken = getRefreshToken(); // Từ cookie
  
  // Gọi refresh endpoint
  POST /user/refresh { refreshToken }
  ← New accessToken + refreshToken
  
  // Set cookies mới
  setAccessToken(newAccessToken);
  setRefreshToken(newRefreshToken);
  
  // Retry request gốc
  GET /user/profile (with new token)
  ← 200 OK
}
```

### 5. Logout

```javascript
// User click logout
POST /user/logout
Headers: { Authorization: Bearer <accessToken> }

// Backend:
// 1. Xóa refreshToken trong database
// 2. Clear cookies
res.clearCookie('accessToken');
res.clearCookie('refreshToken');

// Frontend:
// 1. Clear cookies (nếu backend chưa clear)
// 2. Clear localStorage
// 3. Redirect → /
```

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/user/register` | ❌ | Đăng ký user mới |
| POST | `/user/login` | ❌ | Login → Set access + refresh cookies |
| POST | `/user/refresh` | ❌ | Refresh access token từ refresh token |
| POST | `/user/logout` | ✅ | Logout → Clear cookies + invalidate token |
| GET | `/user/profile` | ✅ | Lấy thông tin user (Protected) |
| GET | `/user` | ❌ | List tất cả users |

### Request/Response Examples

#### Login
```bash
POST /user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
HTTP/1.1 200 OK
Set-Cookie: accessToken=eyJ...; HttpOnly; Secure; SameSite=Lax; Max-Age=900
Set-Cookie: refreshToken=eyJ...; HttpOnly; Secure; SameSite=Lax; Max-Age=604800

{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "createdAt": "2025-11-05T..."
  },
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

#### Refresh Token
```bash
POST /user/refresh
Cookie: refreshToken=eyJ...
Content-Type: application/json

{
  "refreshToken": "eyJ..."  # Fallback nếu cookie không có
}

# Response
HTTP/1.1 200 OK
Set-Cookie: accessToken=new_token; HttpOnly; Secure; SameSite=Lax; Max-Age=900
Set-Cookie: refreshToken=new_token; HttpOnly; Secure; SameSite=Lax; Max-Age=604800

{
  "accessToken": "eyJhbGci...",
  "refreshToken": "eyJhbGci..."
}
```

#### Get Profile (Protected)
```bash
GET /user/profile
Cookie: accessToken=eyJ...
Authorization: Bearer eyJ...  # Fallback

# Response
HTTP/1.1 200 OK

{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2025-11-05T..."
}
```

## 🔒 Security Features

### 1. Token Storage Strategy

| Token | Storage | Lifetime | Flags | Purpose |
|-------|---------|----------|-------|---------|
| **Access Token** | HTTP-only Cookie | 15 minutes | `HttpOnly`, `Secure`, `SameSite=Lax` | API authentication |
| **Refresh Token** | HTTP-only Cookie | 7 days | `HttpOnly`, `Secure`, `SameSite=Lax` | Renew access token |

### 2. Why HTTP-only Cookies? 🍪

✅ **Pros:**
- **XSS Protection**: JavaScript không thể đọc được → An toàn khỏi XSS attacks
- **Auto-send**: Browser tự động gửi cookie với mỗi request
- **Secure flag**: Chỉ gửi qua HTTPS trong production
- **SameSite**: Bảo vệ khỏi CSRF attacks

⚠️ **Considerations:**
- Cần CORS configuration với `credentials: true`
- Backend phải set cookie với domain đúng
- Production cần HTTPS

### 3. Password Security
- Bcrypt hashing với 10 salt rounds
- Không bao giờ return password trong response
- Validation: minimum 6 ký tự

### 4. Token Validation
- JWT signature verification
- Expiration time check
- User existence validation
- Refresh token hash comparison trong database

### 5. CORS Configuration

```typescript
// Backend main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,  // Allow cookies
});

// Frontend api.js
axios.create({
  withCredentials: true,  // Send cookies
});
```

## 🧪 Testing Instructions

### Scenario 1: Login Flow
1. Vào http://localhost:5173/login
2. Nhập: `user@example.com` / `password123`
3. Click Login
4. ✅ Redirect → /dashboard
5. Mở DevTools → Application → Cookies
6. Verify `accessToken` và `refreshToken` trong cookies

### Scenario 2: Protected Route without Login
1. Clear cookies (hoặc logout)
2. Trực tiếp vào http://localhost:5173/dashboard
3. ✅ Tự động redirect → /login

### Scenario 3: Page Reload (Quan trọng!)
1. Login thành công → Vào /dashboard
2. **Xóa `accessToken` cookie** (giữ lại `refreshToken`)
3. Refresh page (F5)
4. ✅ Không bị logout!
5. Check console: "🔄 No access token, refreshing..."
6. ✅ "✅ Access token refreshed successfully"
7. Dashboard load bình thường

### Scenario 4: Token Expiration Auto Refresh
1. Login → Vào dashboard
2. Đợi 15+ phút (hoặc set JWT_ACCESS_TOKEN_EXPIRATION=1m để test)
3. Click vào một feature cần API call
4. ✅ Request tự động retry sau khi refresh token
5. Check Network tab: 401 → POST /refresh → 200 retry

### Scenario 5: Logout
1. Vào dashboard
2. Click "Logout"
3. ✅ Cookies cleared
4. ✅ Redirect → Home
5. Try vào /dashboard → Redirect /login

## 📦 Deployment

### Backend (Railway / Render)

```bash
# Build
npm run build

# Start production
npm run start:prod

# Environment Variables
DATABASE_URL=<neon-postgresql-url>
JWT_SECRET=<strong-random-secret-min-32-chars>
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>
```

### Frontend (Vercel / Netlify)

```bash
# Build
npm run build

# Environment Variables
VITE_API_URL=<your-backend-url>

# Vercel
vercel --prod

# Netlify
netlify deploy --prod
```

### Post-Deployment Checklist
- [ ] Update `FRONTEND_URL` trong backend .env
- [ ] Update `VITE_API_URL` trong frontend .env
- [ ] Verify HTTPS enabled (required for Secure cookies)
- [ ] Test CORS với credentials
- [ ] Test login → refresh → logout flow
- [ ] Monitor error logs

## 🎓 Learning Outcomes

✅ **Core Concepts Mastered:**
1. JWT Access + Refresh Token pattern
2. HTTP-only Cookies security
3. Axios request/response interceptors
4. React Query for server state
5. React Hook Form validation
6. Protected routes implementation
7. Automatic token refresh middleware
8. Error handling best practices

✅ **Assignment Requirements:**
- [x] Login & Logout mechanism ✅
- [x] JWT Access & Refresh tokens ✅
- [x] Token storage strategy (Cookies) ✅
- [x] Axios configuration & interceptors ✅
- [x] Automatic token refresh ✅
- [x] React Query integration ✅
- [x] React Hook Form validation ✅
- [x] Protected routes ✅
- [x] Error handling ✅
- [x] Public hosting ready ✅

## 🤝 Tech Stack Summary

### Backend
- **NestJS** 11.0 - TypeScript framework
- **PostgreSQL** (Neon) - Database
- **TypeORM** - ORM
- **@nestjs/jwt** + **passport-jwt** - JWT strategy
- **cookie-parser** - Cookie handling
- **bcrypt** - Password hashing

### Frontend
- **React** 19.1 - UI library
- **React Router** 7.9 - Navigation
- **TanStack Query** 5.90 - Server state
- **React Hook Form** 7.65 - Form validation
- **Axios** 1.13 - HTTP client
- **js-cookie** - Cookie manipulation
- **Tailwind CSS** - Styling

## 📚 Resources

- [JWT.io](https://jwt.io/) - JWT debugger
- [TanStack Query](https://tanstack.com/query/latest) - React Query docs
- [NestJS JWT](https://docs.nestjs.com/security/authentication) - Official docs
- [HTTP-only Cookies](https://owasp.org/www-community/HttpOnly) - Security guide

---

**Author**: Assignment BT_4 - React Authentication with JWT  
**Year**: 2025  
**Course**: Web Development

⭐ **If you find this helpful, give it a star!** ⭐
