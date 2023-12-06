const jwt = require('jsonwebtoken');
require('dotenv').config();

// Authentication Middleware
const authenticateJWT = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Token not found" });
    }

    try {
      const payload = jwt.verify(token, '00');
      req.user = payload;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ success: false, message: "Invalid Token" });
    }
  } else {
    res.status(403).json({ message: "Token not found" });
  }
};

// Authorization Middleware
const isUser = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "USER") {
      return res.status(401).json({ success: false, message: "Unauthorized Access, This is a route for Users only" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "User role is not matching" });
  }
};

const isAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(401).json({ success: false, message: "Unauthorized Access, This is a route for ADMIN only" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "User role is not matching" });
  }
};

module.exports = { authenticateJWT, isAdmin,isUser };
