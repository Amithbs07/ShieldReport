import { Router } from 'express';
import { verifyAdmin } from '../middleware/auth.middleware';
import { 
  getDashboardStats, 
  getRecentCases, 
  getEvidenceQueue, 
  updateEvidenceStatus,
  updateCaseStatus,
  logCaseAccess,
  getAdminAuditLogs,
  getWebhookSettings,
  saveWebhookSettings,
  testWebhook,
  getBlockchainLedger,
  getCaseMessages,
  sendCaseMessage
} from '../controllers/admin.controller';

const router = Router();

// All routes in this router require a valid Admin JWT
router.use(verifyAdmin);

router.get('/stats', getDashboardStats);
router.get('/cases', getRecentCases);
router.patch('/cases/:token/status', updateCaseStatus);
router.post('/cases/:token/access-log', logCaseAccess);
router.get('/cases/:caseToken/messages', getCaseMessages);
router.post('/cases/:caseToken/messages', sendCaseMessage);
router.get('/evidence', getEvidenceQueue);
router.patch('/evidence/:id/review', updateEvidenceStatus);
router.get('/blockchain-ledger', getBlockchainLedger);
router.get('/audit-logs', getAdminAuditLogs);
router.get('/webhooks', getWebhookSettings);
router.post('/webhooks', saveWebhookSettings);
router.post('/webhooks/test', testWebhook);

export default router;
