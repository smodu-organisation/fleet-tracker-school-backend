require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const socket = require('./services/socket');
const app = express();

connectDB();
app.use(express.json());
app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/messages/", messageRoutes);

const server = require('http').createServer(app);
socket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
