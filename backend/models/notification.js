import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    emergencyalerts: { type: Boolean, default: false },
    safetyupdates: { type: Boolean, default: false },
    communityreports: { type: Boolean, default: false },
    locationbased: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
