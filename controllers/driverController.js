const User = require("../models/User");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

exports.getDrivers = async (req, res) => {
  try {
    console.log("Fetching drivers...");
    const drivers = await User.find({ role: "Driver" });
    res.status(200).json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const userid =req.params.id
    const driver = await User.findById(userid);


    if (!driver || driver.role !== "Driver")
      return res.status(404).json({ message: "Driver not found" });
    res.status(200).json(driver);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching driver", error: err.message });
  }
};

exports.updateDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    const updateData = req.body;

    console.log("Received update request:", {
      driverId,
      updateData,
    });
    const updatedDriver = await User.findByIdAndUpdate(driverId, updateData, {
      new: true,
    });

    if (!updatedDriver) {
      return res.status(404).json({ message: "Driver not found" });
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
    const driverId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedDriver = await User.findByIdAndDelete(driverId);
    if (!deletedDriver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ message: "Driver deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting driver", error: err.message });
  }
};

