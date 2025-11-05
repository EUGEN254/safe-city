import express from "express";
import userAuth from "../middleware/userAuth.js";
import { addReport,getMyReports, deleteReport } from "../controllers/report.js";
import upload from "../middleware/upload.js";

const reportRouter = express.Router();

// Upload up to 3 images
reportRouter.post(
  "/add-report",
  userAuth,
  upload.array("images", 3),
  addReport
);
reportRouter.get("/get-reports",userAuth, getMyReports);
reportRouter.delete("/delete/:id",userAuth, deleteReport);

export default reportRouter;
