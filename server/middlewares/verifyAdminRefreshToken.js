import jwt from 'jsonwebtoken';


const VerifyAdminRefreshToken = async (req,res,next) => {

    const admin_refresh_token = req.cookies.admin_refresh_token;

    if(!admin_refresh_token){
        return res.status(401).json({message: ' No refresh token provided.'});
    }

    try{
        const decoded = jwt.verify(admin_refresh_token, process.env.ADMIN_REFRESH_KEY);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(403).json({message: 'Invalid refresh token.'});
    }

}

export default VerifyAdminRefreshToken;