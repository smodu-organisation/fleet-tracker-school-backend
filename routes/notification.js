const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware'); 

router.post('/send', notificationController.sendNotification);
router.post('/schedule', verifyToken, verifyRole('manager'), notificationController.scheduleNotification);

router.get('/:userId', notificationController.getNotifications);
router.put('/:notificationId/mark-as-read', verifyToken, notificationController.markAsRead);
router.get('/sent/:senderId', notificationController.getNotificationsSentByUser);

module.exports = router;
