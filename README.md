# 🔐 Auth API

Authentication API built with **Node.js**, **Express**, and **PostgreSQL**, focused on backend best practices, security, and clean project structure.

This project was built as a hands-on study to understand how real authentication systems work behind the scenes.

---

## 🚀 Features

- User registration  
- User login with JWT generation  
- Password hashing with bcrypt  
- Protected routes using middleware  
- Role-based access control (RBAC)  
- Authenticated user profile route  
- Admin routes  
- Organized project structure  
- Global error handling  

---

## 🛠 Technologies

- Node.js  
- Express.js  
- PostgreSQL  
- JWT (jsonwebtoken)  
- bcrypt  
- ES Modules  
- MVC Pattern  

---

## 📁 Project Structure
```bash
public/
├── css/styles.css
├── login.html
├── me.html
├── register.html

src/
├── controllers/
├── routes/
├── middlewares/
├── database/
├── app.js
└── server.js
```

---

## 🔐 Authentication

The API uses **JWT (JSON Web Token)** for authentication.

After login, the JWT is returned by the API and used by the frontend
(JavaScript) to access protected routes by sending:

Authorization: Bearer <token>

## 👤 User Roles

The system uses role-based access control:

| Role  | Permissions |
|------|-------------|
| user  | Access to regular routes |
| admin | Access to administrative routes |

Responsible middlewares:
- `authMiddleware` → verifies token  
- `authorizeRoles` → checks permissions  

---

## 📌 Main Routes

### User Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | /users/register | Create account |
| POST | /users/login | Login |
| GET | /users/me | Get authenticated user profile |

### Admin Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | /admin/users | List all users |
| DELETE | /admin/users/:id | Delete user |

---

### Creating an Admin User

By default, new users are created with the role `user`.

To promote a user to admin manually:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@email.com';
```

---

## 🌐 Frontend (Demo Interface)

This project includes a simple frontend built with HTML, CSS, and vanilla JavaScript for testing authentication flows.

Pages included:

- login.html
- register.html
- me.html

The frontend consumes the API and stores the JWT to access protected routes.

---

## ⚙️ Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create .env file
```bash
PORT=3000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
DATABASE_URL=your_postgres_connection_string
```
### 3. Create database and tables

```sql
CREATE DATABASE auth_api;

\c auth_api;

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Run the server
```bash
npm run dev
```

---

## 🔒 Security Practices

- Passwords are hashed using bcrypt  
- JWT is required to access protected routes  
- Role-based authorization middleware  
- Environment variables used for sensitive data  
- Centralized error handling to avoid leaking internal details  

---

## 📚 Learning Outcomes

During development, the following concepts were practiced:

- Full authentication flow
- Password security
- Express middleware
- Route protection
- Database integration
- Backend project organization