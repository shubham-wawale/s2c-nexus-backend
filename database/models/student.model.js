import mongoose from 'mongoose';
import { studentCredentialSchema, studentInfoSchema} from '../schemas/student.schema';

const StudentCredential = mongoose.model('StudentCredential', studentCredentialSchema);
const StudentInfo = mongoose.model('StudentInfo', studentInfoSchema);

export {
    StudentCredential,
    StudentInfo
}