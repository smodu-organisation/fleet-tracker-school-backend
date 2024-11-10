const express = require('express');
const User = require('../models/User'); 
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordValid(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'User logged in successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
