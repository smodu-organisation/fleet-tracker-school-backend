const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  notifications: [{ type: String }],
  messages: [{ type: String }],
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
});

module.exports = mongoose.model("Driver", driverSchema);
