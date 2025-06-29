import jwt from "jsonwebtoken";


const authToken = (req, res, next) => {
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; 
        next(); 
    } catch (error) {
        console.error("Token verification failed:", error);
        return res.status(403).json({ message: "Forbidden. Invalid token." });
    }
};

export default authToken;