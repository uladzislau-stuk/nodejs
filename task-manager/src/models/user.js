const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(val) {
      if (!validator.isEmail(val)) {
        throw new Error('Email is invalid')
      }
    }
  },
  password: {
    type: String,
    require: true,
    minLength: 7,
    trim: true,
    validate(value) {
      if (value.toLocaleString().includes('password')) {
        throw new Error('Password cannot contain password')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(val) {
      // for email, phones and other things it's better to use
      // time-proven libraries as validator
      if (val < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  }
})

module.exports = User
