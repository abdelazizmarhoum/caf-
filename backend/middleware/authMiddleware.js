const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-passwordHash');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const manager = (req, res, next) => {
    if (req.user && req.user.role === 'manager') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as a manager' });
    }
};

const kitchen = (req, res, next) => {
    if (req.user && (req.user.role === 'kitchen' || req.user.role === 'manager')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as kitchen staff' });
    }
};

module.exports = { protect, manager, kitchen };
