const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notification_type: { type: String, required: true },
  message: { type: String, required: true },
  read_status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);

