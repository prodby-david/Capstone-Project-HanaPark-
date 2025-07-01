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

        const user_token = jwt.sign({userId: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: "5m"});

        res.cookie('token', user_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'Strict'
        });

        res.status(200).json({message: "Sign in successful.", success: true, 
            user: {
            firstname: user.firstname,
            }
        });

    }catch(err){
        console.error(err);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export default studentSignInController;