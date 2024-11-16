const mongoose = require('mongoose');

const routeStopSchema = new mongoose.Schema({
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  stop_name: { type: String, required: true },
  stop_latitude: { type: Number, required: true },
  stop_longitude: { type: Number, required: true },
  stop_order: { type: Number, required: true },  
  stop_distance: { type: Number, required: true },  
  stop_estimated_time: { type: Number, required: true },  
  waiting_time: { type: Number, required: true }, 
  estimated_arrival_time: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RouteStop', routeStopSchema);
