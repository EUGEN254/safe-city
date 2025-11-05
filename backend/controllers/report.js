import Report from "../models/report.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";

// Add Report
const addReport = async (req, res) => {
  try {
    const { title, description, category, urgency, anonymous } = req.body;

    if (!title || !description || !category || !urgency) {
      return res.status(400).json({
        success: false,
        message: "All fields must be filled",
      });
    }

    // Upload Images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: "safecity_reports",
        })
      );

      const uploadResults = await Promise.all(uploads);
      imageUrls = uploadResults.map(img => img.secure_url);
    }

    const report = await Report.create({
      title,
      description,
      category,
      urgency,
      images: imageUrls,
      reporter: req.user._id,
      anonymous: anonymous === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.error("Add Report Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get ONLY Logged-In User's Reports
const getMyReports = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Login required",
      });
    }

    const reports = await Report.find({
      reporter: req.user._id,
    })
      .sort({ createdAt: -1 })
      .populate("reporter", "fullname email");

    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    console.error("Get My Reports Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

//  Delete Report Safely
const deleteReport = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Check ownership
    if (!report.reporter || report.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this report",
      });
    }

    await report.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addReport, getMyReports, deleteReport };
