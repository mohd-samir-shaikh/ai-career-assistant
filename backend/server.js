const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
console.log("SERVER FILE IS RUNNING ");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();


connectDB();                                                //connect to database


app.use(cors({                                                // CORS
  origin: "*",
}));


app.options(/.*/, cors());                                    // CORS preflight


app.use(express.json());                                         // JSON parsing                              


app.use("/api/auth", authRoutes);                                       // Auth routes
app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static("uploads"));


app.get("/check", (req, res) => {                                       // CHECK test route
  res.send("CHECK OK");
});


app.get("/", (req, res) => {                                                              // Root route
  res.send("AI Career Assistant API Running...");
});


console.log("MONGO:", process.env.MONGO_URI ? "OK" : "MISSING");                          // Check MongoDB URI
console.log("JWT:", process.env.JWT_SECRET ? "OK" : "MISSING");


const PORT = process.env.PORT || 5000;                                                      // Start server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});