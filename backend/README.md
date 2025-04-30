# Society Management System - Backend

This is the backend for the Society Management System, built with Node.js, Express, and MongoDB.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm (Node Package Manager)

### Installation

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/society-management
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```
   Note: Replace the `MONGODB_URI` with your actual MongoDB connection string if using MongoDB Atlas.

### Running the Server

To start the server in development mode:
```
npm run dev
```

To start the server in production mode:
```
npm start
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
  - Request Body: `{ name, email, password, role }`
  - Response: `{ token, user: { id, name, email, role } }`

- **POST /api/auth/login** - Authenticate a user
  - Request Body: `{ email, password }`
  - Response: `{ token, user: { id, name, email, role } }`

- **GET /api/auth/me** - Get current user information (protected route)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ id, name, email, role }`

## Database Models

### User Model

- **name** (String, required): Full name of the user
- **email** (String, required, unique): Email address for login
- **password** (String, required): Hashed password
- **role** (String, enum): Either 'citizen' or 'admin'
- **createdAt** (Date): Account creation timestamp

## Security Features

- Password hashing with bcrypt
- JWT authentication with token expiration
- Protected routes middleware
- Role-based access control 