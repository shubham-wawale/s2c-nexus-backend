import express from 'express';
import { StudentCredential, StudentInfo, CompanyDrive } from "../database/models";
import sha256 from "sha256";

const studentController = express.Router();

studentController.get("/login", (req, res) => {
  const { email, password } = req.query;
  StudentInfo.findOne({ 'credentials.email': email }).then(user => {
    if (!user) {
      res.json({ success: false, message: `Student with email ${email} does not exist.` })
    } else {
      if (user.credentials.hashedPassword != sha256(password)) {
        res.json({ success: false, message: "Incorrect Password" })
      } else {
        res.json({ success: true, studentId: user._id, message: "Student successfully logged in." })
      }
    }
  })
    .catch(err => {
      res.json({ success: false, error: err })
    })
})

studentController.post("/signup", (req, res) => {
  if (req.body) {
    const { email, password } = req.body;
    const credentials = {
      email: email,
      hashedPassword: sha256(password)
    }
    const studentData = {
      credentials: credentials
    }

    StudentInfo.find({ 'credentials.email': email }).then(student => {
      if (student.length == 0) {
        const studentInfo = new StudentInfo(studentData)
        studentInfo.save().then(data => {
          res.status(200).json({ success: true, studentId: data._id, message: "Credentials added to student database" })
        }).catch(error => {
          res.status(400).json({ success: false, error: error, message: "Error adding credentials to the student database" })
        })
      } else {
        res.status(200).json({ success: false, message: `Student with ${email} already exists.` })
      }
    })
  } else {
    res.json({ success: false, message: "Invalid request object" })
  }

})

studentController.get("/getDetails", (req, res) => {
  var { studentId } = req.query
  StudentInfo.findById(studentId).then(data => {
    if (data) {
      res.status(200).json({ success: true, studentData: data, message: "Student Record fetched successfully." })
    } else {
      res.status(400).json({ success: false, message: "Student Record fetched could not be fetched." })
    }
  }).catch(error => {
    res.status(400).json({ success: false, error: error, message: "Student Record could not be fetched." })
  })
})

studentController.get("/drives", (req, res) => {
  const {studentData} = req.query
  CompanyDrive.find().then(drives => {
    if (!drives) {
      res.json({ success: false, message: "No drives found." })
    } else {
      var filteredDrives = drives.filter(drive => (
        studentData.academicDetails.tenth.marks >= parseInt(drive.tenthPercentage) &&
        studentData.academicDetails.twelfth.marks >= parseInt(drive.twelfthPercentage) &&
        studentData.academicDetails.degreeCgpa >= parseInt(drive.cgpa) &&
        studentData.academicDetails.activeBacklogs <= parseInt(drive.numberOfLiveKT) &&
        studentData.academicDetails.previousBacklogs <= parseInt(drive.numberOfDeadKT) &&
        studentData.academicDetails.academicGap <= parseInt(drive.numberOfAcademicGaps) &&
        studentData.academicDetails.degreeGap <= parseInt(drive.numberOfDegreeGaps)
      ))
      res.json({ success: true, drives: filteredDrives })
    }
  })
})

// studentController.post("/addDetails", (req, res) => {
//   if (req.body.personalDetails
//     && req.body.academicDetails
//     && req.body.projectDetails
//     && req.body.experienceDetails) {
//     const studentData = {
//       studentId: req.body.studentId,
//       personalDetails: req.body.personalDetails,
//       academicDetails: req.body.academicDetails,
//       projectDetails: req.body.projectDetails,
//       experienceDetails: req.body.experienceDetails
//     }
//     const studentInfo = new StudentInfo(studentData)
//     studentInfo.save().then(savedData => {
//       res.status(200).json({ success: true, message: "Student details saved successfully." })
//     }).catch(error => {
//       res.status(400).json({ success: false, error: error, message: "Student details not saved." })
//     })
//   } else {
//     res.status(400).json({ success: false, message: "Invalid request object" })
//   }
// })

studentController.post("/updateDetails", (req, res) => {
  if (req.body.studentId
    && req.body.key
    && req.body.newData) {
    StudentInfo.updateOne({ _id: req.body.studentId },
      { [req.body.key]: req.body.newData }
      , { multi: true }).then(data => {
        data.n == 1 ? res.status(200).json({
          success: true,
          message: `UPDATED STUDENT RECORD SUCCESSFULLY`
        }) :
          res.status(400).json({ success: false, message: "STUDENT RECORD NOT UPDATED" })
      }).catch(error => {
        res.status(400).json({ success: false, error: error, message: "STUDENT RECORD NOT UPDATED" })
      })
  } else {
    res.status(400).json({ success: false, message: "INVALID REQUEST OBJECT" })
  }
})

studentController.get("/getAppliedDrives", (req, res) => {
  const {studentId} = req.query
  var customisedDriveData = []
  CompanyDrive.find({"appliedStudents.id": studentId})
  .then(drives=> {
    if(drives.length===0) {
      res.json({ success: false, message: "No drives found." })
    } else {
      drives.map(drive=> {
        var studentData = drive.appliedStudents.filter(student=> student.id===studentId)
        console.log(studentData)
        var customDriveObject = {
          driveName: drive.driveName,
          jobRole: drive.jobRole,
          ctcOffered: drive.ctcOffered,
          isRejected: studentData[0].rejected,
          interviewCleared: studentData[0].interviewCleared,
          testCleared: studentData[0].testCleared
        }
        customisedDriveData.push(customDriveObject)
      })
      res.json({ success: true, message: "Applied Drives found", drives: customisedDriveData })
    }
  })
  .catch(error=> {
    res.json({ success: false, message: error })
  })
})

export default studentController;