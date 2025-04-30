# Society Management System Documentation

## Overview
The Society Management System (SMS) is a comprehensive web-based platform designed to promote social order, awareness, and active community participation in India. The system is structured around two primary user roles: normal citizens and admins, with admins consisting of police officers and advocates who are responsible for enforcing laws and regulations.

## Technology Stack
- **Frontend**: React with TypeScript using Material UI
- **UI Component Library**: Material UI v7
- **Frontend Routing**: React Router v7
- **Build Tool**: Vite
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## User Roles
1. **Citizen**: Regular users who can report violations, learn about rules, and share improvement ideas
2. **Admin**: Authorities (police/advocates) who review reports and take actions

## Application Structure

### Frontend Components
- **Layouts**
  - `MainLayout.tsx`: Main application layout with header, footer, and navigation

- **Pages**
  - `HomePage.tsx`: Landing page with hero section and feature highlights
  - `LoginPage.tsx`: User authentication 
  - `RegisterPage.tsx`: New user registration
  - `ReportPage.tsx`: Form for reporting violations
  - `RulesPage.tsx`: Information about laws and regulations
  - `IdeasPage.tsx`: Community ideas sharing platform
  - `admin/Dashboard.tsx`: Admin interface for managing reports

### Backend Components
- **Server**: Express server setup in `server.js`
- **Authentication**: JWT-based authentication in `routes/auth.js`
- **Models**: MongoDB schema models in `models/` directory

## Key Features

### For Citizens
1. **Report Violations**: Upload evidence of social rule violations via videos or descriptions
2. **Learn About Rules**: Browse important laws and regulations to become a more informed citizen
3. **Share Ideas**: Contribute suggestions for improving the community

### For Admins
1. **Review Reports**: View and assess citizen-submitted reports
2. **Take Action**: Approve or reject reports, issue fines or legal notices
3. **Manage Community**: Oversee the platform and maintain social order

## Frontend Implementation Notes
- Using Material UI with GridLegacy instead of Grid for the newer Material UI version
- Responsive design supporting mobile and desktop views
- Form validation for data integrity
- Sample data used for demonstration purposes

## Authentication System
- JSON Web Token (JWT) based authentication
- Secure password hashing with bcrypt
- Role-based access control (citizen vs admin)
- Protected routes for authenticated users

## Database Schema

### User Collection
```
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['citizen', 'admin'],
    default: 'citizen'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Report Collection
```
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['violation', 'complaint'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  evidence: {
    type: String
  },
  submittedBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: ObjectId,
    ref: 'User'
  },
  comments: [{
    text: {
      type: String,
      required: true
    },
    user: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

### Future Collections (Planned)
- **Ideas**: For community improvement suggestions
- **Rules**: To document laws and regulations
- **Notifications**: For system alerts and communications

## API Endpoints

### Authentication Endpoints
- **POST /api/auth/register**: Register a new user
  - Request: `{ name, email, password, role }`
  - Response: `{ token, user: { id, name, email, role } }`

- **POST /api/auth/login**: Authenticate a user
  - Request: `{ email, password }`
  - Response: `{ token, user: { id, name, email, role } }`

- **GET /api/auth/me**: Get current user information (protected route)
  - Response: `{ id, name, email, role }`

### Report Endpoints
- **GET /api/reports**: Get all reports 
  - Protected route: Admin users see all reports, citizens see only their own
  - Response: Array of report objects

- **GET /api/reports/:id**: Get a specific report
  - Protected route: Only the user who submitted the report or an admin can access it
  - Response: Report object with populated user information

- **POST /api/reports**: Create a new report
  - Protected route
  - Request: `{ title, description, type, category, location, date, time }`
  - Response: The created report object

- **POST /api/reports/:id/evidence**: Upload evidence file for a report
  - Protected route
  - Request: `FormData` object with a file field
  - Response: `{ message: 'Evidence uploaded successfully', file: filename }`

- **PATCH /api/reports/:id/status**: Update the status of a report
  - Protected route (admin only)
  - Request: `{ status }` (must be one of: pending, in-progress, resolved, rejected)
  - Response: Updated report object

- **PATCH /api/reports/:id/assign**: Assign a report to an admin
  - Protected route (admin only)
  - Request: `{ adminId }`
  - Response: Updated report object

- **POST /api/reports/:id/comments**: Add a comment to a report
  - Protected route
  - Request: `{ text }`
  - Response: The created comment object with populated user information

## Future Enhancements
- File upload functionality for evidence
- Admin notification system
- Mobile application version
- Advanced reporting analytics
- Integration with government systems

## Database Schema (Planned)
*To be implemented in future phases*

## API Endpoints (Planned)
*To be implemented in future phases*
