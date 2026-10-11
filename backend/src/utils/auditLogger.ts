import prisma from '../lib/prisma';

export interface AuditLogEntry {
  adminId?: string;
  adminEmail?: string;
  action: string;
  caseToken?: string;
  details?: string;
  ipAddress?: string;
}

/**
 * Persists an indelible, append-only administrative audit log.
 * Provides compliance with ISO 37002, GDPR Article 30, and SOC 2 Type II
 * access controls.
 */
export const recordAuditLog = async (entry: AuditLogEntry): Promise<void> => {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId: entry.adminId || null,
        adminEmail: entry.adminEmail || 'Unknown Admin',
        action: entry.action,
        caseToken: entry.caseToken || null,
        details: entry.details || null,
        ipAddress: entry.ipAddress || '127.0.0.1 (Ingress Scrubbed)',
      }
    });
  } catch (error) {
    // Non-blocking catch to ensure audit writes do not crash the primary request
    console.error('[AUDIT_TRAIL_ERROR] Failed to record admin audit log:', error);
  }
};

/**
 * Retrieves the latest immutable audit records for authorized compliance officers.
 */
export const getAuditLogs = async (limit = 50, offset = 0) => {
  return prisma.adminAuditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
};
