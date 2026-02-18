# ConsultEd - Consultation Scheduling System Backend

A Node.js backend API for managing student-professor consultations with role-based access control.

## Features

- **JWT Authentication** with role-based access control
- **Student Portal**: Request consultations, view request status
- **Professor Portal**: Approve/reject requests, manage schedule
- **Admin Dashboards**: 
  - Registrar (full access to all programs)
  - Dean (access to IT and CS programs)
  - Program Chair (access to assigned program only)
- **MySQL Database** with 8 tables and proper relationships
- **RESTful API** with input validation

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. **Clone or navigate to the project directory**
   ```bash

   ```

2. **Install dependencies** (already done)
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file and update MySQL credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=consulted_db
   ```

4. **Create database and tables**
   ```bash
   mysql -u root -p < database/schema.sql
   ```

5. **Seed initial data**
   ```bash
   npm run seed
   ```

6. **Import student data**
   ```bash
   npm run import-students
   ```

## Running the Server

```bash
npm start
```

Server will run on `http://localhost:5000`

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Student Routes (requires student role)
- `GET /api/student/dashboard` - Get student info and courses
- `GET /api/student/professors` - Get professors for enrolled courses
- `POST /api/student/consultation-request` - Create consultation request
- `GET /api/student/consultation-requests` - View own requests

### Professor Routes (requires professor role)
- `GET /api/professor/dashboard` - Get professor info
- `GET /api/professor/consultation-requests` - View all requests
- `GET /api/professor/consultation-requests/:id` - View request details
- `PUT /api/professor/consultation-requests/:id/approve` - Approve request
- `PUT /api/professor/consultation-requests/:id/reject` - Reject request
- `GET /api/professor/schedule` - View schedule

### Admin Routes (requires admin role)
- `GET /api/admin/students` - List students (filtered by program scope)
- `POST /api/admin/students` - Create student
- `PUT /api/admin/students/:id` - Update student
- `DELETE /api/admin/students/:id` - Delete student
- `GET /api/admin/professors` - List professors
- `GET /api/admin/sections` - List sections
- `GET /api/admin/programs` - View programs (Registrar only)
- `GET /api/admin/consultation-requests` - View all requests

## Default Credentials

### Admin Users
- **Registrar**: `username: registrar, password: registrar123`
- **Dean**: `username: dean, password: dean123`
- **IT Chair**: `username: it_chair, password: itchair123`
- **CS Chair**: `username: cs_chair, password: cschair123`

### Sample Professors
- **Professor 1**: `username: 200-123, password: prof123`
- **Professor 2**: `username: 200-124, password: prof456`

### Students
- Use credentials from the imported CSV file

## Project Structure

```
Assignment/
├── database/
│   └── schema.sql              # Database schema
├── scripts/
│   ├── seedDatabase.js         # Seed initial data
│   └── importStudents.js       # Import students from CSV
├── src/
│   ├── config/
│   │   └── database.js         # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── professorController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js             # JWT & role-based auth
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── student.routes.js
│   │   ├── professor.routes.js
│   │   └── admin.routes.js
│   ├── utils/
│   │   └── validators.js       # Input validation
│   └── app.js                  # Express app setup
├── server.js                   # Server entry point
├── .env                        # Environment variables
└── package.json
```

## Testing the API

Use Postman, curl, or any HTTP client:

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"registrar\", \"password\": \"registrar123\"}"
```

### Example: Get Student Dashboard
```bash
curl -X GET http://localhost:5000/api/student/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Schema

- **users** - Authentication and roles
- **programs** - Academic programs (IT, CS, GRAD)
- **students** - Student profiles
- **professors** - Professor profiles
- **courses** - Course catalog
- **professor_courses** - Professor-course assignments
- **enrollments** - Student enrollments
- **consultation_requests** - Consultation tracking

## Role-Based Access Control

- **Student**: Can request consultations and view own requests
- **Professor**: Can approve/reject requests and view schedule
- **Registrar**: Full access to all programs
- **Dean**: Access to IT and CS programs only
- **Program Chair**: Access to assigned program only

## License

ISC
