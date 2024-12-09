const socketIO = require('socket.io');
const DriverLocation = require('../models/DriverLocation'); // You'll need to create this model

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

    // Existing room and message handling
    socket.on('joinRoom', ({ userId }) => {
      socket.join(userId);
      console.log(`${userId} joined their private room`);
    });

    socket.on('subscribe-to-driver', (driverId) => {
      socket.join(driverId); // Parent joins the driver's room
      console.log(`Parent subscribed to driver ${driverId}`);
    });

    // New handler for driver location updates
    socket.on('driver-location-update', async (locationData) => {
      console.log('Backend received location data:', locationData)
      try {
        // Validate required fields
        if (!locationData.driverId || 
            !locationData.latitude || 
            !locationData.longitude) {
              console.error('Invalid location data received');
          throw new Error('Invalid location data');
        }

        // Create or update driver location in database
        const driverLocation = await DriverLocation.findOneAndUpdate(
          { driverId: locationData.driverId },
          {
            latitude: locationData.latitude,
            longitude: locationData.longitude,
            timestamp: locationData.timestamp || new Date(),
            totalDistance: locationData.totalDistance || 0
          },
          { 
            new: true,  // Return updated document
            upsert: true  // Create if doesn't exist
          }
        );

        // Broadcast location to relevant parties
        socketIOInstance.emit('driver-location-broadcast', {
          driverId: locationData.driverId,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          timestamp: driverLocation.timestamp,
          totalDistance: locationData.totalDistance
        });

        console.log(`Location broadcast for driver ${locationData.driverId}`);
      } catch (error) {
        console.error('Error processing driver location update:', error);
        // socket.emit('location-update-error', { 
        //   message: 'Failed to process location update',
        //   error: error.message 
        // });
      }
    });

    // Existing message sending logic
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