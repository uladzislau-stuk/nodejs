const express = require('express')
// User, Task are cursors (pointers to collections)
const Task = require('../models/task')
const router = new express.Router()

// curl -X POST -H "Content-Type: application/json" -d '{"description": "my new task", "completed": true}'  http://127.0.0.1:3000/tasks
router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body)
    await task.staus(201).save()
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// curl -X GET -H "Content-Type: application/json" http://127.0.0.1:27017/users
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.status(201).send(tasks)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.get('/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id
    const task = await Task.findById(id).exec()
    
    if (!task) {
      return res.status(404).send()
    }
    
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))
  
  if (!isValidOperation) {
    return res.status(400).send({error: 'Invalid updates!'})
  }
  
  try {
    const id = req.params.id
    const task = await Task.findByIdAndUpdate(id, req.body, {
      // return new user after update
      new: true,
      // run validation, check format data match
      runValidators: true
    })
    
    if (!task) {
      return res.status(404).send()
    }
    
    res.send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

// 3 possible outcomes
// task deletion success
// task not found
// task delection error
router.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    
    if (!task) {
      return res.status(404).send()
    }
    
    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
