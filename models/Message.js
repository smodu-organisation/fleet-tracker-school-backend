const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender_id: { type: String, ref: 'User', required: true },
    receiver_id: { type:String, ref: 'User', required: true },
    message: { type: String, required: false },
    image_url: { type: String, required: false },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
