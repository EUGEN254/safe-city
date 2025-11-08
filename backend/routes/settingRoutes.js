import express from 'express'
import { enablenotification,updatePrivacySettings,getPrivacySettings ,changePassword} from '../controllers/settings.js';
import userAuth from '../middleware/userAuth.js';

const settingsRouter = express.Router();


settingsRouter.post('/notification',userAuth,enablenotification)
settingsRouter.post("/account/change-password", userAuth, changePassword);
settingsRouter.post('/privacy', userAuth, updatePrivacySettings);
settingsRouter.get('/privacy', userAuth, getPrivacySettings);


export default settingsRouter