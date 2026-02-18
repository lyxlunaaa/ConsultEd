# ConsultEd Backend - Setup Guide

## Quick Setup Steps

### 1. Install MySQL (if not already installed)
Download and install MySQL from: https://dev.mysql.com/downloads/mysql/

### 2. Create Database

**Option A: Using MySQL Workbench (Recommended)**
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Click "File" → "Open SQL Script"
4. Navigate to: `c:\Users\MKS\Desktop\Assignment\database\schema.sql`
5. Click the lightning bolt icon to execute
6. You should see "Database schema created successfully!"

**Option B: Using Command Line**
```bash
# If MySQL is in your PATH
mysql -u root -p < database/schema.sql

# If MySQL is not in PATH, navigate to MySQL bin directory first
cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
.\mysql.exe -u root -p < c:\Users\MKS\Desktop\Assignment\database\schema.sql
```

### 3. Update Database Credentials

Edit the `.env` file in the project root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=consulted_db
DB_PORT=3306
```

### 4. Seed Initial Data

Run this command to create admin users, programs, professors, and courses:
```bash
npm run seed
```

You should see:
```
✅ Programs inserted
✅ Admin users created
✅ Sample professors created
✅ Sample courses created
✅ Professors assigned to courses
```

### 5. Import Student Data

Run this command to import students from the CSV file:
```bash
npm run import-students
```

You should see:
```
📊 Found 160 students in CSV file
✅ Successfully imported: 160
```

### 6. Start the Server

```bash
npm start
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║              ConsultEd Backend Server                     ║
║  Server running on: http://localhost:5000                 ║
╚═══════════════════════════════════════════════════════════╝
✅ Database connected successfully
```

## Testing the API

### Test 1: Health Check
```bash
curl http://localhost:5000/api/health
```

### Test 2: Login as Registrar
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"registrar\", \"password\": \"registrar123\"}"
```

You should receive a JWT token in the response.

### Test 3: Login as Student
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\": \"2024-1001\", \"password\": \"STUDENT_PASSWORD_FROM_CSV\"}"
```

## Default Login Credentials

### Admin Users
| Role | Username | Password |
|------|----------|----------|
| Registrar | registrar | registrar123 |
| Dean | dean | dean123 |
| IT Program Chair | it_chair | itchair123 |
| CS Program Chair | cs_chair | cschair123 |

### Sample Professors
| Name | Username | Password |
|------|----------|----------|
| Juan Dela Cruz | 200-123 | prof123 |
| Maria Santos | 200-124 | prof456 |

### Students
Use the student ID and password from the CSV file:
- Username: Student ID (e.g., "2024-1001")
- Password: From the "Password" column in CSV

## Troubleshooting

### Issue: "Database connection failed"
- Check if MySQL service is running
- Verify credentials in `.env` file
- Ensure `consulted_db` database exists

### Issue: "Cannot find module"
- Run `npm install` again

### Issue: "Port 5000 already in use"
- Change PORT in `.env` file to another port (e.g., 5001)

### Issue: "CSV file not found"
- Ensure `info management-sample data - STUDENTS.csv` is in the project root directory

## Next Steps

1. ✅ Database setup complete
2. ✅ Backend API running
3. 🔄 Connect frontend to the API
4. 🔄 Test all user flows

## API Documentation

See `README.md` for complete API endpoint documentation.
