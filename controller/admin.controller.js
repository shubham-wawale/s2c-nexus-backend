import express from 'express';
import { AdminInfo } from '../database/models';
import sha256 from "sha256";

const adminController = express.Router();

adminController.get("/login", (req, res) => {
  const { email, password } = req.query;
  console.log(req.query)
  AdminInfo.findOne({ 'email': email }).then(user => {
    if (!user) {
      res.json({ success: false, message: `Admin with email ${email} does not exist.` })
    } else {
      if (user.hashedPassword != sha256(password)) {
        res.json({ success: false, message: "Incorrect Password" })
      } else {
        //replace returning IDs with JWT token
        res.json({ success: true, adminId: user._id, message: "Admin successfully logged in." })
      }
    }
  })
    .catch(err => {
      res.json({ success: false, error: err })
    })
})

adminController.post("/signup", (req, res) => {
  if (req.body) {
    const { email, password } = req.body;
    const credentials = {
      email: email,
      hashedPassword: sha256(password)
    }
    AdminInfo.find({ 'credentials.email': email }).then(admin => {
      if (admin.length == 0) {
        const adminInfo = new AdminInfo(credentials)
        adminInfo.save().then(data => {
          res.status(200).json({ success: true, adminId: data._id, message: "Credentials added to admin database" })
        }).catch(error => {
          res.status(400).json({ success: false, error: error, message: "Error adding credentials to the admin database" })
        })
      } else {
        res.status(200).json({ success: false, message: `Admin with ${email} already exists.` })
      }
    })
  } else {
    res.json({ success: false, message: "Invalid request object" })
  }

})

export default adminController;