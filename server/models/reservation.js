import mongoose, { mongo } from 'mongoose';


const reservationSchema = mongoose.Schema({
    reservedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    slotId:{
        type: mongoose.Schema.ObjectId,
        ref: 'Slot',
        required: true
    },
    slotCode:{
        type:String,
        required: true,
    },
    slotPrice:{
        type:Number,
        required: true
    },
    reservationDate:{
        type: String,
        required: true
    },
    arrivalTime:{
        type: String,
        required: true
    },
    reservationTime:{
        type: String,
        required: true
    },
    plateNumber:{
        type: String,
        required: true,
    },
    vehicleType:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['Reserved', 'Pending', 'Completed', 'Cancelled'],
        default: 'Reserved',
        required: true
    },
    verificationCode: { 
        type: String, 
        unique: true, 
        required: true 
    },
    qrCode:{
        type: String,
    },
    isEntryUsed: {
        type: Boolean, 
        default: false 
    }, 
    isExitUsed: {
        type: Boolean, 
        default: false 
    },   
    expiresAt: { 
        type: Date, 
        required: true 
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;