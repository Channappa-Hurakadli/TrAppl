const express = require('express');
const { 
    createJob, 
    getAllJobs, 
    updateJob, 
    deleteJob,
    syncJobsFromGmail 
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// @desc    Create a new job & Get all jobs for the logged-in user
// @route   POST /api/jobs
// @route   GET /api/jobs
router.route('/')
    .post(createJob)
    .get(getAllJobs);

// @desc    Update a specific job & Delete a specific job
// @route   PUT /api/jobs/:id
// @route   DELETE /api/jobs/:id
router.route('/:id')
    .put(updateJob)
    .delete(deleteJob);

router.route('/sync').post(syncJobsFromGmail);

module.exports = router;
