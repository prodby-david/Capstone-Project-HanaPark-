import User from '../../../models/user.js'
import Vehicle from '../../../models/vehicle.js'
import { normalizeVehicleType } from '../../../utils/vehicleTypes.js';


const studentRegistrationController = async (req,res) => {

    try{

        const {userType, lastname, firstname, middlename, studentId, username, password, email, vehicleType, brand, model, plateNumber, transmission, color} = req.body;

        const existingStudentId = await User.findOne({ studentId });
        if(existingStudentId){
            return res.status(409).json({message: 'Student ID exist. Please try again.'});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(409).json({message: 'Email already used. Please try a different one.'});
        }

        const newUser = new User ({userType, lastname, firstname, middlename, studentId, username, password, email});

        await newUser.save();

        const existingPlateNumber = await Vehicle.findOne({plateNumber});
        if(existingPlateNumber){
            return res.status(409).json({message: 'Plate number already registered. Please try a different one.'});
        }

        const normalizedType = normalizeVehicleType(vehicleType);

        const newVehicle = new Vehicle ({vehicleOwner: newUser._id, vehicleType: normalizedType , brand, model, plateNumber, transmission, color});

        await newVehicle.save();

        newUser.vehicle = newVehicle._id;
        
        await newUser.save();

        return res.status(201).json({message: 'Registration successful.', success: true});

    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'An unexpected error occured. Please try again later.'});
    }

};

export default studentRegistrationController;