const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for OAuth users
    googleId: { type: String },
    googleAccessToken: { type: String }, // Should be encrypted in production
    googleRefreshToken: { type: String } // Should be encrypted in production
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);