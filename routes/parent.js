const express = require("express");
const router = express.Router();
const {
  getAllParents,
  getParentById,
  updateParent,
  deleteParent,
} = require("../controllers/parentController");

router.get("/school_id", getAllParents);

router.get("/school_id/:parent_id", getParentById);

router.put("/school_id/:parent_id", updateParent);

router.delete("/:school_id/:parent_id", deleteParent);

module.exports = router;
