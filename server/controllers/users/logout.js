import User from "../../models/user.js";
import UserLog from "../../models/userLog.js";



const Logout = async (req,res) => {

    try {

        const userId = req.user.userId;

        const user = await User.findById(userId);

        if (user) {
            await User.findByIdAndUpdate(userId, { currentToken: null });

            req.io.to('admins').emit('userLoggedOut', {
                userId: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                userType: user.userType,
                action: 'logged out',
                createdAt: new Date(),
            });

            await UserLog.create({
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

       const logout =  await UserLog.create({
            userId: user._id,
            action: 'logged out',
            description: `${user.firstname} ${user.lastname} logged out.`,
        });


        res.status(200).json({ message: 'Cookies cleared successfully.' });

    } catch (err) {
        res.status(500).json({ message: 'Server error while logging out.' });
    }
}

export default Logout;