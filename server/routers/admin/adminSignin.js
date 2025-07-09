import express from 'express';
import Admin from '../../models/admin.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const AdminSignIn = express.Router();

AdminSignIn.post('/admin/sign-in', async (req,res) => {

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

        const admin_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});

        res.cookie('token', admin_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,
            sameSite: 'Strict'
        });

        res.status(200).json({message: 'Admin Sign in success.', success: true});

    } 
    catch (err) {
        res.status(500).json({message: 'Server internal error.', success: false});
        return;
    }

});

export default AdminSignIn;