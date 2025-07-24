import jwt from "jsonwebtoken";
import User from "../models/user.js";


const authToken = async (req, res, next) => {
    
    const user_token = req.cookies.token;

    if (!user_token) {
        return res.status(401).json({ message: "Unauthorized access. No token provided." });
    }

    try {

        const decoded = jwt.verify(user_token, process.env.USER_ACCESS_KEY);

        const user = await User.findById(decoded.userId);

        if (!user) {
        return res.status(401).json({ message: "Unauthorized: User no longer exists." });
        }

        req.user = decoded; 
        next(); 
        
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Forbidden. Invalid token." });
    }
};

export default authToken;