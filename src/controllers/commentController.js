const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
    try {
        const { text, postId } = req.body;
        const comment = new Comment({
            text,
            user: req.user.id,
            post: postId
        });
        await comment.save();
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId }).populate('user', 'username');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json(error);
    }
};