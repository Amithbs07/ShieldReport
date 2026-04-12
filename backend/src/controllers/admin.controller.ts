import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { decrypt } from '../utils/encryption';

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
      orderBy: { createdAt: 'desc' },
      take: 10
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
        tags: c.aiTags
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
