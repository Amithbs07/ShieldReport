import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { decrypt } from '../utils/encryption';
import { getFullBlockchainLedger } from '../utils/blockchain';

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
