// addAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config"; 
import User from "../models/user.js"; 

const createAdmin = async () => {
  try {
    // Connect to MongoDB using your env variable
    await mongoose.connect(`${process.env.MONGODB_URI}/safe-city`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@safecity.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists:", existingAdmin.email);
      return process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    // Create new admin
    const admin = await User.create({
      fullname: "Super Admin",
      email: "admin@safecity.com",
      role: "admin",
      password: hashedPassword,
    });

    console.log("✅ Admin created successfully:", admin.email);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
