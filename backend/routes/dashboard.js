import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { getDashBoardData } from '../controllers/dashboard.js';


const dashBoardRouter = express.Router();

dashBoardRouter.get("/stats",userAuth,getDashBoardData)

export default dashBoardRouter

 