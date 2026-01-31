import type { Request, Response, NextFunction } from 'express';
import { getUserLanguage } from '../utils/i18n';

declare global {
  namespace Express {
    interface Request {
      language: 'en' | 'ar';
    }
  }
}

/**
 * Middleware to set user's language preference
 */
export const localizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.language = getUserLanguage(req);

  // Set language in response header
  res.setHeader('Content-Language', req.language);

  next();
};
