const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  school_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: function() {
      return this.role !== 'Manager'; 
    },
    default: null
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  resetCode: {
    type: Number,
    required: false,
  },
  resetCodeExpiry: {
    type: Date,
    required: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  role: { 
    type: String, 
    enum: ['Manager', 'Parent', 'Driver'], 
    required: true 
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  },
  notifications: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Notification'
  }],
  location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null }
  },
  socketId: {
    type: String,
    default: null,
  }
});

module.exports = mongoose.model('User', userSchema);
