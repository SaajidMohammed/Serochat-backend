const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    caption: { type: String, max: 500 },
    imageUrl: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of user IDs
    shares: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);