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

### Future Collections (Planned)
- **Reports**: To store violation reports from citizens
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

### Future Endpoints (Planned)
- **Reports API**: For submitting and managing violation reports
- **Ideas API**: For sharing and discussing community improvement ideas
- **Rules API**: For accessing information about laws and regulations

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
