const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
  payment_status: { type: String, enum: ['Paid', 'Failed'], required: true },
  payment_method: { type: String },
  next_billing_date: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

