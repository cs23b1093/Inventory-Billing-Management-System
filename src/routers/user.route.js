import express from 'express';
import getUserByCookies from '../middleware/getUser.js';
import { registerUser, loginUser, logoutUser, getUser } from '../controllers/user.controller.js';

const router = express.Router();
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(getUserByCookies, logoutUser);
router.route('/user/:userId').get(getUserByCookies, getUser);

export default router;