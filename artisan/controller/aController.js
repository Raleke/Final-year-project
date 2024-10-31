require("dotenv").config();
const mongoose = require("mongoose"),
bcrypt = require ("bcryptjs"),
multer = require("multer"),
fs= require("fs"),
path= require("path"),
 nodemailer = require('nodemailer');
Artisan= require("../models/artisan");
Skill = require("../models/skill");



//Artisan SIGNING UP
 
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')) // Use path.join to ensure the correct path separator is used
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});


let upload = multer({storage:storage});


//IMAGE UPLOAD FOR Skills
let st = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

let upl = multer({storage:st});

const login = (req,res)=>{
    res.render("login");
}


const artisanRegistration = (req,res) =>{
    res.render("registration")
}
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ralekeegan@gmail.com", // sender gmail address
        pass: "akfg isge aqkc pgfg" // App password from gmail account
    },
});

const artisanRegistrationPost = (req, res) => {
    // console.log(req.body);
    // res.send("Processing");

    const{fn, ln, phone, email, cacStatus, gender, pass1, pass2} = req.body;

    let errors = [];

    if(!fn || !ln || !phone || !email || !cacStatus || !gender || !pass1 || !pass2) {

        errors.push({msg: "Please ensure all fields are filled"});
    }

    if(pass1 !== pass2) {
        errors.push({msg:"Passwords do not match"});
    }

    if(pass1.length < 6) {
        errors.push({msg:"Passwords should be at least 6 characters"});
    }

    if(errors.length > 0) {
        res.render("registration", {errors, fn, ln, phone, email, cacStatus, gender, pass1, pass2});
        
        
    } else {

        //WE DON'T WANT TO HAVE 2 USERS WITH THE SAME EMAIL
        
        Artisan.findOne({email:email})
        .then((result)=> {
            if(result) {
                errors.push({msg: "Email already exists"});
                res.render("registration", {errors, fn, ln, phone, email, cacStatus, gender, pass1, pass2})
    
            } else {
                //WE ARE GOOD TO GO 
                //BELOW WE ENCRYPT OUR PASSWORD

                bcrypt.hash(pass1, 10, (error,hash) => {
                    const newArtisan = new Artisan({
                        fn,ln,email,cacStatus,phone,gender,password:hash,
                        image:{
                            data:fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                            contentType: 'image/png'
                        }
                    })

                    try{
                        newArtisan.save(),
                        req.flash('message', 'Registration Successful. You can now login');
                        res.redirect('/login')
                    }
                    catch(err) {
                        req.flash('error_msg', "Could not save into the Database")
                    }

                    let msg = "Dear " + fn + " " + ln + ", your registration is successful and Details successfully captured"


                    const mailOptions = {
                        from: "ralekeegan@gmail.com",
                        to: email,
                        subject: "Registration Successful",
                        text: msg,
        
                    };


                    transporter.sendMail(mailOptions, (error, info) => {

                        if(error) {
                            console.log(error);
                        } else {
                            console.log("Email sent: " + info.response);
                        }
                    });
                })
            }
        })
        .catch((err) =>{
            res.send("There's a problem")
            console.log(err);
        })

    }

}

const artisanLoginPost =(req,res)=>{
    const{email,password} = req.body;

    Artisan.findOne({email:email})
    .then((result) =>{
        if(!result){ // MEANING THERE'S NO RESULT
            req.flash("error_msg", "This email does not exist");
            res.redirect("/login");
        }else{ //MEANING THER'S RESULT
            bcrypt.compare(password, result.password,(err, isVerified) =>{
                if(err){
                    req.flash("error_msg", "Something Appears Wrong");
                    res.redirect("/login");
                }

                if(isVerified){
                    //BELOW WE ESTABLISH SESSION VARIABLES
                    req.session.artisan_id = result._id;
                    req.session.email = result.email;
                    req.session.fn = result.fn;
                    req.session.ln = result.ln;

                    

                    //BELOW WE REDIRECT MERCHANT INTO THE DASHBOARD PAGE/ROUTE
                    res.redirect("/dashboard")
                }else{
                    req.flash("error_msg", "Invalid Password");
                    res.redirect("/login");
                }
            })
        }
    })
    .catch((err)=> {
        req.flash("error_msg", "There was a problem selecting from DB");
        res.redirect("/login");
    })
}

const dashboard = (req,res) =>{
    //IF OUR SESSION VARIABLES ARE NOT SET 
    if(!req.session.artisan_id && !req.session.fn && !req.session.ln){
        res.redirect("/login");
    }else{
        const aid =req.session.artisan_id;
        const fn = req.session.fn;
        const ln = req.session. ln;

        res.render("dashboard", {aid, fn, ln})
    }
}

