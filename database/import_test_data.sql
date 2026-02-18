-- ConsultEd Test Data Import Script
-- Run this after creating the database schema

USE consulted_db;

-- ========================================
-- 1. PROGRAMS (if not already inserted)
-- ========================================
INSERT IGNORE INTO programs (program_code, program_name) VALUES
('IT', 'Information Technology'),
('CS', 'Computer Science'),
('GRAD', 'Graduate School');

-- ========================================
-- 2. ADMIN USERS
-- ========================================
-- Password for all: "password" (hashed with bcrypt)
-- Note: You'll need to generate actual bcrypt hashes

-- Registrar (Full access to ALL programs)
INSERT INTO users (username, password, role, program_scope) VALUES
('registrar', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'registrar', 'ALL');

-- Dean (Access to IT + CS only)
INSERT INTO users (username, password, role, program_scope) VALUES
('dean', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'dean', 'CCIT');

-- IT Program Chair
INSERT INTO users (username, password, role, program_scope) VALUES
('it_chair', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'program_chair', 'IT');

-- CS Program Chair
INSERT INTO users (username, password, role, program_scope) VALUES
('cs_chair', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'program_chair', 'CS');

-- ========================================
-- 3. PROFESSORS
-- ========================================
-- Create user accounts (password = employee_id)
INSERT INTO users (username, password, role) VALUES
('EMP-001', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'professor'),
('EMP-002', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'professor'),
('EMP-003', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'professor'),
('EMP-004', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'professor');

-- Create professor records
INSERT INTO professors (user_id, employee_id, first_name, last_name, middle_name, department, status)
SELECT user_id, 'EMP-001', 'Roberto', 'Sanchez', 'Villa', 'Information Technology', 'active' FROM users WHERE username = 'EMP-001'
UNION ALL
SELECT user_id, 'EMP-002', 'Carmen', 'Ramirez', 'Castro', 'Computer Science', 'active' FROM users WHERE username = 'EMP-002'
UNION ALL
SELECT user_id, 'EMP-003', 'Luis', 'Torres', 'Gomez', 'Information Technology', 'active' FROM users WHERE username = 'EMP-003'
UNION ALL
SELECT user_id, 'EMP-004', 'Elena', 'Mendoza', 'Rivera', 'Computer Science', 'active' FROM users WHERE username = 'EMP-004';

-- ========================================
-- 4. COURSES
-- ========================================
-- IT Courses
INSERT INTO courses (course_code, course_name, program_id, schedule) VALUES
('IT301', 'Object Oriented Programming', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'MWF 10:00-11:30'),
('IT302', 'Database Management Systems', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'TTH 13:00-14:30'),
('IT303', 'Web Development', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'MWF 14:00-15:30'),
('IT304', 'Systems Analysis and Design', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'TTH 10:00-11:30');

-- CS Courses
INSERT INTO courses (course_code, course_name, program_id, schedule) VALUES
('CS301', 'Data Structures and Algorithms', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'MWF 08:00-09:30'),
('CS302', 'Discrete Mathematics', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'TTH 10:00-11:30'),
('CS303', 'Computer Architecture', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'MWF 13:00-14:30'),
('CS304', 'Theory of Computation', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'TTH 14:00-15:30');

-- ========================================
-- 5. ASSIGN PROFESSORS TO COURSES
-- ========================================
INSERT INTO professor_courses (professor_id, course_id, section)
SELECT p.professor_id, c.course_id, 'IT-3A'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-001' AND c.course_code = 'IT301'
UNION ALL
SELECT p.professor_id, c.course_id, 'IT-3A'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-001' AND c.course_code = 'IT302'
UNION ALL
SELECT p.professor_id, c.course_id, 'IT-3A'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-003' AND c.course_code = 'IT303'
UNION ALL
SELECT p.professor_id, c.course_id, 'IT-3A'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-003' AND c.course_code = 'IT304'
UNION ALL
SELECT p.professor_id, c.course_id, 'CS-3B'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-002' AND c.course_code = 'CS301'
UNION ALL
SELECT p.professor_id, c.course_id, 'CS-3B'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-002' AND c.course_code = 'CS302'
UNION ALL
SELECT p.professor_id, c.course_id, 'CS-3B'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-004' AND c.course_code = 'CS303'
UNION ALL
SELECT p.professor_id, c.course_id, 'CS-3B'
FROM professors p, courses c
WHERE p.employee_id = 'EMP-004' AND c.course_code = 'CS304';

-- ========================================
-- 6. STUDENTS (15 sample students)
-- ========================================
-- Note: Password = student_number for all students

-- Create user accounts
INSERT INTO users (username, password, role) VALUES
('2021-00001', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00002', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00003', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00004', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00005', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00006', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00007', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00008', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00009', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00010', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00011', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00012', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00013', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00014', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student'),
('2021-00015', '$2a$10$e87fPLBWcGUXDQb9a3RczOTPU.voIZE5q0RGfd/O4C3VTojjXRoci', 'student');

