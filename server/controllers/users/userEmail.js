import User from "../../models/user.js";


const UpdateEmail = async (req,res) => {
    try {
        const { email } = req.body;
        const userId = req.user.userId;

        if(!email){
            return res.status(400).json({message: 'Email is required.'});
        }

        const existingUser = await User.findOne({email: email});

        if(existingUser){
            return res.status(409).json({message: 'Email already used.'});
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {email: email},
            {new: true}
        )

        res.status(200).json({ message: "Email updated successfully", user: updatedUser, success: true});
        
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export default UpdateEmail;