const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/message', protect, sendMessage);
router.get('/message/:otherUserId', protect, getMessages);

module.exports = router;