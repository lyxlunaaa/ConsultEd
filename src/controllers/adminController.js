const db = require('../config/database');
const bcrypt = require('bcryptjs');

// Helper function to build program filter
const getProgramFilter = (allowedPrograms) => {
    if (!allowedPrograms || allowedPrograms.length === 0) {
        return { condition: '1=0', values: [] }; // No access
    }
    if (allowedPrograms.includes('IT') && allowedPrograms.includes('CS') && allowedPrograms.includes('GRAD')) {
        return { condition: '1=1', values: [] }; // All access
    }
    const placeholders = allowedPrograms.map(() => '?').join(',');
    return {
        condition: `p.program_code IN (${placeholders})`,
        values: allowedPrograms
    };
};

// Get all students (filtered by program scope)
const getStudents = async (req, res) => {
    try {
        const { allowedPrograms } = req;
        const { search } = req.query;

        console.log(req, res);

        const filter = getProgramFilter(allowedPrograms);
        let query = `
            SELECT 
                s.student_id,
                s.student_number,
                s.first_name,
                s.last_name,
                s.middle_name,
                s.section,
                s.status,
                p.program_code,
                p.program_name,
                u.username,
                GROUP_CONCAT(DISTINCT c.course_name SEPARATOR ', ') AS enrolled_courses
            FROM students s
            JOIN programs p ON s.program_id = p.program_id
            JOIN users u ON s.user_id = u.user_id
            LEFT JOIN enrollments e ON s.student_id = e.student_id
            LEFT JOIN courses c ON e.course_id = c.course_id
            WHERE ${filter.condition}
        `;

        const values = [...filter.values];

        if (search) {
            query += ` AND (s.student_number LIKE ? OR s.first_name LIKE ? OR s.last_name LIKE ?)`;
            const searchTerm = `%${search}%`;
            values.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` GROUP BY s.student_id, u.username ORDER BY s.last_name, s.first_name`;

        const [students] = await db.query(query, values);

        res.json({
            success: true,
            students
        });

    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get single student
const getStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { allowedPrograms } = req;

        const filter = getProgramFilter(allowedPrograms);

        const [students] = await db.query(
            `SELECT 
                s.*,
                p.program_code,
                p.program_name,
                u.username
             FROM students s
             JOIN programs p ON s.program_id = p.program_id
             JOIN users u ON s.user_id = u.user_id
             WHERE s.student_id = ? AND ${filter.condition}`,
            [id, ...filter.values]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            student: students[0]
        });

    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Create student
const createStudent = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { student_number, first_name, last_name, middle_name, program_id, section, password } = req.body;

        // Check if program is allowed
        const [programs] = await connection.query(
            'SELECT program_code FROM programs WHERE program_id = ?',
            [program_id]
        );

        if (programs.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Invalid program'
            });
        }

        if (!req.allowedPrograms.includes(programs[0].program_code)) {
            await connection.rollback();
            return res.status(403).json({
                success: false,
                message: 'Access denied to this program'
            });
        }

        // Hash password (use student_number as default password if not provided)
        const hashedPassword = await bcrypt.hash(password || student_number, 10);

        // Create user account
        const [userResult] = await connection.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [student_number, hashedPassword, 'student']
        );

        // Create student record
        const [studentResult] = await connection.query(
            `INSERT INTO students 
             (user_id, student_number, first_name, last_name, middle_name, program_id, section) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userResult.insertId, student_number, first_name, last_name, middle_name, program_id, section]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            student_id: studentResult.insertId
        });

    } catch (error) {
        await connection.rollback();
        console.error('Create student error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Student number already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    } finally {
        connection.release();
    }
};

// Update student
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, middle_name, program_id, section, status } = req.body;

        // Check program access
        const [programs] = await db.query(
            'SELECT program_code FROM programs WHERE program_id = ?',
            [program_id]
        );

        if (programs.length === 0 || !req.allowedPrograms.includes(programs[0].program_code)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const [result] = await db.query(
            `UPDATE students 
             SET first_name = ?, last_name = ?, middle_name = ?, program_id = ?, section = ?, status = ?
             WHERE student_id = ?`,
            [first_name, last_name, middle_name, program_id, section, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.json({
            success: true,
            message: 'Student updated successfully'
        });

    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete student
const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if student exists and user has access
        const filter = getProgramFilter(req.allowedPrograms);
        const [students] = await db.query(
            `SELECT s.student_id 
             FROM students s
             JOIN programs p ON s.program_id = p.program_id
             WHERE s.student_id = ? AND ${filter.condition}`,
            [id, ...filter.values]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or access denied'
            });
        }

        // Delete student (will cascade to user due to FK)
        const [result] = await db.query(
            'DELETE FROM students WHERE student_id = ?',
            [id]
        );

        res.json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all professors (filtered by program scope)
const getProfessors = async (req, res) => {
    try {
        const { search } = req.query;

        let query = `
            SELECT 
                p.professor_id,
                p.employee_id,
                p.first_name,
                p.last_name,
                p.middle_name,
                p.department,
                p.status,
                GROUP_CONCAT(DISTINCT CONCAT(c.course_code, ' - ', c.course_name) SEPARATOR ', ') AS courses
            FROM professors p
            LEFT JOIN professor_courses pc ON p.professor_id = pc.professor_id
            LEFT JOIN courses c ON pc.course_id = c.course_id
            WHERE 1=1
        `;

        const values = [];

        if (search) {
            query += ` AND (p.employee_id LIKE ? OR p.first_name LIKE ? OR p.last_name LIKE ?)`;
            const searchTerm = `%${search}%`;
            values.push(searchTerm, searchTerm, searchTerm);
        }

        query += ` GROUP BY p.professor_id ORDER BY p.last_name, p.first_name`;

        const [professors] = await db.query(query, values);

        res.json({
            success: true,
            professors
        });

    } catch (error) {
        console.error('Get professors error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Create professor
const createProfessor = async (req, res) => {
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        const { employee_id, first_name, last_name, middle_name, department, username, password } = req.body;

        // Hash password (use employee_id as default password if not provided)
        const hashedPassword = await bcrypt.hash(password || employee_id, 10);

        // Create user account
        const [userResult] = await connection.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username || employee_id, hashedPassword, 'professor']
        );

        // Create professor record
        const [professorResult] = await connection.query(
            `INSERT INTO professors 
             (user_id, employee_id, first_name, last_name, middle_name, department) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [userResult.insertId, employee_id, first_name, last_name, middle_name, department]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Professor created successfully',
            professor_id: professorResult.insertId
        });

    } catch (error) {
        await connection.rollback();
        console.error('Create professor error:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Employee ID already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    } finally {
        connection.release();
    }
};

