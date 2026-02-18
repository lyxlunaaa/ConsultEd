const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config();

// Login
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect credentials. Please try again.'
            });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect credentials. Please try again.'
            });
        }

        // Get additional user details based on role
        let userDetails = {};

        if (user.role === 'student') {
            const [students] = await db.query(
                `SELECT s.*, p.program_name, p.program_code 
                 FROM students s 
                 JOIN programs p ON s.program_id = p.program_id 
                 WHERE s.user_id = ?`,
                [user.user_id]
            );
            userDetails = students[0] || {};
        } else if (user.role === 'professor') {
            const [professors] = await db.query(
                'SELECT * FROM professors WHERE user_id = ?',
                [user.user_id]
            );
            userDetails = professors[0] || {};
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
                program_scope: user.program_scope
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
                program_scope: user.program_scope,
                ...userDetails
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

module.exports = {
    login
};
