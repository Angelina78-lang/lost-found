const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

        if (process.env.MOCK_DB === 'true') {
            // In mock mode, we skip DB lookup and just trust the token
            req.user = { id: decoded.id, name: decoded.name || 'Mock User' };
            return next();
        }

        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
};

module.exports = { protect };
