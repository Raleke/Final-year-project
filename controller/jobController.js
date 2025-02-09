const Job = require("../models/jobSchema");
const Employer = require("../models/employer");
const nodemailer = require("nodemailer");
const Artisan = require("../models/artisan");

const addJob = async (req, res) => {
    const {
        companyName,
        employerEmail,
        applicationDeadline,
        workType,
        commuteType,
        location,
        qualification,
        payAmount,
        payFrequency,
        requiredSkill,
        slots,
        accommodation,
    } = req.body;

   
    const errors = [];
    if (
        !companyName ||
        !employerEmail ||
        !applicationDeadline ||
        !workType ||
        !commuteType ||
        !location ||
        !payAmount ||
        !payFrequency ||
        !requiredSkill ||
        !slots ||
        !accommodation
    ) {
        errors.push({ msg: "Please fill in all required fields." });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    try {
      
        const employer = await Employer.findOne({ email: employerEmail });
        if (!employer) {
            return res.status(400).json({ msg: "Employer not found." });
        }

       
        const newJob = new Job({
            companyName,
            employerEmail,
            applicationDeadline: new Date(applicationDeadline),
            workType,
            commuteType,
            location,
            qualification: qualification || "SSCE",
            pay: {
                amount: payAmount,
                frequency: payFrequency,
            },
            requiredSkill,
            slots,
            accommodation,
        });

        await newJob.save();

      
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ralekeegan@gmail.com", 
                pass: "akfg isge aqkc pgfg", 
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: employerEmail,
            subject: "Job Posted Successfully",
            text: `Hello ${companyName},\n\nYour job posting "${requiredSkill}" has been successfully added with ${slots} slots.\n\nRegards,\nYour Artisan Page Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Confirmation email sent:", info.response);
            }
        });

        res.status(201).json({ msg: "Job added successfully." });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ msg: "Server error." });
    }
};


const applyForJob = async (req, res) => {
    const { jobId, applicantName, applicantEmail } = req.body;

    if (!jobId || !applicantName || !applicantEmail) {
        return res.status(400).json({ msg: "Please provide all required details." });
    }

    try {
       
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found." });
        }

    
        if (job.applications >= job.slots) {
            return res.status(400).json({ msg: "No slots available for this job." });
        }

       
        job.applications += 1;
        await job.save();

        
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ralekeegan@gmail.com", 
                pass: "akfg isge aqkc pgfg", 
            },
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: job.employerEmail,
            subject: `New Applicant for Job: ${job.requiredSkill}`,
            text: `Hello ${job.companyName},\n\nYou have a new applicant:\n\nName: ${ firstName}\nEmail: ${email}\n\nRegards,\nYour Artisan Page Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
            } else {
                console.log("Application email sent:", info.response);
            }
        });

        res.status(200).json({ msg: "Application submitted successfully." });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).json({ msg: "Server error." });
    }
};



const getAllJobsPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const jobs = await Job.find().skip(skip).limit(limit);

        res.status(200).json({ jobs, page });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const updatedData = req.body;

        const job = await Job.findByIdAndUpdate(jobId, updatedData, { new: true });

        if (!job) {
            return res.status(404).json({ msg: "Job not found." });
        }

        res.status(200).json({ msg: "Job updated successfully", job });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const getRecommendedJobs = async (req, res) => {
    try {
        const { artisanId } = req.params;
        const artisan = await Artisan.findById(artisanId);

        if (!artisan) return res.status(404).json({ msg: "Artisan not found." });

        const jobs = await Job.find({
            requiredSkill: { $in: artisan.jobCategories.map(jc => jc.skills) }
        });

        res.status(200).json({ jobs });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const cancelJobApplication = async (req, res) => {
    try {
        const { jobId, artisanId } = req.params;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ msg: "Job not found." });

        job.applications = job.applications.filter(app => app.artisanId.toString() !== artisanId);
        await job.save();

        res.status(200).json({ msg: "Application cancelled successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const updateJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params;
        const { status } = req.body;

        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ msg: "Job not found." });

        job.status = status;
        await job.save();

        res.status(200).json({ msg: "Job status updated", job });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};



module.exports = {
    addJob, applyForJob,getAllJobsPaginated,updateJob, getRecommendedJobs, cancelJobApplication, updateJobStatus
};
