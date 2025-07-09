import express from 'express';
import VerifyAdminController from '../../controllers/admin/verifyAdmin.js';

const VerifyAdmin = express.Router();

VerifyAdmin.post('/admin/passcode', VerifyAdminController);

export default VerifyAdmin;