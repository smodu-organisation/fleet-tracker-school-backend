const express = require('express');
const { sendMessage, getChatHistory , updateMessageStatus } = require('../controllers/messageController');
const router = express.Router();


router.post('/send', sendMessage);
router.get('/:userId/:receiverId', getChatHistory);
router.put('/status/:messageId', updateMessageStatus);
module.exports = router;
