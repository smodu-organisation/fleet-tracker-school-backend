const routeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    start_time: Date,
    end_time: Date,
    stops: [String],
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }
  });
  
  module.exports = mongoose.model('Route', routeSchema);
  