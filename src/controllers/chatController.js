const Message = require('../models/Message');

exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const newMessage = new Message({
            sender: req.user.id,
            receiver: receiverId,
            text
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json(error);
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { sender: req.user.id, receiver: otherUserId },
                { sender: otherUserId, receiver: req.user.id }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json(error);
    }
};