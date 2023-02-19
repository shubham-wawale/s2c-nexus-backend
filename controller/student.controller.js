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
  CompanyDrive.find().then(drives => {
    if (!drives) {
      res.json({ success: false, message: "No drives found." })
    } else {
      res.json({ success: true, drives: drives })
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
        data.matchedCount == 1 ? res.status(200).json({
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

export default studentController;