# Job Application Portal

A full-stack web application that facilitates job postings and applications, connecting employers and job seekers.

## Table of Contents
- [Architecture](#architecture)
- [Design Patterns](#design-patterns)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Features](#features)
- [Setup & Installation](#setup--installation)
- [Testing](#testing)

## Architecture

### MVC (Model-View-Controller) Architecture
The project follows the MVC pattern, separating concerns into:

- **Models**: Located in `/backend/src/models/`
  - User.js - Handles user data and authentication
  - JobListing.js - Manages job posting operations
  - JobApplication.js - Handles application processing

- **Views**: Frontend React components in `/frontend/src/`
  - Components represent the View layer
  - Uses React Router for navigation
  - Tailwind CSS for styling

- **Controllers**: Located in `/backend/src/controllers/`
  - authController.js - Handles authentication logic
  - jobListingController.js - Manages job listings
  - jobApplicationController.js - Processes applications
  - employerController.js - Handles employer-specific operations
  - jobSeekerController.js - Manages job seeker operations

### Design Patterns

1. **Factory Pattern**
   - Implemented in User model for creating different types of users (Job Seekers and Employers)
   - Example in `/backend/src/models/User.js`:
   ```javascript
   static async createProfile(userId, profileData, userType)
   ```

2. **Observer Pattern**

- Used in frontend components for state management
- React's useEffect hook for watching state changes
- Example in job application status updates

3. **Singleton Pattern**
- Database connection implementation
- Mail configuration setup

## Technologies Used 

### Frontend
- React.js (Vite)
- React Router for navigation
- Tailwind CSS for styling
- Axios for API requests

### Backend
- Node.js
- Express.js
- MySQL database
- JWT for authentication
- Multer for file uploads
- Nodemailer for email functionality

### Testing
- Playwright for E2E testing
- Jest for unit testing

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── [App.jsx]
│   ├── [package.json]
│   └── vite.config.js
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   └── [package.json]
└── tests/
    └── e2e/
```

## Features

### Authentication
- User registration (Job Seeker/Employer)
- Login/Logout functionality
- JWT-based authentication
- Protected routes

### Employer Features
- Create and manage job listings
- View job applications
- Update application statuses
- Send emails to applicants
- Company profile management

### Job Seeker Features
- View available jobs
- Apply to jobs with cover letters
- Upload and manage resumes
- Track application status
- Profile management

### Job Management
- Create, read, update job listings
- Filter and search capabilities
- Application tracking
- Status updates

## Setup & Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install frontend dependencies
```bash
cd frontend
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Configure environment variables
```bash
# Backend .env
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_DATABASE=job_portal
JWT_SECRET=your_secret_key

# Frontend .env
VITE_API_URL=http://localhost:3000
```

5. Start the applications
```bash
# Frontend
npm run dev

# Backend
npm start
```

## Testing

Run E2E tests using Playwright:
```bash
npm run test
```

Test coverage includes:
- Authentication flows
- Job posting process
- Application submission
- Profile management
- Email functionality

## API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Job Endpoints
- GET `/api/jobs/active` - Get active job listings
- POST `/api/jobs` - Create new job listing
- GET `/api/jobs/employer` - Get employer's job listings

### Application Endpoints
- POST `/api/applications/apply` - Submit job application
- GET `/api/applications/my-applications` - Get user's applications
- PATCH `/api/applications/:id/status` - Update application status

## Contributors
- Eldar Dadić
- Arijan Komšić

