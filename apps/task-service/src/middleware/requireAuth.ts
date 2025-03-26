import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export const requireAuth = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    let token;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    token = authHeader.split(' ')[1];

    try {
      const payload = jwt.verify(token, JWT_SECRET) as any;

      if (roles.length && !roles.includes(payload.role)) {
        res.status(403).json({ error: 'Forbidden: Insufficient role' });
        return;
      }

      (req as any).user = payload;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Unauthorized: Invalid token' });
      return;
    }
  };
};