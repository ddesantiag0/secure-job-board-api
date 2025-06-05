const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    console.log("📥 Incoming Register Body:", req.body);

    const { name, email, password, role } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !role) {
      console.log("⚠️ Missing fields in register request");
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check for duplicate user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Duplicate email:", email);
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password, role });
    const token = generateToken(user);

    console.log("✅ User created:", user.email);

    res.status(201).json({
      msg: "✅ Registered successfully",
      user: { id: user._id, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message || err);
    res.status(500).json({ error: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = generateToken(user);

    res.status(200).json({
      msg: "✅ Logged in",
      user: { id: user._id, name: user.name, role: user.role },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message || err);
    res.status(500).json({ error: "Server error" });
  }
};