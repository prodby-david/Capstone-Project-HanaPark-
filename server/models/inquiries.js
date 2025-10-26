import mongoose from 'mongoose'


const inquirySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    subject:{
        type: String,
        required: true,
    },
    message:{
        type: String,
        required: true
    }
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

export default Inquiry;