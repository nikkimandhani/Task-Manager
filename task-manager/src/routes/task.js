const Task = require('../models/task');
const auth = require('../middleware/auth')
const express = require('express')
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    console.log(req.user)
    console.log(task)
    try {
        await task.save()
        res.status(201).send(task)
    } catch (err) {
        res.status(400).send(err)

    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({owner: req.user._id})
        //or
        await req.user.populate('tasks').execPopulate()
        res.send(req.user.tasks)
    }
    catch (error) {
        res.status(400).send(error)
    }
})

router.get('/task/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id
        const task = await Task.findByOneAndDelete({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/task/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    console.log(updates)
    let isValidUpdate = updates.every(key => allowedUpdates.includes(key))
    if (!isValidUpdate) {
        return res.status(400).send({ 'error': 'Invalid updates' })
    }
    try {
        const _id = req.params.id
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach(key => task[key] = req.body[key])
        await task.save();

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
module.exports = router;
