const mongoose = require("mongoose");

const artisanSchema= new mongoose.Schema({
    fn:{
        type:String,
        required:true
    },

    ln:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },



    phone:{
        type:String,
        required:true
    },

    cacStatus:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    dateRegistered:{
        type:Date,
       default:Date.now()
    },

    image:{
        data:Buffer,
        contentType:String
    }
})

module.exports = new mongoose.model("artisan", artisanSchema);
