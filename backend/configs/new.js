// scripts/addSupportTeam.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config"; 
import User from "../models/user.js"; 

const supportTeamMembers = [
  {
    fullname: "Admin Support",
    email: "admin@safecity.com",
    role: "admin",
    password: "Admin@123",
    bio: "General inquiries and safety support specialist"
  },
  {
    fullname: "Dr. Sarah Johnson",
    email: "doctor@safecity.com", 
    role: "doctor",
    password: "Doctor@123",
    bio: "Medical doctor specializing in emergency response and healthcare"
  },
  {
    fullname: "Officer Mike Wilson",
    email: "police@safecity.com",
    role: "police", 
    password: "Police@123",
    bio: "Police officer with 10+ years experience in community safety"
  },
  {
    fullname: "Dr. James Chen",
    email: "doctor2@safecity.com",
    role: "doctor",
    password: "Doctor@123",
    bio: "Emergency medicine specialist and trauma care expert"
  },
  {
    fullname: "Officer Lisa Garcia",
    email: "police2@safecity.com", 
    role: "police",
    password: "Police@123",
    bio: "Community policing specialist and safety educator"
  }
];

const createSupportTeam = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('');
    console.log("✅ Connected to MongoDB");

    const results = {
      created: [],
      exists: []
    };

    // Create each team member
    for (const member of supportTeamMembers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: member.email });
      
      if (existingUser) {
        console.log(`⚠️ ${member.role} already exists: ${member.email}`);
        results.exists.push({
          email: member.email,
          role: member.role,
          name: member.fullname
        });
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(member.password, 10);

      // Create user
      const user = await User.create({
        fullname: member.fullname,
        email: member.email,
        role: member.role,
        password: hashedPassword,
        bio: member.bio
      });

      console.log(`✅ ${member.role} created: ${user.email}`);
      results.created.push({
        email: user.email,
        role: user.role,
        name: user.fullname
      });
    }

    console.log("\n📊 Summary:");
    console.log(`Created: ${results.created.length}`);
    console.log(`Already existed: ${results.exists.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating support team:", error);
    process.exit(1);
  }
};

createSupportTeam();