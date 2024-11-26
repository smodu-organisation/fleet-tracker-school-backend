const Message = require('../models/Message'); 

const socketHandler = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*', 
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('joinRoom', ({ userId }) => {
      socket.join(userId);
      console.log(`${userId} joined their private room`);
    });

    socket.on('sendMessage', async (data) => {
      const { sender_id, receiver_id, message, image_url } = data;

      try {
        const newMessage = await Message.create({
          sender_id,
          receiver_id,
          message,
          image_url,
        });

        io.to(receiver_id).emit('receiveMessage', newMessage);

        socket.emit('messageSent', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Message not sent, try again later' });
      }
    });

    // Mark message as read
    socket.on('markAsRead', async ({ messageId }) => {
      try {
        const updatedMessage = await Message.findByIdAndUpdate(
          messageId,
          { status: 'read' },
          { new: true }
        );

        if (updatedMessage) {
          io.to(updatedMessage.sender_id.toString()).emit('messageRead', updatedMessage);
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
