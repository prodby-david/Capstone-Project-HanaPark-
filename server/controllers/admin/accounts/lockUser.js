import User from "../../../models/user.js";


const LockUser = async (req,res) => {

    try {
        const { id } = req.params;
        const {isLocked, lockReason} = req.body;

        const user = await User.findOneAndUpdate(
            id, {isLocked, lockReason}, { new: true }
        )

        if (!user){
            return res.status(404).json({message: "User not found"});
        }

        res.status(200).json({message: 'User account locked successfully'})
        
    } catch (err) {
        res.status(500).json({ message: 'Error unlocking user.', err });
    }
}

export default LockUser;