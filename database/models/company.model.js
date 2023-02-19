import mongoose from 'mongoose';
import {companyCredentialSchema,companyInfoSchema,driveSchema, appliedStudentsDriveSchema} from '../schemas/company.schema';

const CompanyUser = mongoose.model('CompanyUser', companyCredentialSchema);
const CompanyInfo = mongoose.model('CompanyInfo', companyInfoSchema);
const CompanyDrive = mongoose.model('CompanyDrive', driveSchema);
const AppliedStudentDrive = mongoose.model('AppliedStudentDrive', appliedStudentsDriveSchema);

export {
    CompanyUser,
    CompanyDrive,
    CompanyInfo,
    AppliedStudentDrive
}