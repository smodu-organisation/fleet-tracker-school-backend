const Message = require('../models/Message');



exports.sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message, image_url } = req.body;

    try {
 

        const newMessage = await Message.create({
            sender_id: sender_id,
            receiver_id: receiver_id,
            message,
            image_url,
        });

        res.status(200).json({ success: true, newMessage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send message", error: error.message });
    }
};

exports.getChatHistory = async (req, res) => {
    const { userId, receiverId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { sender_id: userId, receiver_id: receiverId },
                { sender_id: receiverId, receiver_id: userId }
            ]
        }).sort({ timestamp: 1 }); 

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to retrieve messages', error });
    }
};


exports.updateMessageStatus = async (req, res) => {
    try {
        const { messageId } = req.params;  
        const { status } = req.body;  

        const message = await Message.findByIdAndUpdate(
            messageId,
            { status },
            { new: true }  
        );

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Message status updated',
            updatedMessage: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update message status',
            error: error.message
        });
    }
};