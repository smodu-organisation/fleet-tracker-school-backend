const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    routeName: { type: String, required: true },
    stops: [{ location: String, time: String }],
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Route = mongoose.model('Route', routeSchema);
module.exports = Route;
