import express from 'express';
import { CompanyUser, CompanyInfo, CompanyDrive } from "../database/models";
import sha256 from "sha256";

const companyController = express.Router();

companyController.post("/login", (req, res) => {
  const { email, password } = req.body;
  CompanyUser.findOne({ email: email }).then(user => {
    if (!user) {
      res.json({ success: false, error: "User does not exist." })
    } else {
      if (user.hashedPassword != sha256(password)) {
        res.json({ success: false, error: "Wrong Password" })
      } else {
        res.json({ success: true })
      }
    }
  })
    .catch(err => {
      res.json({ success: false, error: err })
    })

});

/**
 * POST/
 * Add a new User to your database
 */

companyController.post("/signup", (req, res) => {
  const { name,email, password } = req.body;
  const companyUserData = {
    name:name,
    email,
    hashedPassword: sha256(password)
  };
  CompanyUser.find({ email: email }).then(user => {
    if (!user) {
      const newUser = new CompanyUser(companyUserData);
      newUser
        .save()
        .then(data => {
          res.status(200).send("Data added successfully");
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        })
    } else {
      res.status(200).send("Data already exists");
    }
  })
});

companyController.get("/drives", (req, res) => {
  const { companyName } = req.body;
  CompanyDrive.find({ companyName: companyName }).then(drives => {
    if (!drives) {
      res.json({ success: false, error: "No drives found." })
    } else {
      res.json({ success: true, data: drives })
    }
  })
})


companyController.post("/createDrive", (req, res) => {

  const { companyName,
    driveName,
    branchesPreferred,
    batch, eligibility,
    driveRole,
    ctcOffered,
    jobDescription,
    skillsRequired } = req.body;

  const companyDriveData = {
    companyName: companyName,
    driveName: driveName,
    branchesPreferred: branchesPreferred,
    batch: batch,
    eligibility: eligibility,
    driveRole: driveRole,
    ctcOffered: ctcOffered,
    jobDescription: jobDescription,
    skillsRequired: skillsRequired
  };

  const newDrive = new CompanyDrive(companyDriveData);
  newDrive
    .save()
    .then(data => {
      res.status(200).send("Drive added successfully");
    })
    .catch(err => {
      res.status(400).send("Unable to save to database");
    })
});

companyController.post("/updateDrive", (req, res) => {
  !req.body.driveId ? res.json({ success: false, error:"Drive Id not recieved." }) :
  CompanyDrive.updateOne({ _id: req.body.driveId }, req.body).then(err =>{
    console.log(err)
    if(err.matchedCount == 1){
      res.status(200).json({success: true,message:`Updated drive ID ${req.body.driveId} successfully.`})
    } else {
      res.json({ success: false })
    }
  }).catch(err =>{
    res.json({ success: false, error: err })
  })
})

companyController.post("/deleteDrive", (req,res)=> {
  !req.body.driveId ? res.json({ success: false, error:"Drive Id not recieved." }) :
  CompanyDrive.deleteOne( { _id: req.body.driveId}).then(err => {
    err.deletedCount==1 ? res.status(200).json({
      success: true, 
      message:`Deleted drive ID ${req.body.driveId} successfully.`}) :
    res.json({ success: false })
  })
})

export default companyController;


// { "companyName":"TCS",
// "driveName": "TCS NQT 2022",
// "branchesPreferred": "IT,CS",
// "batch":"2023",
// "eligibility":["10th-80%","12th-70%"],
// "driveRole":"System Engineer",
// "ctcOffered":"4",
// "jobDescription":["Security","Maintainence"],
// "skillsRequired": ["Java","Python"]}