const express = require("express");
const multer = require("multer");
const fs = require("fs");
const Tesseract = require("tesseract.js");
const Certificate = require("../models/Certificate");
const { auth } = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", auth, upload.single("certificate"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "ERROR",
        message: "Certificate file is required",
      });
    }

    
    if (req.file.mimetype === "application/pdf") {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        status: "ERROR",
        message: "PDF files are not supported. Please upload an image (JPG/PNG).",
      });
    }

    //  OCR processing
    const result = await Tesseract.recognize(req.file.path, "eng");
    const text = result.data.text;

    console.log("OCR TEXT:\n", text);

    //  Extract fields
    const certificateId = (text.match(/Certificate\s*ID[:\s]*([A-Z0-9-]+)/i) || [])[1];
    const rollNumber = (text.match(/Roll\s*No[:\s]*([A-Z0-9-]+)/i) || [])[1];
    const studentName = (text.match(/Name[:\s]*([A-Z\s]+)/i) || [])[1]?.trim();

    if (!certificateId && !rollNumber) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        status: "ERROR",
        message: "Could not extract certificate details from image",
      });
    }

    //  DB lookup
    const record = await Certificate.findOne({
      $or: [{ certificateId }, { rollNumber }],
    });

    if (!record) {
      fs.unlink(req.file.path, () => {});
      return res.json({
        status: "FAKE",
        message: "Certificate not found in database",
        extracted: { certificateId, rollNumber, studentName },
      });
    }

    fs.unlink(req.file.path, () => {});
    return res.json({
      status: "VALID",
      message: "Certificate verified successfully",
      extracted: { certificateId, rollNumber, studentName },
      record,
    });
  } catch (err) {
    console.error("OCR ERROR:", err);
    res.status(500).json({
      status: "ERROR",
      message: "Server error during OCR verification",
    });
  }
});

module.exports = router;
