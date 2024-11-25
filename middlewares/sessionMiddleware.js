const Session = require('../models/Session');

exports.ensureSingleSession = async (req, res, next) => {
  const userId = req.user.id;
  const deviceId = req.deviceId; 

  const existingSession = await Session.findOne({ userId });

  if (existingSession && existingSession.deviceId !== deviceId) {
    return res.status(403).json({ error: 'Session already active on another device.' });
  }

  next();
};
