const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  parents: { type: mongoose.Schema.Types.ObjectId, ref: 'Parent' },
  local_address: String,
  stop_pickup: String,
  drop_time: Date,
  parents_note: String,
  kid_behaviour: String,
  grade: String,
  isPickedUp: { type: Boolean, default: false },
  isDropped: { type: Boolean, default: false },
  history: [{ type: Date }],
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' }
});

module.exports = mongoose.model('Student', studentSchema);
