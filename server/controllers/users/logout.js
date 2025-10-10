import User from "../../models/user.js";



const Logout = async (req,res) => {

    try {

        const userId = req.user.userId;

        if (userId) {
            await User.findByIdAndUpdate(userId, { currentToken: null });
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