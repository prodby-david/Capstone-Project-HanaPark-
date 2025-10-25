import express from 'express';
import AdminSignInController from '../../controllers/admin/adminSignIn.js';
import CreateSlot from '../../controllers/admin/slots/createSlot.js';
import FetchSlots from '../../controllers/admin/slots/fetchSlots.js';
import EditSlot from '../../controllers/admin/slots/editSlot.js';
import DeleteSlot from '../../controllers/admin/slots/deleteSlot.js';
import AdminRegistrationController from '../../controllers/admin/adminRegistration.js';
import VerifyAdminController from '../../controllers/admin/verifyAdmin.js';
import FetchUsers from '../../controllers/admin/accounts/getUserList.js'
import DeleteUser from '../../controllers/admin/accounts/deleteUser.js'
import studentRegistrationController from '../../controllers/admin/accounts/registerUser.js';
import authAdminToken from '../../middlewares/authAdminToken.js';
import authRoles from '../../middlewares/verifyRoles.js';
import FetchOneSlot from '../../controllers/admin/slots/fetchOneSlot.js';
import VerifyAdminRefreshToken from '../../middlewares/verifyAdminRefreshToken.js';
import AdminRefreshTokenController from '../../controllers/admin/adminRefreshToken.js';
import ClearAdminCookies from '../../controllers/admin/accounts/clearcookie.js';
import LockUser from '../../controllers/admin/accounts/lockUser.js';
import fetchReservation from '../../controllers/admin/reservation/getUsersReservation.js';
import VerifyReservation from '../../controllers/admin/reservation/verifyReservation.js';
import ApproveReservation from '../../controllers/admin/reservation/manualApproving.js';
import GetCompletedReservation from '../../controllers/admin/reservation/completedReservations.js';
import ArchiveUser from '../../controllers/admin/accounts/archived.js';
import cancelReservation from '../../controllers/admin/reservation/cancelReservation.js';
import GetAllFeedbacks from '../../controllers/users/getFeedback.js';
import getActivityLogs from '../../controllers/admin/activitylogs.js';
import UnarchiveUser from '../../controllers/admin/accounts/unarchive.js';
import GetUserInquiries from '../../controllers/admin/inquiries.js';



const AdminRoute = express.Router();

AdminRoute.post('/sign-in', AdminSignInController);
AdminRoute.post('/passcode-verification', VerifyAdminController);
AdminRoute.get('/slots', FetchSlots);
AdminRoute.get('/slots/:id', FetchOneSlot);
AdminRoute.get('/users', FetchUsers);
AdminRoute.get('/refresh', VerifyAdminRefreshToken, AdminRefreshTokenController);
AdminRoute.post('/logout', ClearAdminCookies);

AdminRoute.use(authAdminToken);
AdminRoute.use(authRoles('admin'));

AdminRoute.post('/student-registration', studentRegistrationController);
AdminRoute.post('/account', AdminRegistrationController);
AdminRoute.post('/slots', CreateSlot);

AdminRoute.post('/verify-reservation', VerifyReservation);
AdminRoute.post("/approve-reservation/:id", ApproveReservation);

AdminRoute.get('/reservations', fetchReservation);
AdminRoute.get('/reservations/completed', GetCompletedReservation);
AdminRoute.get('/feedbacks', GetAllFeedbacks);
AdminRoute.get('/activities', getActivityLogs)
AdminRoute.get('/inquiries', GetUserInquiries)

AdminRoute.put('/slots/:id', EditSlot);

AdminRoute.patch('/lock/:id', LockUser);
AdminRoute.patch('/archive/:id', ArchiveUser);
AdminRoute.patch('/unarchive/:id', UnarchiveUser)
AdminRoute.patch('/reservation/cancel/:id', cancelReservation);

AdminRoute.delete('/slots/:id', DeleteSlot);

AdminRoute.delete('/users/:id', DeleteUser);


export default AdminRoute;