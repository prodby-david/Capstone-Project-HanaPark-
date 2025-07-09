import mongoose from 'mongoose';
import bcrypt  from 'bcrypt';

const adminSchema = mongoose.Schema({
    adminusername:{
        type: String,
        required: true,
        unique: true,
    },
    adminpassword:{
        type: String,
        required: true
    }
});

adminSchema.pre('save', async function (next) {
    
    if (this.isModified('adminpassword')){
        const salt = await bcrypt.genSalt(10);
        this.adminpassword = await bcrypt.hash(this.adminpassword, salt);
    }
        next();
});

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;