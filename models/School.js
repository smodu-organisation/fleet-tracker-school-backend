const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  school_name: { type: String, required: true },
  subscription_plan: { type: String, enum: ['Basic', 'Pro', 'Premium'], required: true },
  subscription_status: {
    type: String,
    enum: ['Active', 'Inactive', 'Pending'], 
    required: true
  },
  subscription_expiry_date: { type: Date, required: true },
  storage_usage: { type: Number, required: true },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('School', schoolSchema);

