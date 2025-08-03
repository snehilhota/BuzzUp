const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middlewares/firebaseAuth');
const User = require('../models/User');

// GET profile of current user
router.get('/me', firebaseAuth, async (req, res) => {
    const user = await User.findOne({ uid: req.user.uid });
    res.json(user);
});

// GET public profile by UID
router.get('/:uid', async (req, res) => {
    const user = await User.findOne({ uid: req.params.uid });
    res.json(user);
});

// UPDATE current user's profile
router.put('/me', firebaseAuth, async (req, res) => {
    const user = await User.findOne({ uid: req.user.uid });
    Object.assign(user, req.body);
    await user.save();
    res.json(user);
});

// Promote yourself to “organizer” (optional approval flow later)
router.post('/become-organizer', firebaseAuth, async (req, res) => {
    const user = await User.findOne({ uid: req.user.uid });
    user.role = 'organizer';
    await user.save();
    res.json({ message: 'Role updated to organizer', user });
});

module.exports = router;
