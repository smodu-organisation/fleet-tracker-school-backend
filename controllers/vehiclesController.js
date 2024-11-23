const { Vehicle, Route, VehicleMaintenance, FuelTracking } = require('../models');

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVehicleById = async (req, res) => {
  const { id } = req.params;

  try {
    const vehicle = await Vehicle.findByPk(id, {
      include: [
        { model: Route, as: 'assigned_route' },
        { model: VehicleMaintenance, as: 'maintenance_history' },
        { model: FuelTracking, as: 'fuel_history' },
      ],
    });

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createVehicle = async (req, res) => {
  const {
    school_id,
    vehicle_number,
    type,
    status,
    fuel_status,
    current_location,
    last_maintenance_date,
  } = req.body;

  try {
    const newVehicle = await Vehicle.create({
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
  const updates = req.body;

  try {
    const [rowsUpdated] = await Vehicle.update(updates, { where: { id } });

    if (!rowsUpdated) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteVehicle = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await Vehicle.destroy({ where: { id } });

    if (!rowsDeleted) return res.status(404).json({ message: 'Vehicle not found' });

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignRouteToVehicle = async (req, res) => {
  const { id } = req.params; 
  const { route_id } = req.body;

  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const route = await Route.findByPk(route_id);
    if (!route) return res.status(404).json({ message: 'Route not found' });

    await vehicle.update({ assigned_route_id: route_id });
    res.status(200).json({ message: 'Route assigned successfully', vehicle });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMaintenanceHistory = async (req, res) => {
  const { id } = req.params; 

  try {
    const maintenanceHistory = await VehicleMaintenance.findAll({ where: { vehicle_id: id } });

    if (!maintenanceHistory.length)
      return res.status(404).json({ message: 'No maintenance history found for this vehicle' });

    res.status(200).json(maintenanceHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFuelHistory = async (req, res) => {
  const { id } = req.params;

  try {
    const fuelHistory = await FuelTracking.findAll({ where: { vehicle_id: id } });

    if (!fuelHistory.length)
      return res.status(404).json({ message: 'No fuel history found for this vehicle' });

    res.status(200).json(fuelHistory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateVehicleStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    await vehicle.update({ status });
    res.status(200).json({ message: 'Vehicle status updated successfully', vehicle });
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
  assignRouteToVehicle,
  getMaintenanceHistory,
  getFuelHistory,
  updateVehicleStatus,
};
