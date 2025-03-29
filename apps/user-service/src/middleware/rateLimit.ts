// src/middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../redis';

export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 5,                  // limit each IP to 5 requests per window
  standardHeaders: true,   // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,    // Disable `X-RateLimit-*` headers
  message: 'Too many login attempts. Please try again later.',
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args)
  })
});