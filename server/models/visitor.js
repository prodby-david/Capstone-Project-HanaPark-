import mongoose from 'mongoose'

const visitorSchema = new mongoose.Schema({
    visitorName: {
        type: String,
        required: true
    },
    contactNumber:{
        type: Number,
        required: true
    },
    purposeOfVisit:{
        type: String,
        required: true
    },
})

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;