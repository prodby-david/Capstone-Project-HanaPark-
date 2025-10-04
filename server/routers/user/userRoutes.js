import express from 'express';
import studentSignInController from '../../controllers/users/signin.js';
import FetchSlots from '../../controllers/admin/slots/fetchSlots.js';
import UserRefreshTokenController from '../../controllers/users/userRefreshToken.js';
import VerifyUserRefreshToken from '../../middlewares/verifyUserRefreshToken.js';
import ClearUserCookies from '../../controllers/users/clearCookies.js';
import VerifyResetToken from '../../controllers/auth/verifyResetToken.js';
import ForgotPasswordController from '../../controllers/auth/forgot-password.js';
import ResetPasswordController from '../../controllers/auth/reset-password.js';
import GetUserVehicleController from '../../controllers/users/getUserVehicle.js';
import authUserToken from '../../middlewares/authUserToken.js';
import CreateReservation from '../../controllers/users/reservation.js';
import GetUserHistory from '../../controllers/users/userHistory.js';
import CancelReservation from '../../controllers/users/cancelReservation.js';
import GetUserInfo from '../../controllers/users/getUserInfo.js';
import ChangePasswordController from '../../controllers/users/changepassword.js';
import UpdateEmail from '../../controllers/users/userEmail.js';
import UpdateVehicleController from '../../controllers/users/updateVehicle.js';
import { getUserNotifications, markAsRead, markAllAsRead } from '../../controllers/users/notification.js';
import FetchOneSlot from '../../controllers/admin/slots/fetchOneSlot.js';



const UserRouter = express.Router();

UserRouter.post('/reset-password', ForgotPasswordController);
UserRouter.get('/slots/:id', authUserToken, FetchOneSlot);
UserRouter.post('/sign-in', studentSignInController);
UserRouter.post('/reset-password/:token', ResetPasswordController);
UserRouter.get('/slots', FetchSlots);
UserRouter.get('/user-vehicle', authUserToken, GetUserVehicleController );
UserRouter.get('/refresh', VerifyUserRefreshToken, UserRefreshTokenController );
UserRouter.post('/logout', ClearUserCookies);
UserRouter.get('/reset-password/:token', VerifyResetToken);
UserRouter.post('/reservation-form/:slotId', authUserToken, CreateReservation);
UserRouter.get('/user/vehicle-type', authUserToken, GetUserVehicleController);
UserRouter.get('/recents', authUserToken, GetUserHistory);
UserRouter.patch('/cancel/:id', authUserToken, CancelReservation);
UserRouter.get('/profile', authUserToken, GetUserInfo)
UserRouter.put('/change-password', authUserToken, ChangePasswordController);
UserRouter.put('/update-email', authUserToken, UpdateEmail)
UserRouter.put('/vehicle-information', authUserToken, UpdateVehicleController);
UserRouter.get('/notifications', authUserToken, getUserNotifications)
UserRouter.patch('/read/:id', authUserToken, markAsRead)
UserRouter.patch('/notifications/mark-all-read', authUserToken, markAllAsRead)




export default UserRouter;