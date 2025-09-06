import dotenv from 'dotenv';
import express from 'express';
import { customMiddleware } from './middleware/customMiddleware.js';
import redis from 'ioredis';
import dbConnect from './config/dbConnect.js';
import { ApiVersioning } from './middleware/apiVersioning.js';
import { CorsInitialisation } from './utils/corsSetup.js';
import { limiter } from './middleware/rateLimiter.js';
import helmet from 'helmet';
import logger from './utils/logger.js';
import { rateLimit } from 'express-rate-limit';
import { RateLimiterRedis } from 'rate-limiter-flexible'
import { RedisStore } from 'rate-limit-redis'
import { globalErrorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser'
import userRouter from './routers/user.route.js';
import dummyRouter from './routers/dummy.route.js';
import productRouter from './routers/product.route.js';
import stackHolderRouter from './routers/stackHolder.route.js';
import transitionRouter from './routers/transition.route.js';
import reportsRouter from './routers/reports.route.js';



dotenv.config();
const redisClient = new redis(
    process.env.REDIS_URL
);

const PORT = process.env.PORT || 3000;

const app = express();

dbConnect()
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(CorsInitialisation)
app.use(globalErrorHandler);
app.use(customMiddleware);
app.use(ApiVersioning('v1'));

app.use((req, _, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`)
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
})
app.use(limiter(10, 10*60*1000));

const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimiter',
    points: 10,
    duration: 10 * 60
})

app.use((req, res, next) => {
    rateLimiter.consume(req.ip).then(() => next()).catch(() => {
        logger.warn('Too many requests from this IP: ' + req.ip + ', please try again later')
        res.status(429).json({
            message: `Too many requests from this IP: ${req.ip}}, please try again later`,
            success: false,
            statusCode: 429
        })
    })
})

const sensitiveEndpointRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later',
    ipv6Subnet: 56,
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args)
    })
})

app.use('/api/v1/auth/register', sensitiveEndpointRateLimiter);
app.use('/api/v1/auth/login', sensitiveEndpointRateLimiter);
app.use('/api/v1/products/create', sensitiveEndpointRateLimiter);
app.use('/api/v1/products/update', sensitiveEndpointRateLimiter);
app.use('/api/v1/products/delete', sensitiveEndpointRateLimiter);
app.use('/api/v1/stackHolder/create', sensitiveEndpointRateLimiter);
app.use('/api/v1/stackHolder/update', sensitiveEndpointRateLimiter);
app.use('/api/v1/stackHolder/delete', sensitiveEndpointRateLimiter);
app.use('/api/v1/transition/create', sensitiveEndpointRateLimiter);


app.use('/api/v1/auth', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/stackHolder', stackHolderRouter);
app.use('/api/v1/transition', transitionRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1', dummyRouter);

app.listen(PORT, () => {
    logger.info('Server is running on port 3000');
    logger.info(`Redis URL: ${process.env.REDIS_URL}`);
})