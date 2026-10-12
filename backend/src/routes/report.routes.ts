import { Router } from 'express';
import { 
  submitReport, 
  getReportStatus, 
  getReportBlockchainProof,
  getReportMessages, 
  sendReportMessage 
} from '../controllers/report.controller';
import { stripIPMiddleware } from '../middleware/ipStripper';

const router = Router();

// Apply IP stripping specifically directly before the submission logic
router.post('/submit', stripIPMiddleware, submitReport);

router.get('/status/:token', stripIPMiddleware, getReportStatus);
router.get('/status/:token/proof', stripIPMiddleware, getReportBlockchainProof);

// Anonymous end-to-end encrypted chat using Case Token
router.get('/:token/messages', stripIPMiddleware, getReportMessages);
router.post('/:token/messages', stripIPMiddleware, sendReportMessage);

export default router;
