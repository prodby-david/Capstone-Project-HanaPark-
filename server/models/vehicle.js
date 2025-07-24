import mongoose from 'mongoose'


const vehicleSchema = mongoose.Schema({

    vehicleOwner:{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    vehicleType:{
        type: String,
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    model:{
        type: String,
        required: true
    },
    plateNumber:{
        type: String,
        required: true,
        unique: true
    },
    transmission:{
        type: String
    },
    color:{
        type: String,
        required: true
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;