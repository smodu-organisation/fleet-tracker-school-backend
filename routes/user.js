const express = require('express');
const { autoRegister, resendCredentials } = require('../controllers/userController');
const router = express.Router();

router.post('/auto-register', autoRegister);
router.post('/:userId/resend-credentials', resendCredentials);

module.exports = router;
