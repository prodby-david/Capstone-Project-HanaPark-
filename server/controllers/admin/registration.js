import User from '../../models/user.js'
import Vehicle from '../../models/vehicle.js'


const studentRegistrationController = async (req,res) => {

    try{

        const {lastname, firstname, middlename, studentId, username, password, email, course, yearLevel,vehicleType, brand, model, plateNumber, transmission, color} = req.body;

        const existingStudentId = await User.findOne({ studentId });
        if(existingStudentId){
            return res.status(409).json({message: 'Student ID exist. Please try again.'});
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(409).json({message: 'Email already used. Please try a different one.'});
        }

        const newUser = new User ({lastname, firstname, middlename, studentId, username, password, email, course, yearLevel});

        await newUser.save();

        const existingPlateNumber = await Vehicle.findOne({plateNumber});
        if(existingPlateNumber){
            return res.status(409).json({message: 'Plate number already registered. Please try a different one.'});
        }

        const newVehicle = new Vehicle ({vehicleOwner: newUser._id, vehicleType, brand, model, plateNumber, transmission, color});

        await newVehicle.save();

        return res.status(201).json({message: 'Registration successful.', success: true});

    }catch(err){
        console.log(err)
        return res.status(500).json({message: 'An unexpected error occured. Please try again later.'});
    }

};

export default studentRegistrationController;