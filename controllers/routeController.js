const mongoose = require("mongoose");
const Route = require("../models/route");

exports.createRoute = async (req, res) => {
  try {
    const {
      school_id,
      route_name,
      start_location,
      end_location,
      driver_id,
      vehicle_id,
      assigned_students,
    } = req.body;

    const newRoute = new Route({
      school_id,
      route_name,
      start_location,
      end_location,
      driver_id,
      vehicle_id,
      assigned_students,
    });

    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const { school_id } = req.query;

    const filter = {};
    if (school_id) filter.school_id = school_id;

    const routes = await Route.find(filter);
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findById(id)
      .populate("school_id", "name")
      .populate("driver_id", "firstName lastName")
        .populate("vehicle_id", "vehicle_number")
      .populate("assigned_students", "name");

    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json(route);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedRoute = await Route.findByIdAndUpdate(id, updates, {
      new: true,
    })
      .populate("school_id", "name")
      .populate("driver_id", "firstName lastName")
      .populate("vehicle_id", "vehicle_number")
      .populate("assigned_students", "name");

    if (!updatedRoute) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json(updatedRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoute = await Route.findByIdAndDelete(id);
    if (!deletedRoute) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
