import User from "../../../models/user.js";

const ArchiveUser = async(req,res) => {

    try {
        const { id } = req.params;

        const user = await User.findByIdAndUpdate(
            id,
            {status: 'Archived'},
            {new: true}
        )

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        const activeUsers = await User.find({status: 'Active'})

        res.status(200).json(activeUsers);
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }

}

export default ArchiveUser;