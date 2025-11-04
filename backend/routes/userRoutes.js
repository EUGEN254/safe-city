import express from 'express'
import { getUser, loginUser, logout, registerUser } from '../controllers/user.js';
import { addReport } from '../controllers/report.js'; 
import userAuth from '../middleware/userAuth.js';
import upload from '../middleware/upload.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.get("/getme", userAuth, getUser);

// Upload up to 3 images
userRouter.post(
  "/add-report",
  userAuth,
  upload.array("images", 3),
  addReport
);

export default userRouter;
