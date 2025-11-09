import express from 'express'
import { loginadmin, getAdminData, logoutAdmin } from '../controllers/admin.js';
import userAuth from '../middleware/userAuth.js';


const adminRouter = express.Router();

adminRouter.post("/",loginadmin)
adminRouter.post("/logout",logoutAdmin)
adminRouter.get("/get-admin",userAuth,getAdminData)

export default adminRouter