import User from "../../../models/user.js"


const DeleteUser = async (req,res) => {

    try{
        const { id } = req.params;

        const deleteUser = await User.findByIdAndDelete(id);

        if(!deleteUser){
            return res.status(404).json({message: 'User not found.'});
        }

        const updatedUsers = await User.find();
        res.status(200).json(updatedUsers);

    }catch(err){
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }

}

export default DeleteUser;