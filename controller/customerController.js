require("dotenv").config();
const path = require("path");
const multer = require("multer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");
const Job = require("../models/jobSchema");
const Artisan = require("../models/artisan");
const Review = require("../models/review");


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, 
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            cb(null, true);
        } else {
            cb(new Error("Invalid image type, Only .png, .jpeg, .jpg"));
        }
    },
}).fields([
    { name: "image", maxCount: 1 },
]);


const registerCustomer = async (req, res) => {
    console.log("Request Body Before Upload:", req.body);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ralekeegan@gmail.com", // sender gmail address
            pass: "akfg isge aqkc pgfg", // App password from gmail account
        },
    });

    upload(req, res, async (err) => {
        if (err) {
            console.error("Multer Error:", err.message);
            return res.status(400).json({ msg: err.message });
        }

        const {
            firstName,
            lastName,
            email,
            phoneNumber,
            whatsappNumber,
            password,
            confirmPassword,
            confirmPhone,
            notifications,
            language,
            currency,
            "address.street": street,
            "address.city": city,
            "address.state": state,
            "address.country": country,
        } = req.body;
        let errors = [];

        if (
            !firstName ||
            !lastName ||
            !email ||
            !phoneNumber ||
            !whatsappNumber ||
            !password ||
            !confirmPassword ||
            !street ||
            !city ||
            !state ||
            !country
        ) {
            errors.push({ msg: "Please fill in all the required fields" });
        }

        if (password !== confirmPassword) {
            errors.push({ msg: "Passwords do not match" });
        }

        if (password.length < 8) {
            errors.push({ msg: "Password should be at least 8 characters long" });
        }

        if (phoneNumber !== confirmPhone) {
            errors.push({ msg: "Phone numbers do not match" });
        }

        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const existingCustomer = await Customer.findOne({ email });
            if (existingCustomer) {
                return res.status(400).json({ msg: "Email is already registered" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newCustomer = new Customer({
                firstName,
                lastName,
                email,
                phoneNumber,
                whatsappNumber,
                password: hashedPassword,
                image:
                    req.files && req.files.image
                        ? {
                              data: req.files.image[0].buffer,
                              contentType: req.files.image[0].mimetype,
                          }
                        : null,
                address: {
                    street,
                    city,
                    state,
                    country,
                },
                preferences: {
                    notifications: notifications === "true", 
                    language: language || "en", 
                    currency: currency || "NGN", 
                },
            });

            await newCustomer.save();
            res.status(201).json({ msg: "Registration successful" });

            const msg =
                "Dear " +
                firstName +
                " " +
                lastName +
                ", your registration is successful and details successfully captured";

            const mailOptions = {
                from: "ralekeegan@gmail.com",
                to: email,
                subject: "Registration Successful",
                text: msg,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        } catch (err) {
            console.error("Server Error:", err.message);
            res.status(500).json({ msg: "Server error" });
        }
    });
};

  

const loginCustomer = async (req, res) => {
    const { email, password } = req.body;

   
    if (!email || !password) {
        return res.status(400).json({ msg: "Please fill in all the fields" });
    }

    try {
      
        const customer = await Customer.findOne({ email });
        if (!customer) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

       
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid email or password" });
        }

        
        const token = jwt.sign(
            { id: customer._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            msg: "Login successful",
            token,
            customer: {
                id: customer._id,
                email: customer.email,
                image: customer.image
                    ? {
                        data: customer.image.data.toString("base64"),
                        contentType: customer.image.contentType,
                    }
                    : null,
                address: customer.address,
                preferences: customer.preferences,
            },
        });
    } catch (err) {
        console.error("Server Error:", err.message);
        res.status(500).json({ msg: "Server error" });
    }
};


const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ email });

        if (!customer) return res.status(404).json({ msg: "Email not registered" });

        const otp = Math.floor(100000 + Math.random() * 900000); 
        customer.resetOTP = otp;
        customer.otpExpiry = Date.now() + 10 * 60 * 1000; 

        await customer.save();

        const mailOptions = {
            from: "ralekeegan@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(500).json({ msg: "Error sending OTP" });
            }
            res.status(200).json({ msg: "OTP sent successfully" });
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const customer = await Customer.findOne({ email });

        if (!customer) return res.status(404).json({ msg: "Email not registered" });

        if (customer.resetOTP !== otp || Date.now() > customer.otpExpiry) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        customer.password = await bcrypt.hash(newPassword, salt);
        customer.resetOTP = null;
        customer.otpExpiry = null;

        await customer.save();
        res.status(200).json({ msg: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


const jobSearch = async (req, res) => {
    try {
        let searchParam = req.body.searchParam;
        if (typeof searchParam !== "string") {
            searchParam = searchParam?.toString() || "";
        }

        const results = await Artisan.find({
            $or: [
                { "jobCategories.jobCategory": { $regex: searchParam, $options: "i" } },
                { "jobCategories.skills": { $regex: searchParam, $options: "i" } }, 
                { state: { $regex: searchParam, $options: "i" } }, 
            ],
        }).select("-password"); 

        if (results.length > 0) {
            res.status(200).json({ results, searchParam });
        } else {
            res.status(404).json({ results: [], searchParam, message: "No artisans found." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "An error occurred while searching for artisans." });
    }
};

const getStates = async (req, res) => {
    try {
        const states = await Artisan.distinct("state"); 
        res.status(200).json({ states });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};


const getCustomerProfile = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findById(customerId).select("-password");
        if (!customer) return res.status(404).json({ msg: "Customer not found." });

        res.status(200).json({ customer });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const hireArtisan = async (req, res) => {
    try {
        const { customerId, artisanId } = req.params;
        const { jobCategory, jobDescription, budget } = req.body;

        const customer = await Customer.findById(customerId);
        const artisan = await Artisan.findById(artisanId);
        if (!customer || !artisan) return res.status(404).json({ msg: "Customer or Artisan not found." });

        customer.jobRequests.push({ artisanId, jobCategory, jobDescription, budget });
        await customer.save();

        res.status(200).json({ msg: "Artisan hired successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const leaveReview = async (req, res) => {
    try {
        const { customerId, artisanId } = req.params;
        const { rating, comment } = req.body;

        const newReview = new Review({ customerId, artisanId, rating, comment });
        await newReview.save();

        res.status(200).json({ msg: "Review added successfully." });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};


const addFavoriteArtisan = async (req, res) => {
    try {
        const { customerId, artisanId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) return res.status(404).json({ msg: "Customer not found." });

        if (!customer.favorites.includes(artisanId)) {
            customer.favorites.push(artisanId);
            await customer.save();
        }

        res.status(200).json({ msg: "Artisan added to favorites." });
    } catch (err) {
        res.status(500).json({ msg: "Server error." });
    }
};




module.exports = {
    loginCustomer, registerCustomer, sendOTP,resetPassword, jobSearch, getStates,getCustomerProfile, hireArtisan,leaveReview,
    addFavoriteArtisan
};

