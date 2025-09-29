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
        const user_refresh_token = jwt.sign(payload, process.env.USER_REFRESH_KEY, {expiresIn: "7d"});
        
        res.cookie('user_token', user_token, {
            httpOnly: true,
            secure: true,
            maxAge: 30 * 60 * 1000,
            sameSite: 'None'
        });

        res.cookie('user_refresh_token', user_refresh_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });

        res.status(200).json({message: "Sign in successful", success: true, 
            user: {
            firstname: user.firstname,
            userType: user.userType,
            }
        });

    }catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export default studentSignInController;