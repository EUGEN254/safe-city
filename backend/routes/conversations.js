import userAuth from "../middleware/userAuth.js";
import Message from "../models/messages.js";
import express from "express"

const conversationsRouter = express.Router();

// Get user conversations
conversationsRouter.get('/conversations', userAuth, async (req, res) => {
  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { receiverId: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", req.user._id] },
              "$receiverId",
              "$senderId"
            ]
          },
          messages: { $push: "$$ROOT" }
        }
      }
    ]);

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default conversationsRouter