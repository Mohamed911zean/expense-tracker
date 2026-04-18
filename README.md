# Expense Tracker

A full-stack expense ,income, aqquestions tracking application built with React, Vite, Express, and MongoDB.

This repository contains two main parts:

- `Backend/`: A Node.js + Express API server with authentication, expense and income management, dashboard data, and file upload support.
- `Frontend/expense-tracker/`: A React + Vite frontend that provides login/signup, transaction tracking, charts, and a responsive dashboard.

## Key Features

- User authentication with JWT
- Expense and income CRUD operations
- Transaction detail pages
- Dashboard overview and reporting
- Protected routes for authenticated users
- API built with Express and MongoDB
- Frontend built with React, React Router, Tailwind CSS, and Recharts

## Folder Structure

- `Backend/`
  - `src/server.js`: Express server entry point
  - `src/routes/`: API route definitions
  - `src/controllers/`: Backend logic for authentication, expenses, income, dashboard, and more
  - `src/model/`: Mongoose models
  - `src/config/db.js`: MongoDB connection setup

- `Frontend/expense-tracker/`
  - `src/App.jsx`: Route setup with protected/public routes
  - `src/pages/`: Client pages for Dashboard, Income, Expense, Acquisitions, Login, Signup, and Transaction details
  - `src/components/`: UI components and layout pieces
  - `src/context/`: Auth and transaction context providers
  - `src/utils/`: API helpers and configuration

## Requirements

- Node.js 18+ (or compatible)
- npm
- MongoDB running locally or accessible via a connection string

## Setup

### 1. Backend

```bash
cd a:/web/self-projects/expense-tracker/Backend
npm install
```

Create or update `Backend/.env` with the following values:

```env
PORT=8000
MONGO_URL=mongodb://localhost:27017/expense-app
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

### 2. Frontend

```bash
cd a:/web/self-projects/expense-tracker/Frontend/expense-tracker
npm install
npm run dev
```

The frontend should open on `http://localhost:5173` by default.

### 3. Run both together from repository root

If you want to run both server and client simultaneously, use the root script setup:

```bash
cd a:/web/self-projects/expense-tracker
npm run dev
```

> Note: this command assumes the root `package.json` is configured with `client` and `server` scripts.

## Usage

- Visit `/signup` to create a new user
- Visit `/login` to authenticate
- Use the dashboard to review balances and recent transactions
- Add or edit income and expense entries
- View transaction details on the detail page

## Technologies

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, dotenv, cors
- Frontend: React, Vite, Tailwind CSS, React Router, React Hot Toast, Recharts, Axios

## Notes

- The default `Backend/.env` includes a local MongoDB URL; update it if you use a hosted database.
- The frontend uses client-side routing, so use `npm run dev` for local testing.

## License

This project does not include a license file. Add one if you want to share it publicly.
