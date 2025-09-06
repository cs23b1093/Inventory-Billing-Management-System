import { asyncHandler } from '../middleware/errorHandler.js';
import { User } from '../models/user.model.js';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/errorFormat.js';
import { validateNewUserData, validateLoginData } from '../utils/user.validate.js';
import generateToken from '../utils/genrateToken.js';

const registerUser = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit register user...');
        const error = validateNewUserData(req.body);
        if (error) {
            logger.error(error.message);
            const apiError = new ApiError({ message: error.message, status: 400, error: error })
            return res.status(400).json({
                ...apiError 
            })
        }
        
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            logger.error('user already exists');
            const apiError = new ApiError({ message: 'User already exists', status: 400 })
            return res.status(400).json({
                ...apiError
            })
        }

        const user = new User({
            username,
            email,
            password
        
        })
        await user.save();
        logger.info('user saved');

        const userData = user.toObject();
        delete userData.password;
        res.status(201).json({
            message: 'User created successfully',
            user
        })
    } catch (error) {
        logger.error(`Register failed: unexpected error: ${error.message}}`, {
            errorMessage: error?.message,
            stack: error?.stack,
            path: req.originalUrl,
            method: req.method,
            bodyKeys: Object.keys(req.body || {})
        })
        res.status(500).json({
            message: `Internal server error while registering user: ${error.message}}`
        })
    }
})

const loginUser = asyncHandler(async (req, res, next) => {
    try {
        const error = validateLoginData(req.body);
        if (error) {
            logger.error(error.details[0].message);
            const apiError = new ApiError({ message: error.details[0].message, status: 400, error: error })
            return res.status(400).json({
                ...apiError 
            })
        }

        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            logger.error('user not found');
            const apiError = new ApiError({ message: 'User not found', status: 404 })
            return res.status(404).json({
                ...apiError
            })
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            logger.error('password is incorrect');
            const apiError = new ApiError({ message: 'Password is incorrect', status: 401 })
            return res.status(401).json({
                ...apiError
            })
        }

        const { accessToken, refreshToken } = await generateToken(user._id);
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.cookie('refreshToken', refreshToken, options);
        res.cookie('accessToken', accessToken, options);

        const userData = user.toObject();
        delete userData.password;

        logger.info('user logged in');
        res.status(200).json({
            message: 'User logged in successfully',
            user: userData,
            accessToken,
            refreshToken
        })
    } catch (error) {
        logger.error(`Login failed: unexpected error: ${error.message}`, {
            errorMessage: error?.message,
            stack: error?.stack,
            path: req.originalUrl,
            method: req.method,
            bodyKeys: Object.keys(req.body || {})
        })
        res.status(500).json({
            message: `Internal server error while logging in user: ${error.message}`
        })
    }
})

const logoutUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            logger.error('user not found');
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 10
        }
        
        res.clearCookie('accessToken', options);
        res.clearCookie('refreshToken', options);
    
        logger.info('user logged out');
        res.status(200).json({
            message: 'User logged out successfully'
        })
    } catch (error) {
        logger.error(`Logout failed: unexpected error: ${error.message}}`)
        res.status(500).json({
            message: `Internal server error while logging out user: ${error.message}}`
        })
    }
})

const getUser = asyncHandler(async (req, res, next) => {
    try {
        logger.info('hit get user...');

        const userId = req.params.userId;
        if (!userId) {
            logger.error('id not provided');
            return res.status(404).json({
                message: 'id not provided'
            })
        }

        const user = await User.findById(userId);
        if (!user) {
            logger.error('user not found');
            return res.status(404).json({
                message: 'User not found'
            })
        }

        const userData = user.toObject();
        delete userData.password;
        logger.info('user found');
        res.status(200).json({
            message: 'User found successfully',
            user: userData
        })
    } catch (error) {
        logger.error(`Get user failed: unexpected error: ${error.message}}`);
        res.status(500).json({
            message: `Internal server error while getting user: ${error.message}}`
        })
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getUser
}