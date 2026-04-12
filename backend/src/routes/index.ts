import { Router } from 'express';
import authRoutes from './auth.routes';
import reportRoutes from './report.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/admin', adminRoutes);

export default router;
