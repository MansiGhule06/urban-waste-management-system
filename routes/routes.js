const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userSchema = require('../validation/userValidation');

router.post('/register', async (req, res) => {
  try {
    const { error, value } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const user = new User(value);
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;