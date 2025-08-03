const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    category: String,
    location: String,
    date: {
        type: Date,
        required: true,
    },
    createdBy: {
        type: String,      // Firebase UID
        required: true,
    },
    bannerImage: String,
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);