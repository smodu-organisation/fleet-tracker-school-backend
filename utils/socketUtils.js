const socketIO = require('socket.io');

let socketIOInstance;

const setSocketIO = (server) => {
  socketIOInstance = socketIO(server, {
    cors: {
      origin: '*',
    },
  });
  return socketIOInstance;
};


const sendNotificationToSocket = (userId, notification) => {
  if (!socketIOInstance) {
    return;
  }

  socketIOInstance.to(userId).emit('new-notification', notification);
};

const sendGlobalNotification = (message) => {
  if (!socketIOInstance) {
    return;
  }

  socketIOInstance.emit('global-alert', message);
};

const socketHandler = () => {
  if (!socketIOInstance) {
    console.error('Socket.io instance is not initialized');
    return;
  }

  socketIOInstance.on('connection', (socket) => {
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

        socketIOInstance.to(receiver_id).emit('receiveMessage', newMessage);
        socket.emit('messageSent', newMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Message not sent, try again later' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};


module.exports = {
  setSocketIO,
  sendNotificationToSocket,
  sendGlobalNotification,
  socketHandler,
};
