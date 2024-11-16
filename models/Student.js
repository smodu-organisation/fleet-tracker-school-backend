const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  grade: { type: String, required: true },
  note: { type: String },
  assigned_route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  pickup_time: { type: Date },
  dropoff_time: { type: Date },
  house_latitude: { type: Number, required: true },
  house_longitude: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('Student', studentSchema);
