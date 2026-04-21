console.log("SERVER FILE IS RUNNING 🚀");
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// ✅ CONNECT DATABASE
connectDB();

// ✅ CORS (FIXED - WORKS FOR LOCAL + LIVE)
app.use(cors({
  origin: "*",
}));

// ✅ HANDLE PREFLIGHT REQUESTS
app.options(/.*/, cors());

// ✅ MIDDLEWARE
app.use(express.json());

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static("uploads"));

// ✅ TEST ROUTE
app.get("/check", (req, res) => {
  res.send("CHECK OK");
});

// ✅ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("AI Career Assistant API Running...");
});

// ✅ DEBUG ENV
console.log("MONGO:", process.env.MONGO_URI ? "OK" : "MISSING");
console.log("JWT:", process.env.JWT_SECRET ? "OK" : "MISSING");

// ✅ START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});