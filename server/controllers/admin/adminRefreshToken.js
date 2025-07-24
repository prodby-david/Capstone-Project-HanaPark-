import jwt from 'jsonwebtoken';


const AdminRefreshTokenController = async (req,res) => {

    const payload = {
    userId: req.user.userId,
    role: 'admin'
    };

    const newAdminAccessToken = jwt.sign(payload, process.env.ADMIN_ACCESS_KEY , { expiresIn:'1h' });

    res.cookie('token', newAdminAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,
        sameSite: 'Strict'
    });

    res.status(200).json({message: 'New access token issued. '});

}

export default AdminRefreshTokenController;