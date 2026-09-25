const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { authenticate } = require("../middlewares/auth");

router.post("/file", authenticate, (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Fayl yuklashda xatolik:", err);
      return res.status(500).json({ success: false, message: `Fayl yuklashda xatolik: ${err.message}` });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Fayl yuborilmadi" });
    }

    // AWS S3 location yoki local uploads URL
    const fileUrl = req.file.location || `/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Fayl muvaffaqiyatli yuklandi",
      file_url: fileUrl,
      file_name: req.file.originalname,
      size: req.file.size,
    });
  });
});

module.exports = router;
