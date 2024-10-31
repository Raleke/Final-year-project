require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const dataRoutes = require('./route/dataRoutes'); 
const dataController = require('./controller/dataController'); 
const path = require('path');
const app = express();

dataController.loadData(() => {


app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/Final year Project");

app.use(session({
    secret: "mysecretkey",
    resave: true,
    saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash("message");
    res.locals.error_msg = req.flash("error_msg");
    next();
});


app.use('/', dataRoutes);


app.listen(3000, () => console.log("Server started at port 3000"));
});