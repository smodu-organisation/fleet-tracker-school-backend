const User = require("../models/User");
const mongoose = require("mongoose");

exports.getDrivers = async (req, res) => {
  try {
    const { school_id } = req.params; // school_id from route
    console.log(`Fetching drivers for school ID: ${school_id}...`);
    const drivers = await User.find({ role: "Driver", school_id: school_id }); // Filtering by school ID
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const { school_id, driver_id } = req.params; 
    const driver = await User.findOne({ _id: driver_id, school_id: school_id, role: "Driver" });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.status(200).json(driver);
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({ message: "Error fetching driver", error: error.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const { school_id, driver_id } = req.params;
    const updateData = req.body;

    console.log("Received update request:", {
      driverId: driver_id,
      updateData,
    });

    const updatedDriver = await User.findOneAndUpdate(
      { _id: driver_id, school_id: school_id, role: "Driver" },
      updateData,
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found or not associated with this school" });
    }

    res.status(200).json(updatedDriver);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const { school_id, driver_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(driver_id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedDriver = await User.findOneAndDelete({ _id: driver_id, school_id: school_id, role: "Driver" });

    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found or not associated with this school" });
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({ message: "Error deleting driver", error: error.message });
  }
};
