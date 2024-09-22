const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: { type: String, required: true },
});

// Middleware to hash password before saving user
userSchema.pre('save', async function (next) {
    console.log('Document Type:', this.constructor.name); 
    if (!this.isModified('password')) return next();
    try {
      this.password = await bcrypt.hash(this.password, 10);
      next();
    } catch (err) {
      next(err);
    }
  });

module.exports = mongoose.model('User', userSchema);
