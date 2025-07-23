import express from 'express';
import studentSignInController from '../../controllers/users/signin.js';
import FetchSlots from '../../controllers/admin/slots/fetchSlots.js';
import UserRefreshTokenController from '../../controllers/users/userRefreshToken.js';
import VerifyUserRefreshToken from '../../middlewares/verifyUserRefreshToken.js';



const UserRouter = express.Router();

UserRouter.post('/sign-in', studentSignInController);
UserRouter.get('/slots', FetchSlots);
UserRouter.get('/refresh', UserRefreshTokenController, VerifyUserRefreshToken);


export default UserRouter;