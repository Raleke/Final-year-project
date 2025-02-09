const jwt = require("jsonwebtoken");

const artMiddleware = (req,res,next)=>{
    const token = req.header("Authorization");

    if(!token){
        return res.status(401).json({msg:"No token, Authorization Denied"});
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

module.exports = artMiddleware;

