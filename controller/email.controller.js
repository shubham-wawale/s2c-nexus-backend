const path = require('path');
const express = require('express'); 
const nodemailer = require('nodemailer');
const app = express();
const cors = require('cors')
app.use(cors())
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath)); 


const emailController = express.Router(); 
emailController.post('/users',(req,res)=>{
  const {driveData} = req.body;
  var mailList = []
  driveData.appliedStudents.map(student=> {
    if(student.rejected==false) {
      mailList.push(student.email)
    }
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
        text:req.body.description,
        html: `
        <div style="padding:10px;border-style: ridge">
        <p>You have a new contact request.</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Email: From s2c-nexus@limited </li>
            <li>Subject: ${req.body.subject}</li>
            <li>Message: ${req.body.description}</li>
        </ul>
        `

    };
     
    transporter.sendMail(mailOptions, function(error, info){
        if (error)
        {
          res.json({status: true, respMesg: 'Error!!'})
        } 
        else
        {
          res.json({status: true, respMesg: 'Email Sent Successfully'})
        }
     
      });
});


emailController.post('/offer',(req,res)=>{
  const {driveData} = req.body;
  var mailList = []
  driveData.appliedStudents.map(student=> {
    if(student.rejected==false) {
      mailList.push(student.email)
    }
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
      text:req.body.description,
      html: `
      <div style="padding:10px;border-style: ridge">
      <h1>Congratulations!!</h1>
      <ul>
          <li>Email: From s2c-nexus@limited </li>
          <li>Subject: ${req.body.subject}</li>
          <li>Message: ${req.body.description}</li>
      </ul>
      <p>Dear [Candidate Name],

      I am delighted to offer you the position of [Job Title] at [Company Name]. After carefully considering your qualifications and experience, we believe you are an excellent fit for our team. <br>
      The position offers a [Full-time/Part-time/Contract/Internship] employment status. Your compensation package includes a starting salary of [Salary], health insurance, and a 401(k) plan. <br>    
      Please note that this offer is contingent on satisfactory results of a background check and any other pre-employment screening that may be required. We will be sending you additional details on this shortly. Please review and sign the attached documents, which include your job description and other important details about your employment. <br>   
      To accept the offer, please sign the enclosed copy of the offer letter and return it to us within 3-4 working days. <br>
      We are excited to have you join our team and look forward to your contributions. If you have any questions or concerns, please do not hesitate to contact us.<br>
      
      Best regards,<br>
      
      [Company Name] </p> 
      `
      
  };
   
  transporter.sendMail(mailOptions, function(error, info){
      if (error)
      {
        res.json({status: true, respMesg: 'Error!!'})
      } 
      else
      {
        res.json({status: true, respMesg: 'Email Sent Successfully'})
      }
   
    });
});
 
export default emailController;