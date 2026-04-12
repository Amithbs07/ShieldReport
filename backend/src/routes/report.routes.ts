import { Router } from 'express';
import { submitReport, getReportStatus } from '../controllers/report.controller';
import { stripIPMiddleware } from '../middleware/ipStripper';

const router = Router();

// Apply IP stripping specifically directly before the submission logic
router.post('/submit', stripIPMiddleware, submitReport);

router.get('/status/:token', stripIPMiddleware, getReportStatus);

export default router;
