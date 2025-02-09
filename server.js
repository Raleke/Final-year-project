require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const path = require("path");


const dataRoutes = require('./route/dataRoutes'); 
const employerRoutes = require('./route/employerRoute');
const artisanRoutes = require('./route/artisanRoute');
const customerRoutes = require("./route/customerRoute");
const jobRoutes = require("./route/jobRoute");
const dataController = require('./controller/dataController'); 
const messageController = require("./controller/messageController");

const app = express();


dataController.loadData(() => {
    
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "public"))); 
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors());

    const dbURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/FinalYearProject";
    mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("MongoDB connected successfully"))
        .catch((err) => console.error("MongoDB connection error:", err));

  
    app.use(session({
        secret: process.env.SESSION_SECRET || "mysecretkey",
        resave: true,
        saveUninitialized: true,
    }));

  
    app.use(flash());

    
    app.use((req, res, next) => {
        res.locals.message = req.flash("message");
        res.locals.error_msg = req.flash("error_msg");
        next();
    });

    
  
    app.use('/api', dataRoutes); 
    app.use('/api/employer', employerRoutes); 
    app.use('/api/artisan', artisanRoutes);
    app.use('/api/customer', customerRoutes);
    app.use('/api/job',jobRoutes);
    app.use('/api/message',messageRoutes);

    
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong! Please try again later.");
    });

   
    const PORT = process.env.PORT || 3500;
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
});
