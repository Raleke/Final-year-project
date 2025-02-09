const mongoose = require("mongoose");

const artisanSchema = new mongoose.Schema({
  
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'], 
        required: true,
    },
    whatsappNumber: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    image:{
        data:Buffer,
        contentType:String
    },
    dob: {
        type: Date,
        required: true,
    },
    streetAddress: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },

    
    jobType: {
        type: String,
        enum: ['Contract', 'Full-Time'], 
        required: true,
    },
    jobCategories: [
        {
            jobCategory: { type: String, required: true }, 
            skills: [
                {
                    type: String, 
                    required: true,
                },
            ],
        },
    ],
    yearsOfExperience: {
        type: Number,
        required: true,
    },
    cv: {
        type: Buffer, 
        required: false,
    },
    artisanDescription: {
        type: String,
        required: true,
    },

    notifications: [
        {
            message: { type: String, required: true },
            date: { type: Date, default: Date.now },
            read: { type: Boolean, default: false },
        },
    ],

    resetOTP: { type: Number },
    otpExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
    
    education: {
        level: {
            type: String,
            enum: [
                'No Education',
                'Primary School',
                'Secondary School',
                'University',
                'Technical School',
                'College of Education',
                'Polytechnic',
            ],
            required: true,
        },
        details: {
            course: { type: String, required: function () { return this.education.level !== 'No Education'; } },
            gradYear: { type: Number, required: function () { return this.education.level !== 'No Education'; } },
            certObtained: { type: String, required: function () { return this.education.level !== 'No Education'; } },
        },
    },

   
    workExperience: {
        hasExperience: {
            type: String,
            enum: ['Yes', 'No'],
            required: true,
        },
        details: {
            companyName: { type: String, required: function () { return this.workExperience.hasExperience === 'Yes'; } },
            role: { type: String, required: function () { return this.workExperience.hasExperience === 'Yes'; } },
            startYear: { type: Number, required: function () { return this.workExperience.hasExperience === 'Yes'; } },
            endYear: { type: Number, required: function () { return this.workExperience.hasExperience === 'Yes'; } },
        },
    },
});

module.exports = mongoose.model("Artisan", artisanSchema);
