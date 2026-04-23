const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getDb, saveDb } = require('../config/mockStorage');

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            const userExists = db.users.find(u => u.email === email);
            if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = { _id: Date.now().toString(), name, email, password: hashedPassword };
            db.users.push(newUser);
            saveDb(db);
            return sendTokenResponse(newUser, 201, res);
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });
        const user = await User.create({ name, email, password });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (process.env.MOCK_DB === 'true') {
            const db = getDb();
            const user = db.users.find(u => u.email === email);
            if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials' });
            return sendTokenResponse(user, 200, res);
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
    res.status(statusCode).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email }
    });
};
