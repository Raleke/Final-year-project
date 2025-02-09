const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "reviewerType" 
    },
    reviewerType: {
        type: String,
        required: true,
        enum: ["Artisan", "Employer", "Customer"] 
    },
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
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Review", reviewSchema);