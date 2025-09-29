
const ClearUserCookies = (req,res) => {

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
}

export default ClearUserCookies;