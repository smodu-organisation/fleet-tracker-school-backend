const mongoose = require('mongoose');

const vehicleMaintenanceSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  maintenance_date: { type: Date, required: true },
  part_damaged: { type: String, required: true },
  repair_status: { type: String, required: true },
  description: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VehicleMaintenance', vehicleMaintenanceSchema);
