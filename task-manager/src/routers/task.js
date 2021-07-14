const express = require('express')
// User, Task are cursors (pointers to collections)
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

// curl -X POST -H "Content-Type: application/json" -d '{"description": "my new task", "completed": true}'  http://127.0.0.1:3000/tasks
router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user._id
    })
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// curl -X GET -H "Content-Type: application/json" http://127.0.0.1:27017/users
router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({owner: req.user._id})
    // another way to get tasks await req.user.populate('tasks').execPopulate()
    res.status(201).send(tasks)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id
    // const task = await Task.findById(id).exec()
    const task = await Task.findOne({_id, owner: req.user._id})
    
    if (!task) {
      return res.status(404).send()
    }
    
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))
  
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }
  
  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    
    // const task = await Task.findByIdAndUpdate(id, req.body, {
    //   // return new user after update
    //   new: true,
    //   // run validation, check format data match
    //   runValidators: true
    // })
    
    if (!task) {
      return res.status(404).send()
    }
    
    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// 3 possible outcomes
// task deletion success
// task not found
// task deletion error
router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // + owner
    // + when task isn't exist
    // + delete task by another user
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    // const task = await Task.findByIdAndDelete(req.params.id)
    
    if (!task) {
      return res.status(404).send()
    }
    
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
