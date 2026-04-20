const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    score: {
  type: Number,
  default: 0,
},
    skills: [String],
    missingSkills: [String],
    suggestions: [String],
    careerRoles: [String],
    resumeFile: String,
    jobMatches: [
  {
    role: String,
    match: Number,
    missing: [String],
  },
],
  },
  { timestamps: true }
  
);


module.exports = mongoose.model("Result", resultSchema);