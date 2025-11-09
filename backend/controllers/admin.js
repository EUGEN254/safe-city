import User from "../models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

const loginadmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Kindly fill in all details",
      });
    }

    // check if its admin
    if (role != "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied Admin role required",
      });
    }

    // finding admin
    const admin = await User.findOne({ email, role });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "No admin with that account",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
    // genrate token
    const token = generateToken(admin._id);

    // set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production " ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    // remover password
    const { password: _, adminWithoutPassword } = admin._doc;

    return res.status(200).json({
      success: true,
      message: "Login Succesfull",
      admin: adminWithoutPassword,
    });
  } catch (error) {}
};

const getAdminData = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }
    return res.status(200).json({
      success: true,
      admin: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch admin",
    });
  }
};


const logoutAdmin = async (req,res) => {
  try {
    res.clearCookie("token")
    res.status(200).json({
      success:true,
      message:"Logged out"
    })
  } catch (error) {
    console.error("Logg Out Error",error)
    res.status(500).json({
      success:false,
      message:"Server error"
    })
    
  }
  
}


const getAllUsers = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized"
      });
    }

    // Fetch all users from database
    const users = await User.find().select('-password'); // Exclude passwords

    // Filter out admin users
    const usersNotAdmin = users.filter(user => user.role !== 'admin');

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: usersNotAdmin, 
      count: usersNotAdmin.length
    });

  } catch (error) {
    console.error("Failed to fetch users", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
export { loginadmin, getAdminData,logoutAdmin,getAllUsers };
