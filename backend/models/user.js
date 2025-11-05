import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "invalid email"],
    },
    role: { type: String, default: "User" },
    password: { type: String, required: true },
  },
  {
    timeStamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
