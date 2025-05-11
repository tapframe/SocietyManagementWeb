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
1. **Citizen**: Regular users who can report violations, learn about rules, share improvement ideas, and create/sign petitions
2. **Admin**: Authorities (police/advocates) who review reports and petitions, and take actions

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
  - `PetitionsPage.tsx`: Browse and create community petitions
  - `PetitionDetailPage.tsx`: View and sign individual petitions
  - `admin/Dashboard.tsx`: Admin interface for managing reports and petitions
  - `admin/PetitionsManagement.tsx`: Admin interface for reviewing petitions

- **Components**
  - `PetitionForm.tsx`: Multi-step form for creating new petitions
  - `PetitionCard.tsx`: Card component for displaying petition information
  - `PetitionFilters.tsx`: Filter controls for petition listing

### Backend Components
- **Server**: Express server setup in `server.js`
- **Authentication**: JWT-based authentication in `routes/auth.js`
- **Models**: MongoDB schema models in `models/` directory
- **Controllers**: API controllers in `controllers/` directory

## Key Features

### For Citizens
1. **Report Violations**: Upload evidence of social rule violations via videos or descriptions
2. **Learn About Rules**: Browse important laws and regulations to become a more informed citizen
3. **Share Ideas**: Contribute suggestions for improving the community
4. **Create & Sign Petitions**: Start community initiatives and gather support from other residents
   - Submit petitions that require admin approval before becoming public
   - Track progress toward signature goals
   - Sign existing petitions with optional comments
   - Delete their own petitions
   - Filter petitions by status (active, completed, pending, rejected)

### For Admins
1. **Review Reports**: View and assess citizen-submitted reports
2. **Take Action**: Approve or reject reports, issue fines or legal notices
3. **Manage Community**: Oversee the platform and maintain social order
4. **Review Petitions**: Approve or reject community petitions through a dedicated management interface

## Frontend Implementation Notes
- Using Material UI with GridLegacy instead of Grid for the newer Material UI version
- Responsive design supporting mobile and desktop views
- Form validation for data integrity
- Sample data used for demonstration purposes
- Multi-step forms for complex data entry operations

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

### Petition Collection
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
  category: {
    type: String,
    required: true,
    trim: true
  },
  goal: {
    type: Number,
    required: true,
    min: 10,
    default: 100
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'expired', 'rejected'],
    default: 'active'
  },
  image: {
    type: String
  },
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  signatures: [{
    user: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    comment: {
      type: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  updates: [{
    text: {
      type: String,
      required: true
    },
    addedBy: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  adminReview: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    notes: {
      type: String
    },
    reviewedBy: {
      type: ObjectId,
      ref: 'User'
    },
    reviewedAt: {
      type: Date
    }
  },
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

### Petition Endpoints
- **GET /api/petitions**: Get all approved petitions
  - Public route that returns all approved petitions
  - Response: Array of petition objects

- **GET /api/petitions/user**: Get all petitions created by the current user
  - Protected route (requires authentication)
  - Response: Array of petition objects created by the user

- **GET /api/petitions/:id**: Get a specific petition
  - Public route that returns details of a specific petition
  - Response: Petition object with populated user information

- **POST /api/petitions**: Create a new petition
  - Protected route (requires authentication)
  - Request: `{ title, description, category, goal, deadline }`
  - Response: The created petition object

- **POST /api/petitions/:id/image**: Upload image for a petition
  - Protected route (only petition creator or admin)
  - Request: `FormData` object with an image field
  - Response: `{ message: 'Image uploaded successfully', file: filename }`

- **PUT /api/petitions/:id**: Update a petition
  - Protected route (only petition creator or admin)
  - Request: `{ title, description, category, goal, deadline }`
  - Response: Updated petition object

- **DELETE /api/petitions/:id**: Delete a petition
  - Protected route (only petition creator)
  - Response: `{ message: 'Petition deleted successfully' }`

- **POST /api/petitions/:id/sign**: Sign a petition
  - Protected route (requires authentication)
  - Request: `{ comment }`
  - Response: `{ message: 'Signature added successfully', signatureCount: number }`

- **POST /api/petitions/:id/updates**: Add an update to a petition
  - Protected route (only petition creator or admin)
  - Request: `{ text }`
  - Response: The created update object

- **GET /api/petitions/admin/all**: Get all petitions for admin review
  - Protected route (admin only)
  - Response: Array of all petition objects

- **PUT /api/petitions/admin/:id/review**: Review a petition
  - Protected route (admin only)
  - Request: `{ status, notes }` (status must be 'approved' or 'rejected')
  - Response: Updated petition object

## Future Enhancements
- File upload functionality for evidence
- Admin notification system
- Mobile application version
- Advanced reporting analytics
- Integration with government systems
- Petition analytics dashboard
- Social media sharing for petitions
- Email notifications for petition updates

## Database Schema (Planned)
*To be implemented in future phases*

## API Endpoints (Planned)
*To be implemented in future phases*
