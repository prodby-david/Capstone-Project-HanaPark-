import mongoose from 'mongoose'


const staffSchema = mongoose.Schema({
    staffrole:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    personnelnumber:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    vehicleType:{
        type: String,
        required: true,
    },
    plateNumber:{
        type: String,
        required: true,
        unique: true
    },
})

staffSchema.pre('save', async function (next) {
    
    if (this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
        next();
});

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;