// Update professor
const updateProfessor = async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, middle_name, department, status } = req.body;

        const [result] = await db.query(
            `UPDATE professors 
             SET first_name = ?, last_name = ?, middle_name = ?, department = ?, status = ?
             WHERE professor_id = ?`,
            [first_name, last_name, middle_name, department, status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        res.json({
            success: true,
            message: 'Professor updated successfully'
        });

    } catch (error) {
        console.error('Update professor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete professor
const deleteProfessor = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete professor (will cascade to user due to FK)
        const [result] = await db.query(
            'DELETE FROM professors WHERE professor_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        res.json({
            success: true,
            message: 'Professor deleted successfully'
        });

    } catch (error) {
        console.error('Delete professor error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};


// Get all programs (Registrar only)
const getPrograms = async (req, res) => {
    try {
        const [programs] = await db.query(
            `SELECT 
                p.program_id,
                p.program_code,
                p.program_name,
                COUNT(DISTINCT c.course_id) AS num_sections,
                COUNT(DISTINCT s.student_id) AS num_students
             FROM programs p
             LEFT JOIN courses c ON p.program_id = c.program_id
             LEFT JOIN students s ON p.program_id = s.program_id
             GROUP BY p.program_id
             ORDER BY p.program_name`
        );

        res.json({
            success: true,
            programs
        });

    } catch (error) {
        console.error('Get programs error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all sections (filtered by program scope)
const getSections = async (req, res) => {
    try {
        const { allowedPrograms } = req;
        const filter = getProgramFilter(allowedPrograms);

        const [sections] = await db.query(
            `SELECT 
                c.course_id,
                c.course_code,
                c.course_name,
                c.schedule,
                p.program_code,
                p.program_name,
                prof.professor_id,
                prof.first_name AS prof_first_name,
                prof.last_name AS prof_last_name
             FROM courses c
             JOIN programs p ON c.program_id = p.program_id
             LEFT JOIN professor_courses pc ON c.course_id = pc.course_id
             LEFT JOIN professors prof ON pc.professor_id = prof.professor_id
             WHERE ${filter.condition}
             ORDER BY c.course_code`,
            filter.values
        );

        res.json({
            success: true,
            sections
        });

    } catch (error) {
        console.error('Get sections error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get all consultation requests (filtered by program scope)
const getConsultationRequests = async (req, res) => {
    try {
        const { allowedPrograms } = req;
        const filter = getProgramFilter(allowedPrograms);

        const [requests] = await db.query(
            `SELECT 
                cr.request_id,
                cr.purpose,
                cr.status,
                cr.approved_date,
                cr.approved_time,
                cr.created_at,
                s.student_number,
                s.first_name AS student_first_name,
                s.last_name AS student_last_name,
                prof.employee_id,
                prof.first_name AS prof_first_name,
                prof.last_name AS prof_last_name,
                c.course_code,
                c.course_name,
                p.program_code
             FROM consultation_requests cr
             JOIN students s ON cr.student_id = s.student_id
             JOIN professors prof ON cr.professor_id = prof.professor_id
             JOIN courses c ON cr.course_id = c.course_id
             JOIN programs p ON s.program_id = p.program_id
             WHERE ${filter.condition}
             ORDER BY cr.created_at DESC`,
            filter.values
        );

        res.json({
            success: true,
            requests
        });

    } catch (error) {
        console.error('Get consultation requests error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getProfessors,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    getPrograms,
    getSections,
    getConsultationRequests
};
