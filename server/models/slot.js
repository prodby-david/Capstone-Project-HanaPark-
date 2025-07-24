import mongoose from 'mongoose'

const slotSchema = mongoose.Schema({
    slotUser:{
        type: String,
        enum: ['Student', 'Staff', 'Visitor'],
        required: true
    },
    slotNumber:{
        type: String,
        required: true,
        unique: true
    },
    slotPrice:{
        type:Number,
        required: true
    },
    slotType:{
        type: String,
        required: true
    },
    slotStatus:{
        type: String,
        enum: ['Available', 'Reserved', 'Occupied', 'Ongoing Maintenance'],
        default: 'Available',
        required: true
    },
    slotDescription:{
        type: String,
    }
});

const Slot = mongoose.model('Slot', slotSchema);

export default Slot;