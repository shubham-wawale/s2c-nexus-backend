import mongoose from 'mongoose';
import { adminCredentialSchema } from '../schemas/admin.schema';

const AdminInfo = mongoose.model('AdminInfo', adminCredentialSchema);

export {
    AdminInfo
}