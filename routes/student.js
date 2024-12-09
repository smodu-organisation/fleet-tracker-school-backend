const express = require("express");
const router = express.Router();
const {createStudent ,getAllStudents ,getStudentById ,updateStudent, deleteStudent} = require("../controllers/studentController");

router.post("/create", createStudent);

router.get("/:school_id", getAllStudents);

router.get("/:school_id/:student_id/", getStudentById);

router.put("/:school_id/:student_id/", updateStudent);

router.delete("/:school_id/:student_id/", deleteStudent);

module.exports = router;
