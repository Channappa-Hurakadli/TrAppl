const User = require('../models/userModel');
const Job = require('../models/jobModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// UPDATED: Function now accepts the full user object to create a richer token
const generateToken = (user) => {
    return jwt.sign({ 
        id: user._id,
        name: user.name,
        email: user.email,
        googleId: user.googleId // Include googleId in the token
    }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user), // Pass the full user object
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate user & get token
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user), // Pass the full user object
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Google OAuth callback
exports.googleCallback = (req, res) => {
    // req.user is the full user object provided by Passport.js
    const token = generateToken(req.user); 
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
};

// @desc    Logout user
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};

// @desc    Delete user account
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.user._id;
        await Job.deleteMany({ userId: userId });
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User account and all data successfully deleted.' });
    } catch (error) {
        console.error('Error deleting user account:', error);
        res.status(500).json({ message: 'Server Error while deleting account.' });
    }
};

exports.disconnectGoogle = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.googleId = undefined;
        user.googleAccessToken = undefined;
        user.googleRefreshToken = undefined;
        await user.save();
        
        // We don't need to send a new token, the old one is still valid for our app
        res.status(200).json({ message: "Google account disconnected successfully." });

    } catch (error) {
        console.error("Disconnect Google error:", error);
        res.status(500).json({ message: "Server error while disconnecting account." });
    }
};

