const { Vehicles, Schools, Users } = require('../models');

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicles.findAll({
      include: [
        { model: Schools, attributes: ['school_name'] },
        { model: Users, attributes: ['name'] },
      ],
    });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicles.findByPk(id, {
      include: [
        { model: Schools, attributes: ['school_name'] },
        { model: Users, attributes: ['name'] },
      ],
    });

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVehicle = async (req, res) => {
  const { school_id, vehicle_number, type, status, fuel_status, current_location, last_maintenance_date } = req.body;

  try {
    const newVehicle = await Vehicles.create({
      school_id,
      vehicle_number,
      type,
      status,
      fuel_status,
      current_location,
      last_maintenance_date,
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { status, fuel_status, current_location, last_maintenance_date } = req.body;

  try {
    const [rowsUpdated] = await Vehicles.update(
      { status, fuel_status, current_location, last_maintenance_date },
      { where: { id } }
    );

    if (!rowsUpdated) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await Vehicles.destroy({ where: { id } });

    if (!rowsDeleted) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
