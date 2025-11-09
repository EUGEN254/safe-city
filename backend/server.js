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
import { Server } from "socket.io";

// .......express setup.......
const app = express();
const PORT = process.env.PORT || 5000;

// ...middleware.....
connectCloudinary();

// Determine the environment
const isProduction = (process.env.NODE_ENV || "development") === "production";
const allowedOrigins = (
  isProduction ? process.env.PROD_ORIGINS : process.env.DEV_ORIGINS
)?.split(",");

app.use(express.json({ limit: "4mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// test route
app.get("/", (req, res) => {
  res.send(
    `🚀 Server is running in ${process.env.NODE_ENV} - ready to receive request`
  );
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reports", reportRouter);
app.use("/api/settings", settingsRouter);

// connect MongoDb
await connectDB();

// create http server for socket.io
const server = http.createServer(app);

// initialize socket.io
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// keep track of online users 
let onlineUsers = {}; // { userId: { socketId: string, role: 'user' | 'admin', name: string } }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // listen for user login - ENHANCED
  socket.on("user-online", (userData) => {
    onlineUsers[userData.id] = {
      socketId: socket.id,
      role: userData.role || 'user', // Default to 'user' if not specified
      name: userData.name || 'Unknown'
    };
    
    io.emit("update-online-users", onlineUsers); // broadcast to all clients
    console.log("User came online:", userData.name, "Role:", userData.role);
    console.log("Online users:", onlineUsers);
  });


  // offline - ENHANCED
  socket.on("user-offline", (userId) => {
    console.log("User logging out:", userId);
    if (onlineUsers[userId]) {
      console.log("Removing user from online users:", onlineUsers[userId].name);
      delete onlineUsers[userId];
      io.emit("update-online-users", onlineUsers);
    }
  });

  // handle disconnect
  socket.on("disconnect", () => {
    let disconnectedUser = null;
    
    // Find which user disconnected
    for (let userId in onlineUsers) {
      if (onlineUsers[userId].socketId === socket.id) {
        disconnectedUser = onlineUsers[userId];
        delete onlineUsers[userId];
        break;
      }
    }
    
    
    io.emit("update-online-users", onlineUsers);
    console.log("Remaining online users:", onlineUsers);
  });
});

// start server
server.listen(PORT, () => console.log(`Server started on PORT : ${PORT}`));