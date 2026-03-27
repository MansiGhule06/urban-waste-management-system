const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userSchema = require('../validation/userValidation');

// POST /api/resident/register
router.post('/register', async (req, res) => {
    try {
        // Validate request body
        const { error, value } = userSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        // Check if email already exists
        const existingUser = await User.findOne({ email: value.email });
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        // Save new user
        const user = new User(value);
        await user.save();

        res.status(201).json({ message: 'Resident registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// POST /api/resident/login
router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check password
        if (user.pass !== pass) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.json({ message: 'Login successful ✅', user });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});
module.exports = router;
