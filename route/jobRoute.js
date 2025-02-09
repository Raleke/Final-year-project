const express = require("express");
const router = express.Router();
const { addJob, applyForJob,updateJob, getRecommendedJobs, cancelJobApplication, updateJobStatus, getAllJobsPaginated } = require("../controller/jobController");

router.post("/add-job", addJob);

router.post("/apply-job", applyForJob);

router.put("/update/:jobId", updateJob);

router.get("/recommended/:artisanId", getRecommendedJobs);

router.put("/cancel/:jobId/:artisanId", cancelJobApplication);

router.put("/update-status/:jobId", updateJobStatus);

router.get("/jobs", getAllJobsPaginated);

module.exports = router;
