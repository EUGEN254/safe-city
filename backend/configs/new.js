// scripts/addSupportTeam.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config"; 
import User from "../models/user.js"; 



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