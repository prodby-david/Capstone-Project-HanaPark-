import Staff from "../../../models/staff.js";

const CreateStaffAccount = async(req,res) => {
    try {

        const { staffrole, lastname, firstname, username, password, personnelnumber, email, vehicleType, plateNumber} = req.body;

        const existingUsername = await Staff.findOne({ username })

        if(existingUsername){
            return res.status(409).json({message: 'Username already exist'});
        }

        const staffPersonnelNumber = await Staff.findOne({ personnelnumber })

        if(staffPersonnelNumber){
            return res.status(409).json({message: 'Personnel Number already used.'});
        }

        const staffEmail = await Staff.findOne({ email })

        if(staffEmail){
            return res.status(409).json({message: 'Email already used. Try another email.'});
        }

        const staffPlateNumber = await Staff.findOne({ plateNumber })

        if(staffPlateNumber){
            return res.status(409).json({message: 'Plate Number already registered.'});
        }
        
        const newStaff = new Staff({staffrole, lastname, firstname, username, password, personnelnumber, email, vehicleType, plateNumber});

        await newStaff.save();

        res.status(201).json({message: 'Staff Account created successfully.'});
    } catch (err) {
        return res.status(500).json({message: 'Unexpected error occured.'})
    }
}

export default CreateStaffAccount;

