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



const UserRouter = express.Router();

UserRouter.post('/reset-password', ForgotPasswordController);
UserRouter.post('/sign-in', studentSignInController);
UserRouter.post('/reset-password/:token', ResetPasswordController);
UserRouter.get('/slots', FetchSlots);
UserRouter.get('/user-vehicle', authUserToken, GetUserVehicleController );
UserRouter.get('/refresh', VerifyUserRefreshToken, UserRefreshTokenController );
UserRouter.post('/logout', ClearUserCookies);
UserRouter.get('/reset-password/:token', VerifyResetToken)




export default UserRouter;