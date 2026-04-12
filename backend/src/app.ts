import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { stripIPMiddleware } from './middleware/ipStripper';
import apiRoutes from './routes/index';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());

// Strict rate limiting for the API
const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	limit: 5, // 5 requests per IP per windowMs
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// Apply strict rate limiting & IP stripping globally or to specific endpoints
// We applied IP stripping directly on the route in report.routes.ts

app.use('/api/v1', limiter, apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'ShieldReport API is running securely' });
});

export default app;
