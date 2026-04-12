import { Request, Response, NextFunction } from 'express';

/**
 * Middleware that strips real IP addresses and user agents from the request 
 * before it hits business logic to guarantee anonymity.
 */
export const stripIPMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Overwrite the IP address
  Object.defineProperty(req, 'ip', { value: '0.0.0.0', writable: true });
  
  // Clean potentially tracking headers
  delete req.headers['x-forwarded-for'];
  delete req.headers['x-real-ip'];
  delete req.headers['user-agent'];
  delete req.headers['referer'];
  
  // Set security flag indicating properties were stripped
  res.locals.anonymized = true;

  next();
};
