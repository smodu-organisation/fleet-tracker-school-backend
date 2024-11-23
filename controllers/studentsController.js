const { Student, School, User, Route } = require('../models');

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      include: [
        { model: School, as: 'school' },
        { model: User, as: 'parent' },
        { model: Route, as: 'route' },
      ],
    });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findByPk(id, {
      include: [
        { model: School, as: 'school' },
        { model: User, as: 'parent' },
        { model: Route, as: 'route' },
      ],
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStudent = async (req, res) => {
  const {
    school_id,
    parent_id,
    name,
    age,
    grade,
    note,
    assigned_route_id,
    pickup_time,
    dropoff_time,
    house_latitude,
    house_longitude,
  } = req.body;
  try {
    const newStudent = await Student.create({
      school_id,
      parent_id,
      name,
      age,
      grade,
      note,
      assigned_route_id,
      pickup_time,
      dropoff_time,
      house_latitude,
      house_longitude,
    });
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const [rowsUpdated] = await Student.update(updates, { where: { id } });
    if (!rowsUpdated) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await Student.destroy({ where: { id } });
    if (!rowsDeleted) return res.status(404).json({ message: 'Student not found' });
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignRouteToStudent = async (req, res) => {
  const { id } = req.params;
  const { route_id } = req.body;
  try {
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.assigned_route_id = route_id;
    await student.save();
    res.status(200).json({ message: 'Route assigned successfully', student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  assignRouteToStudent,
};
