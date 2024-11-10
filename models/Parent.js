const parentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  kids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  phone: String,
  notifications: [{ type: String }],
  messages: [{ type: String }]
});

module.exports = mongoose.model('Parent', parentSchema);
