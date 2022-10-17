import mongoose from 'mongoose';
import {companyCredentialSchema,companyInfoSchema,driveSchema} from '../schemas/user.schema';
const CompanyUser = mongoose.model('CompanyUser', companyCredentialSchema);
const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema);
const CompanyDrive = mongoose.model('CompanyDrive', driveSchema);

export {
    CompanyUser,
    CompanyDrive,
    CompanyInfo
}