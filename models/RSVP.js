const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RSVPSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    user: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['going', 'interested', 'not going'],
        default: 'going'
    }
}, { timestamps: true });

module.exports = mongoose.model('RSVP', RSVPSchema);