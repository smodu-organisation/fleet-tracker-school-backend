const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  managedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
  managedRoutes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Route' }]
});

const Manager = mongoose.model('Manager', managerSchema);
module.exports = Manager;
