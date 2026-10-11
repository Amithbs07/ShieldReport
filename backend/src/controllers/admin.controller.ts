import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { decrypt } from '../utils/encryption';
import { getFullBlockchainLedger } from '../utils/blockchain';
import { recordAuditLog, getAuditLogs } from '../utils/auditLogger';
import { sendWebhookRequest } from '../utils/webhookDispatcher';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const organizationId = admin.organizationId;

    const [activeCases, criticalFlags, pendingReview, resolvedCases, totalBlocks] = await Promise.all([
      prisma.report.count({
        where: { organizationId, status: { notIn: ['RESOLVED'] } }
      }),
      prisma.report.count({
        where: { 
          organizationId, 
          OR: [
            { severity: 'Critical' },
            { isHighRiskCrisis: true }
          ]
        }
      }),
      prisma.report.count({
        where: { organizationId, status: 'UNDER_REVIEW' }
      }),
      prisma.report.count({
        where: { organizationId, status: 'RESOLVED' }
      }),
      prisma.blockchainBlock.count()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        activeCases,
        criticalFlags,
        pendingReview,
        resolvedCases,
        totalBlocks
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getRecentCases = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const organizationId = admin.organizationId;

    const cases = await prisma.report.findMany({
      where: { organizationId },
      include: {
        evidence: true
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const decryptedCases = cases.map(c => {
      let description = 'Encrypted content';
      try {
        description = decrypt(c.description);
      } catch(e) {
        console.error("Failed to decrypt description for case", c.caseToken);
      }
      return {
        id: c.caseToken,
        category: c.category,
        aiScore: c.aiUrgencyScore,
        status: c.status,
        date: c.createdAt,
        summary: c.aiSummary || description.substring(0, 50) + '...',
        descriptionSnippet: description.substring(0, 160) + '...',
        severity: c.severity,
        tags: c.aiTags,
        incidentSchedule: c.incidentSchedule,
        nlpFraudScore: c.nlpFraudScore,
        nlpCredibilityScore: c.nlpCredibilityScore,
        nlpAnalysis: c.nlpAnalysis,
        
        // Emotion & Crisis fields (IEEE 11452105)
        emotionPrimary: c.emotionPrimary,
        emotionIntensity: c.emotionIntensity,
        isHighRiskCrisis: c.isHighRiskCrisis,
        crisisInterventionNotes: c.crisisInterventionNotes,

        // Blockchain Chain of Custody Notary
        blockchainTxHash: c.blockchainTxHash,
        blockchainBlockNumber: c.blockchainBlockNumber,
        blockchainBlockHash: c.blockchainBlockHash,
        merkleRoot: c.merkleRoot,

        evidenceCount: c.evidence.length,
        evidence: c.evidence
      };
    });

    return res.status(200).json({
      success: true,
      data: decryptedCases
    });
  } catch (error) {
    console.error('Error fetching recent cases:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEvidenceQueue = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const organizationId = admin.organizationId;

    const evidenceList = await prisma.evidence.findMany({
      where: {
        report: {
          organizationId
        }
      },
      include: {
        report: {
          select: {
            caseToken: true,
            category: true,
            severity: true,
            status: true,
            emotionPrimary: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      data: evidenceList
    });
  } catch (error) {
    console.error('Error fetching evidence queue:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateEvidenceStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalStatus, reviewerNotes } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING_MANUAL_APPROVAL'].includes(approvalStatus)) {
      return res.status(400).json({ error: 'Invalid approval status' });
    }

    const admin = (req as any).admin;
    const updated = await prisma.evidence.update({
      where: { id: id as string },
      data: {
        approvalStatus,
        reviewerNotes: reviewerNotes || null,
        reviewedAt: new Date()
      }
    });

    await recordAuditLog({
      adminId: admin?.id,
      adminEmail: admin?.email,
      action: 'REVIEW_EVIDENCE',
      caseToken: updated.reportId,
      details: `Evidence '${updated.fileName}' updated to ${approvalStatus}`,
    });

    return res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating evidence status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCaseStatus = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const { token } = req.params;
    const { status } = req.body;

    const validStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'INVESTIGATION_STARTED', 'ACTION_TAKEN', 'RESOLVED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid case status' });
    }

    const updated = await prisma.report.update({
      where: { caseToken: token as string },
      data: { status }
    });

    await recordAuditLog({
      adminId: admin?.id,
      adminEmail: admin?.email,
      action: 'UPDATE_STATUS',
      caseToken: token as string,
      details: `Case status transitioned to ${status}`,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating case status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logCaseAccess = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const { token } = req.params;
    await recordAuditLog({
      adminId: admin?.id,
      adminEmail: admin?.email,
      action: 'VIEW_DOSSIER',
      caseToken: token as string,
      details: 'Investigator accessed full decrypted case dossier',
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error recording case access:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdminAuditLogs = async (req: Request, res: Response) => {
  try {
    const logs = await getAuditLogs(100);
    return res.status(200).json({
      success: true,
      data: logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWebhookSettings = async (req: Request, res: Response) => {
  try {
    const [configs, deliveries] = await Promise.all([
      prisma.webhookConfig.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.webhookDeliveryLog.findMany({ orderBy: { createdAt: 'desc' }, take: 25 })
    ]);

    const activeConfig = configs[0] || null;
    const envUrl = process.env.WEBHOOK_URL || null;

    return res.status(200).json({
      success: true,
      data: {
        config: activeConfig,
        envWebhookUrl: envUrl,
        deliveries
      }
    });
  } catch (error) {
    console.error('Error fetching webhook settings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const saveWebhookSettings = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const { url, events, isEnabled } = req.body;

    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return res.status(400).json({ error: 'Valid HTTP/HTTPS Webhook URL is required' });
    }

    const config = await prisma.webhookConfig.create({
      data: {
        organizationId: admin?.organizationId || null,
        url,
        events: events || 'ALL',
        isEnabled: isEnabled !== undefined ? !!isEnabled : true,
      }
    });

    await recordAuditLog({
      adminId: admin?.id,
      adminEmail: admin?.email,
      action: 'CONFIG_WEBHOOK',
      details: `Configured webhook: ${url.substring(0, 30)}... [Events: ${events || 'ALL'}]`,
    });

    return res.status(200).json({ success: true, data: config });
  } catch (error) {
    console.error('Error saving webhook settings:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const testWebhook = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const { url } = req.body;

    const targetUrl = url || process.env.WEBHOOK_URL;
    if (!targetUrl) {
      return res.status(400).json({ error: 'No webhook URL provided or configured' });
    }

    const testPayload = {
      caseToken: 'SHR-TEST-SIEM',
      category: 'Whistleblowing & SIEM Probe',
      severity: 'Critical',
      aiUrgencyScore: 99,
      isHighRiskCrisis: true,
      crisisCategory: 'Synthetic Healthcheck Test Broadcast',
      emotionPrimary: 'Objective / Calibrated',
      evidenceCount: 1,
      timestamp: new Date().toISOString()
    };

    const outcome = await sendWebhookRequest(targetUrl, testPayload);

    await recordAuditLog({
      adminId: admin?.id,
      adminEmail: admin?.email,
      action: 'TEST_WEBHOOK',
      details: `Triggered test alert to ${targetUrl.substring(0, 30)}... (Success: ${outcome.success})`,
    });

    return res.status(200).json({
      success: outcome.success,
      data: outcome
    });
  } catch (error: any) {
    console.error('Error executing test webhook:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const getBlockchainLedger = async (req: Request, res: Response) => {
  try {
    const ledger = await getFullBlockchainLedger(50);
    return res.status(200).json({
      success: true,
      data: ledger
    });
  } catch (error) {
    console.error('Error fetching blockchain ledger:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
