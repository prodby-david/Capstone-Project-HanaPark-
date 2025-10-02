import User from "../../models/user.js";


const UpdateEmail = async (req,res) => {
    try {
        const { email } = req.body;
        const userId = req.user.userId;

        if(!email){
            return res.status(400).json({message: 'Email is required.'});
        }

        
        const user = await User.findById(userId);

        if (!user) {
        return res.status(404).json({ message: "User not found." });
        }

        if (user.email === email) {
        return res.status(200).json({
            message: "No changes made. Email is the same as current.",
            user,
            success: true
        });
    }

        const existingUser = await User.findOne({ email });

        if(existingUser && existingUser._id.toString() !== userId){
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