const Job = require('../models/jobModel');
const { syncGmail } = require('../services/gmailService');

// @desc    Create a new job
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
    const { company, position, appliedDate, status, notes, location } = req.body;
    try {
        const job = new Job({
            userId: req.user._id,
            company,
            position,
            appliedDate,
            status,
            notes,
            location,
            source: 'Manual'
        });
        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all jobs for a user
// @route   GET /api/jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ userId: req.user._id }).sort({ appliedDate: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
    const { company, position, appliedDate, status, notes, location } = req.body;
    try {
        const job = await Job.findById(req.params.id);

        if (job && job.userId.toString() === req.user._id.toString()) {
            job.company = company || job.company;
            job.position = position || job.position;
            job.appliedDate = appliedDate || job.appliedDate;
            job.status = status || job.status;
            job.notes = notes || job.notes;
            job.location = location || job.location;

            const updatedJob = await job.save();
            res.json(updatedJob);
        } else {
            res.status(404).json({ message: 'Job not found or user not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job && job.userId.toString() === req.user._id.toString()) {
            await job.deleteOne(); // Use deleteOne() for Mongoose v6+
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found or user not authorized' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
// @desc    Trigger a manual Gmail sync for the logged-in user
// @route   POST /api/jobs/sync
exports.syncJobsFromGmail = async (req, res) => {
    try {
        if (!req.user || !req.user.googleRefreshToken) {
            return res.status(400).json({ message: 'Google account not connected or refresh token is missing.' });
        }
        
        const { newJobsCount } = await syncGmail(req.user);
        
        if (newJobsCount > 0) {
            res.status(200).json({ message: `Sync complete. Found and added ${newJobsCount} new job(s).` });
        } else {
            res.status(200).json({ message: 'Sync complete. No new job applications were found.' });
        }

    } catch (error) {
        console.error('Manual sync error:', error);
        res.status(500).json({ message: 'Failed to sync jobs from Gmail.', error: error.message });
    }
};