const express = require('express');
const passport = require('passport');
const { register, login, googleCallback,disconnectGoogle } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Register a new user with email and password
// @route   POST /api/auth/register
router.post('/register', register);

// @desc    Authenticate user with email and password
// @route   POST /api/auth/login
router.post('/login', login);

// @desc    Authenticate with Google
// @route   GET /api/auth/google
router.get('/google', passport.authenticate('google', {
    scope: [
        'profile', 
        'email', 
        'https://www.googleapis.com/auth/gmail.readonly' // Scope to read emails
    ],
    accessType: 'offline', // Important to get a refresh token
    prompt: 'consent'      // Ensures the user is prompted for consent every time
}));

// @desc    Google OAuth callback URL
// @route   GET /api/auth/google/callback
router.get(
    '/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: `${process.env.CLIENT_URL}/login`, // Redirect on failure
        session: false // We are using JWT, so no sessions needed
    }), 
    googleCallback
);

router.post('/disconnect',protect, disconnectGoogle);

module.exports = router;
