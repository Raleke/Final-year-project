const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "recipientType" 
    },
    recipientType: {
        type: String,
        required: true,
        enum: ["Artisan", "Employer", "Customer"] 
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", notificationSchema);