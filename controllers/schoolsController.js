const { School, User } = require('../models');

const getAllSchools = async (req, res) => {
  try {
    const schools = await School.findAll({
      include: [{ model: User, as: 'manager' }],
    });
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchoolById = async (req, res) => {
  const { id } = req.params;
  try {
    const school = await School.findByPk(id, {
      include: [{ model: User, as: 'manager' }],
    });
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.status(200).json(school);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSchool = async (req, res) => {
  const {
    school_name,
    subscription_plan,
    subscription_status,
    subscription_expiry_date,
    storage_usage,
    manager_id,
  } = req.body;
  try {
    const newSchool = await School.create({
      school_name,
      subscription_plan,
      subscription_status,
      subscription_expiry_date,
      storage_usage,
      manager_id,
    });
    res.status(201).json(newSchool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSchool = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const [rowsUpdated] = await School.update(updates, { where: { id } });
    if (!rowsUpdated) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ message: 'School updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSchool = async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await School.destroy({ where: { id } });
    if (!rowsDeleted) return res.status(404).json({ message: 'School not found' });
    res.status(200).json({ message: 'School deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
};
