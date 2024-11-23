const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const dotenv = require('dotenv');
const sessionConfig = require('./config/sessions');
const User = require('./models/User');
const messageRoutes = require('./routes/messages'); 
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(session(sessionConfig));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

io.on('connection', (socket) => {
  console.log('A user connected.');
  socket.on('send_message', (messageData) => {
    io.emit('receive_message', messageData);
  });
  socket.on('disconnect', () => {
    console.log('A user disconnected.');
  });
});

// Use the message routes
app.use('/api/messages', messageRoutes);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.user = {
    userId: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.json({ message: 'Login successful', user: req.session.user });
});

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

app.get('/manager-dashboard', authorize(['Manager']), (req, res) => {
  res.json({ message: 'Welcome to the Manager Dashboard' });
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
