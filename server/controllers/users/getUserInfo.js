import User from "../../models/user.js";


const GetUserInfo = async (req,res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized. No user ID found." });
        }

        const userInfo = await User.findById(userId).select('-password');

        if(!userInfo){
           return res.status(404).json({message: 'User not found.'});
        }

        res.status(200).json({message: 'User information fetched successfully', user: userInfo} );
        
    } catch (err) {
        return res.status(500).json({message: 'Unexpected error.'});
    }
}


export default GetUserInfo;