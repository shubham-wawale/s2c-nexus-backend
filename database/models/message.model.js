import mongoose from 'mongoose';
import message from '../schemas/discussion.schema';

const messageModel = mongoose.model('messages', message);

export default messageModel;