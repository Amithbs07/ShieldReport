import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { encrypt, decrypt } from '../utils/encryption';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const organizationId = admin.organizationId;

    const [activeCases, criticalFlags, pendingReview, resolvedCases] = await Promise.all([
      prisma.report.count({
        where: { organizationId, status: { notIn: ['RESOLVED'] } }
      }),
      prisma.report.count({
        where: { organizationId, severity: 'Critical' }
      }),
      prisma.report.count({
        where: { organizationId, status: 'UNDER_REVIEW' }
      }),
      prisma.report.count({
        where: { organizationId, status: 'RESOLVED' }
      })
    ]);

    return res.status(200).json({
      success: true,
      data: {
        activeCases,
        criticalFlags,
        pendingReview,
        resolvedCases
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
        evidence: true,
        messages: {
          select: { id: true, senderType: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const decryptedCases = cases.map(c => {
      // In a real strict implementation, only investigators might get the decrypted description.
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
        summary: c.aiSummary || description.substring(0, 50) + '...', // Fallback to description snippet
        severity: c.severity,
        tags: c.aiTags,
        incidentSchedule: c.incidentSchedule,
        nlpFraudScore: c.nlpFraudScore,
        nlpCredibilityScore: c.nlpCredibilityScore,
        nlpAnalysis: c.nlpAnalysis,
        evidenceCount: c.evidence.length,
        evidence: c.evidence,
        messageCount: c.messages?.length || 0,
        reporterMessageCount: c.messages?.filter(m => m.senderType === 'REPORTER').length || 0
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
            status: true
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

    const updated = await prisma.evidence.update({
      where: { id: id as string },
      data: {
        approvalStatus,
        reviewerNotes: reviewerNotes || null,
        reviewedAt: new Date()
      }
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

export const getCaseMessages = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const organizationId = admin.organizationId;
    const caseToken = req.params.caseToken as string;

    const report = await (prisma.report.findFirst as any)({
      where: {
        caseToken,
        organizationId
      },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const decrypted = (report.messages || []).map((m: any) => {
      let content = m.content;
      try {
        content = decrypt(m.content);
      } catch (e) {
        console.error('Failed to decrypt message:', m.id);
      }
      return {
        id: m.id,
        senderType: m.senderType,
        content,
        createdAt: m.createdAt
      };
    });

    return res.status(200).json({
      success: true,
      data: decrypted
    });
  } catch (error) {
    console.error('Error fetching case messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendCaseMessage = async (req: Request, res: Response) => {
  try {
    const admin = (req as any).admin;
    const organizationId = admin.organizationId;
    const caseToken = req.params.caseToken as string;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const report = await prisma.report.findFirst({
      where: {
        caseToken,
        organizationId
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Case not found' });
    }

    const encrypted = encrypt(content.trim());

    const message = await prisma.message.create({
      data: {
        reportId: report.id,
        senderType: 'ADMIN',
        content: encrypted
      }
    });

    await prisma.report.update({
      where: { id: report.id },
      data: { updatedAt: new Date() }
    });

    return res.status(201).json({
      success: true,
      data: {
        id: message.id,
        senderType: message.senderType,
        content: content.trim(),
        createdAt: message.createdAt
      }
    });
  } catch (error) {
    console.error('Error sending case message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

