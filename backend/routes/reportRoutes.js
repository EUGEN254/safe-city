import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { addReport, getReports } from '../controllers/report.js';
import upload from '../middleware/upload.js';

const  reportRouter = express.Router();

// Upload up to 3 images
reportRouter.post(
    "/add-report",
    userAuth,
    upload.array("images", 3),
    addReport
  );
reportRouter.get("/get-reports",getReports)

export default reportRouter;