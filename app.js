require("dotenv").config();
const express = require("express");
const http = require("http");
const { socketHandler, setSocketIO } = require("./utils/socketUtils");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const messageRoutes = require("./routes/message");
const notificationRoutes = require("./routes/notification");
const routeRoutes = require("./routes/route");
const cors = require("cors");

const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.use("/api/auth/", authRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/messages/", messageRoutes);
app.use("/api/notifications/", notificationRoutes);
app.use("/api/routes", routeRoutes);
const server = http.createServer(app);

setSocketIO(server);
socketHandler();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
