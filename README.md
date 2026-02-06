# Scalable REST API & Frontend Assignment

This project contains a REST API for Task Management with Role-Based Access Control and a reacting Frontend UI.

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, Zod.
- **Frontend**: React, Vite, TypeScript, TailwindCSS, Axios, Context API.
- **Docs**: Swagger UI.

## Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

## Setup & Run

### 1. Backend
```bash
cd backend
npm install
npm run dev
```
Server runs on `http://localhost:5000`.
Swagger Docs: `http://localhost:5000/api-docs`.

**Environment Variables**:
Create `.env` in `backend/` (optional, defaults provided in code):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/assignment_db
JWT_SECRET=supersecret
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## Features
- **Auth**: Register, Login (JWT).
- **RBAC**: Admin can access all tasks; Users can access only their own.
- **Features**: Create, Read (Pagination), Update, Delete Tasks.
- **UI**: Modern, responsive design with TailwindCSS.

## API Documentation
Visit `/api-docs` on the backend server for full Swagger documentation.

## Scalability
See [SCALABILITY.md](./SCALABILITY.md) for architectural decisions and scaling strategies.
