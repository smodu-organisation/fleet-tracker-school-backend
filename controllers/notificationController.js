const Notification = require('../models/Notification');
const User = require('../models/User');
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
      status: 'Sent',
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

    const now = new Date(); // Get the current date and time
    let scheduleTime = new Date(scheduledTime); // Convert the scheduled time from the request

    // Check if the scheduled time is in the past (less than or equal to now)
    if (scheduleTime <= now) {
      // If it's in the past, set it to 1 minute ahead of the current time
      scheduleTime = new Date(now.getTime() + 1 * 60 * 1000); // Add 1 minute to the current time
    }

    // Ensure the scheduled time is at least 1 minute in the future
    if (scheduledTime === scheduleTime.toISOString()) {
      // If the user provided the current time (or time in the past), set it to future time
      scheduleTime = new Date(now.getTime() + 1 * 60 * 1000); // Set it to 1 minute ahead
    }

    const notification = new Notification({
      sender,
      receivers,
      message,
      notificationType,
      actionDetails,
      scheduledTime: scheduleTime,
      isRead: false,
      status: 'Pending',
    });

    await notification.save();

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
      receivers: userId,
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
        status: 'Pending',
      });

      for (const notification of notificationsToSend) {
        notification.receivers.forEach((receiverId) => {
          sendNotificationToSocket(receiverId, notification);
        });

        notification.status = 'Sent';
        await notification.save();
      }
    } catch (error) {
      console.error('Error processing scheduled notifications:', error);
    }
  });
};

handleScheduledNotifications();
