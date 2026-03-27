const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { fullname, email, mobile_number, pass } = req.body;

        if (!fullname || !email || !mobile_number || !pass) {
            return res.status(400).json({ message: "All fields required ❌" });
        }

        const existing = await Staff.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists ❌" });
        }

        const staff = new Staff({ fullname, email, mobile_number, pass });
        await staff.save();

        res.json({ message: "Staff registered successfully ✅" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;

        const staff = await Staff.findOne({ email });

        if (!staff) {
            return res.status(400).json({ message: "User not found ❌" });
        }

        if (staff.pass !== pass) {
            return res.status(400).json({ message: "Invalid password ❌" });
        }

        res.json({ message: "Login successful ✅", staff });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;