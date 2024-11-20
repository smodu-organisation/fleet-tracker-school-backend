const express = require('express');
const router = express.Router();
const { managerSignup, requestPasswordReset, resetPassword, managerSignin, confirmEmail } = require('../controllers/authController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

router.post('/signup/manager', managerSignup);
router.get('/confirm-email/:token', confirmEmail);
router.post('/sigin/manager', managerSignin);
router.post('/forgot-password', requestPasswordReset);
router.post('/reset-password', resetPassword);

router.get('/manager/dashboard', verifyToken, verifyRole('Manager'), (req, res) => {
    res.status(200).json({ message: 'Welcome to the manager dashboard!' });
  });

module.exports = router;
