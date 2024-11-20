const mongoose = require('mongoose');

const routeStopSchema = new mongoose.Schema({
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  stop_name: { type: String, required: true },
  stop_latitude: { type: mongoose.Schema.Types.Decimal128, required: true },
  stop_longitude: { type: mongoose.Schema.Types.Decimal128, required: true },
  stop_order: { type: Number, required: true },
  stop_distance: { type: mongoose.Schema.Types.Decimal128 },
  stop_estimated_time: { type: mongoose.Schema.Types.Decimal128 },
  waiting_time: { type: mongoose.Schema.Types.Decimal128 },
  estimated_arrival_time: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RouteStop', routeStopSchema);

