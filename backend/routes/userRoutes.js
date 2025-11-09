import express from "express";
import {
  getUser,
  loginUser,
  logout,
  registerUser,
  getSupportTeam,
} from "../controllers/user.js";

import userAuth from "../middleware/userAuth.js";
import upload from "../middleware/upload.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.get("/getme", userAuth, getUser);
userRouter.get("/get-support", userAuth, getSupportTeam);


export default userRouter;
