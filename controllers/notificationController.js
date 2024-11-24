const Notification = require('../models/Notification');
const User = require('../models/User')
const { sendNotificationToSocket } = require('../utils/socketUtils');
const cron = require('node-cron');

exports.sendNotification = async (req, res) => {
  try {
    const { sender, receivers, message, notificationType, actionDetails } = req.body;

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const receiverUsers = await User.find({ '_id': { $in: receivers } });
    if (receiverUsers.length !== receivers.length) {
      return res.status(404).json({ error: 'One or more receivers not found' });
    }

    const notification = new Notification({
      sender,
      receivers,
      message,
      notificationType,
      actionDetails,
      isRead: false, 
      scheduledTime: null,
      status: 'Sent' 
    });

    await notification.save();

    receivers.forEach((receiverId) => {
      sendNotificationToSocket(receiverId, notification);
    });

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
};

exports.scheduleNotification = async (req, res) => {
  try {
    const { sender, receivers, message, notificationType, actionDetails, scheduledTime } = req.body;

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ error: 'Sender not found' });
    }

    const receiverUsers = await User.find({ '_id': { $in: receivers } });
    if (receiverUsers.length !== receivers.length) {
      return res.status(404).json({ error: 'One or more receivers not found' });
    }

    const now = new Date();
    if (new Date(scheduledTime) <= now) {
      return res.status(400).json({ error: 'Scheduled time must be in the future' });
    }

    const notification = new Notification({
      sender,
      receivers,
      message,
      notificationType,
      actionDetails,
      scheduledTime,
      isRead: false, 
      status: 'Pending' 
    });

    await notification.save();

    cron.schedule(new Date(scheduledTime), () => {
      receivers.forEach((receiverId) => {
        sendNotificationToSocket(receiverId, notification);
      });

      notification.status = 'Sent';
      notification.save();
    });

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to schedule notification' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    const notifications = await Notification.find({
      receivers: userId
    }).sort({ createdAt: -1 }); 

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.receivers.forEach((receiverId) => {
      sendNotificationToSocket(receiverId, notification);
    });

    res.status(200).json({ success: true, notification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update read status' });
  }
};
exports.getNotificationsSentByUser = async (req, res) => {
  try {
    const { senderId } = req.params;

    const notifications = await Notification.find({ sender: senderId }).sort({ createdAt: -1 });

    if (!notifications.length) {
      return res.status(404).json({ error: 'No notifications found for this sender' });
    }

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications sent by the user' });
  }
};


const handleScheduledNotifications = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const notificationsToSend = await Notification.find({
        scheduledTime: { $lte: now },
        isRead: false,
        status: 'Pending' 
      });

      notificationsToSend.forEach((notification) => {
        notification.receivers.forEach((receiverId) => {
          sendNotificationToSocket(receiverId, notification);
        });

        notification.status = 'Sent';
        notification.save();
      });
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  });
};

handleScheduledNotifications();
