import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { loginRateLimiter } from '../middleware/rateLimit';

const router = Router();

router.post('/register', register);
router.post('/login', loginRateLimiter, login);

export default router;