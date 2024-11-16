const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  vehicle_number: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, enum: ['Active', 'In Maintenance'], required: true },
  fuel_status: { type: String, required: true },
  current_location: { type: String, required: true },
  last_maintenance_date: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
