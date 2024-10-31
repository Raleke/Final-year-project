const express = require("express");
const router = express.Router();

const {
login,
artisanLoginPost,
    artisanRegistration, 
    upload, 
    upl, 
    dashboard,
    addSkill,
    addSkillPost,
    viewSkill,
    editSkill,
    editSkillPost,
    deleteSkill,
    artisanRegistrationPost,
    logout
   
  } = require("../controller/aController");
  


router.get("/registration", artisanRegistration);
router.post("/registration", upload.single("image"), artisanRegistrationPost);
router.get("/login", login);
router.post("/login", artisanLoginPost);
router.get("/dashboard", dashboard);
router.get("/addSkill", addSkill);
router.post("/addSkill", upl.single("image"),addSkillPost)
router.get('/viewSkill', viewSkill);
router.get('/edit/:sid', editSkill);
router.post('/edit/:sid', editSkillPost);
router.get('/delete/:sid', deleteSkill);
router.get('/logout', logout);
module.exports= router;
