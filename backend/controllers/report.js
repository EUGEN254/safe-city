import Report from "../models/report.js";
import { v2 as cloudinary } from "cloudinary";
import { getPublicId } from "../utils/cloudinaryHelpers.js";
import { removeTempFile } from "../utils/fileHelpers.js";

//  Add Report
const addReport = async (req, res) => {
  try {
    const { title, description, category, urgency, anonymous } = req.body;

    if (!title || !description || !category || !urgency) {
      return res.status(400).json({
        success: false,
        message: "All fields must be filled",
      });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploads = req.files.map((file) =>
        cloudinary.uploader
          .upload(file.path, { folder: "safecity_reports" })
          .then((result) => {
            removeTempFile(file.path);
            return result;
          })
      );
      const results = await Promise.all(uploads);
      imageUrls = results.map((img) => img.secure_url);
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
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get ONLY logged-in user reports
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ reporter: req.user._id })
      .sort({ createdAt: -1 })
      .populate("reporter", "fullname email"); 

    return res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Get My Reports Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete Report with Cloudinary cleanup
const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });

    if (report.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this report",
      });
    }

    // Delete images from Cloudinary
    for (const img of report.images) {
      const publicId = getPublicId(img);
      await cloudinary.uploader.destroy(publicId);
    }

    await report.deleteOne();

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Report (keep old + add new + delete removed)
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report)
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });

    if (report.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot edit this report",
      });
    }

    const { title, description, category, urgency, anonymous, existingImages } =
      req.body;

    if (title) report.title = title;
    if (description) report.description = description;
    if (category) report.category = category;
    if (urgency) report.urgency = urgency;
    report.anonymous = anonymous === "true";

    let finalImages = [];

    // Parse remaining old images from frontend input
    if (existingImages) {
      const parsed = JSON.parse(existingImages);
      finalImages = [...parsed];
    }

    // ✅ Upload newly added images
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "safecity_reports",
        });
        finalImages.push(uploaded.secure_url);
        removeTempFile(file.path);
      }
    }

    // ✅ Remove Cloudinary images that user deleted
    for (const oldImg of report.images) {
      if (!finalImages.includes(oldImg)) {
        const publicId = getPublicId(oldImg);
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // ✅ Limit max 3 images
    report.images = finalImages.slice(0, 3);

    const updatedReport = await report.save();

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addReport, getMyReports, deleteReport, updateReport };
