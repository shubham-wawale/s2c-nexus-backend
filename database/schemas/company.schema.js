import { Schema } from 'mongoose';
import sha256 from 'sha256';

const companyCredentialSchema = new Schema({
    hashedPassword: { type: String, required: true },
    email: { type: String, required: true },
});
/**
 * @param {*} password
 */

const companyInfoSchema = new Schema({
    companyId: { type: String, required: true },
    studentsHired: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    yearOfEstablishment: { type: String, required: true },
    goalDescription: { type: String, required: true },
    popularRoles: { type: [String], required: true }
});

const driveSchema = new Schema({
    companyId: { type: String, required: true },
    driveName: { type: String, required: true },
    branchesPreferred: { type: String, required: true },
    batch: { type: Number, required: true },
    eligibility: { type: [String], required: true },
    driveRole: { type: String, required: true },
    ctcOffered: { type: Number, required: true },
    jobDescription: { type: [String], required: true },
    skillsRequired: { type: [String], required: true }

});

const companyDriveSchema = new Schema({
    drives: { type: [driveSchema] }
});


companyCredentialSchema.methods.comparePassword = function comparePassword(password) {
    return this.hashedPassword === sha256(password);
};

export {
    companyCredentialSchema,
    companyInfoSchema,
    companyDriveSchema,
    driveSchema
};


