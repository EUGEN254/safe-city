import express from 'express'
import { getUser, loginUser, logout, registerUser } from '../controllers/user.js';
import userAuth from '../middleware/userAuth.js'



const userRouter = express.Router();

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.post("/logout",logout)
userRouter.get("/getme",userAuth,getUser)


export default userRouter