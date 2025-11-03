import jwt from "jsonwebtoken";
import User from "../models/user.js";

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorised login again",
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // fetch user from db and attach to req.user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User Not Found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: err.message || "Not Authorised",
    });
  }
};


export default userAuth;