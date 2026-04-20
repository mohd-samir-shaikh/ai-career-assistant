const axios = require("axios");

const USE_DUMMY = false;

// ================= RESUME ANALYSIS =================
const analyzeText = async (text) => {
  try {
    if (USE_DUMMY) {
      return {
        skills: ["HTML", "CSS", "JavaScript"],
        missingSkills: ["TypeScript", "Next.js"],
        suggestions: ["Add projects", "Improve resume"],
        careerRoles: ["Frontend Developer"],
      };
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `You are an expert AI career assistant.

Analyze the resume and return ONLY valid JSON in this format:

{
  "skills": [],
  "missingSkills": [],
  "suggestions": [],
  "careerRoles": []
}

STRICT RULES:
- ALWAYS return at least:
  - 5 skills
  - 3 missingSkills
  - 3 suggestions
  - 2 careerRoles
- Never return empty arrays
- Missing skills must be realistic and relevant
- Suggestions must be actionable and specific
- Do NOT return explanation text
- ONLY JSON

Resume:
${text}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

try {
  return JSON.parse(content);
} catch (err) {
  console.log("JSON PARSE ERROR:", content);
  return {
    skills: [],
    missingSkills: ["Node.js", "API Development", "Git"],
    suggestions: ["Add projects", "Improve resume", "Learn backend"],
    careerRoles: ["Full Stack Developer"]
  };
}

  } catch (error) {
    console.log("ANALYZE TEXT ERROR:", error.response?.data || error.message);
    throw error;
  }
};
// ================= CHAT AI =================
const chatWithAI = async (prompt) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // ✅ ALWAYS return TEXT (NOT JSON)
    return response.data.choices[0].message.content;

  } catch (error) {
    console.log("CHAT AI ERROR:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = { analyzeText, chatWithAI };