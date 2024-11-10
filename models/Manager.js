const managerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },
  school_name: String,
  payment_status: String,
  package_name: String
});

module.exports = mongoose.model('Manager', managerSchema);
