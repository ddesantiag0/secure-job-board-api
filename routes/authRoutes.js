const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
router.post("/register", register);

// @route   POST /api/auth/login
router.post("/login", login);

// @route   GET /api/auth/me
router.get("/me", protect, (req, res) => {
  console.log("🧠 /me route hit");
  res.json({
    msg: "✅ You accessed a protected route!",
    user: req.user,
  });
});

// ✅ Export router LAST
module.exports = router;