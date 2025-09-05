import { asyncHandler } from '../middleware/errorHandler.js';
import { User } from '../models/user.model.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/errorFormat.js';
import { validateNewUserData, validateLoginData } from '../utils/user.validate.js';

const registerUser = asyncHandler(async (req, res, next) => {
    
})

const loginUser = asyncHandler(async (req, res, next) => {

})

const logoutUser = asyncHandler(async (req, res, next) => {

})

const getUser = asyncHandler(async (req, res, next) => {

})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}