const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String }, 
  image: { type: String }, 
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent', 
  },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
