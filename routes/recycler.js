const express = require('express');
const router = express.Router();
const Recycler = require('../models/recycler');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const { fullname, email, mobile_number, pass } = req.body;

        if (!fullname || !email || !mobile_number || !pass) {
            return res.status(400).json({ message: "All fields required ❌" });
        }

        const existing = await Recycler.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "Email already exists ❌" });
        }

        const recycler = new Recycler({ fullname, email, mobile_number, pass });
        await recycler.save();

        res.json({ message: "Recycler registered successfully ✅" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, pass } = req.body;

        const recycler = await Recycler.findOne({ email });

        if (!recycler) {
            return res.status(400).json({ message: "User not found ❌" });
        }

        // 🔥 FIXED HERE
        if (recycler.pass !== pass) {
            return res.status(400).json({ message: "Invalid password ❌" });
        }

        res.json({ message: "Login successful ✅", recycler });

    } catch (err) {
        console.error(err); // optional debug
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;