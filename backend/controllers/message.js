import { v2 as cloudinary } from "cloudinary";
import { removeTempFile } from "../utils/fileHelpers.js";
import Message from "../models/messages.js";

const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text } = req.body;

    if (!senderId || !receiverId || (!text && !req.file)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message data",
      });
    }

    let image_url = "";

    // Upload image if exists
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "safecity_images",
      });
      removeTempFile(req.file.path);
      image_url = result.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: image_url,
    });

    const savedMessage = await newMessage.save();

    return res.status(201).json({
      success: true,
      message: "Message saved successfully",
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const fetchMessage = async (req, res) => {
  try {
    const { userId, receiverId } = req.params;

    if (!userId || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "Missing user or receiver ID",
      });
    }

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

export { fetchMessage, sendMessage };