-- Create student records
INSERT INTO students (user_id, student_number, first_name, last_name, middle_name, program_id, section, status)
SELECT user_id, '2021-00001', 'Juan', 'Dela Cruz', 'Santos', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00001'
UNION ALL
SELECT user_id, '2021-00002', 'Maria', 'Garcia', 'Reyes', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00002'
UNION ALL
SELECT user_id, '2021-00003', 'Pedro', 'Gonzales', 'Torres', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'CS-3B', 'active' FROM users WHERE username = '2021-00003'
UNION ALL
SELECT user_id, '2021-00004', 'Ana', 'Rodriguez', 'Lopez', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'CS-3B', 'active' FROM users WHERE username = '2021-00004'
UNION ALL
SELECT user_id, '2021-00005', 'Jose', 'Martinez', 'Fernandez', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00005'
UNION ALL
SELECT user_id, '2021-00006', 'Sofia', 'Santos', 'Ramos', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00006'
UNION ALL
SELECT user_id, '2021-00007', 'Miguel', 'Flores', 'Cruz', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'CS-3B', 'active' FROM users WHERE username = '2021-00007'
UNION ALL
SELECT user_id, '2021-00008', 'Isabella', 'Morales', 'Diaz', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00008'
UNION ALL
SELECT user_id, '2021-00009', 'Carlos', 'Jimenez', 'Alvarez', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'CS-3B', 'active' FROM users WHERE username = '2021-00009'
UNION ALL
SELECT user_id, '2021-00010', 'Gabriela', 'Hernandez', 'Mendoza', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00010'
UNION ALL
SELECT user_id, '2021-00011', 'Ricardo', 'Vargas', 'Salazar', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00011'
UNION ALL
SELECT user_id, '2021-00012', 'Lucia', 'Ortiz', 'Navarro', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'CS-3B', 'active' FROM users WHERE username = '2021-00012'
UNION ALL
SELECT user_id, '2021-00013', 'Fernando', 'Castillo', 'Romero', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00013'
UNION ALL
SELECT user_id, '2021-00014', 'Valentina', 'Ruiz', 'Herrera', (SELECT program_id FROM programs WHERE program_code = 'CS'), 'CS-3B', 'active' FROM users WHERE username = '2021-00014'
UNION ALL
SELECT user_id, '2021-00015', 'Diego', 'Moreno', 'Medina', (SELECT program_id FROM programs WHERE program_code = 'IT'), 'IT-3A', 'active' FROM users WHERE username = '2021-00015';

-- ========================================
-- 7. ENROLL STUDENTS IN COURSES
-- ========================================
-- IT Students enrolled in IT courses
INSERT INTO enrollments (student_id, course_id, semester)
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00001' AND c.course_code IN ('IT301', 'IT302', 'IT303')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00002' AND c.course_code IN ('IT301', 'IT302', 'IT304')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00005' AND c.course_code IN ('IT301', 'IT303')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00006' AND c.course_code IN ('IT302', 'IT303', 'IT304')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00008' AND c.course_code IN ('IT301', 'IT302')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00010' AND c.course_code IN ('IT303', 'IT304')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00011' AND c.course_code IN ('IT301', 'IT304')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00013' AND c.course_code IN ('IT302', 'IT303')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00015' AND c.course_code IN ('IT301', 'IT302', 'IT303', 'IT304');

-- CS Students enrolled in CS courses
INSERT INTO enrollments (student_id, course_id, semester)
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00003' AND c.course_code IN ('CS301', 'CS302', 'CS303')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00004' AND c.course_code IN ('CS301', 'CS304')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00007' AND c.course_code IN ('CS302', 'CS303', 'CS304')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00009' AND c.course_code IN ('CS301', 'CS302')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00012' AND c.course_code IN ('CS303', 'CS304')
UNION ALL
SELECT s.student_id, c.course_id, '2024-2025 1st Semester'
FROM students s, courses c
WHERE s.student_number = '2021-00014' AND c.course_code IN ('CS301', 'CS302', 'CS303', 'CS304');

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
SELECT '========== DATA IMPORT SUMMARY ==========' AS '';

SELECT 'Programs:' AS Category, COUNT(*) AS Count FROM programs
UNION ALL
SELECT 'Users:', COUNT(*) FROM users
UNION ALL
SELECT 'Students:', COUNT(*) FROM students
UNION ALL
SELECT 'Professors:', COUNT(*) FROM professors
UNION ALL
SELECT 'Courses:', COUNT(*) FROM courses
UNION ALL
SELECT 'Professor Assignments:', COUNT(*) FROM professor_courses
UNION ALL
SELECT 'Student Enrollments:', COUNT(*) FROM enrollments;

SELECT '========== STUDENTS BY PROGRAM ==========' AS '';
SELECT p.program_name, COUNT(*) as student_count
FROM students s
JOIN programs p ON s.program_id = p.program_id
GROUP BY p.program_name;

SELECT 'Test data imported successfully!' AS message;
SELECT 'Default password for all users: "password"' AS note;
