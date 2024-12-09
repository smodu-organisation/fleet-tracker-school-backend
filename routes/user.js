const express = require("express");
const {
  autoRegister,
  resendCredentials,
} = require("../controllers/userController");
const {
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");
const {
  getAllParents,
  getParentById,
  updateParent,
  deleteParent,
} = require("../controllers/parentController");

const router = express.Router();

router.post("/auto-register", autoRegister);
router.post("/:userId/resend-credentials", resendCredentials);
// Drivers
router.get("/drivers/:school_id", getDrivers);
router.get("/drivers/:school_id/:driver_id", getDriverById);
router.put("/drivers/:school_id/:driver_id", updateDriver);
router.delete("/drivers/:school_id/:driver_id", deleteDriver);

// Parents
router.get("/:school_id", getAllParents);
router.get("/:school_id/:parent_id", getParentById);
router.put("/:school_id/:parent_id", updateParent);
router.delete("/:school_id/:parent_id", deleteParent);

module.exports = router;