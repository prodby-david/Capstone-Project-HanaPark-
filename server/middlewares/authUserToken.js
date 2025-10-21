import jwt from "jsonwebtoken";
import User from "../models/user.js";


const authToken = async (req, res, next) => {
    
    const user_token = req.cookies.user_token;

    if (!user_token) {
        return res.status(401).json({ message: "Unauthorized access. No token provided." });
    }

    try {

        const decoded = jwt.verify(user_token, process.env.USER_ACCESS_KEY);

        const user = await User.findById(decoded.userId);

        if (!user) {
        return res.status(401).json({ message: "Unauthorized: User no longer exists." });
        }

        if (user.isLocked) {
        return res.status(403).json({ message: "Account is locked. Please contact the administrator.", });
        }

        if (user.currentToken !== user_token) { return res.status(401).json({ message: "Logged in on another device"});
        }

        req.user = {
            userId: decoded.userId,
            userType: decoded.userType 
        };
        next(); 
        
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(401).json({ message: "Forbidden. Invalid token." });
    }
};

export default authToken;