# Society Management System

A comprehensive web-based platform designed to promote social order, awareness, and active community participation. The system is structured around two primary user roles: normal citizens and admins (police officers and advocates).

## Project Structure

The project is organized into two main parts:

### Frontend (React)

- Located in the root directory
- Built with React, TypeScript, and Material UI
- Includes pages for login, registration, reporting issues, and more
- Implements JWT authentication with protected routes

### Backend (Node.js/Express)

- Located in the `backend` directory
- Built with Node.js, Express, and MongoDB
- Provides API endpoints for authentication and data management
- Implements JWT-based authentication and role-based access control

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm (Node Package Manager)

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/society-management
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```

4. Start the server:
   ```
   npm run dev
   ```

## Features

- User authentication (login/register)
- Role-based access control (citizen/admin)
- Protected routes based on authentication and roles
- JWT token-based auth system
- Secure password hashing with bcrypt
- Responsive UI with Material UI

## Documentation

For more detailed information, please refer to:

- [Backend Documentation](backend/README.md)
- [API Documentation](backend/README.md#api-endpoints)
- [Database Schema](sms.md#database-schema)

## Development

The project follows the repository pattern with clear separation between frontend and backend. Please refer to [sms.md](sms.md) for comprehensive documentation on the project architecture and design.

## Admin Access

This application includes a secure admin access system with the following features:

### Admin Access

You can access the admin portal by typing the secret keyboard combination `815787` anywhere in the application. When typed correctly, an admin login dialog will appear allowing you to:

1. Login as an existing admin
2. Create a new admin account (requires the admin secret key: `815787`)

### Admin API Endpoints

The backend includes several admin-specific API endpoints:

- **POST /api/admin/register** - Create a new admin account (requires secret key)
- **POST /api/admin/login** - Login as an admin
- **GET /api/admin/users** - Get all users (admin only)
- **PUT /api/admin/users/:id** - Update a user (admin only)
- **DELETE /api/admin/users/:id** - Delete a user (admin only)
- **GET /api/reports/admin/all** - Get all reports (admin only)
- **PUT /api/reports/admin/:id/status** - Update report status (admin only)
- **GET /api/reports/admin/stats** - Get report statistics (admin only)

### Admin Dashboard

The admin dashboard provides real-time data fetched from the backend, including:

- Overview statistics of reports (pending, approved, rejected)
- Detailed report management with approval/rejection functionality
- Status tracking and admin notes for each report
- Evidence handling and review capabilities 