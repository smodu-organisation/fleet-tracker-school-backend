const { Route, School, User, Vehicle, Student } = require('../models');

const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.findAll({
      include: [
        { model: School, as: 'school' },
        { model: User, as: 'driver' },
        { model: Vehicle, as: 'vehicle' },
        { model: Student, as: 'students' }, 
      ],
    });
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRouteById = async (req, res) => {
  const { id } = req.params;
  try {
    const route = await Route.findByPk(id, {
      include: [
        { model: School, as: 'school' },
        { model: User, as: 'driver' },
        { model: Vehicle, as: 'vehicle' },
        { model: Student, as: 'students' },
      ],
    });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json(route);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRoute = async (req, res) => {
  const {
    school_id,
    route_name,
    start_location,
    end_location,
    driver_id,
    vehicle_id,
    assigned_students,
    route_distance,
    estimated_time,
  } = req.body;
  try {
    const newRoute = await Route.create({
      school_id,
      route_name,
      start_location,
      end_location,
      driver_id,
      vehicle_id,
      assigned_students,
      route_distance,
      estimated_time,
    });
    res.status(201).json(newRoute);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRoute = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const [rowsUpdated] = await Route.update(updates, { where: { id } });
    if (!rowsUpdated) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ message: 'Route updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoute = async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await Route.destroy({ where: { id } });
    if (!rowsDeleted) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignStudentsToRoute = async (req, res) => {
  const { id } = req.params;
  const { student_ids } = req.body; 
  try {
    const route = await Route.findByPk(id);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    route.assigned_students = student_ids;
    await route.save();
    res.status(200).json({ message: 'Students assigned successfully', route });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoutesBySchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const routes = await Route.findAll({ where: { school_id } });
    res.status(200).json(routes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
  assignStudentsToRoute,
  getRoutesBySchool,
};
