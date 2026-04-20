const express = require("express");
const router = express.Router();

const {
  uploadResume,
  getMyResults,
  chatWithResume
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");
const { analyzeText } = require("../services/aiService");
const upload = require("../middleware/uploadMiddleware");

// ================= TEST =================
router.get("/test", protect, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

// ================= ANALYZE TEXT =================
router.post("/analyze", protect, async (req, res) => {
  try {
    const { text } = req.body;

    const result = await analyzeText(text);

    res.json({
      message: "AI Analysis Result",
      result,
    });
  } catch (error) {
    console.log("ANALYZE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// ================= UPLOAD =================
router.post(
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);

// ================= HISTORY =================
router.get("/my-results", protect, getMyResults);

// ================= CHAT =================
router.post("/chat", protect, chatWithResume);

module.exports = router;