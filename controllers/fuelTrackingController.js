const { FuelTracking, Vehicles } = require('../models');

const getAllFuelTracking = async (req, res) => {
  try {
    const fuelRecords = await FuelTracking.findAll({
      include: [{ model: Vehicles, attributes: ['vehicle_number'] }],
    });
    res.status(200).json(fuelRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFuelTrackingByVehicle = async (req, res) => {
  const { vehicle_id } = req.params;

  try {
    const fuelRecords = await FuelTracking.findAll({
      where: { vehicle_id },
      include: [{ model: Vehicles, attributes: ['vehicle_number'] }],
    });

    if (!fuelRecords) return res.status(404).json({ message: 'No fuel tracking records found for this vehicle' });

    res.status(200).json(fuelRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFuelTracking = async (req, res) => {
  const { vehicle_id, refill_date, fuel_amount, is_scheduled } = req.body;

  try {
    const newFuelRecord = await FuelTracking.create({
      vehicle_id,
      refill_date,
      fuel_amount,
      is_scheduled,
    });

    res.status(201).json(newFuelRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFuelTracking = async (req, res) => {
  const { id } = req.params;

  try {
    const rowsDeleted = await FuelTracking.destroy({ where: { id } });

    if (!rowsDeleted) return res.status(404).json({ message: 'Fuel tracking record not found' });

    res.status(200).json({ message: 'Fuel tracking record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFuelTracking,
  getFuelTrackingByVehicle,
  createFuelTracking,
  deleteFuelTracking,
};
