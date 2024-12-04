const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../utils/sendEmail');

exports.autoRegister = async (req, res) => {
  const { school_id, firstName, lastName, email, role, phone, studentId = null, routeId = null } = req.body;

  if (!school_id || !firstName || !lastName || !email || !role || !phone) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      school_id,
      firstName,
      lastName,
      email,
      password_hash: hashedPassword,
      phone,
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

exports.resendCredentials = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const password = Math.random().toString(36).slice(-8);
    user.password_hash = await bcrypt.hash(password, 10);

    await user.save();

    await sendEmail(user.email, 'Resent Account Details', `Login Email: ${user.email}\nPassword: ${password}`);

    res.status(200).json({ message: 'Credentials resent successfully.' });
  } catch (error) {
    console.error('Error resending credentials:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
exports.changePassword = async (req, res) => {
  const { userId, oldPassword, newPassword } = req.body;

  if (!userId || !oldPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password_hash = hashedPassword;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

