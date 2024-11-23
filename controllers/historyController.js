const { History, Student, Vehicle } = require('../models');

const getAllHistory = async (req, res) => {
  try {
    const history = await History.findAll({
      include: [
        { model: Student, as: 'student', attributes: ['id', 'name'] },
      ],
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const historyRecord = await History.findByPk(id, {
      include: [
        { model: Student, as: 'student', attributes: ['id', 'name'] },
      ],
    });

    if (!historyRecord) return res.status(404).json({ message: 'History record not found' });

    res.status(200).json(historyRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHistoryByStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const historyRecords = await History.findAll({
      where: { student_id },
      include: [
        { model: Student, as: 'student', attributes: ['id', 'name'] },
      ],
    });

    if (!historyRecords.length)
      return res.status(404).json({ message: 'No history records found for this student' });

    res.status(200).json(historyRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createHistory = async (req, res) => {
  const { student_id, event_type, event_description, timestamp } = req.body;

  try {
    const newHistory = await History.create({
      student_id,
      event_type,
      event_description,
      timestamp: timestamp || new Date(),
    });

    res.status(201).json(newHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateHistory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const [rowsUpdated] = await History.update(updates, { where: { id } });

    if (!rowsUpdated) return res.status(404).json({ message: 'History record not found' });

    res.status(200).json({ message: 'History record updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await History.destroy({ where: { id } });

    if (!rowsDeleted) return res.status(404).json({ message: 'History record not found' });

    res.status(200).json({ message: 'History record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get history by event type ( "pickup", "dropoff")
const getHistoryByEventType = async (req, res) => {
  const { event_type } = req.params;

  try {
    const historyRecords = await History.findAll({
      where: { event_type },
    });

    if (!historyRecords.length)
      return res.status(404).json({ message: `No history records found for event type: ${event_type}` });

    res.status(200).json(historyRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllHistory,
  getHistoryById,
  getHistoryByStudent,
  createHistory,
  updateHistory,
  deleteHistory,
  getHistoryByEventType,
};
