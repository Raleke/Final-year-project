const express = require("express");
const {
    uploadCV,
    registerArtisan,
    loginArtisan,
    updateArtisanProfile,
    getJobHistory,
    deactivateAccount,
    logoutArtisan,
    sendOTP,
    resetPassword,
    filterJobsByLocation,
    artisanDashboard,
    searchArtisans,
    advancedSearchArtisans,
    getAppliedJobs,
    getArtisanProfile,
    updateArtisanPassword,
    getArtisanNotifications,
    updateAvailability,
    contactEmployer, getArtisanMessages ,

} = require("../controller/artisanController");

const artMiddleware = require("../middleware/artMiddleware");

const router = express.Router();

router.post("/register", registerArtisan);

router.post("/login", loginArtisan);


// router.post("/upload", uploadCV);

router.put("/update-profile", artMiddleware, updateArtisanProfile);  

router.get("/notifications/:artisanId", getArtisanNotifications);

router.get("/job-history", artMiddleware, getJobHistory); 

router.put("/deactivate", artMiddleware, deactivateAccount);  

router.post("/logout", logoutArtisan);  

router.post("/forgot-password", sendOTP);  

router.post("/reset-password", resetPassword);  

router.get("/jobs", filterJobsByLocation);

router.get("/dashboard", artMiddleware, artisanDashboard);

router.get("/search-artisans", searchArtisans); 

router.get("/search-artisans-advanced", advancedSearchArtisans);

router.get("/artisan/applied-jobs", getAppliedJobs);

router.get("/profile/:artisanId", getArtisanProfile);

router.post("/contact-employer/:artisanId/:employerId", contactEmployer);

router.get("/messages/:artisanId", getArtisanMessages);

router.put("/update-password/:artisanId", updateArtisanPassword);

router.get("/profile", artMiddleware, (req, res) => {
    res.json({
        msg: "Access granted",
        artisan: req.artisan, 
    });
});

module.exports = router;