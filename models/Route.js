const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  route_name: { type: String, required: true },
  start_location: { type: String, required: true },  // House 
  end_location: { type: String, required: true },    // School 
  driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  assigned_students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  route_distance: { type: Number, required: true },  // Distance in km
  estimated_time: { type: Number, required: true },   // Time in hours
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Route', routeSchema);
