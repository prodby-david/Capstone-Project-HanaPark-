import jwt from 'jsonwebtoken';



const UserRefreshTokenController = async(req,res) => {
    const payload = {
        user: user._id,
        role: 'user'
    }

    const newUserAccessToken = jwt.sign(payload, process.env.USER_ACCESS_KEY, {expiresIn:'1h'});

    res.cookie('token', newUserAccessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000,
        sameSite: 'Strict'
    });

    res.status(200).json({message: 'New access token acquired.'});

}

export default UserRefreshTokenController;