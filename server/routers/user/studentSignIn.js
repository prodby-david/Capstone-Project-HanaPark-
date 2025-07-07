import express from 'express';
import studentSignInController from '../../controllers/users/signin.js';


const UserRouter = express.Router();

UserRouter.post('/sign-in', studentSignInController);


export default UserRouter;