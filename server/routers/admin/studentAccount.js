import express from 'express';
import studentRegistrationController from '../../controllers/admin/registration.js';


const StudentAccountRouter = express.Router();


StudentAccountRouter.post('/admin/student-registration', studentRegistrationController);


export default StudentAccountRouter;