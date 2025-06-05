// server.js
// Backend API server for Secure Job Board
// David De Santiago | UCSD | CSE 100 + 120 + 127 inspired backend structure

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");

const app = express();

// ===== Global Middleware =====
app.use(express.json());        // Parse JSON request bodies
app.use(cors());                // Enable CORS for all origins
app.use(helmet());              // Set secure HTTP headers
app.use(morgan("dev"));         // Log HTTP requests to console

// ===== Rate Limiting (CSE 127-style defense) =====
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,     // 15 minutes
  max: 100,                     // Limit each IP to 100 requests per window
  message: "Too many requests, please try again later." // Optional custom message
});
app.use(limiter);

// ===== Routes =====
app.use("/api/auth", authRoutes);

// ===== Test Routes =====
app.get("/api/test", (req, res) => {
  res.json({ msg: "Unprotected test route working fine ✅" });
});

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "🚀 Secure Job Board API by David is live" });
});

// ===== Catch-All (404) =====
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===== MongoDB Connection =====
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
