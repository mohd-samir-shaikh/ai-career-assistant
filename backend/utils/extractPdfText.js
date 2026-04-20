const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractPdfText = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("PDF ERROR:", error);
    throw new Error("Failed to extract PDF text");
  }
};

module.exports = extractPdfText;