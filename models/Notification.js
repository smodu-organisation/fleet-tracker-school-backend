const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  sender: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receivers: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  message: { 
    type: String, 
    required: true 
  },
  notificationType: { 
    type: String, 
    enum: ['Reminder', 'Alert', 'Info', 'Emergency', 'Payment', 'RouteUpdate', 'BehaviorUpdate', 'Other'],
    required: true 
  },
  actionDetails: { 
    type: String, 
    required: false 
  },
  isRead: { 
    type: Boolean, 
    default: false 
  },
  scheduledTime: { 
    type: Date, 
    required: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },
  // Optionally, store the notification's status (sent, failed, etc.)
  status: {
    type: String,
    enum: ['Pending', 'Sent', 'Failed'],
    default: 'Pending'
  }
});

notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
