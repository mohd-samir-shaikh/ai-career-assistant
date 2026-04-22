const extractPdfText = require("../utils/extractPdfText");
const { analyzeText, chatWithAI } = require("../services/aiService");
const Result = require("../models/Result");

// ================= JOB MATCH FUNCTION =================
const calculateJobMatches = (skills = []) => {
  const roles = [
    {
      name: "Frontend Developer",
      required: ["HTML", "CSS", "JavaScript", "React", "Bootstrap"],
    },
    {
      name: "Backend Developer",
      required: ["Node.js", "Express", "MongoDB", "API", "Database"],
    },
    {
      name: "Full Stack Developer",
      required: ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"],
    },
  ];

  return roles.map((role) => {
    const userSkills = skills.map((s) => s.toLowerCase());

    // 🔥 SMART MATCH
    const matched = role.required.filter((skill) =>
      userSkills.some((userSkill) =>
        userSkill.includes(skill.toLowerCase())
      )
    );

    const percent = Math.round(
      (matched.length / role.required.length) * 100
    );

    return {
      role: role.name,
      match: percent,

      // 🔥 SMART MISSING
      missing: role.required.filter(
        (skill) =>
          !userSkills.some((userSkill) =>
            userSkill.includes(skill.toLowerCase())
          )
      ),
    };
  });
};

// ================= UPLOAD & ANALYZE =================
const uploadResume = async (req, res) => {
  try {
    console.log("FILE RECEIVED:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded ❌",
      });
    }

    // ✅ SAFE FILE PATH
    const filePath = req.file.path || `uploads/${req.file.filename}`;

    let text = "";

    // ✅ SAFE PDF EXTRACTION (THIS FIXES YOUR CRASH)
    try {
      text = await extractPdfText(filePath);
    } catch (err) {
      console.error("PDF ERROR:", err);
      return res.status(500).json({
        message: "Error reading PDF ❌",
      });
    }

    // ✅ AI ANALYSIS
    const aiResult = await analyzeText(text);

    // ================= SCORE =================
    const totalSkills = aiResult.skills.length;
    const missing = aiResult.missingSkills.length;
    const suggestions = aiResult.suggestions.length;

    let score = 100;
    score -= missing * 5;
    score -= suggestions * 2;
    score += totalSkills * 2;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // ================= JOB MATCH =================
    const jobMatches = calculateJobMatches(aiResult.skills);

    // ✅ SAVE
    const savedResult = await Result.create({
      user: req.user.id,
      score,
      skills: aiResult.skills || [],
      missingSkills: aiResult.missingSkills || [],
      suggestions: aiResult.suggestions || [],
      careerRoles: aiResult.careerRoles || [],
      jobMatches,
      resumeFile: req.file.filename,
    });

    res.json({
      message: "Resume analyzed & saved ✅",
      result: savedResult,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      message: "Upload failed ❌",
      error: error.message,
    });
  }
};

// ================= CHAT WITH RESUME =================
const chatWithResume = async (req, res) => {
  try {
    const { message } = req.body;

    const latest = await Result.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No resume found" });
    }

    const prompt = `
You are a smart AI career coach.

Resume Summary:
- Skills: ${latest.skills.join(", ")}
- Missing Skills: ${latest.missingSkills.join(", ")}

User Question:
"${message}"

Instructions:
- Answer ONLY the question
- Do NOT repeat resume data
- Keep answer short and helpful
- Give practical advice
- Sound like a real mentor
`;

    const reply = await chatWithAI(prompt);

    res.json({ reply });

  } catch (error) {
    console.error("CHAT ERROR:", error);
    res.status(500).json({ message: "Chat failed" });
  }
};

// ================= GET USER RESULTS =================
const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(results);

  } catch (error) {
    console.error("FETCH ERROR:", error);
    res.status(500).json({
      message: "Error fetching results",
      error: error.message,
    });
  }
};

// ================= EXPORT =================
module.exports = {
  uploadResume,
  chatWithResume,
  getMyResults,
};