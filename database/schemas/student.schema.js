import { Schema } from 'mongoose';

const studentCredentialSchema = new Schema({
    hashedPassword: { type: String, required: true },
    email: { type: String, required: true },
});

const tenthDetailsSchema = new Schema({
    marks: {type: String, required: true},
    passingYear: {type: String, required: true}
})

const higherSecondaryDetailsSchema = new Schema({
    marks: {type: String},
    passingYear: {type: String}
})

const degreeDetailsSchema = new Schema({
    name: {type: String, required: true},
    startDate: {type: String, required: true},
    completionDate: {type: String, required: true},
    semesterGPA: [String],
    marksheets: [{data: Buffer, contentType: String, required: false}]
})

const studentPersonalDetailsSchema = new Schema({
    name: {type: String},
    dateOfBirth: {type: String},
    identificationNumber: {type: String},
    mobileNumber: {type: String},
    address: {type: String}
})

const studentAcademicDetailsSchema = new Schema({
    tenth: tenthDetailsSchema,
    twelfth: higherSecondaryDetailsSchema,
    diploma: higherSecondaryDetailsSchema,
    department: {type: String, required: true},
    degree: degreeDetailsSchema,
    activeBacklogs: {type: String},
    previousBacklogs: {type: String},
    gapYear: {type: String}
})

const studentProjectDetailsSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true}
})

const studentExperienceDetailsSchema = new Schema({
    position: {type: String, required: true},
    duration: {type: String, required: true},
    organisation: {type: String, required: true},
    workDescription: {type: String, required: true}
})


const studentInfoSchema = new Schema({
    studentId: {type: String},
    credentials: studentCredentialSchema,
    personalDetails: studentPersonalDetailsSchema,
    academicDetails: studentAcademicDetailsSchema,
    projectDetails: [studentProjectDetailsSchema],
    experienceDetails: [studentExperienceDetailsSchema]
})

export {
    studentCredentialSchema,
    studentInfoSchema
}

// {
//     "studentId": "ijsnsfgkjsndfgjdf",
//     "key": "personalDetails",
//     "newData": {
//         "name": "Shubham",
//         "dateOfBirth": "10-11-2000",
//         "identificationNumber": "19IT1037",
//         "mobileNumber": "8454019013",
//         "address": "Juinagar Navi Mumbai"
//     } 
// }

// {
//     "studentId": "ijsnsfgkjsndfgjdf",
//     "personalDetails": {
//         "name": "Shubham",
//         "dateOfBirth": "10-11-2000",
//         "identificationNumber": "19IT1037",
//         "mobileNumber": "8454019013",
//         "address": "Juinagar Navi Mumbai"
//     },
//     "academicDetails": {
//         "tenth": {
//             "marks": "95%",
//             "passingYear": "2016" 
//         },
//         "department": "Information Technology",
//         "degree": {
//             "name": "BE",
//             "startDate": "2019",
//             "completionDate": "2023",
//             "semesterGPA": ["9", "10", "9", "9", "8", "9"]
//         },
//         "activeBacklogs": "0",
//         "previousBacklogs": "0",
//         "gapYear": "1"
//     },
//     "projectDetails": [{
//         "name": "PawPet",
//         "description": "Pet Sitter Hiring Platform"
//     }],
//     "experienceDetails": [{
//         "position": "SDE Intern",
//         "duration": "6",
//         "organisation": "Urneeds",
//         "workDescription": "Developed a code generation feature"
//     }]
// }