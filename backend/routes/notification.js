import userAuth from "../middleware/userAuth.js";
import express from "express";
import Notification from "../models/notification.js";

const NotificationRouter = express.Router();

// Get user notifications
NotificationRouter.get('/', userAuth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
NotificationRouter.put('/:id/read', userAuth, async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default NotificationRouter;