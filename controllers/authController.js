const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const School = require('../models/School');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { sendConfirmationEmail, sendPasswordResetEmail } = require('../utils/sendEmail');

exports.managerSignup = async (req, res) => {
  const { name, email, password, school_name, subscription_plan } = req.body;

  if (!name || !email || !password || !school_name || !subscription_plan) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  const session = await User.startSession();
  let transactionCommitted = false;

  try {
    session.startTransaction();

    const existingManager = await User.findOne({ email }).session(session);
    if (existingManager) {
      throw new Error('Email already in use.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const manager = new User({
      name,
      email,
      password_hash: hashedPassword,
      role: 'Manager',
      subscription_plan,
      subscription_status: 'Pending',
    });

    await manager.save({ session });

    const subscriptionExpiryDate = new Date();
    subscriptionExpiryDate.setMonth(subscriptionExpiryDate.getMonth() + 1);

    const school = new School({
      manager_id: manager._id,
      subscription_status: 'Pending',
      storage_usage: 0,
      subscription_expiry_date: subscriptionExpiryDate,
      subscription_plan,
      school_name,
    });

    await school.save({ session });

    manager.school_id = school._id;
    await manager.save({ session });

    await session.commitTransaction();
    transactionCommitted = true;

    session.endSession();

    const verificationToken = jwt.sign(
      { userId: manager._id, email: manager.email },
      process.env.SECRET,
      { expiresIn: '1d' } // 1 day expiration
    );

    await sendConfirmationEmail(manager.email, verificationToken);

    return res.status(201).json({
      message: 'Manager registered successfully. Please check your email to verify your account.',
      token: verificationToken
    });

  } catch (error) {
    if (!transactionCommitted) {
      await session.abortTransaction();
    }
    session.endSession();

    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

exports.confirmEmail = async (req, res) => {
  const { token } = req.params;
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).send('Invalid token or user does not exist.');
    }

    if (user.isEmailVerified) {
      return res.status(200).send('Email already verified. You can proceed to the payment.');
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(200).send('Email successfully verified! You can now proceed to the payment.');
  } catch (error) {
    console.error('Error during email confirmation:', error);
    return res.status(500).send('Internal server error. Please try again later.');
  }
};

exports.managerSignin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide both email and password.' });
  }

  try {
    const manager = await User.findOne({ email });
    if (!manager) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, manager.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (manager.role !== 'Manager') {
      return res.status(403).json({ message: 'Access denied. Not a manager.' });
    }

    const token = jwt.sign(
      { userId: manager._id, role: manager.role },
      process.env.SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      token: token,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error.', error: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const resetCode = crypto.randomInt(100000, 999999); 
    user.resetCode = resetCode;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000; 
    await user.save();

    await sendPasswordResetEmail(email, resetCode);

    res.status(200).json({ message: 'Reset code sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending reset code', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.resetCode !== resetCode || Date.now() > user.resetCodeExpiry) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);

    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};