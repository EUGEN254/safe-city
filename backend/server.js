import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import http from "http";
import connectCloudinary from "./configs/cloudinary.js";
import connectDB from "./configs/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import settingsRouter from "./routes/settingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";
import dashBoardRouter from "./routes/dashboard.js";

/** ------------------- EXPRESS SETUP ------------------- **/
const app = express();
const PORT = process.env.PORT || 5000;

// Cloudinary setup
connectCloudinary();

// Determine environment and allowed origins
const isProduction = (process.env.NODE_ENV || "development") === "production";
const allowedOrigins = (
  isProduction ? process.env.PROD_ORIGINS : process.env.DEV_ORIGINS
)?.split(",");

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Test route
app.get("/", (req, res) => {
  res.send(`🚀 Server running in ${process.env.NODE_ENV}`);
});

// REST API routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reports", reportRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/messages", messageRouter);
app.use("/api/dashboard", dashBoardRouter);

// Connect MongoDB
await connectDB();

/** ------------------- HTTP & SOCKET.IO SETUP ------------------- **/
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

// Keep track of online users
let onlineUsers = {}; // { userId: { socketId, name, role } }

io.on("connection", (socket) => {
  /** ----- USER ONLINE ----- **/
  socket.on("user-online", (userData) => {
    onlineUsers[userData.id] = {
      socketId: socket.id,
      name: userData.name || "Unknown",
      role: userData.role || "user",
    };
    io.emit("update-online-users", onlineUsers);
  });

  /** ----- USER OFFLINE ----- **/
  socket.on("user-offline", (userId) => {
    if (onlineUsers[userId]) {
      delete onlineUsers[userId];
      io.emit("update-online-users", onlineUsers);
    }
  });

  /** ----- SEND MESSAGE ----- **/
  socket.on("send-message", async ({ toUserId, message }) => {
    try {
      // Emit message to receiver if online
      const receiver = onlineUsers[toUserId];
      if (receiver?.socketId) {
        io.to(receiver.socketId).emit("receive-message", {
          fromUserId: message.senderId,
          message,
        });
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  /** ----- DISCONNECT ----- **/
  socket.on("disconnect", () => {
    let disconnectedUserId = null;

    for (const userId in onlineUsers) {
      if (onlineUsers[userId].socketId === socket.id) {
        disconnectedUserId = userId;
        delete onlineUsers[userId];
        break;
      }
    }

    if (disconnectedUserId) io.emit("update-online-users", onlineUsers);
  });
});

/** ------------------- START SERVER ------------------- **/
server.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
