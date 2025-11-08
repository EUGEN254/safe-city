import Notification from "../models/notification.js";
import Privacy from "../models/privacy.js";
import User from "../models/user.js";
import { notificationEnabledEmailTemplate } from "./emailTemplates.js";
import transporter from "./nodemailer.js";
import bcrypt from "bcrypt";

const enablenotification = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised to perform the action",
      });
    }

    const { email, fullname, _id: userId } = req.user;
    const { notificationType, enabled } = req.body;

    // Validate input
    if (!notificationType || typeof enabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Notification type and enabled status are required",
      });
    }

    // Update notification setting in DB
    const updatedNotification = await Notification.findOneAndUpdate(
      { user: userId },
      { [notificationType]: enabled },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Send confirmation email only if enabling
    if (enabled) {
      const htmlContent = notificationEnabledEmailTemplate(
        fullname,
        notificationType,
        enabled
      );
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: `Notification Enabled: ${notificationType}`,
        html: htmlContent,
      });
    }

    res.status(200).json({
      success: true,
      message: `Notification for ${notificationType} has been ${
        enabled ? "enabled" : "disabled"
      } successfully.`,
      data: updatedNotification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update notification setting.",
      error: error.message,
    });
  }
};

const getPrivacySettings = async (req, res) => {
  try {
    let privacy = await Privacy.findOne({ user: req.user._id });
    if (!privacy) {
      privacy = new Privacy({ user: req.user._id });
      await privacy.save();
    }
    res.json({ success: true, privacy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updatePrivacySettings = async (req, res) => {
  try {
    const { key, value } = req.body;
    let privacy = await Privacy.findOne({ user: req.user._id });
    if (!privacy) {
      privacy = new Privacy({ user: req.user._id });
    }
    privacy[key] = value;
    await privacy.save();
    res.json({ success: true, privacy });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const user = await User.findById(req.user._id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export {
  enablenotification,
  updatePrivacySettings,
  getPrivacySettings,
  changePassword,
};
