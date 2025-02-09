const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.employer = decoded;
        next(); 
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: "Invalid token" });
    }
};

module.exports = authMiddleware;

