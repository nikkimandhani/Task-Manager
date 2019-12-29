const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    }
    catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({ user, token })
    }
    catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const users = await User.findOne({'tokens.token': token})
        users.tokens = users.tokens.filter((token) => {
            token.token !== req.token
        })
                     await users.save();
        res.send(users)
    }
    catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const users = await User.find({'tokens.token': token})
       // console.log(req)
                 res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
})



router.get('/user/:id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/user/:id', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.patch('/user/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    console.log(updates)
    let isValidUpdate = updates.every(key => allowedUpdates.includes(key))

    if (!isValidUpdate) {
        return res.status(400).send({ 'error': 'Invalid updates' })
    }
    try {
        const user = await User.findById(req.params.id);
        updates.forEach(key => user[key] = req.body[key])
        await user.save();
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})
module.exports = router
