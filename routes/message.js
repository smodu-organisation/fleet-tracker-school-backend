const express = require('express');
const { sendMessage, getChatHistory , updateMessageStatus } = require('../controllers/messageController');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/send', verifyToken, sendMessage);
router.get('/:userId/:receiverId', verifyToken, getChatHistory);
router.put('/status/:messageId', verifyToken, updateMessageStatus);
module.exports = router;
