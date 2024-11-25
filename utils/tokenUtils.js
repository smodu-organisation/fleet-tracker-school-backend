const jwt = require('jsonwebtoken');

exports.generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, process.env.SECRET, { expiresIn });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
