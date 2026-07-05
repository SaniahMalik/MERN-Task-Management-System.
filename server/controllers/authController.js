const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// 1. User Register Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check karna ke user pehle se to nahi bana hua
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, error: 'User already exists' });

        // Naya user create karna
        user = await User.create({ name, email, password });
        
        // Token generate karna
        const token = jwt.sign({ id: user._id }, 'secretkey123', { expiresIn: '1d' });

        res.status(201).json({ success: true, token, data: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. User Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // User ko email se dhoondna
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, error: 'Invalid Credentials' });

        // Password match karke check karna
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, error: 'Invalid Credentials' });

        // Token generate karna
        const token = jwt.sign({ id: user._id }, 'secretkey123', { expiresIn: '1d' });
        
        res.status(200).json({ success: true, token, data: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};