# Job Board (MERN Stack)

## Overview

This is a full-stack job board application built with the MERN (MongoDB, Express.js, React.js, Node.js) technology stack. The platform enables employers to post job listings and job seekers to browse and apply for positions. It features user authentication with role-based access, job management with filtering by type, experience level, and location, an application system, and a modern responsive UI. The backend provides a RESTful API for all job board operations, while the frontend offers an intuitive interface for both employers and job seekers.

## Key Features

- **User Authentication**: Secure registration and login with role-based access (employer / job seeker)
- **Job Listings**: Create, read, update, and delete job postings
- **Job Types**: Full-time, Part-time, Contract, Remote, Internship
- **Experience Levels**: Entry, Mid, Senior, Lead, Executive
- **Salary Ranges**: Optional min/max salary for each listing
- **Skills & Requirements**: Tag jobs with required skills
- **Job Applications**: Job seekers can apply with a cover letter
- **Filtering**: Browse jobs by type, experience level, and location
- **Status Management**: Mark jobs as open, closed, or filled
- **My Listings**: Employers can view and manage their posted jobs
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **RESTful API**: Well-structured backend API with proper error handling

## Project Structure

```
job-board/
├── backend/
│   ├── models/          # Mongoose models (User, Job)
│   ├── routes/          # Express route handlers
│   ├── middleware/       # Authentication middleware
│   ├── test/
│   │   ├── task1/       # Task 1 test cases (Job Creation)
│   │   └── task2/       # Task 2 test cases (Job Update)
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server entry point
│   └── seed.js          # Database seeding
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Page components
│       └── context/     # React context providers
└── README.md
```

## Installation and Running the Application

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)

### Install Dependencies

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Or install individually
cd backend && npm install
cd ../frontend && npm install
```

### Running the Application

```bash
# Start the backend server (runs on port 5000)
npm run start:backend

# In a separate terminal, start the frontend (runs on port 3000)
npm run start:frontend
```

### Running Tests

The application includes test suites that validate the API functionality:

```bash
# Run all tests
npm test

# Run Task 1 tests only (Job Creation)
npm run test:task1

# Run Task 2 tests only (Job Update)
npm run test:task2
```

> **Note**: Tests use an in-memory MongoDB instance (mongodb-memory-server), so no external database is required for testing.

## Database Reset

To manually reset the database to its initial state:

1. Stop the running server and restart it — the seed data will be re-applied if the database is empty.

2. Running test cases uses an isolated in-memory database, so your development database is not affected.

## API Endpoints

### Authentication

| Method | Endpoint           | Description          |
|--------|--------------------|----------------------|
| POST   | /api/auth/register | Register new user    |
| POST   | /api/auth/login    | Login user           |
| GET    | /api/auth/me       | Get current user     |

### Jobs

| Method | Endpoint              | Description                     |
|--------|-----------------------|---------------------------------|
| GET    | /api/jobs             | Get all jobs (filterable)       |
| GET    | /api/jobs/:id         | Get single job with details     |
| POST   | /api/jobs             | Create new job listing (auth)   |
| PUT    | /api/jobs/:id         | Update job listing (auth)       |
| DELETE | /api/jobs/:id         | Delete job listing (auth)       |
| POST   | /api/jobs/:id/apply   | Apply to a job (auth)           |

### Query Parameters for GET /api/jobs

| Parameter       | Description                       |
|----------------|-----------------------------------|
| jobType        | Filter by job type                |
| experienceLevel | Filter by experience level       |
| location       | Search by location (partial match)|
| status         | Filter by status (open/closed)    |
| postedBy       | Filter by employer user ID        |

## Test Accounts (Seeded Data)

| Name           | Email                | Password    | Role      | Company    |
|---------------|----------------------|-------------|-----------|------------|
| Sarah Chen    | sarah@acmecorp.com   | password123 | employer  | Acme Corp  |
| Marcus Rivera | marcus@techstart.io  | password123 | employer  | TechStart  |
| Emily Park    | emily@email.com      | password123 | jobseeker | —          |
