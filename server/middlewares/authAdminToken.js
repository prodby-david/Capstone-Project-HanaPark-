import jwt from "jsonwebtoken";


const authAdminToken = async (req, res, next) => {
    
    const admin_token = req.cookies.admin_token;

    if (!admin_token) {
        return res.status(401).json({ message: "Unauthorized access. No token provided." });
    }

    try {
        const decoded = jwt.verify(admin_token, process.env.ADMIN_ACCESS_KEY);
        req.user = decoded; 
        next(); 
        
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Forbidden. Invalid token." });
    }
};

export default authAdminToken;