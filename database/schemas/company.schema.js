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
    branchesPreferred: { type: [String], required: true },
    batch: { type: String, required: true }, 
    tenthPercentage: { type: String, required: true },
    twelfthPercentage: { type: String, required: true },
    cgpa: { type: String, required: true },
    cgpaInPercentage: { type: String, required: true },
    numberOfLiveKT: { type: String, required: true },
    numberOfDeadKT: { type: String, required: true },
    numberOfAcademicGaps: { type: String, required: true },
    numberOfDegreeGaps: { type: String, required: true },
    ctcOffered: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobRole: { type: String, required: true },
    jobType: { type: String, required: true },
    jobLocation: { type: [String], required: true },
    skillsRequired: { type: [String], required: true }

});

const appliedStudentsDriveSchema = new Schema({
    driveId: { type: String, required: true },
    appliedStudents: {type: Array, "default": [] }
});


companyCredentialSchema.methods.comparePassword = function comparePassword(password) {
    return this.hashedPassword === sha256(password);
};

export {
    companyCredentialSchema,
    companyInfoSchema,
    appliedStudentsDriveSchema,
    driveSchema
};


