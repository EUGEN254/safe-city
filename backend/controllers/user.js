import bcrypt from "bcrypt";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import { ACCOUNT_CREATION_TEMPLATE } from "./emailTemplates.js";
import transporter from "../controllers/nodemailer.js";
import {v2 as cloudinary} from 'cloudinary'

// register user
const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "ACCOUNT CREATION",
      html: ACCOUNT_CREATION_TEMPLATE.replace(`{userName}`, fullname),
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register Error", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // finding user
    const user = await User.findOne({ email }).select(
      "fullname email password"
    );

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No User with that email",
      });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = generateToken(user);

    // set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    };

    // Set appropriate maxAge based on rememberMe
    if (rememberMe) {
      cookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days for "remember me"
    } else {
      cookieOptions.maxAge = 24 * 60 * 60 * 1000; // 1 day for normal session
    }

    res.cookie("token", token, cookieOptions);

    const { password: _, ...userWithoutPassword } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Login Successfull",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login failed", error);
  }
};

const getUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised",
      });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // return the safe user
    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
    };

    res.json({ success: true, user: safeUser });
  } catch (error) {
    console.error("Error in getUser", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(201).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.error("LoggOut error", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export { registerUser, loginUser, getUser, logout };
