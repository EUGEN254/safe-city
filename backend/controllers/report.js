import Report from "../models/report.js";
import { v2 as cloudinary } from "cloudinary";

const addReport = async (req, res) => {
  try {
    const { title, description, category, urgency, anonymous } = req.body;

    if (!title || !description || !category || !urgency) {
      return res.status(400).json({
        success: false,
        message: "All fields must be filled",
      });
    }

    // Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: "safecity_reports",
        })
      );

      const uploadResults = await Promise.all(uploads);
      imageUrls = uploadResults.map(img => img.secure_url)
    }

    // Save Report to DB
    const report = await Report.create({
      title,
      description,
      category,
      urgency,
      images: imageUrls,
      reporter: anonymous === "true" ? null : req.user._id,
      anonymous: anonymous === "true",
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report
    });

  } catch (error) {
    console.error("Add Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export { addReport };
