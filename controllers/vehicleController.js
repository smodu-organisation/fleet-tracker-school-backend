const Vehicle = require('../models/Vehicle');

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { school_id, vehicle_number, type, status, fuel_status, current_location, last_maintenance_date } = req.body;

    const newVehicle = new Vehicle({
      school_id,
      vehicle_number,
      type,
      status,
      fuel_status,
      current_location,
      last_maintenance_date,
    });

    const savedVehicle = await newVehicle.save();
    res.status(201).json({ message: 'Vehicle created successfully', data: savedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error creating vehicle', error: error.message });
  }
};

// Get all vehicles for a manager
exports.getAllVehicles = async (req, res) => {
  try {
    const { school_id } = req.query; 
    if (!school_id) {
      return res.status(400).json({ message: 'School ID is required' });
    }

    const vehicles = await Vehicle.find({ school_id });
    res.status(200).json({ message: 'Vehicles fetched successfully', data: vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicles', error: error.message });
  }
};

// Get a single vehicle
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await Vehicle.findById(id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle fetched successfully', data: vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vehicle', error: error.message });
  }
};

// Update a vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    updates.updated_at = new Date(); 

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle updated successfully', data: updatedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error updating vehicle', error: error.message });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedVehicle = await Vehicle.findByIdAndDelete(id);

    if (!deletedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle deleted successfully', data: deletedVehicle });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
  }
};
