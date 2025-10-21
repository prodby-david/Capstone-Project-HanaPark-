import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({ 

    studentId: {
        type: Number,
        required: true,
        unique: true
    },
    userType:{
        type: String,
        enum: ['Student', 'Staff'],
        required: true
    },
    vehicle: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'Vehicle',
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
    isLocked: {
        type: Boolean,
        default: false
    },
    lockReason:{
        type: String,
        default: ''
    },
    status:{
        type: String,
        default:'Active'
    },
    violations:[
        {
        reason: { type: String, required: true },
        date: { type: Date, default: Date.now },
        },
    ],
    currentToken:{
        type: String,
        default: null
    },
    failedLoginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
});

userSchema.pre('save', async function (next) {
    
    if (this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
        next();
});

const User = mongoose.model('User', userSchema);

export default User;