const path = require('path');
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors')
app.use(cors())
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));
import { StudentInfo } from '../database/models';


const emailController = express.Router();
emailController.post('/users', (req, res) => {
  const { driveData } = req.body;
  var mailList = []
  // var customDriveData = {
  //   id: driveData._id,
  //   driveName: driveData.driveName,
  //   jobRole: driveData.jobRole,
  //   jobType: driveData.jobType,
  //   ctcOffered: driveData.ctcOffered,
  //   location: driveData.jobLocation
  // }
  driveData.appliedStudents.map(student => {
    if (student.rejected == false) {
      mailList.push(student.email)
    }
  })
  // const filters = {
  //   arrayFilters: [
  //     {
  //       "credentials.email": {$in: mailList}
  //     }
  //   ]
  // }
  // StudentInfo.updateMany({}, update, filters)
  // .then(update=>{ 
  //   console.log(update)
  //   if(update.n >=1){
  //     res.json({success:true, message:"Succesfully updated student offers"})
  //   } else {
  //     res.json({success:false, message:"Error updating student offers"})
  //   }
  // }).catch(error=> {
  //   res.json({success:false, message:error})
  // })
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 's2cnexus@gmail.com',
      pass: 'fsoiaxencpjwbmjj'
    }
  });

  var mailOptions = {
    from: 's2cnexus@gmail.com',// sender address
    to: mailList, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.description,
    html: `
        <div style="padding:10px;border-style: ridge">
        <ul>
            <li>Email: From s2c-nexus@limited </li>
            <li>Subject: ${req.body.subject}</li>
            <li>Message: ${req.body.description}</li>
        </ul>
        `

  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.json({ status: true, respMesg: 'Error!!' })
    }
    else {
      res.json({ status: true, respMesg: 'Email Sent Successfully' })
    }

  });
});


emailController.post('/offer', (req, res) => {
  const { driveData } = req.body;
  var mailList = []
  var customDriveData = {
    id: driveData._id,
    driveName: driveData.driveName,
    jobRole: driveData.jobRole,
    jobType: driveData.jobType,
    ctcOffered: driveData.ctcOffered,
    location: driveData.jobLocation
  }
  driveData.appliedStudents.map(student => {
    if (student.rejected == false) {
      mailList.push(student.email)
    }
  })

  const query = {
    "credentials.email": { $in: mailList }
  }
  const update = {
    $inc: {
      "offerCount": 1
    },
    $push: {
      offers: customDriveData
    }
  }

  StudentInfo.updateMany(query, update)
    .then(update => {
      console.log(update)
      if (update.n >= 1) {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.json({ status: true, respMesg: 'Error!!' })
          }
          else {
            res.json({ status: true, respMesg: 'Email Sent Successfully' })
          }
      
        });
      } else {
        res.json({ success: false, respMesg: "Error updating student offers" })
      }
    }).catch(error => {
      res.json({ success: false, message: error })
    })

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ashutoshkarwa18@gmail.com',
      pass: 'hpurduewakvqhubl'
    }
  });

  var mailOptions = {
    from: 'ashutoshkarwa18@gmail.com',// sender address
    to: mailList, // list of receivers
    subject: req.body.subject, // Subject line
    text: req.body.description,
    html: `
      <div style="padding:10px;border-style: ridge">
      <h1>Congratulations!!</h1>
      <ul>
          <li>Email: From s2c-nexus@limited </li>
          <li>Subject: ${req.body.subject}</li>
          <li>Message: ${req.body.description}</li>
      </ul>
      <p>Dear Akansha Tripathi,

      I am delighted to offer you the position of Software Eng at Tera Data. After carefully considering your qualifications and experience, we believe you are an excellent fit for our team. <br>
      The position offers a Full-time employment status. Your compensation package includes a starting salary of 7LPA, health insurance, and a 401(k) plan. <br>    
      Please note that this offer is contingent on satisfactory results of a background check and any other pre-employment screening that may be required. We will be sending you additional details on this shortly. Please review and sign the attached documents, which include your job description and other important details about your employment. <br>   
      To accept the offer, please sign the enclosed copy of the offer letter and return it to us within 3-4 working days. <br>
      We are excited to have you join our team and look forward to your contributions. If you have any questions or concerns, please do not hesitate to contact us.<br>
      
      Best regards,<br>
      
      Tera Data </p> 
      `

  };

});

export default emailController;