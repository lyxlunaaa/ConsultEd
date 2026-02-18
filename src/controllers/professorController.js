const db = require('../config/database');

// Get professor dashboard
const getDashboard = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get professor details
        const [professors] = await db.query(
            'SELECT * FROM professors WHERE user_id = ?',
            [userId]
        );

        if (professors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        const professor = professors[0];

        // Get assigned courses
        const [courses] = await db.query(
            `SELECT 
                c.course_id,
                c.course_code,
                c.course_name,
                pc.section
             FROM professor_courses pc
             JOIN courses c ON pc.course_id = c.course_id
             WHERE pc.professor_id = ?`,
            [professor.professor_id]
        );

        res.json({
            success: true,
            professor: {
                professor_id: professor.professor_id,
                employee_id: professor.employee_id,
                full_name: `${professor.first_name} ${professor.middle_name || ''} ${professor.last_name}`.trim(),
                first_name: professor.first_name,
                last_name: professor.last_name,
                middle_name: professor.middle_name,
                department: professor.department
            },
            courses
        });

    } catch (error) {
        console.error('Get dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get consultation requests for professor
const getConsultationRequests = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get professor ID
        const [professors] = await db.query(
            'SELECT professor_id FROM professors WHERE user_id = ?',
            [userId]
        );

        if (professors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        const professorId = professors[0].professor_id;

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
                s.student_number,
                s.first_name AS student_first_name,
                s.last_name AS student_last_name,
                s.section
             FROM consultation_requests cr
             JOIN courses c ON cr.course_id = c.course_id
             JOIN students s ON cr.student_id = s.student_id
             WHERE cr.professor_id = ?
             ORDER BY cr.created_at DESC`,
            [professorId]
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

// Get single consultation request details
const getRequestDetails = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const requestId = req.params.id;

        // Get professor ID
        const [professors] = await db.query(
            'SELECT professor_id FROM professors WHERE user_id = ?',
            [userId]
        );

        if (professors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        const professorId = professors[0].professor_id;

        // Get request details
        const [requests] = await db.query(
            `SELECT 
                cr.*,
                c.course_code,
                c.course_name,
                s.student_number,
                s.first_name AS student_first_name,
                s.last_name AS student_last_name,
                s.middle_name AS student_middle_name,
                s.section
             FROM consultation_requests cr
             JOIN courses c ON cr.course_id = c.course_id
             JOIN students s ON cr.student_id = s.student_id
             WHERE cr.request_id = ? AND cr.professor_id = ?`,
            [requestId, professorId]
        );

        if (requests.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        res.json({
            success: true,
            request: requests[0]
        });

    } catch (error) {
        console.error('Get request details error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Approve consultation request
const approveRequest = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const requestId = req.params.id;
        const { approved_date, approved_time, consultation_type, consultation_note } = req.body;

        // Get professor ID
        const [professors] = await db.query(
            'SELECT professor_id FROM professors WHERE user_id = ?',
            [userId]
        );

        if (professors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        const professorId = professors[0].professor_id;

        // Update request
        const [result] = await db.query(
            `UPDATE consultation_requests 
             SET status = 'approved',
                 approved_date = ?,
                 approved_time = ?,
                 consultation_type = ?,
                 consultation_note = ?
             WHERE request_id = ? AND professor_id = ?`,
            [approved_date, approved_time, consultation_type, consultation_note, requestId, professorId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found or already processed'
            });
        }

        res.json({
            success: true,
            message: 'Consultation request approved successfully'
        });

    } catch (error) {
        console.error('Approve request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Reject consultation request
const rejectRequest = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const requestId = req.params.id;

        // Get professor ID
        const [professors] = await db.query(
            'SELECT professor_id FROM professors WHERE user_id = ?',
            [userId]
        );

        if (professors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        const professorId = professors[0].professor_id;

        // Update request
        const [result] = await db.query(
            `UPDATE consultation_requests 
             SET status = 'rejected'
             WHERE request_id = ? AND professor_id = ?`,
            [requestId, professorId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Request not found or already processed'
            });
        }

        res.json({
            success: true,
            message: 'Consultation request rejected'
        });

    } catch (error) {
        console.error('Reject request error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get professor's schedule/calendar
const getSchedule = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get professor ID
        const [professors] = await db.query(
            'SELECT professor_id FROM professors WHERE user_id = ?',
            [userId]
        );

        if (professors.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Professor not found'
            });
        }

        const professorId = professors[0].professor_id;

        // Get approved consultations
        const [schedule] = await db.query(
            `SELECT 
                cr.request_id,
                cr.approved_date,
                cr.approved_time,
                cr.consultation_type,
                cr.consultation_note,
                c.course_code,
                c.course_name,
                s.first_name AS student_first_name,
                s.last_name AS student_last_name
             FROM consultation_requests cr
             JOIN courses c ON cr.course_id = c.course_id
             JOIN students s ON cr.student_id = s.student_id
             WHERE cr.professor_id = ? AND cr.status = 'approved'
             ORDER BY cr.approved_date, cr.approved_time`,
            [professorId]
        );

        res.json({
            success: true,
            schedule
        });

    } catch (error) {
        console.error('Get schedule error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    getDashboard,
    getConsultationRequests,
    getRequestDetails,
    approveRequest,
    rejectRequest,
    getSchedule
};
