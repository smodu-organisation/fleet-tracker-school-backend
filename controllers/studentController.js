const mongoose = require('mongoose');
const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
        const {
            school_id,
            parent_id,
            name,
            age,
            grade,
            note,
            assigned_route_id,
            pickup_time,
            dropoff_time,
            house_latitude,
            house_longitude
        } = req.body;

        if (!school_id || !name || !age || !grade) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const newStudent = new Student({
            school_id,
            parent_id,
            name,
            age,
            grade,
            note,
            assigned_route_id,
            pickup_time,
            dropoff_time,
            house_latitude,
            house_longitude
        });

        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (err) {
        if (err.name === 'ValidationError') {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: err.message });
            console.error(err);
        }
    }
};

exports.getAllStudents = async (req, res) => {
    console.log('Get all students request received');
    try {
        const { school_id } = req.params;
        console.log('School ID:', school_id);

        if (!school_id) {
            return res.status(400).json({ error: 'School ID is required' });
        }

        const students = await Student.find({ school_id });
        res.json(students);
    } catch (err) {
        console.error('Error in getAllStudents:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};



exports.getStudentById = async (req, res) => {
    try {
        const { school_id, student_id } = req.params;

        if (!student_id || !mongoose.Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ error: 'Invalid or missing student ID.' });
        }

        const student = await Student.findOne({ _id: student_id, school_id })
            .populate('parent_id')
            .populate('assigned_route_id');

        if (!student) {
            return res.status(404).json({ error: 'Student not found.' });
        }

        res.status(200).json(student);
    } catch (err) {
        console.error('Error fetching student:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};


exports.updateStudent = async (req, res) => {
    try {
        const { school_id, student_id } = req.params;
        const updates = req.body;

        if (!student_id || !mongoose.Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ error: 'Invalid or missing student ID.' });
        }

        const updatedStudent = await Student.findOneAndUpdate(
            { _id: student_id, school_id },
            updates,
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found or does not belong to the specified school.' });
        }

        res.json(updatedStudent);
    } catch (err) {
        console.error('Error updating student:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};


// Delete Student
exports.deleteStudent = async (req, res) => {
    try {
        const { school_id, student_id } = req.params;

        // Validate the student ID
        if (!student_id || !mongoose.Types.ObjectId.isValid(student_id)) {
            return res.status(400).json({ error: 'Invalid or missing student ID.' });
        }

        // Find and delete the student by matching both school_id and student_id
        const deletedStudent = await Student.findOneAndDelete({ _id: student_id, school_id });

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found or does not belong to the specified school.' });
        }

        res.json({ message: 'Student deleted successfully.' });
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};
