const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middlewares/firebaseAuth');
const Comment = require('../models/Comment');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

// Check if the user is organizer
const onlyOrganizer = (req, res, next) => {
    if (req.user.role !== 'organizer') return res.status(403).json({ message: 'Organizer access only' });
    next();
};

// Remove a user from an event
router.delete('/events/:eventId/kick/:uid', firebaseAuth, onlyOrganizer, async (req, res) => {
    await RSVP.deleteOne({ event: req.params.eventId, user: req.params.uid });
    res.json({ message: 'User removed from event RSVP list.' });
});

// Delete Comment
router.delete('/comments/:commentId', firebaseAuth, onlyOrganizer, async (req, res) => {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ message: 'Comment deleted.' });
});

// Delete Event
router.delete('/events/:eventId', firebaseAuth, onlyOrganizer, async (req, res) => {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Not found' });
    await Event.deleteOne({ _id: req.params.eventId });
    await RSVP.deleteMany({ event: req.params.eventId });
    await Comment.deleteMany({ event: req.params.eventId });
    res.json({ message: 'Event and related data removed.' });
});

module.exports = router;
