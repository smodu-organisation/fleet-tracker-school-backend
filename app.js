require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notification');
const http = require('http');
const socketIo = require('socket.io');

const app = express();

connectDB();

app.use(express.json());

app.use('/api/auth/', authRoutes);
app.use('/api/users/', userRoutes);
app.use('/api/notifications/', notificationRoutes);

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('User connected: ', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User with ID ${userId} joined the room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
