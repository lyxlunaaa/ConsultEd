const db = require('../config/database');

// Get student dashboard
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get student details
        const [students] = await db.query(
            `SELECT s.*, p.program_name, p.program_code 
             FROM students s 
             JOIN programs p ON s.program_id = p.program_id 
             WHERE s.user_id = ?`,
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const student = students[0];

        // Get enrolled courses with professor info
        const [enrolledCourses] = await db.query(
            `SELECT 
                c.course_id,
                c.course_code,
                c.course_name,
                c.schedule,
                pc.section,
                p.professor_id,
                p.first_name AS prof_first_name,
                p.last_name AS prof_last_name,
                p.department
             FROM enrollments e
             JOIN courses c ON e.course_id = c.course_id
             LEFT JOIN professor_courses pc ON c.course_id = pc.course_id AND pc.section = e.student_id
             LEFT JOIN professors p ON pc.professor_id = p.professor_id
             WHERE e.student_id = ?`,
            [student.student_id]
        );

        res.json({
            success: true,
            student: {
                student_id: student.student_id,
                student_number: student.student_number,
                full_name: `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim(),
                first_name: student.first_name,
                last_name: student.last_name,
                middle_name: student.middle_name,
                program: student.program_name,
                program_code: student.program_code,
                section: student.section
            },
            enrolled_courses: enrolledCourses
        });

    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get professors for student's enrolled courses
const getProfessors = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get student ID
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const studentId = students[0].student_id;

        // Get professors teaching student's courses
        const [professors] = await db.query(
            `SELECT DISTINCT
                p.professor_id,
                p.first_name,
                p.last_name,
                p.department,
                c.course_id,
                c.course_code,
                c.course_name,
                pc.section
             FROM enrollments e
             JOIN courses c ON e.course_id = c.course_id
             JOIN professor_courses pc ON c.course_id = pc.course_id
             JOIN professors p ON pc.professor_id = p.professor_id
             WHERE e.student_id = ? AND p.status = 'active'
             ORDER BY p.last_name, p.first_name`,
            [studentId]
        );

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

// Create consultation request
const createConsultationRequest = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { professor_id, course_id, purpose } = req.body;

        // Get student ID
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const studentId = students[0].student_id;

        // Create consultation request
        const [result] = await db.query(
            `INSERT INTO consultation_requests 
             (student_id, professor_id, course_id, purpose, status) 
             VALUES (?, ?, ?, ?, 'pending')`,
            [studentId, professor_id, course_id, purpose]
        );

        res.status(201).json({
            success: true,
            message: 'Consultation request submitted successfully',
            request_id: result.insertId
        });

    } catch (error) {
        console.error('Create consultation request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get student's consultation requests
const getConsultationRequests = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get student ID
        const [students] = await db.query(
            'SELECT student_id FROM students WHERE user_id = ?',
            [userId]
        );

        if (students.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const studentId = students[0].student_id;

        // Get consultation requests
        const [requests] = await db.query(
            `SELECT 
                cr.request_id,
                cr.purpose,
                cr.status,
                cr.approved_date,
                cr.approved_time,
                cr.consultation_type,
                cr.consultation_note,
                cr.created_at,
                c.course_code,
                c.course_name,
                p.first_name AS prof_first_name,
                p.last_name AS prof_last_name
             FROM consultation_requests cr
             JOIN courses c ON cr.course_id = c.course_id
             JOIN professors p ON cr.professor_id = p.professor_id
             WHERE cr.student_id = ?
             ORDER BY cr.created_at DESC`,
            [studentId]
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
    getDashboard,
    getProfessors,
    createConsultationRequest,
    getConsultationRequests
};
