const express = require("express");
const router = express.Router();
const {
  createRoute,
  getAllRoutes,
  getRouteById,
  updateRoute,
  deleteRoute,
} = require("../controllers/routeController");

router.post("/create", createRoute);
router.get("/", getAllRoutes);
router.get("/:school_id/:route_id", getRouteById);
router.put("/:school_id/:route_id", updateRoute);
router.delete("/:school_id/:route_id", deleteRoute);

module.exports = router;
