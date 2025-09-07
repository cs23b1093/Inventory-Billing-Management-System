import { rateLimit } from 'express-rate-limit'
// NOTE: Redis store is optional, not required by assignment
// import { RedisStore } from 'rate-limit-redis'
// import redis from '../config/redisClient.js'

const STANDARD_HEADERS = 'draft-8'
const LEGACY_HEADERS = false
const IPV6_SUBNET = 56
const DEFAULT_MESSAGE = 'Too many requests, please try again later'

// General rate limiter (default)
export const generalRateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_GENERAL_WINDOW_MS || 15 * 60 * 1000), // 15 mins
    max: Number(process.env.RATE_LIMIT_GENERAL_MAX || 200), // 200 requests per window
    standardHeaders: STANDARD_HEADERS,
    legacyHeaders: LEGACY_HEADERS,
    ipv6Subnet: IPV6_SUBNET,
    message: DEFAULT_MESSAGE,
    // If Redis were required:
    // store: new RedisStore({
    //     sendCommand: (...args) => redis.call(...args)
    // })
})

// Stricter rate limiter for sensitive endpoints (login/register)
export const sensitiveRateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_SENSITIVE_WINDOW_MS || 15 * 60 * 1000),
    max: Number(process.env.RATE_LIMIT_SENSITIVE_MAX || 30), // Only 30 attempts
    standardHeaders: STANDARD_HEADERS,
    legacyHeaders: LEGACY_HEADERS,
    ipv6Subnet: IPV6_SUBNET,
    message: DEFAULT_MESSAGE,
    // If Redis were required:
    // store: new RedisStore({
    //     sendCommand: (...args) => redis.call(...args)
    // })
})

// Dynamic limiter (useful if you want custom limits per route)
export const limiter = (max, timeMs) => rateLimit({
    max,
    windowMs: timeMs,
    standardHeaders: STANDARD_HEADERS,
    legacyHeaders: LEGACY_HEADERS,
    ipv6Subnet: IPV6_SUBNET,
    message: DEFAULT_MESSAGE,
    // If Redis were required:
    // store: new RedisStore({
    //     sendCommand: (...args) => redis.call(...args)
    // })
})
