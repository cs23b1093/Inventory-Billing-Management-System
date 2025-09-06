import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';
import { ApiError } from '../utils/errorFormat.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const getUserByCookies = (req, res, next) => {
    const token = req.cookies?.accessToken || req.headers?.authorization?.split(' ')[1] || null;
    if (!token) {
        logger.error('No token found');
        const error = new ApiError('No token found', 401);
        res.status(401).json({
            ...error
        })
    }

    console.log('token', token)
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            logger.error('Invalid token');
            const error = new ApiError('Invalid token', 401);
            res.status(401).json({
                ...error
            })
        }
        req.user = decoded;
        next();
    })
}

export default getUserByCookies;