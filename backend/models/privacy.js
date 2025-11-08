import mongoose from "mongoose";

const privacySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    shareLocation: { type: Boolean, default: true },
    showOnMap: { type: Boolean, default: false },
    anonymousReporting: { type: Boolean, default: true },
    dataCollection: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Privacy =
  mongoose.models.Privacy || mongoose.model("Privacy", privacySchema);
export default Privacy;