const addSkill =(req,res)=>{
    if(!req.session.artisan_id && !req.session.fn && !req.session.ln){
        res.redirect("/login");
    }else{
        const aid =req.session.artisan_id;
        const fn = req.session.fn;
        const ln = req.session. ln;

        res.render("add_skill", {aid, fn, ln})
    }
}

const addSkillPost =async(req,res)=>{
    console.log('req.body:', req.body);
    console.log('req.session:', req.session);

    const{
        residence,experience,job,education,set,phone,email,address,cacStatus
    } = req.body;

    let errors = [];
    if(!residence || !experience ||!job ||!education ||!set ||!phone ||!email ||!address ||!cacStatus){
        errors.push({msg:"Some Fields are missing. Please fill all fields"});
    }

    if(errors.length>0){
        res.render('add_skill',{
            errors, residence, experience, job, education, set, fn: req.session.fn, ln: req.session.ln
        })
    }else{
        console.log('Creating new Skill...');
        const nskill = new Skill({
            residence, experience, job, education, set,phone,email,address,cacStatus, fn:req.session.fn,  ln:req.session. ln,
            image:{
                data: fs.readFileSync(path.join('./public/images/' + req.file.filename)),
                contentType: 'image/png'
            }
        })

        try{
            console.log('Saving new Skill...');
           await nskill.save();
            req.flash('message', "Skill successfully Added to DB");
            res.redirect('/addSkill');
        }
        catch(err){
            console.error(err);
            req.flash('error_msg', 'Could not save to DB. Check the server logs for more info.');
            res.redirect('/addSkill');
        }
    }
}




const viewSkill =(req,res)=>{

    if(!req.session.artisan_id && !req.session.fn && !req.session.ln){
        req.flash("error_msg", "Please login to access our platform");
        res.redirect('/login');
}else{
    const aid =req.session.artisan_id;
        const fn = req.session.fn;
        const ln = req.session. ln;

        Skill.find({fn:fn, ln:ln})
        .then((results) =>{
            res.render('view_skill',{aid, fn , ln ,results})
        })

        .catch((err) =>{
            req.flash('error_msg', 'could not select from DB:' + err);
            res.redirect('/viewSkill');
        })
}

}

const editSkill =(req,res)=>{
    if(!req.session.artisan_id && !req.session.fn && !req.session.ln){
        req.flash("error_msg", "Please login to access our platform");
        res.redirect('/login');
}else{
    const aid = req.session.artisan_id;
    const fn = req.session.fn;
    const ln = req.session.ln;

    Skill.findOne({_id:req.params.sid})
    .then((record)=>{
        res.render('edit_page', {aid,fn,ln,record});
    })

    .catch((err) => {
        req.flash('error_msg', 'Could not select from DB:' +err);
        res.redirect('/viewSkill');
})
}
}

const editSkillPost = (req,res)=>{
    if(!req.session.artisan_id && !req.session.fn && !req.session.ln){
        req.flash("error_msg", "Please login to access our platform");
        res.redirect('/login');
}else{
    const{residence, experience,job,education,set,phone,address,email,cacStatus}= req.body;
    const sid = req.params.sid;

    Skill.findByIdAndUpdate(sid,
         {$set: {residence, experience,job,education,set,phone,address,email,cacStatus}})

         .then(() =>{
            req.flash('message', "Skill Successfully Updated");
            res.redirect('/viewSkill');
         })
         .catch((err) => {
            req.flash('error_msg', 'Could not Update Skill');
            res.redirect('/edit/:sid');
        })

    }
}

const deleteSkill = (req,res)=>{
    if(!req.session.artisan_id && !req.session.fn && !req.session.ln){
        req.flash("error_msg", "Please login to access our platform");
        res.redirect('/login');
}else{
    const sid = req.params.sid;

    Skill.findByIdAndDelete(sid)
    .then(() =>{
        req.flash('message', 'Skill Successfully Deleted');
        res.redirect('/viewSkill');
    })
    .catch((err) => {
        req.flash('error_msg', 'Could not delete skill');
        res.redirect('/viewSkill')
    })
}
}

const logout =(req,res)=>{
    if(!req.session.artisan_id && !req.session.fn && !req.session.ln){
        req.flash("error_msg", "Please login to access our platform");
        res.redirect('/login');
}else{
    req.session.destroy();
    res.redirect('/login');
}
}
  
  
         
module.exports = ({login, artisanLoginPost, artisanRegistration,upl,upload,dashboard,addSkill,addSkillPost,viewSkill,editSkill,editSkillPost,deleteSkill,artisanRegistrationPost,logout})