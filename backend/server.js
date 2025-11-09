import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import http from "http"; // <-- needed for socket.io
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
let onlineUsers = {}; // { userId: socketId }

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // listen for user login
  socket.on("user-online", (user) => {
    onlineUsers[user.id] = socket.id;
    io.emit("update-online-users", onlineUsers); // broadcast to all clients
    console.log("Online users:", onlineUsers);
  });

  // offline
  socket.on("user-offline", (userId) => {
    console.log("User logging out:", userId);
    if (onlineUsers[userId]) {
      delete onlineUsers[userId];
      io.emit("update-online-users", onlineUsers);
      console.log("User removed from online users:", userId);
    }
  });

  // handle disconnect
  socket.on("disconnect", () => {
    for (let id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
      }
    }
    io.emit("update-online-users", onlineUsers);
    console.log("User disconnected:", socket.id);
  });
});

// start server
server.listen(PORT, () => console.log(`Server started on PORT : ${PORT}`));
