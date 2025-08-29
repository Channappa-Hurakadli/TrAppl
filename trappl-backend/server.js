const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
const cron = require('node-cron');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const { syncGmail } = require('./services/gmailService');

// Load env vars
dotenv.config();

// Passport config
require('./config/passport')(passport);

// Connect to database
connectDB();

const app = express();

// Body parser and CORS
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL })); // Allow requests from your React app

// Passport middleware
app.use(passport.initialize());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// Schedule a cron job to run every hour for Gmail sync
cron.schedule('0 * * * *', async () => {
    console.log('Running hourly Gmail sync for all connected users...');
    const users = await User.find({ googleRefreshToken: { $ne: null } });
    
    for (const user of users) {
        try {
            await syncGmail(user);
            console.log(`Successfully synced emails for user ${user.email}`);
        } catch (error) {
            console.error(`Failed to sync for user ${user.email}:`, error.message);
        }
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));