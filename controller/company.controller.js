import express from 'express';
import { CompanyUser, CompanyInfo, CompanyDrive, AppliedStudentDrive } from "../database/models";
import sha256 from "sha256";

const companyController = express.Router();

companyController.post("/login", (req, res) => {
  const { email, password } = req.body;
  CompanyInfo.findOne({ email: email }).then(company => {
    if (!company) {
      res.json({ success: false, message: `Company with email ${email} does not exist.` })
    } else {
      if (company.hashedPassword != sha256(password)) {
        res.json({ success: false, message: "Incorrect Password" })
      } else {
        res.json({ success: true, companyData: company, message: "Company successfully logged in." })
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
    const { email, password, name, type, yearOfEstablishment, vision } = req.body;
    const companyData = {
      email,
      hashedPassword: sha256(password),
      name,
      type,
      yearOfEstablishment,
      vision
    };
    CompanyInfo.find({ email: email }).then(company => {
      if (company.length == 0) {
        const newCompany = new CompanyInfo(companyData);
        newCompany
          .save()
          .then(data => {
            res.status(200).json({ success: true, companyId: data._id, message: "Company registration successful." });
          })
          .catch(err => {
            res.status(404).json({ success: false, message: "Company registration unsuccessful" });
          })
      } else {
        res.status(200).json({ success: false, message: `Company with the email ${email} already exists.` });
      }
    })
  }
  else {
    res.json({ message: "Invalid request object." });
  }

});

companyController.get("/driveInfo", (req, res) => {
  const { driveId } = req.query;
  CompanyDrive.find({ _id: driveId }).then(drive => {
    if (!drive) {
      res.json({ success: false, message: "No drive found." })
    } else {
      res.json({ success: true, message: "Drive retrieved", drive: drive })
    }
  })
})

companyController.get("/drives", (req, res) => {
  const { companyId } = req.query;
  CompanyDrive.find({ companyId: companyId }).then(drives => {
    if (!drives) {
      res.json({ success: false, message: "No drives found." })
    } else {
      res.json({ success: true, drives: drives })
    }
  })
})

companyController.get("/appliedStudentsDrive", (req, res) => {
  const { driveId } = req.query;
  CompanyDrive.find({ driveId: driveId }).then(drive => {
    if (!drive) {
      res.json({ success: false, message: "No drives found." })
    } else {
      res.json({ success: true, appliedStudents: drive.appliedStudents })
    }
  })
})

companyController.post("/addStudentToDrive", (req, res) => {
  const { studentData, driveId } = req.body

  CompanyDrive.find({ _id: driveId, "appliedStudents.id": studentData.id }).then(document => {

    if (document.length == 1) {
      res.json({
        success: false,
        message: "Already applied to the drive."
      })
    } else {
      CompanyDrive.updateOne({ _id: driveId }, { $push: { appliedStudents: studentData } })
        .then(update => {
          update.n == 1 ? res.status(200).json({
            success: true,
            message: `Student applied to drive successfully.`
          })
            : res.json({ success: false, message: "Could not apply to drive." })
        }).catch(err => {
          res.json({ success: false, message: err })
        })
    }
  })
})

companyController.post("/filterStudentsByTest",async  (req, res) => {
  const { studentEmails, driveId, key } = req.body

  const query = {_id: driveId }

  const updateClearedTest = {
    $set: { 
      "appliedStudents.$[element].testCleared" : true,
     }
  }

  const updateNotClearedTest = {
    $set: { 
      "appliedStudents.$[element].rejected" : true,
     }
  }

  const rejectedEmailsFilter = {
    arrayFilters: [
      {
        "element.email": {$in: studentEmails},
      },
    ],
  }
  const acceptedEmailsFilter = {
    arrayFilters: [
      {
        "element.email": {$nin: studentEmails},
      },
    ],
  }
  CompanyDrive.updateOne(query, updateNotClearedTest, rejectedEmailsFilter)
    .then(firstUpdate => {
    console.log(firstUpdate)
    if(firstUpdate.n >=1 ) {
      CompanyDrive.updateOne(query, updateClearedTest, acceptedEmailsFilter)
      .then(secondUpdate=>{
        console.log(secondUpdate)
        secondUpdate.n >= 1 ? res.status(200).json({
          success: true,
          message: `Students filtered in drive successfully by test.`
        })
          : res.json({ success: false, message: "Could not update students." })
      })
    }
  }).catch(err => {
    res.json({ success: false, message: err })
  })
})

companyController.post("/filterStudentsByInterview",async  (req, res) => {
  const { studentEmails, driveId } = req.body
  
  const query = {_id: driveId }

  const updateClearedInterview = {
    $set: { 
      "appliedStudents.$[element].interviewCleared" : true,
     }
  }

  const updateNotClearedInterview = {
    $set: { 
      "appliedStudents.$[element].rejected" : true,
     }
  }

  const rejectedEmailsFilter = {
    arrayFilters: [
      {
        "element.email": {$in: studentEmails},
      },
    ],
  }
  const acceptedEmailsFilter = {
    arrayFilters: [
      {
        "element.email": {$nin: studentEmails},
      },
    ],
  }
  CompanyDrive.updateOne(query, updateNotClearedInterview, rejectedEmailsFilter)
    .then(firstUpdate => {
    console.log(firstUpdate)
    if(firstUpdate.n >=1 ) {
      CompanyDrive.updateOne(query, updateClearedInterview, acceptedEmailsFilter)
      .then(secondUpdate=>{
        console.log(secondUpdate)
        secondUpdate.n >= 1 ? res.status(200).json({
          success: true,
          message: `Students filtered in drive successfully by interview.`
        })
          : res.json({ success: false, message: "Could not update students." })
      })
    }
  }).catch(err => {
    res.json({ success: false, message: err })
  })
})

companyController.post("/removeStudentFromDrive", (req, res) => {
  const { studentId, driveId } = req.body
  // console.log("studentId", studentId)
  // console.log(driveId)
  CompanyDrive.updateOne({ _id: driveId, "appliedStudents.id": studentId }, {
    $set: {
      "appliedStudents.$.rejected": true,
      "appliedStudents.$.status": "Rejected",
    }
  })
    .then(update => {
      // console.log(update)
      update.n == 1 ? res.status(200).json({
        success: true,
        message: `Student removed from drive successfully.`
      })
        : res.json({ success: false, message: "Could not delete student." })
    }).catch(err => {
      res.json({ success: false, message: err })
    })
})


companyController.post("/createDrive", (req, res) => {

  const { companyId,
    driveName,
    branchesPreferred,
    batch,
    tenthPercentage,
    twelfthPercentage,
    cgpa,
    cgpaInPercentage,
    numberOfLiveKT,
    numberOfDeadKT,
    numberOfAcademicGaps,
    numberOfDegreeGaps,
    ctcOffered,
    jobDescription,
    jobRole,
    jobType,
    jobLocation,
    skillsRequired } = req.body;

  const companyDriveData = {
    companyId: companyId,
    driveName: driveName,
    branchesPreferred: branchesPreferred,
    batch: batch,
    tenthPercentage: tenthPercentage,
    twelfthPercentage: twelfthPercentage,
    cgpa: cgpa,
    cgpaInPercentage: cgpaInPercentage,
    numberOfLiveKT: numberOfLiveKT,
    numberOfDeadKT: numberOfDeadKT,
    numberOfAcademicGaps: numberOfAcademicGaps,
    numberOfDegreeGaps: numberOfDegreeGaps,
    ctcOffered: ctcOffered,
    jobDescription: jobDescription,
    jobRole: jobRole,
    jobType: jobType,
    jobLocation: jobLocation.split(","),
    skillsRequired: skillsRequired.split(",")
  };

  const newDrive = new CompanyDrive(companyDriveData);
  newDrive
    .save()
    .then(data => {
      res.status(200).json({ success: true, message: "Drive added successfully" });
    })
    .catch(err => {
      res.status(400).json({ success: false, message: "Unable to add drive", error: err });
    })
});

companyController.post("/updateDrive", (req, res) => {
  !req.body.driveId ? res.json({ success: false, error: "Drive Id not recieved." }) :
    CompanyDrive.updateOne({ _id: req.body.driveId }, req.body.updatedData).then(err => {
      err.matchedCount == 1 ? res.status(200).json({
        success: true,
        message: `Updated drive ID ${req.body.driveId} successfully.`
      })
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
        message: `Deleted drive ID ${req.body.driveId} successfully.`
      })
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