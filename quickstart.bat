@echo off
echo ========================================
echo ConsultEd Backend - Quick Start
echo ========================================
echo.

echo Step 1: Checking MySQL connection...
echo Please make sure MySQL is running!
echo.

echo Step 2: Creating database and tables...
echo Please run this command in MySQL Workbench or MySQL CLI:
echo    mysql -u root -p ^< database/schema.sql
echo.
pause

echo Step 3: Seeding initial data...
call npm run seed
echo.

echo Step 4: Importing student data...
call npm run import-students
echo.

echo Step 5: Starting server...
call npm start
