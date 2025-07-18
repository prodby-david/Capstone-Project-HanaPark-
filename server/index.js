import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import StudentAccountRouter from './routers/admin/studentAccount.js';
import UserRouter from './routers/user/studentSignIn.js';
import AdminRegistration from './routers/admin/registerAdmin.js';
import VerifyAdmin from './routers/admin/verifyAdmin.js';
import AdminSignIn from './routers/admin/adminSignin.js';


dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
}));

app.use(express.json());
app.use(cookieParser());

app.use(StudentAccountRouter, UserRouter, AdminRegistration, VerifyAdmin, AdminSignIn);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
});


