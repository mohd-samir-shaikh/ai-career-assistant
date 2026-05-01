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


router.get("/test", protect, (req, res) => {                    //test
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});


router.post("/analyze", protect, async (req, res) => {        //analyze text
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


router.post(                                      //upload resume
  "/upload",
  protect,
  upload.single("resume"),
  uploadResume
);


router.get("/my-results", protect, getMyResults);                               //get my results


router.post("/chat", protect, chatWithResume);                      //chat with resume data                 

module.exports = router;