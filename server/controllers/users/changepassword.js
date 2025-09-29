import User from "../../models/user.js";
import bcrypt from 'bcrypt';


const ChangePasswordController = async (req,res) => {

    try {
        const {currentpassword, newpassword} = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(currentpassword, user.password);

        if(!isMatch){
            return res.status(400).json({message: 'Current password is incorrect'});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newpassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully", success: true});

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

export default ChangePasswordController;