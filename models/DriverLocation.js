const mongoose = require('mongoose');

const DriverLocationSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
    index: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  totalDistance: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('DriverLocation', DriverLocationSchema);