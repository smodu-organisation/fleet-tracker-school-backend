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

    if (!school_id || !route_name || !start_location || !end_location) {
      return res.status(400).json({ error: "Missing required fields." });
    }

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
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
      console.error(err);
    }
  }
};

exports.getAllRoutes = async (req, res) => {
  try {
    const { school_id } = req.body;


    const routes = await Route.find({school_id});
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const { school_id, route_id } = req.params;

    if (!school_id) {
      return res.status(400).json({
        error: "School ID is required.",
      });
    }

    if (!route_id) {
      return res.status(400).json({
        error: "Route ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(school_id)) {
      return res.status(400).json({
        error: "Invalid school ID format.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(route_id)) {
      return res.status(400).json({
        error: "Invalid route ID format.",
      });
    }

    const route = await Route.findOne({
      school_id: school_id,
      _id: route_id,
    });

    if (!route) {
      return res.status(404).json({
        error: "Route not found for the provided school ID and route ID.",
      });
    }

    res.status(200).json(route);
  } catch (err) {
    console.error("Error fetching route:", err);
    res.status(500).json({
      error: "An internal server error occurred.",
    });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { school_id, route_id } = req.params;
    const updates = req.body;

    if (!route_id || !school_id) {
      return res
        .status(400)
        .json({ error: "Both route ID and school ID are required." });
    }

    const updatedRoute = await Route.findOneAndUpdate(
      { _id: route_id, school_id },
      updates,
      { new: true }
    );

    if (!updatedRoute) {
      return res.status(404).json({
        error: "Route not found for the provided school and route ID.",
      });
    }

    res.json(updatedRoute);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRoute = async (req, res) => {
  try {
    const { school_id , route_id } = req.params;
    
    if (!route_id || !school_id) {
      return res
        .status(400)
        .json({ error: "Both route ID and school ID are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(school_id)) {
      return res.status(400).json({ error: "Invalid route ID." });
    }
    if (!mongoose.Types.ObjectId.isValid(route_id)) {
      return res.status(400).json({ error: "Invalid route ID." });
    }
    const deletedRoute = await Route.findByIdAndDelete({
      school_id: school_id,
      _id: route_id
    });
    if (!deletedRoute) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json({ message: "Route deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
