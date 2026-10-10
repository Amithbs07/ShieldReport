import { Router } from 'express';
import { verifyAdmin } from '../middleware/auth.middleware';
import { 
  getDashboardStats, 
  getRecentCases, 
  getEvidenceQueue, 
  updateEvidenceStatus,
  getCaseMessages,
  sendCaseMessage
} from '../controllers/admin.controller';

const router = Router();

// All routes in this router require a valid Admin JWT
router.use(verifyAdmin);

router.get('/stats', getDashboardStats);
router.get('/cases', getRecentCases);
router.get('/cases/:caseToken/messages', getCaseMessages);
router.post('/cases/:caseToken/messages', sendCaseMessage);
router.get('/evidence', getEvidenceQueue);
router.patch('/evidence/:id/review', updateEvidenceStatus);

export default router;
