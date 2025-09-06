import { createNewStackHolder, updateStackHolder, deleteStackHolder, getStackHolder, getAllStackHolders, searchStackHolders } from "../controllers/stackHolder.controller.js";
import express from "express";
import getUserByCookies from '../middleware/getUser.js';

const stackHolderRouter = express.Router();

stackHolderRouter.route('/create').post(getUserByCookies, createNewStackHolder);
stackHolderRouter.route('/update/:stackHolderId').patch(getUserByCookies, updateStackHolder);
stackHolderRouter.route('/delete/:stackHolderId').delete(getUserByCookies, deleteStackHolder);
stackHolderRouter.route('/get/:stackHolderId').get(getUserByCookies, getStackHolder);
stackHolderRouter.route('/all').get(getUserByCookies, getAllStackHolders);
stackHolderRouter.route('/search').get(getUserByCookies, searchStackHolders);

export default stackHolderRouter;