import express from 'express';
import { CompanyUser, CompanyInfo, CompanyDrive } from "../database/models";
import sha256 from "sha256";

const companyController = express.Router();

companyController.post("/login", (req, res) => {
  const { email, password } = req.body;
  CompanyUser.findOne({ email: email }).then(user => {
    if (!user) {
      res.json({ success: false, message: `User with email ${email} does not exist.` })
    } else {
      if (user.hashedPassword != sha256(password)) {
        res.json({ success: false, message: "Incorrect Password" })
      } else {
        res.json({ success: true, companyId: user._id, message:"User successfully logged in."})
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
  if (req.body) {
    const { email, password } = req.body;
    const companyUserData = {
      email,
      hashedPassword: sha256(password)
    };
    CompanyUser.find({ email: email }).then(user => {
      console.log(user)
      if (user.length==0) {
        const newUser = new CompanyUser(companyUserData);
        newUser
          .save()
          .then(data => {
            res.status(200).json({ success: true, companyId: data._id, message:"User registration successful." });
          })
          .catch(err => {
            res.status(404).json({success: false, message : "User registration unsuccessful"});
          })
      } else {
        res.status(200).json({success: false, message: `User with the email ${email} already exists.`});
      }
    })
  }
  else {
    res.json({message: "Invalid request object."});
  }

});

companyController.get("/drives", (req, res) => {
  const { companyId } = req.body;
  CompanyDrive.find({ companyId: companyId }).then(drives => {
    if (!drives) {
      res.json({ success: false, message: "No drives found." })
    } else {
      res.json({ success: true, drives: drives })
    }
  })
})


companyController.post("/createDrive", (req, res) => {

  const { companyId,
    driveName,
    branchesPreferred,
    batch, eligibility,
    driveRole,
    ctcOffered,
    jobDescription,
    skillsRequired } = req.body;

  const companyDriveData = {
    companyId: companyId,
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
      res.status(200).json({success: true, message:"Drive added successfully"});
    })
    .catch(err => {
      res.status(400).json({success: false, message:"Unable to add drive",error: err});
    })
});

companyController.post("/updateDrive", (req, res) => {
  !req.body.driveId ? res.json({ success: false, error: "Drive Id not recieved." }) :
    CompanyDrive.updateOne({ _id: req.body.driveId }, req.body).then(err => {
      err.matchedCount == 1 ? res.status(200).json({ 
          success: true,
          message: `Updated drive ID ${req.body.driveId} successfully.` })
        : res.json({ success: false })
    }).catch(err => {
      res.json({ success: false, error: err })
    })
})

companyController.post("/deleteDrive", (req, res) => {
  !req.body.driveId ? res.json({ success: false, error: "Drive Id not recieved." }) :
    CompanyDrive.deleteOne({ _id: req.body.driveId }).then(err => {
      err.deletedCount == 1 ? res.status(200).json({
        success: true,
        message: `Deleted drive ID ${req.body.driveId} successfully.`}) 
      : res.json({ success: false })
    }).catch(err => {
      res.json({ success: false, error: err })
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