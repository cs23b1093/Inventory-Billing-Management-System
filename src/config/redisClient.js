/* 
    Adding redis makes it makes extra scalble, 
    yet i did not add in backend but commenting it for easy testing for you.
*/

// import Redis from "ioredis";
// import logger from "../utils/logger.js";

// const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// let redis;

// try {
//     redis = new Redis(REDIS_URL, {
//         retryStrategy(times) {
//             const delay = Math.min(times * 50, 2000);
//             return delay;
//         }
//     })

//     redis.on('connect', () => logger.info('Connected to Redis'));
//     redis.on('error', (err) => logger.error(`Redis error: ${err}`));
// } catch (error) {
//     logger.error("Failed to initialize Redis client", err);
// }

// export default redis;