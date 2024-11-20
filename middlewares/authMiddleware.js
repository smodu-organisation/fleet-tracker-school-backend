const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

function verifyRole(role) {
  return (req, res, next) => {
    if (req.role !== role) {
      return res.status(403).json({ error: 'Access denied. Unauthorized role.' });
    }
    next();
  };
}

module.exports = { verifyToken, verifyRole };
