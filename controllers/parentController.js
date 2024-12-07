const User = require('../models/User'); 
const mongoose = require('mongoose');


exports.getAllParents = async (req, res) => {
  try {
    const { school_id } = req.params; 

    const parents = await User.find({ role: 'Parent', school_id: school_id });

    if (parents.length === 0) {
      return res.status(404).json({ message: 'No parents found for this school.' });
    }

    res.status(200).json(parents);
  } catch (err) {
    console.error('Error fetching parents:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};


exports.getParentById = async (req, res) => {
  try {
    const { parent_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parent_id)) {
      return res.status(400).json({ error: 'Invalid parent ID.' });
    }

    const parent = await User.findById(parent_id).populate('school_id');

    if (!parent || parent.role !== 'Parent') {
      return res.status(404).json({ error: 'Parent not found.' });
    }

    res.status(200).json(parent);
  } catch (err) {
    console.error('Error fetching parent:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.updateParent = async (req, res) => {
  try {
    const { parent_id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(parent_id)) {
      return res.status(400).json({ error: 'Invalid parent ID.' });
    }

    const updatedParent = await User.findByIdAndUpdate(parent_id, updates, { new: true });

    if (!updatedParent || updatedParent.role !== 'Parent') {
      return res.status(404).json({ error: 'Parent not found.' });
    }

    res.status(200).json(updatedParent);
  } catch (err) {
    console.error('Error updating parent:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

exports.deleteParent = async (req, res) => {
  try {
    const { school_id , parent_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parent_id)) {
      return res.status(400).json({ error: 'Invalid parent ID.' });
    }
    if (!mongoose.Types.ObjectId.isValid(school_id)) {
      return res.status(400).json({ error: 'Invalid Shool ID.' });
    }

    const deletedParent = await User.findByIdAndDelete({school_id: school_id , _id: parent_id});

    if (!deletedParent || deletedParent.role !== 'Parent') {
      return res.status(404).json({ error: 'Parent not found.' });
    }

    res.status(200).json({ message: 'Parent deleted successfully.' });
  } catch (err) {
    console.error('Error deleting parent:', err);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};
