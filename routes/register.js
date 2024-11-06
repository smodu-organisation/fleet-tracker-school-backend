const express = require('express');
const User = require('./models/User'); 
const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const newUser = new User({
            name,
            email,
            password,
            role,
        });

        await newUser.hashPassword();

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
