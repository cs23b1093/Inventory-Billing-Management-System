import dotenv from 'dotenv';
import express from 'express';
import { customMiddleware } from './middleware/customMiddleware.js';
import dbConnect from './config/dbConnect.js';
import { CorsInitialisation } from './utils/corsSetup.js';
import { generalRateLimiter, sensitiveRateLimiter } from './middleware/rateLimiter.js';
import helmet from 'helmet';
import logger from './utils/logger.js';
import { globalErrorHandler } from './middleware/errorHandler.js';
import cookieParser from 'cookie-parser'
import userRouter from './routers/user.route.js';
import dummyRouter from './routers/dummy.route.js';
import productRouter from './routers/product.route.js';
import stackHolderRouter from './routers/stackHolder.route.js';
import transitionRouter from './routers/transition.route.js';
import reportsRouter from './routers/reports.route.js';

dotenv.config();
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

app.use((req, _, next) => {
    logger.info(`Received ${req.method} request for ${req.url}`)
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
})
app.use(generalRateLimiter);

app.use('/api/v1/auth/register', sensitiveRateLimiter);
app.use('/api/v1/auth/login', sensitiveRateLimiter);
app.use('/api/v1/auth/logout', sensitiveRateLimiter);
app.use('/api/v1/products/create', sensitiveRateLimiter);
app.use('/api/v1/products/update', sensitiveRateLimiter);
app.use('/api/v1/products/delete', sensitiveRateLimiter);
app.use('/api/v1/stackHolder/create', sensitiveRateLimiter);
app.use('/api/v1/stackHolder/update', sensitiveRateLimiter);
app.use('/api/v1/stackHolder/delete', sensitiveRateLimiter);
app.use('/api/v1/transition/create', sensitiveRateLimiter);


app.use('/api/v1/auth', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/stackHolder', stackHolderRouter);
app.use('/api/v1/transition', transitionRouter);
app.use('/api/v1/reports', reportsRouter);
app.use('/api/v1', dummyRouter);

app.listen(PORT, () => {
    // logger.info(`Redis Server is running on port 6379`);
    logger.info('Server is running on port 3000');
    logger.info(`Redis URL: ${process.env.REDIS_URL}`);
})