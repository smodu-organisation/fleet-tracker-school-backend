const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  school_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: function() {
      return this.role !== 'Manager'; 
    },
    default: null 
  },
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password_hash: { 
    type: String, 
    required: true 
  },
  resetCode: {
    type: Number,
    required: false,
  },
  resetCodeExpiry: {
    type: Date,
    required: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  role: { 
    type: String, 
    enum: ['Manager', 'Parent', 'Driver'], 
    required: true 
  },
  phone: { 
    type: String, 
    required: false, 
    validate: {
      validator: function(value) {
        return /^(\+\d{1,3}[- ]?)?\d{10}$/.test(value);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  is_active: { 
    type: Boolean, 
    default: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  updated_at: { 
    type: Date, 
    default: Date.now 
  }
});

userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
