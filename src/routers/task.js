import express from 'express'
import auth from '../middleware/auth.js'
import Task from '../models/Tasks.js'
import User from '../models/User.js'

const router = express.Router()

router.post('/tasks', auth, async(req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })

  try {
      await task.save()
      res.status(201).send(task)
  } catch (e) {
      res.status(404).send(e)
  }
})

router.get('/tasksAll', async (req, res) => {
  const tasks = await Task.find({})
  res.send(tasks)
})

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
  const match = {}
  const sort = {}

  if(req.query.completed) {
    match.completed = req.query.completed === "true"
  }

  if(req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }

  try {
    req.user.populate({
      path: 'tasks', match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        select: 'description completed -_id',
        sort
      }
    })
    .then((user) => res.send(user.tasks))
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) {
      return res.status(404).send("Task not found")
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

  if(!isValidOperation) {
    res.status(400).send({error: 'Invalid updates'})
  }
  try {
    const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
    if(!task) { return res.status(400).send("Cannot UPDATE. Task not found!") }
    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
    if(!task) {
      return res.status(400).send("Cannot DELETE. Task not found!")
    }
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

export default router