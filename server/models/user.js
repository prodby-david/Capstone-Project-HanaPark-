import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({ 

    studentId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true  
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
    },
    lastname: {
        type: String,
        required: true
    },
    courses:{
        type: String,
        required: true,
    },
    yearLevel:{
        type: String,
        required: true
    }
});


const User = mongoose.model('User', userSchema);

export default User;