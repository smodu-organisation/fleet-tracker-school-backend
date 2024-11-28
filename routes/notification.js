const express = require('express');
const router = express.Router();
const { sendNotification, scheduleNotification, getNotifications, markAsRead, getNotificationsSentByUser } = require('../controllers/notificationController');
const { verifyToken } = require('../middlewares/authMiddleware'); 

router.post('/send', verifyToken, sendNotification);
router.post('/schedule', verifyToken, scheduleNotification);

router.get('/:userId', verifyToken, getNotifications);
router.put('/:notificationId/mark-as-read', verifyToken, markAsRead );
router.get('/sent/:senderId', verifyToken, getNotificationsSentByUser);

module.exports = router;
