# 🔐 Auth API — Production-Ready Authentication System

A secure and structured Authentication API built with Node.js, Express, and PostgreSQL, following real-world backend best practices.

This project was developed to deeply understand how production authentication systems work — focusing on security, clean architecture, and scalability.

---

## 🚀 Core Features

- User Registration
- User Login with JWT
- Secure Password Hashing (bcrypt)
- JWT Authentication Middleware
- Role-Based Access Control (RBAC)
- Authenticated Profile Route (/me)
- Update User Data (PATCH /me)
- Delete Account (DELETE /me)
- Admin-Only Routes
- Centralized Error Handling
- Regex-Based Input Validation
- Modular Utilities Architecture

---
## 🧠 Architectural Decisions

### 🔐 JWT (Stateless Authentication)

Chosen for scalability and stateless architecture.
No server-side session storage required.

### 🔑 Password Security

Passwords are:

Hashed using bcrypt (12 salt rounds)
Never returned in responses
Validated before hashing

### 🧩 Layered Structure

Controllers → Business Logic
Middlewares → Auth & Authorization
Utils → Reusable helpers (JWT, bcrypt, regex)

Database → Isolated connection logic

### 🛡 Role-Based Access Control

authMiddleware → Validates JWT
authorizeRoles → Validates permissions
Role column stored in database

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
src/
├── controllers/
│   ├── authController.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── authorizeRoles.js
│   ├── errorHandler.js
│
├── utils/
│   ├── generateToken.js
│   ├── hashPassword.js
│   ├── regexVerification.js
│
├── database/
│   ├── db.js
│
├── routes/
│   ├── userRoutes.js
│   ├── adminRoutes.js
│
├── app.js
└── server.js
```

---

## 🔐 Authentication Flow

### 1️⃣ Register

Input validation
Business validation (unique email/name)
Password hashing
JWT generation

### 2️⃣ Login

Email format validation
Credential verification
Password comparison
JWT issuance

### 3️⃣ Protected Routes

All protected routes require:
Authorization: Bearer <token>

## 👤 Role-Based Access

| Role  | Access Level              |
| ----- | ------------------------- |
| user  | Standard protected routes |
| admin | Administrative routes     |

Admin routes are protected with layered middleware:

- Token verification
- Role verification

--- 

## 📌 API Routes

### 🔓 Public

| Method | Route           | Description    |
| ------ | --------------- | -------------- |
| POST   | /users/register | Create account |
| POST   | /users/login    | Login          |

### 🔒 Authenticated

| Method | Route     | Description            |
| ------ | --------- | ---------------------- |
| GET    | /users/me | Get authenticated user |
| PATCH  | /users/me | Update account data    |
| DELETE | /users/me | Delete account         |

### 🛡 Admin

| Method | Route            | Description       |
| ------ | ---------------- | ----------------- |
| GET    | /admin/users     | List all users    |
| DELETE | /admin/users/:id | Delete user by ID |


### Creating an Admin User

By default, new users are created with the role `user`.

To promote a user to admin manually:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@email.com';
```

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

## 🔒 Security Practices Implemented

- Password hashing with bcrypt
- JWT-based authentication
- Role-based authorization
- Conflict-safe user validation
- Proper HTTP status codes
- Input validation before database operations
- Centralized error handler
- No password exposure in responses

---

## 📈 Backend Engineering Concepts Practiced

- Stateless authentication
- Access control patterns
- RESTful API design
- Middleware chaining
- Business rule validation
- Secure password lifecycle
- Proper status code semantics
- Modular architecture
- Separation of concerns

---

## 🧪 Possible Future Improvements

- Refresh Token rotation
- Email verification flow
- Rate limiting on login
- Account lock after failed attempts
- Docker containerization
- Logging system (Winston / Pino)
- Automated tests (Jest + Supertest)

---

## 🏆 Project Goal

This project was built not as a tutorial copy, but as a backend engineering exercise focused on:

- Writing clean and secure authentication logic
- Understanding real production flows
- Structuring scalable Express applications
- Thinking in terms of security-first backend design

---

## 👨‍💻 Author

Benjamin Bernardi
Backend Developer in Progress 🚀