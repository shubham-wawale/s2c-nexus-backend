import { Schema } from 'mongoose';

const message = new Schema({
    username: {type: String},
    question: {type: String},
    replies: {type: Array, "default": []},
},
{timestamps: true}
)

export default message;