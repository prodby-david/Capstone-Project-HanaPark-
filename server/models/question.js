import mongoose from 'mongoose'


const questionSchema = mongoose.Schema({
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

const Question = mongoose.model('Question', questionSchema);

export default Question;