const mongoose = require ("mongoose");

const skillSchema = new mongoose.Schema({


    residence:{
        type:String,
        required:true
    },

    experience:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true
    },

    cacStatus:{
        type:String,
        required:true
    },

    phone:{
        type:String,
        required:true
    },

    address:{
        type:String,
        required:true
    },

    job:{
        type:String,
        required:true
    },

    education:{
        type:String,
        required:true
    },

    set:{
        type:String,
        required:true
    },

    fn:{
        type:String,
        required:true
    },

    ln:{
        type:String,
        required:true
    },


    image:{
        data:Buffer,
        contentType:String
    },

    dateAdded:{
        type:Date,
     default: Date.now()
    },

   
})

module.exports = new mongoose.model("skill", skillSchema);