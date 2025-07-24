import jwt from 'jsonwebtoken';



const VerifyUserRefreshToken = async (req,res,next) => {

    const user_refresh_token = req.cookies.user_refresh_token;

    if (!user_refresh_token) {
        return res.status(401).json({ message: "No refresh token provided." });
    }

    try{
        const decoded = jwt.verify(user_refresh_token, process.env.USER_REFRESH_KEY);
            req.user = decoded;
            next();
    }
    catch(err){
         return res.status(403).json({ message: "Invalid refresh token." });
    }

}
export default VerifyUserRefreshToken;