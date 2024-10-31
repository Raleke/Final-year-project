const express = require("express");
const router = express.Router();


const{landingPage, JobSearch, skillDetails, LocationSearch,LocationDetails } = require("../controller/uController");

router.get("/", landingPage);
router.get("/skill/Job",JobSearch);
 router.post("/search", JobSearch);
router.get("/details/:sid", skillDetails);
router.get("/skill/Candidate", LocationSearch);
router.post("/locationsearch", LocationSearch);
router.get("/artisan/:sid", LocationDetails);

module.exports = router;