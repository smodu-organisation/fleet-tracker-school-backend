
const io = require('socket.io'); 

let socketIOInstance;

const setSocketIO = (server) => {
  socketIOInstance = io(server); 
  return socketIOInstance;
};

const sendNotificationToSocket = (userId, notification) => {
  if (!socketIOInstance) {
    console.log("Socket.io instance is not initialized");
    return;
  }

  socketIOInstance.to(userId).emit('new-notification', notification);
  console.log(`Notification sent to user ${userId}`);
};

const sendGlobalNotification = (message) => {
  if (!socketIOInstance) {
    console.log("Socket.io instance is not initialized");
    return;
  }

  socketIOInstance.emit('global-alert', message);
  console.log('Global notification sent');
};

module.exports = {
  setSocketIO,
  sendNotificationToSocket,
  sendGlobalNotification
};
