const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// curl -X POST -H "Content-Type: application/json" -d '{"name": "Vlad", "email": "vlad_stuk@mail.ru", "password": "12"}'  http://127.0.0.1:3000/users
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.status(201).send(users)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id
    const user = await User.findOne({_id}).exec()
    
    if (!user) {
      return res.status(404).send()
    }
    
    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Usually the routes for updating resources more complex
router.patch('/users/:id', async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    // props we would like someone to be able to change
    const allowedUpdates = ['name', 'email', 'password', 'age']
    
    const isValidOperation = updates.every(update => (
      allowedUpdates.includes(update)
    ))
    
    if (!isValidOperation) {
      return res.status(400).send({
        error: 'Invalid update'
      })
    }
    
    const id = req.params.id
    const user = await User.findByIdAndUpdate(id, req.body, {
      // return new user after update
      new: true,
      // run validation, check format data match
      runValidators: true
    })
    
    if (!user) {
      return res.status(404).send()
    }
    
    res.send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    
    if (!user) {
      return res.status(404).send()
    }
    
    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
