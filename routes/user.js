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

const router = express.Router();

router.post("/auto-register", autoRegister);
router.post("/:userId/resend-credentials", resendCredentials);

router.get("/drivers", getDrivers);
router.get("/drivers/:id", getDriverById);
router.put("/drivers/:id", updateDriver);
router.delete("/drivers/:id", deleteDriver);
module.exports = router;