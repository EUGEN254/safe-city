import express from 'express'
import { loginadmin, getAdminData, logoutAdmin,getAllUsers } from '../controllers/admin.js';
import userAuth from '../middleware/userAuth.js';


const adminRouter = express.Router();

adminRouter.post("/",loginadmin)
adminRouter.post("/logout",logoutAdmin)
adminRouter.get("/get-admin",userAuth,getAdminData)
adminRouter.get("/get-all-users",userAuth,getAllUsers)

export default adminRouter