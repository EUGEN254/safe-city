import express from 'express'
import { loginadmin, getAdminData} from '../controllers/admin.js';
import userAuth from '../middleware/userAuth.js';


const adminRouter = express.Router();

adminRouter.post("/",loginadmin)
adminRouter.get("/get-admin",userAuth,getAdminData)

export default adminRouter