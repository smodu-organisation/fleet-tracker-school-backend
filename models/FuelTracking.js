const mongoose = require('mongoose');

const fuelTrackingSchema = new mongoose.Schema({
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  refill_date: { type: Date, required: true },
  fuel_amount: { type: mongoose.Schema.Types.Decimal128 },
  is_scheduled: { type: Boolean },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FuelTracking', fuelTrackingSchema);

