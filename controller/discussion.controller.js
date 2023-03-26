import express from 'express';
import messageModel from '../database/models/message.model';

const discussionController = express.Router();

discussionController.get("/getMessages", (req, res) => {
    messageModel.find({}).then(messages => {
        // console.log(messages)
      if (messages.length == 0) {
        res.json({ success: false, message: "No Open Discussion found" })
      } else {
          res.json({ success: true, message_data: messages, message: "" })  
      }
    })
      .catch(err => {
        res.json({ success: false, error: err })
      })
  })

  discussionController.get("/getMessageContent", (req, res) => {
    const {msg_id} = req.query;
    messageModel.findOne({"_id": msg_id}).then(message => {
      if (!message) {
        res.json({ success: false, message: "Message Not Found" })
      } else {
          res.json({ success: true, data: message, message: "" })  
      }
    })
      .catch(err => {
        res.json({ success: false, error: err })
      })
  })

  discussionController.post("/updateMessageContent", (req, res) => {
    const {msg_id,reply} = req.body;
    console.log(req.body)
    messageModel.updateOne({"_id": msg_id},{$push:{replies:reply}}).then(update => {
      if (update.matchedCount == 1) {
        res.json({ success: true, message: "Reply added successfully." })
      } else {
          res.json({ success: false, message: "Unable to add reply." })  
      }
    })
      .catch(err => {
        res.json({ success: false, error: err })
      })
  })

discussionController.post("/addNewMessage", (req, res) => {
const {message} = req.body;
console.log(message);
const newMessage = new messageModel(message)
newMessage.save().then(message => {
    res.status(200).json({ success: true, message: "Message added to database" })
    }).catch(error => {
    res.status(400).json({ success: false, error: error, message: "Error adding message to the database" })
    })
})


export default discussionController;