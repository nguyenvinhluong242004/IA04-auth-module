# User Registration System - Frontend (React)# React + Vite



## 📝 DescriptionThis template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Frontend cho hệ thống đăng ký người dùng, xây dựng với React, React Query, React Hook Form và Tailwind CSS.

Currently, two official plugins are available:

## 🛠️ Technologies

- **React** + **Vite** - Fast development- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh

- **React Router** - Routing- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

- **React Query** - Data fetching

- **React Hook Form** - Form validation## React Compiler

- **Axios** - HTTP client

- **Tailwind CSS** - StylingThe React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).



## 🚀 Quick Start## Expanding the ESLint configuration



```bashIf you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Frontend chạy tại: `http://localhost:5173`

## 📡 API Configuration

File `.env`:
```env
VITE_API_URL=http://localhost:3001
```

**Lưu ý**: Backend phải chạy trước!

## 🎨 Pages

- **Home** (`/`) - Landing page
- **Sign Up** (`/signup`) - Registration với API integration
- **Login** (`/login`) - Login form (mock)

## ✨ Features

### Sign Up Page
- ✅ Form validation (email format, password min 6 chars)
- ✅ API integration với React Query
- ✅ Loading & error states
- ✅ Success message
- ✅ Responsive design

### Login Page
- ✅ Form validation
- ✅ Mock login
- ✅ Beautiful UI
- ✅ Responsive design

## 🧪 Test

1. Start backend: `cd backend && npm run start:dev`
2. Start frontend: `npm run dev`
3. Open `http://localhost:5173`
4. Test Sign Up với email/password

## 📦 Build

```bash
npm run build
npm run preview
```

## 🚀 Deploy

### Vercel
```bash
vercel
```

### Netlify
```bash
netlify deploy --prod
```

Nhớ set `VITE_API_URL` to production backend URL!

---

Built with ❤️ using React + Vite + Tailwind CSS
