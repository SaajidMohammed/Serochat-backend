const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        // Check if a file was actually uploaded by Multer
        if (!req.file) {
            return res.status(400).json({ message: "No image file uploaded" });
        }

        const { caption } = req.body;
        
        const post = new Post({
            user: req.user.id,
            caption,
            // We use req.file.filename (the name saved in the uploads folder)
            imageUrl: `/uploads/${req.file.filename}`, 
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({ $push: { likes: req.user.id } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).json("The post has been disliked");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.sharePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        post.shares += 1;
        await post.save();
        res.status(200).json({ message: "Post shared successfully", shares: post.shares });
    } catch (error) {
        res.status(500).json(error);
    }
};

// Add this to src/controllers/postController.js
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username profilePicture').sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};