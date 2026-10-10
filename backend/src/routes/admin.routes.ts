import { Router } from 'express';
import { verifyAdmin } from '../middleware/auth.middleware';
import { 
  getDashboardStats, 
  getRecentCases, 
  getEvidenceQueue, 
  updateEvidenceStatus,
  getBlockchainLedger
} from '../controllers/admin.controller';

const router = Router();

// All routes in this router require a valid Admin JWT
router.use(verifyAdmin);

router.get('/stats', getDashboardStats);
router.get('/cases', getRecentCases);
router.get('/evidence', getEvidenceQueue);
router.patch('/evidence/:id/review', updateEvidenceStatus);
router.get('/blockchain-ledger', getBlockchainLedger);

export default router;
