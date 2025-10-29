import User from "../../models/user.js";
import UserLog from '../../models/userlog.js'



const Logout = async (req,res) => {

    try {

        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (user) {
            await User.findByIdAndUpdate(userId, { currentToken: null });

           const log = await UserLog.create({
            userId: user._id,
            action: 'logged out',
            description: `${user.firstname} ${user.lastname} logged out.`,
            });
        }
        
        res.clearCookie('user_token', {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite: 'Strict'
        });
        res.clearCookie('user_refresh_token', {
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'Strict'
        });

        res.status(200).json({ message: 'Cookies cleared successfully.' });

    } catch (err) {
        res.status(500).json({ message: 'Server error while logging out.' });
    }
}

export default Logout;