const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique: true,
    },

    password:{
        type:String,
        required:true
    },

    CompanyName :{
        type:String,
        required:true
    },
   termsAndConditions: {
        type: String,
        required: true,
        default: "By using [Your Artisan Page Name], you agree to the following terms: " +
            "Our platform connects clients with artisans based on location and specified needs. " +
            "We are not responsible for the quality of work, fulfillment of services, or any agreements made between clients and artisans. " +
            "Users must provide accurate information when creating profiles or listings. " +
            "We do not guarantee matches or availability of artisans in specific areas. " +
            "Personal data provided will be used solely for matching purposes and will not be shared with third parties without consent. " +
            "We reserve the right to remove any user or listing that violates our guidelines or terms. " +
            "Use of our platform is at your own risk, and we are not liable for any disputes, damages, or losses arising from connections made through our service. " +
            "Terms are subject to change without prior notice. For questions or support, contact us at [Your Contact Information].",
    },

    companyNum:{
        type:String,
        required:true
    },

    image:{
        data:Buffer,
        contentType:String
    },

    dateRegistered:{
        type:Date,
       default:Date.now()
    },

    country: {
        type: String,
        required: true,
    },

    state: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    resetOTP: { type: Number },
    otpExpiry: { type: Date },
    isActive: { type: Boolean, default: true },

});

module.exports = mongoose.model("Employer", employerSchema);




