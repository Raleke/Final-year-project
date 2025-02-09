const express = require("express");

const { markMessageAsRead, getAllMessages, getUnreadMessages } = require("../controller/messageController");

const router = express.Router();


router.put("/mark-read/:messageId", markMessageAsRead);


router.get("/all/:userId", getAllMessages);


router.get("/unread/:userId", getUnreadMessages);

module.exports = router;