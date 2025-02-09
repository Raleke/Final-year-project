const Message = require("../models/message");
const markMessageAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ msg: "Message not found." });
        }

        message.read = true;
        await message.save();

        res.status(200).json({ msg: "Message marked as read." });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const getAllMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [{ senderId: userId }, { recipientId: userId }]
        }).sort({ createdAt: -1 });

        res.status(200).json({ messages });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const getUnreadMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            recipientId: userId,
            read: false
        }).sort({ createdAt: -1 });

        res.status(200).json({ unreadMessages: messages });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};

module.exports = { markMessageAsRead, getAllMessages, getUnreadMessages };