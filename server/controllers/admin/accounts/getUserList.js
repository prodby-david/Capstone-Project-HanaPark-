import User from "../../../models/user.js"


const FetchUsers = async (req,res) => {
    try {
        const users = await User.find().populate('vehicles').lean();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving users.' });
    }
}

export default FetchUsers;