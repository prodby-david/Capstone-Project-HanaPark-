import express from 'express';
import AdminSignInController from '../../controllers/admin/adminSignIn.js';
import CreateSlot from '../../controllers/admin/slots/createSlot.js';
import FetchSlots from '../../controllers/admin/slots/fetchSlots.js';
import EditSlot from '../../controllers/admin/slots/editSlot.js';
import DeleteSlot from '../../controllers/admin/slots/deleteSlot.js';
import AdminRegistrationController from '../../controllers/admin/adminRegistration.js';
import VerifyAdminController from '../../controllers/admin/verifyAdmin.js';
import FetchUsers from '../../controllers/users/getUserList.js'
import DeleteUser from '../../controllers/users/deleteUser.js'
import studentRegistrationController from '../../controllers/users/registration.js';
import authAdminToken from '../../middlewares/authAdminToken.js';
import authRoles from '../../middlewares/verifyRoles.js';
import FetchOneSlot from '../../controllers/admin/slots/fetchOneSlot.js';

import VerifyAdminRefreshToken from '../../middlewares/verifyAdminRefreshToken.js';
import AdminRefreshTokenController from '../../controllers/admin/adminRefreshToken.js';


const AdminRoute = express.Router();

AdminRoute.get('/refresh', AdminRefreshTokenController, VerifyAdminRefreshToken);

AdminRoute.post('/account', AdminRegistrationController);
AdminRoute.post('/sign-in', AdminSignInController);
AdminRoute.post('/passcode-verification', VerifyAdminController);
AdminRoute.get('/slots', FetchSlots);
AdminRoute.get('/slots/:id', FetchOneSlot);
AdminRoute.get('/users', FetchUsers);

AdminRoute.use(authAdminToken);
AdminRoute.use(authRoles('admin'));

AdminRoute.post('/student-registration', studentRegistrationController);
AdminRoute.delete('/users/:id', DeleteUser);
AdminRoute.post('/slots', CreateSlot);
AdminRoute.put('/slots/:id', EditSlot);
AdminRoute.delete('/slots/:id', DeleteSlot);

export default AdminRoute;