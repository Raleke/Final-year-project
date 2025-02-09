const express = require("express");
const {  registerCustomer, loginCustomer,sendOTP,resetPassword,jobSearch,getStates,getCustomerProfile, 
    hireArtisan,leaveReview, addFavoriteArtisan } = require("../controller/customerController");
const artMiddleware = require("../middleware/artMiddleware");

const router = express.Router();


router.post("/register", registerCustomer);

router.get("/profile/:customerId", getCustomerProfile);

router.post("/hire-artisan/:customerId/:artisanId", hireArtisan);

router.post("/login", loginCustomer);

router.post("/forgot-password", sendOTP);  

router.post("/reset-password", resetPassword);  

router.post("/search-artisans", jobSearch);

router.get("/get-states", getStates);

router.post("/favorite-artisan/:customerId/:artisanId", addFavoriteArtisan);

router.post("/review/:customerId/:artisanId", leaveReview);


router.get("/profile", artMiddleware, (req, res) => {
    res.json({
        msg: "Access granted",
        customer: req.customer, 
    });
});

module.exports = router;