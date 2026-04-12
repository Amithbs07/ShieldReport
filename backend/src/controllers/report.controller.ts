import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateCaseToken } from '../utils/token';
import { encrypt } from '../utils/encryption';
import { analyzeReport } from '../utils/aiAnalyzer';

export const submitReport = async (req: Request, res: Response) => {
  try {
    const { category, severity, description, organizationId } = req.body;

    if (!category || !severity || !description || !organizationId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Generate the unique CASE TOKEN for the reporter
    const caseToken = generateCaseToken();

    // 2. Run AI Analysis BEFORE encrypting so the DB has queryable metadata (Summary, Urgency, Tags)
    // The raw description is NEVER saved unencrypted.
    const aiAnalysis = await analyzeReport(description, category, severity);

    // 3. Encrypt the sensitive description (AES-256-GCM) before it touches the DB
    const encryptedDescription = encrypt(description);

    // 3. Save to database
    // The IP addresses are stripped by the middleware, so we don't save them.
    const report = await prisma.report.create({
      data: {
        caseToken,
        category,
        severity,
        description: encryptedDescription,
        organizationId,
        status: 'SUBMITTED',
        aiUrgencyScore: aiAnalysis?.urgencyScore || null,
        aiSummary: aiAnalysis?.summary || null,
        aiTags: aiAnalysis?.tags || null
      }
    });

    // 4. Return ONLY the token to the user. (Absolutely no PII or identifiers returned).
    return res.status(201).json({
      success: true,
      data: {
        caseToken: report.caseToken,
        message: 'Report submitted successfully. Please save this token. It is the ONLY way to access this report again.'
      }
    });
  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({ error: 'Internal server error while processing report' });
  }
};

export const getReportStatus = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;

    const report = await prisma.report.findUnique({
      where: { caseToken: token },
      select: {
        id: true,
        caseToken: true,
        status: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      }
      // Note: We deliberately exclude the description and notes on this public endpoint
    });

    if (!report) {
      return res.status(404).json({ error: 'Case not found or invalid token.' });
    }

    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
