# 🔍 Debug Steps - Token Persistence Issue

## Test Flow

### 1. Login
1. Mở Console (F12)
2. Login với: user@example.com / password123
3. **Xem logs:**
   ```
   📥 Login response: {...}
   🔐 Login called with: {...}
   🍪 Set accessToken: ✅ SUCCESS hoặc ❌ FAILED
   🍪 Set refreshToken: ✅ SUCCESS hoặc ❌ FAILED
   ```

### 2. Check Cookies NGAY SAU LOGIN
```javascript
// Trong console:
window.debugAuth()
```

Hoặc:
- F12 → Application tab → Cookies → http://localhost:5173
- Tìm `accessToken` và `refreshToken`

### 3. Reload Page (F5)
**Xem logs:**
```
🔍 AuthContext init: {
  hasStoredUser: true/false,
  hasAccessToken: true/false,
  hasRefreshToken: true/false
}
```

### 4. Expected vs Actual

#### ✅ EXPECTED (Đúng):
- Login → Cookies được set → Reload → Vẫn có cookies → Vào được dashboard

#### ❌ ACTUAL (Lỗi):
- Login → Cookies được set (?) → Reload → Cookies mất (?) → Bị redirect login

## Possible Issues

### Issue 1: Cookies không được lưu
**Triệu chứng:** Log `🍪 Set accessToken: ❌ FAILED`
**Nguyên nhân:** 
- js-cookie config sai
- Browser block cookies
- Token quá dài

### Issue 2: Cookies bị xóa khi reload
**Triệu chứng:** Sau login có cookies, nhưng reload thì mất
**Nguyên nhân:**
- Session cookies (không set expires)
- SameSite config
- Path không đúng

### Issue 3: Cookies có nhưng không đọc được
**Triệu chứng:** F12 thấy cookies nhưng log `hasAccessToken: false`
**Nguyên nhân:**
- Cookie name không khớp
- Path không khớp
- js-cookie không đọc được

## Quick Fix Test

Thử set cookie thủ công trong console:
```javascript
document.cookie = "test=123; path=/; max-age=3600"
console.log(document.cookie)
```

Nếu không thấy → Browser settings block cookies
