import express from 'express';
import AdminRegistrationController from '../../controllers/admin/adminRegistration.js';

const AdminRegistration = express.Router();


AdminRegistration.post('/admin/create-account', AdminRegistrationController);


export default AdminRegistration;