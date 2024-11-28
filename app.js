require("dotenv").config();
const express = require("express");
const http = require("http");
const { socketHandler, setSocketIO } = require("./utils/socketUtils");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const notificationRoutes = require("./routes/notification");

const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/messages/", messageRoutes);
app.use("/api/notifications/", notificationRoutes);

const server = http.createServer(app);

setSocketIO(server); 
socketHandler(); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
