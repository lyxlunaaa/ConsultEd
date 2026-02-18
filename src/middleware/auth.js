const jwt = require('jsonwebtoken');
require('dotenv').config();

// Verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { user_id, username, role, program_scope }
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token.'
        });
    }
};

// Require specific role(s)
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        // roles can be a string or array
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};

// Check program access for admin roles
const checkProgramAccess = (req, res, next) => {
    const { role, program_scope } = req.user;

    // Registrar has access to all programs
    if (role === 'registrar' || program_scope === 'ALL') {
        req.allowedPrograms = ['IT', 'CS', 'GRAD'];
        return next();
    }

    // Dean has access to IT and CS only (CCIT)
    if (role === 'dean' && program_scope === 'CCIT') {
        req.allowedPrograms = ['IT', 'CS'];
        return next();
    }

    // Program Chair has access to their assigned program only
    if (role === 'program_chair' && program_scope) {
        req.allowedPrograms = [program_scope];
        return next();
    }

    // Default: no access
    req.allowedPrograms = [];
    next();
};

module.exports = {
    verifyToken,
    requireRole,
    checkProgramAccess
};
