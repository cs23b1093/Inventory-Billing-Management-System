import jwt from 'jsonwebtoken';
import { RefreshToken } from '../models/refreshToken.model.js';
import logger from './logger.js';
import { ApiError } from './errorFormat.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key';
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

const generateToken = async (userId) => {
    const payload = { userId };
  
    const accessToken = jwt.sign(payload, 
        JWT_SECRET, 
        { expiresIn: ACCESS_TOKEN_EXPIRY }
    )

    const refreshToken = jwt.sign(payload, 
        JWT_REFRESH_SECRET, 
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    )

    const decoded = jwt.decode(refreshToken);
    const expiredAt = new Date(decoded.exp * 1000);

    const saveRefreshToken = new RefreshToken({
        token: refreshToken,
        user_id: userId,
        expiredAt: expiredAt
    })
    
    const response = await saveRefreshToken.save();
    if (!response) {
        const error = new ApiError('Failed to save refresh token');
        logger.error(error);
    }

    return {
        accessToken,
        refreshToken
    }
}

export default generateToken;