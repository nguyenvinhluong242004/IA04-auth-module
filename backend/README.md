# User Registration API - Backend (NestJS)

## 📝 Description
Backend API cho hệ thống đăng ký người dùng, được xây dựng với NestJS, MongoDB và Mongoose.

## 🛠️ Technologies
- **NestJS** - Framework Node.js
- **MongoDB** - Database
- **Mongoose** - ODM
- **bcrypt** - Password hashing
- **class-validator** - Validation
- **class-transformer** - Data transformation

## 📋 Prerequisites
- Node.js (v18 trở lên)
- npm hoặc yarn
- MongoDB (local hoặc cloud)

## 🚀 Installation

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Cập nhật các biến môi trường trong `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/user_registration
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Chạy MongoDB
Đảm bảo MongoDB đang chạy trên máy local hoặc sử dụng MongoDB Atlas.

**Nếu sử dụng MongoDB local:**
```bash
mongod
```

**Nếu sử dụng MongoDB Atlas:**
- Tạo cluster trên [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Copy connection string và cập nhật vào `MONGODB_URI` trong file `.env`

### 4. Chạy ứng dụng

**Development mode:**
```bash
npm run start:dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

Server sẽ chạy tại: `http://localhost:3001`

## 📡 API Endpoints

### 1. Register User
**POST** `/user/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "65f1234567890abcdef12345",
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- **409 Conflict** - Email already exists
- **400 Bad Request** - Validation errors
- **500 Internal Server Error** - Server error

### 2. Get All Users
**GET** `/user`

**Success Response (200):**
```json
[
  {
    "id": "65f1234567890abcdef12345",
    "email": "user@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

## 🔒 Security Features
- ✅ Password hashing với bcrypt
- ✅ Input validation với class-validator
- ✅ CORS enabled
- ✅ Environment variables cho sensitive data
- ✅ Unique email constraint

## 🧪 Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📁 Project Structure
```
backend/
├── src/
│   ├── user/
│   │   ├── dto/
│   │   │   └── register-user.dto.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .env.example
└── package.json
```

## 🌐 CORS Configuration
CORS được cấu hình để chấp nhận requests từ frontend (mặc định: `http://localhost:5173`). 
Để thay đổi, cập nhật biến `FRONTEND_URL` trong file `.env`.

## 📝 Validation Rules
- **Email**: 
  - Required
  - Must be valid email format
  - Must be unique
- **Password**:
  - Required
  - Minimum 6 characters

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Đảm bảo MongoDB đang chạy hoặc cập nhật `MONGODB_URI` đúng.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solution:** Thay đổi `PORT` trong file `.env` hoặc kill process đang sử dụng port 3001.

## 📦 Dependencies
- @nestjs/common
- @nestjs/core
- @nestjs/mongoose
- @nestjs/config
- mongoose
- bcrypt
- class-validator
- class-transformer

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

Recommended platforms:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Heroku](https://heroku.com)
- [AWS EC2](https://aws.amazon.com/ec2/)

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
