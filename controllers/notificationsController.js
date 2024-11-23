const { Notifications, Users } = require('../models');

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notifications.findAll({
      include: [
        { model: Users, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notifications.findByPk(id, {
      include: [
        { model: Users, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNotificationsByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const userNotifications = await Notifications.findAll({
      where: { user_id },
    });

    if (!userNotifications.length)
      return res.status(404).json({ message: 'No notifications found for this user' });

    res.status(200).json(userNotifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNotification = async (req, res) => {
  const { user_id, notification_type, message, read_status } = req.body;

  try {
    const newNotification = await Notifications.create({
      user_id,
      notification_type,
      message,
      read_status: read_status || 'Unread',
    });

    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a notification ( mark as "Read")
const updateNotification = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [rowsUpdated] = await Notifications.update(updates, { where: { id } });

    if (!rowsUpdated) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json({ message: 'Notification updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await Notifications.destroy({ where: { id } });

    if (!rowsDeleted) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rowsUpdated] = await Notifications.update(
      { read_status: 'Read' },
      { where: { user_id, read_status: 'Unread' } }
    );

    if (!rowsUpdated) return res.status(404).json({ message: 'No unread notifications found' });

    res.status(200).json({ message: 'All unread notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllNotifications,
  getNotificationById,
  getNotificationsByUser,
  createNotification,
  updateNotification,
  deleteNotification,
  markAllAsRead,
};
