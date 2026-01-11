const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Required to fetch user data
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile/:id', protect, getUserProfile);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users for the chat list
 * @access  Private
 */
router.get('/users', protect, async (req, res) => {
    try {
        // Fetch all users, excluding the password field for security
        // We also exclude the current logged-in user so they don't chat with themselves
        const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

module.exports = router;