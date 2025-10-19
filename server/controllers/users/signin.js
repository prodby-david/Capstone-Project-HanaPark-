import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



const studentSignInController = async (req,res) => {

    try{
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if(!user){
            return res.status(404).json({message: "Username not found. Try again."});
        }

        if (user.isLocked) {
        return res.status(403).json({
            message: `Your account is temporarily locked.${
            user.lockReason ? ' Reason: ' + user.lockReason : ''
            }`,
        });
        }

        const isPaswordMatch = await bcrypt.compare(password, user.password);
        if(!isPaswordMatch){
            return res.status(401).json({message: "Password is incorrect. Please try again."});
        }

        const payload = {
            userId: user._id,
            role: 'user',
            userType: user.userType
        };

        const user_token = jwt.sign(payload, process.env.USER_ACCESS_KEY, {expiresIn: "1h"});
        user.currentToken = user_token;
        await user.save();
        
        const user_refresh_token = jwt.sign(payload, process.env.USER_REFRESH_KEY, {expiresIn: "7d"});
        
        res.cookie('user_token', user_token, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 1000,
            sameSite: 'None'
        });

        res.cookie('user_refresh_token', user_refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({message: "Sign in successful", success: true, 
            user: {
            firstname: user.firstname,
            userType: user.userType,
            userId: user._id
            }
        });

    }catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export default studentSignInController;