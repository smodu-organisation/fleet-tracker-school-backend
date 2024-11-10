const vehicleSchema = new mongoose.Schema({
    model: { type: String, required: true },
    number: { type: String, unique: true, required: true },
    maintenance: [{ type: String }],
    fuel: String,
    driver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }
  });
  
  module.exports = mongoose.model('Vehicle', vehicleSchema);
  