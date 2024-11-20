const User = require('../models/User');
const bcrypt = require('bcrypt');
const sendEmail = require('../utils/sendEmail');

exports.autoRegister = async (req, res) => {
  const { school_id, name, email, role, studentId = null, routeId = null } = req.body;

  if (!school_id || !name || !email || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      school_id,
      name,
      email,
      password_hash: hashedPassword,
      role,
      ...(role === 'Parent' && { parent_id: studentId }),
      ...(role === 'Driver' && { driver_id: routeId }),
    });

    await sendEmail(email, 'Your Account Details', `Login Email: ${email}\nPassword: ${password}`);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
