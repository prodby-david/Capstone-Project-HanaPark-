import mongoose from 'mongoose'

const visitorSchema = new mongoose.Schema({
    visitorSlotId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot'
    },
    visitorName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    plateNumber:{
        type: String,
        required: true,
        unique: true
    },
    contactNumber:{
        type: Number,
        required: true,
        unique: true
    },
    purposeOfVisit:{
        type: String,
        required: true
    },
    vehicleType:{ 
        type: String, 
        required: true 
    },
    status:{ 
        type: String, 
        default: 'Pending' 
    },
    createdAt:{ 
        type: Date, 
        default: Date.now 
    },
    qrCode:{
        type: String,
        required: true
    },
    isEntryUsed: {
        type: Boolean, 
        default: false 
    }, 
    isExitUsed: {
        type: Boolean, 
        default: false 
    },   
})

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;