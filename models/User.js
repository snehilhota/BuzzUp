const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    uid: {
        type: String,
        required: true,
        unique: true,       // Firebase UID
    },
    email: {
        type: String,
        required: true,
    },
    username: String,
    role: {
        type: String,
        enum: ['organizer', 'participant'],
        default: 'participant',
    },
    profilePhoto: String,
    bio: String,
    skills: [String],
    interests: [String],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
