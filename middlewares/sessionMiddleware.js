const Session = require('../models/Session');

exports.ensureSingleSession = async (req, res, next) => {
  const userId = req.user.id;
  const existingSession = await Session.findOne({ userId });

  if (existingSession && existingSession.deviceId !== req.deviceId) {
    return res.status(403).json({ error: 'Session already active on another device.' });
  }

  next();
};
