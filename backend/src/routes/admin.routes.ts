import { Router } from 'express';
import { verifyAdmin } from '../middleware/auth.middleware';
import { getDashboardStats, getRecentCases } from '../controllers/admin.controller';

const router = Router();

// All routes in this router require a valid Admin JWT
router.use(verifyAdmin);

router.get('/stats', getDashboardStats);
router.get('/cases', getRecentCases);

export default router;
