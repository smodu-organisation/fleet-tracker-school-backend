const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  event_type: {
    type: String,
    enum: ['pickup', 'dropoff', 'message', 'notification', 'maintenance', 'fuel'],
    required: true
  },
  event_description: { type: String },
  timestamp: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);

