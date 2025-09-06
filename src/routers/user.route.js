import express from 'express';
import getUserByCookies from '../middleware/getUser.js';
import { registerUser, loginUser, logoutUser, getUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(getUserByCookies, logoutUser);
userRouter.route('/user/:userId').get(getUserByCookies, getUser);

export default userRouter;