const mongoose = require("mongoose");
const Student = require('../models/Student'); 
const routeSchema = new mongoose.Schema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  route_name: { type: String, required: true },
  start_location: { type: String, required: true },
  end_location: { type: String, required: true },
  driver_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicle_id: {
    type: String,
    ref: "Vehicle",
    required: false,
  },
  assigned_students: [{ type: String, ref: "Student" }],
  route_distance: { type: mongoose.Schema.Types.Decimal128 },
  estimated_time: { type: mongoose.Schema.Types.Decimal128 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Route", routeSchema);
