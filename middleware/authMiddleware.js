const jwt = require("jsonwebtoken");

// Middleware to protect private routes
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for "Bearer <token>"
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      // Verify token using JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach decoded payload to request (e.g., user ID + role)
      req.user = decoded;

      return next(); // Let the request continue
    } catch (err) {
      console.error("❌ Invalid token");
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  return res.status(401).json({ error: "No token provided" });
};

module.exports = protect;