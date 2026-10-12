import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { stripIPMiddleware } from './middleware/ipStripper';
import apiRoutes from './routes/index';

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false
}));
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5000, // Generous limit for dev & polling
	standardHeaders: 'draft-7',
	legacyHeaders: false,
	message: { success: false, error: 'Too many requests, please try again later.' }
});

// Apply strict rate limiting & IP stripping globally or to specific endpoints
// We applied IP stripping directly on the route in report.routes.ts

app.use('/api/v1', limiter, apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ShieldReport API is running securely' });
});

export default app;
