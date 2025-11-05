import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectCloudinary from "./configs/cloudinary.js";
import connectDB from "./configs/connectDB.js";
import userRouter from "./routes/userRoutes.js";
import reportRouter from "./routes/reportRoutes.js";

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
app.use("/api/reports", reportRouter);

// connect MongoDb
await connectDB();

// start server
app.listen(PORT, () => console.log(`Server started on PORT : ${PORT}`));
