import mongoose from 'mongoose'


const feedbackSchema = mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name:{
        type: String,
        required: true
    },
    rating: {              
        type: Number,
        required: true
    },
    message:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;