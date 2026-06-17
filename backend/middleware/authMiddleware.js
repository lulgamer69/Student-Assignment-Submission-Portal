const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  try {
    let token;

    // token from header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // DB se FULL USER fetch
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // req.user me full user daal
    req.user = user;

    next();

  } catch (error) {
    res.status(401).json({ message: "Token failed" });
  }
};

// 🔐 TEACHER ONLY MIDDLEWARE
exports.teacherOnly = (req, res, next) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({ message: "❌ Only teachers can perform this action" });
  }
  next();
};
