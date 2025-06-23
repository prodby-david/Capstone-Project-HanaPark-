import mongoose from 'mongoose'

const vehicleSchema = mongoose.Schema({

    vehicleType:{
        type: String,
        enum: ['Toyota', 'Ford', 'Mitsubishi', 'Nissan', 'Hyundai', 'Mazda', 'Suzuki', 'Isuzu', 'MG', 'Kia', 'Geely', 'Chery', 'BYD', 'Peugeot', 'Volkswagen'],
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    model:{
        type: Number,
        required: true
    },
    plateNumber:{
        type: String,
        required: true,
        unique: true
    },
    transmission:{
        type: String,
        required: true
    },
    color:{
        type: String,
        required: true
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;