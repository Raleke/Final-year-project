
const mongoose = require("mongoose"),
Skill = require("../models/skill");



const landingPage =(req,res)=>{
    res.render("index");
}

  
const JobSearch = (req, res) => {
    let searchParam = req.body.searchParam;
  
    // Ensure searchParam is a string
    if (typeof searchParam !== 'string') {
      searchParam = searchParam?.toString() || '';
    }
  
    Skill.find({ set: { $regex: new RegExp('^' + searchParam + '$', 'i') } })
      .then((results) => {
        if (results.length > 0) {
          res.render('job_page', { results, searchParam });
        } else {
          res.render('job_page', { results: [], searchParam, message: 'No artisans found for this skill.' });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('An error occurred while searching for artisans.');
      });
  };
  
  const skillDetails = (req, res) => {
    const skill_id = req.params.sid;
  
    Skill.findOne({ _id: skill_id })
      .then((result) => {
        const profileImage = result.image;
        res.render("job_details", {
          artisan: {
            fn: result.fn,
            ln: result.ln,
            residence: result.residence,
            experience: result.experience,
            job: result.job,
            education: result.education,
            phone:result.phone,
            email:result.email,
            address:result.address,
            cacStatus:result.cacStatus,
          },
          image:profileImage 
        });
      })
      .catch((err) => {
        res.send("could not get result: " + err);
        console.log(err);
      });
  };

  
  const LocationSearch = async(req, res) => {
    let { SearchParam, residence } = req.body;
    
    // Ensure SearchParam is a string
    if (typeof SearchParam !== 'string') {
      SearchParam = SearchParam?.toString() || '';
    }
    
    Skill.find({ 
        set: { $regex: new RegExp(SearchParam, 'i') },
        residence: residence
    })
    .then((skills) => {
      let message;
      if (skills.length > 0) {
        message = `Found ${skills.length} artisan for ${SearchParam} in ${residence}`;
      } else {
        message = `No artisans available for ${SearchParam} in ${residence}`;
      }
      res.render('job_location', { results: skills, SearchParam, message }); // pass skills as results
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred while searching for skills.');
    });
};

const LocationDetails = (req, res) => {
    const skill_id = req.params.sid;
  
    Skill.findOne({ _id: skill_id })
      .then((result) => {
        const profileImage = result.image;
        res.render("job_Detaails", {
          artisan: {
            fn: result.fn,
            ln: result.ln,
            residence: result.residence,
            experience: result.experience,
            job: result.job,
            education: result.education,
            phone:result.phone,
            email:result.email,
            address:result.address,
            cacStatus:result.cacStatus,
          },
          image:profileImage 
        });
      })
      .catch((err) => {
        res.send("could not get result: " + err);
        console.log(err);
      });
  };

  

   
  
module.exports =({landingPage, JobSearch,skillDetails, LocationSearch,LocationDetails})