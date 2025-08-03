const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middlewares/firebaseAuth');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const Comment = require('../models/Comment');

// GET: List all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create new event  (organizers only)
router.post('/', firebaseAuth, async (req, res) => {
    try {
        const event = new Event({
            ...req.body,
            createdBy: req.user.uid
        });
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET: Single event
router.get('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id);
    res.json(event);
});

// PUT: Edit event
router.put('/:id', firebaseAuth, async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (event.createdBy !== req.user.uid) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    Object.assign(event, req.body);
    await event.save();
    res.json(event);
});

// RSVP to event
router.post('/:id/rsvp', firebaseAuth, async (req, res) => {
    const { status } = req.body;
    let rsvp = await RSVP.findOne({ event: req.params.id, user: req.user.uid });
    if (!rsvp) {
        rsvp = new RSVP({
            event: req.params.id,
            user: req.user.uid,
            status
        });
    } else {
        rsvp.status = status;
    }
    await rsvp.save();
    res.json(rsvp);
});

// Comment on event
router.post('/:id/comments', firebaseAuth, async (req, res) => {
    const comment = new Comment({
        content: req.body.content,
        event: req.params.id,
        user: req.user.uid
    });
    await comment.save();
    res.status(201).json(comment);
});

module.exports = router;