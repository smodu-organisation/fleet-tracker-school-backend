const mongoose = require('mongoose');

const vehicleMaintenanceSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  maintenance_date: { type: Date, required: true },
  part_damaged: { type: String },
  repair_status: { type: String },
  description: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VehicleMaintenance', vehicleMaintenanceSchema);

