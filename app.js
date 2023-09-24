// Import all dependencies & middleware here
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import * as dotenv from 'dotenv' ;
import cors from 'cors';
import { 
  companyController,
  studentController,
  discussionController,
  emailController,
  adminController
} from './controller';

// Init an Express App.
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ['GET', 'POST'],
    credentials: true,
  }),
);
dotenv.config()

// Use your dependencies here
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use all controllers(APIs) here
app.use("/company", companyController)
app.use("/student", studentController)
app.use("/discussion", discussionController)
app.use("/email", emailController)
app.use("/admin", adminController)

// Start Server here
app.listen(8080, () => {
  console.log('Example app listening on port 8080!');
  mongoose.connect(process.env.DB_HOST).then(() => {
    console.log(`Conneted to mongoDB cloud`);
  });
});