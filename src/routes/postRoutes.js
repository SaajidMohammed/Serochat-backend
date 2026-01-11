const express = require('express');
const router = express.Router();
const { createPost, likePost, sharePost, getAllPosts } = require('../controllers/postController');
const { addComment, getCommentsByPost } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Post actions
router.post('/', protect, upload.single('image'), createPost); // Create post with image
router.put('/:id/like', protect, likePost);
router.post('/:id/share', protect, sharePost);
router.get('/', protect, getAllPosts);

// Comment actions
router.post('/comments', protect, addComment);
router.get('/:postId/comments', getCommentsByPost);

module.exports = router;