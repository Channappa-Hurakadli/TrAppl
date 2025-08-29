const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    position: { type: String, required: true },
    appliedDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied'
    },
    source: { type: String, enum: ['Manual', 'Gmail'], default: 'Manual' },
    notes: { type: String },
    location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);