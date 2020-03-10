const express = require('express');

const auth = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

router.post('/', auth, async (req, res) => {
    const user = {_id: req.user._id, username: req.user.username, token: req.user.token};

    console.log(user);

    const task = new Task({
        ...req.body,
        user: user._id,
    });

    await task.save();

    return res.send(task);
});

router.get('/', auth, async (req, res) => {
    const user = {_id: req.user._id, username: req.user.username, token: req.user.token};
    try {
        const tasks = await Task.find({user: user._id});

        res.send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.put('/:id', auth, async (req, res) => {
    const user = {_id: req.user._id, username: req.user.username, token: req.user.token};

    try {
        const task = await Task.findById(req.params.id);

        if (task.user.equals(user._id)) {
            task.title = req.body.title;
            task.description = req.body.description;
            task.status = req.body.status;

            await task.save();
            return res.send(task);
        } else {
            return res.status(404).send({error: 'Nothing to find'})
        }
    } catch (error) {
        return res.status(401).send({error});
    }
});

router.delete('/:id', auth, async (req, res) => {
    const user = {_id: req.user._id, username: req.user.username, token: req.user.token};

    try {
        const task = await Task.findById(req.params.id);

        if (task.user.equals(user._id)) {
            task.delete();
            res.send({message: "Task was successfully deleted"});
        }

        return res.status(404).send({message: 'Oops, cannot find this stuff'});

    } catch (error) {
        return res.status(500).send({error});
    }

});

module.exports = router;