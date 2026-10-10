import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateCaseToken } from '../utils/token';
import { encrypt, decrypt } from '../utils/encryption';
import { analyzeReport } from '../utils/aiAnalyzer';

export const submitReport = async (req: Request, res: Response) => {
  try {
    let { 
      category, 
      severity, 
      description, 
      organizationId,
      incidentSchedule,
      nlpFraudScore,
      nlpCredibilityScore,
      nlpAnalysis,
      evidence
    } = req.body;

    if (!organizationId) {
      const defaultOrg = await prisma.organization.findFirst();
      organizationId = defaultOrg?.id;
    }

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

    // Format schedule if passed as object
    const scheduleStr = typeof incidentSchedule === 'object' ? JSON.stringify(incidentSchedule) : incidentSchedule;

    // 4. Save to database
    // The IP addresses are stripped by the middleware, so we don't save them.
    const createData: any = {
      caseToken,
      category,
      severity,
      description: encryptedDescription,
      organizationId,
      status: 'SUBMITTED',
      aiUrgencyScore: aiAnalysis?.urgencyScore || null,
      aiSummary: aiAnalysis?.summary || null,
      aiTags: aiAnalysis?.tags || null,
      incidentSchedule: scheduleStr || null,
      nlpFraudScore: typeof nlpFraudScore === 'number' ? nlpFraudScore : null,
      nlpCredibilityScore: typeof nlpCredibilityScore === 'number' ? nlpCredibilityScore : null,
      nlpAnalysis: nlpAnalysis || null,
    };

    if (Array.isArray(evidence) && evidence.length > 0) {
      createData.evidence = {
        create: evidence.map((e: any) => ({
          fileName: e.fileName || 'evidence.png',
          fileSize: typeof e.fileSize === 'number' ? e.fileSize : 0,
          fileType: e.fileType || 'image/png',
          dataUrl: e.dataUrl || null,
          sha256Hash: e.sha256Hash || 'hash-pending',
          cvAuthenticity: typeof e.cvAuthenticity === 'number' ? e.cvAuthenticity : 98.5,
          cvTamperScore: typeof e.cvTamperScore === 'number' ? e.cvTamperScore : 1.5,
          approvalStatus: 'PENDING_MANUAL_APPROVAL'
        }))
      };
    }

    const report = await (prisma.report.create as any)({
      data: createData,
      include: {
        evidence: true
      }
    });

    // 5. Return ONLY the token to the user. (Absolutely no PII or identifiers returned).
    return res.status(201).json({
      success: true,
      data: {
        caseToken: report.caseToken,
        evidenceCount: report.evidence?.length || 0,
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
        severity: true,
        createdAt: true,
        updatedAt: true,
        incidentSchedule: true,
        nlpFraudScore: true,
        nlpCredibilityScore: true,
        evidence: {
          select: {
            id: true,
            fileName: true,
            fileSize: true,
            fileType: true,
            sha256Hash: true,
            cvAuthenticity: true,
            approvalStatus: true,
            reviewerNotes: true,
            reviewedAt: true,
            createdAt: true
          }
        }
      }
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

export const getReportMessages = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    const report = await prisma.report.findUnique({
      where: { caseToken: token },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!report) {
      return res.status(404).json({ error: 'Case not found or invalid token.' });
    }

    const decrypted = ((report as any).messages || []).map((m: any) => {
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

    return res.status(200).json({ success: true, data: decrypted });
  } catch (error) {
    console.error('Error fetching report messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendReportMessage = async (req: Request, res: Response) => {
  try {
    const token = req.params.token as string;
    const { content } = req.body;

    if (!content || typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    const report = await prisma.report.findUnique({
      where: { caseToken: token }
    });

    if (!report) {
      return res.status(404).json({ error: 'Case not found or invalid token.' });
    }

    const encrypted = encrypt(content.trim());

    const message = await prisma.message.create({
      data: {
        reportId: report.id,
        senderType: 'REPORTER',
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
    console.error('Error sending report message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
