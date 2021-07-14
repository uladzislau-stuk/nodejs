const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

// curl -X POST -H "Content-Type: application/json" -d '{"name": "Vlad", "email": "vlad_stuk@mail.ru", "password": "12"}'  http://127.0.0.1:3000/users
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    // TODO: generateAuthToken not available here
    const token = await user.generateAuthToken()
    res.status(201).send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send(e)
  }
})

// the second parameter will run before third one
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
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

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => (
      token.token !== req.token
    ))
    await req.user.save()
    
    res.send()
  } catch (e) {
    res.status(400).send({error: 'Unable to logout'})
  }
})

// variation of logout that allows to logout all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    
    res.send()
  } catch (e) {
    res.status(400).send({error: 'Unable to logout'})
  }
})

// Usually the routes for updating resources more complex
router.patch('/users/me', auth, async (req, res) => {
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
    
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

// Example without authentication
// router.patch('/users/:id', async (req, res) => {
//   try {
//     const updates = Object.keys(req.body)
//     // props we would like someone to be able to change
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//
//     const isValidOperation = updates.every(update => (
//       allowedUpdates.includes(update)
//     ))
//
//     if (!isValidOperation) {
//       return res.status(400).send({
//         error: 'Invalid update'
//       })
//     }
//
//     const user = await User.findById(req.params.id)
//
//     if (!user) {
//       return res.status(404).send()
//     }
//
//     updates.forEach(update => user[update] = req.body[update])
//
//     // allows userSchema.pre('save', () => {}) consistently running
//     await user.save()
//
//     res.send(user)
//   } catch (e) {
//     res.status(400).send(e)
//   }
// })

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    
    res.send({
      user,
      token
    })
  } catch (e) {
    res.status(400).send()
  }
})

router.delete('/users/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id)
    //
    // if (!user) {
    //   return res.status(404).send()
    // }
    await req.user.remove()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
