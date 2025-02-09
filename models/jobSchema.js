const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    employerEmail: {
        type: String,
        required: true,
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    applicationDeadline: {
        type: Date,
        required: true,
    },
    workType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract"],
        required: true,
    },
    commuteType: {
        type: String,
        enum: ["Onsite", "Remote"],
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    qualification: {
        type: String,
        default: "SSCE",
    },
    pay: {
        amount: {
            type: Number,
            required: true,
        },
        frequency: {
            type: String,
            enum: ["Per Day", "Per Job", "Per Week", "Per Month"],
            required: true,
        },
    },
    requiredSkill: {
        type: String,
        required: true,
    },
    slots: {
        type: Number,
        required: true,
    },
    applications: [
        {
            artisanId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Artisan", 
                required: true,
            },
            status: {
                type: String,
                enum: ["Pending", "Employed"],
                default: "Pending",
            },
        },
    ],
    accommodation: {
        type: String,
        enum: ["Yes", "No"],
        required: true,
    },
});

module.exports = mongoose.model("Job", jobSchema);
