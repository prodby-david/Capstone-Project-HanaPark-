
const ClearAdminCookies = (req,res) => {

    res.clearCookie('admin_token', {
        httpOnly:true,
        secure: true,
        sameSite: 'Strict'
    });
    res.clearCookie('admin_refresh_token', {
        httpOnly:true,
        secure: true,
        sameSite: 'Strict'
    });
    res.status(200).json({ message: 'Logged out successfully.' });
}

export default ClearAdminCookies;