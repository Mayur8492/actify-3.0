# Actify - AI-Powered Behavioral Productivity Analysis Platform

Actify is a full-stack production-ready SaaS application designed to track user activities, productivity habits, focus sessions, and work performance. It provides deep behavioral insights using an AI Insights Engine.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router v6, Zustand, Axios, Recharts, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT Authentication

## Project Structure
The project is a monorepo containing two main directories:
- `frontend/`: The React client application.
- `backend/`: The Express API server.

## Features Completed
1. **Authentication System**: Secure JWT-based signup and login with role-based access.
2. **Dashboard**: Overview of user statistics and focus timer.
3. **Workspaces**: Personal and team workspace management.
4. **Pages**: Notion-like nested document editor.
5. **Tasks**: Kanban board task management with priority, status, and categories.
6. **Activity Tracking**: Real-time logging of user actions.
7. **Focus Timer**: Pomodoro-style timer with interruption tracking.
8. **Behavioral Analytics**: Recharts-based data visualization for Productivity, Focus, and Consistency scores.
9. **Realtime Notifications**: Socket.io integration for instant alerts.
10. **Admin Panel**: System-wide statistics and user management.

## Setup Instructions

### Backend Setup
1. Navigate to `backend/` directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in `backend/` and add:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/actify
   JWT_SECRET=your_super_secret_key_here
   ```
4. Start the backend server: `npm start` (or `node server.js`)

### Frontend Setup
1. Navigate to `frontend/` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite development server: `npm run dev`

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## Architecture Note
This implementation uses clean code architecture with modular controllers, models, and routes in the backend, and global Zustand stores connected to React components in the frontend. Socket.io handles real-time bidirectional communication.
