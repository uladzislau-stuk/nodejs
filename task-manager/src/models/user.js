const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// it will provide as advantage of middleware
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
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
    required: true,
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
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
})

// TODO: It doesn't work as it should
// runs it every time when we .send({user})
// userSchema.methods.toJSON = async function () {
//   const user = this
//   const userObject = user.toObject()
//
//   // delete userObject.password
//   // delete userObject.tokens
//
//   return userObject
// }
userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  // payload uniquely identify the user
  const token = jwt.sign({ _id: user._id.toString() }, 'test123')
  
  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  
  if (!user) {
    throw new Error('Unable to login')
  }
  
  const isMatch = await bcrypt.compare(password, user.password)
  
  if (!isMatch) {
    throw new Error('Unable to login')
  }
  
  return user
}

userSchema.pre('save', async function (next) {
  // this gives access to the user that is going to be saved
  const user = this
  
  // true
  // 1) when user first is created
  // 2) when password is updated
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
