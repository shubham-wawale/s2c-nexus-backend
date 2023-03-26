import { Schema } from 'mongoose';

const adminCredentialSchema = new Schema({
    hashedPassword: { type: String, required: true },
    email: { type: String, required: true },
});

export {
    adminCredentialSchema,
}