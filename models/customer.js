const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
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
  phoneNumber: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },

  resetOTP: { type: Number },
    otpExpiry: { type: Date },
    isActive: { type: Boolean, default: true },
    
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  jobRequests: [
    {
      artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan" },
      jobCategory: { type: String },
      jobDescription: { type: String },
      preferredDate: { type: Date },
      budget: { type: Number },
      status: { 
        type: String, 
        enum: ['pending', 'completed', 'cancelled'], 
        default: 'pending' 
      },
      requestedAt: { type: Date, default: Date.now },
      completedAt: { type: Date },
    },
  ],
  reviews: [
    {
      artisanId: { type: mongoose.Schema.Types.ObjectId, ref: "Artisan" },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  preferences: {
    notifications: { type: Boolean, default: true },
    language: { type: String, default: "en" },
    currency: { type: String, default: "USD" },
  },

});

module.exports = mongoose.model("Customer", customerSchema);