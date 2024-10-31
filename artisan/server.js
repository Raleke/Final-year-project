require("dotenv").config();
const express = require("express");
const qs = require('qs');
mongoose = require("mongoose"),
ejs = require("ejs"),
session = require("express-session"),
flash = require("connect-flash"),
app=express();


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));


mongoose.connect("mongodb://127.0.0.1:27017/Artisan");

app.use(session({
    secret:"mysecretkey",
    resave:true,
    saveUninitialized:true
}))

app.use(flash());
app.use((req,res,next) => {
    res.locals.message = req.flash("message");
    res.locals.error_msg = req.flash("error_msg");

    next();
})




app.set('query parser', function(str) {
  return qs.parse(typeof str === 'string' ? str.toLowerCase() : str, {});
});


app.use((req, res, next) => {
  for (var key in req.query) {
    req.query[key.toLowerCase()] = req.query[key];
  }
  next();
});



module.exports = app; 

app.use("/", require("./route/uRoute"));
app.use("/", require("./route/aRoute"));




app.listen(4000,()=> console.log("Server started on port 4000"));