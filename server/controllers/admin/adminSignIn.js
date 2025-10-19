import Admin from '../../models/admin.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const AdminSignInController = async (req,res) => {

    try {

        const { adminusername, adminpassword } = req.body;

        const admin = await Admin.findOne({ adminusername });

        if(!admin){
            return res.status(404).json({message: "Admin username doesn't exists."})
        }

       const isAdminPasswordMatch = await bcrypt.compare(adminpassword, admin.adminpassword);
        if(!isAdminPasswordMatch){
            return res.status(401).json({message: "Password is incorrect. Please try again."});
        }

        const payload = {
            userId: admin._id,
            role: 'admin'
        }

        const admin_token = jwt.sign(payload, process.env.ADMIN_ACCESS_KEY, {expiresIn: "1h"});

        const adminrefreshtoken = jwt.sign(payload, process.env.ADMIN_REFRESH_KEY, {expiresIn: '7d'})

        res.cookie('admin_token', admin_token, {
            httpOnly: true,
            secure: true,   
            sameSite: 'None',
            maxAge: 60 * 60 * 1000, 
        });

        res.cookie('admin_refresh_token', adminrefreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({message: 'Admin Sign in success.', success: true});

    } 
    catch (err) {
        res.status(500).json({message: 'Server internal error.', success: false});
        return;
    }

}

export default AdminSignInController;