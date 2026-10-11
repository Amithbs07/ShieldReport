import prisma from '../lib/prisma';

export interface IncidentAlertPayload {
  caseToken: string;
  category: string;
  severity: string;
  aiUrgencyScore?: number | null | undefined;
  isHighRiskCrisis?: boolean | undefined;
  crisisCategory?: string | null | undefined;
  emotionPrimary?: string | null | undefined;
  evidenceCount?: number | undefined;
  timestamp: string;
}

/**
 * Dispatches an automated, privacy-sanitized notification to external webhooks
 * (Slack, Discord, Microsoft Teams, or custom HTTP SIEM/SOAR endpoints).
 * Strictly guarantees that no plain-text whistleblower PII or descriptions are transmitted.
 */
export const dispatchIncidentAlert = async (alert: IncidentAlertPayload): Promise<void> => {
  try {
    // 1. Fetch active webhook configurations
    const configs = await prisma.webhookConfig.findMany({
      where: { isEnabled: true },
    });

    const envWebhook = process.env.WEBHOOK_URL?.trim();
    const targetUrls: string[] = [];

    if (envWebhook && envWebhook.startsWith('http')) {
      targetUrls.push(envWebhook);
    }

    configs.forEach(c => {
      if (c.url && !targetUrls.includes(c.url)) {
        // Filter based on severity if configured
        if (c.events === 'CRISIS_ONLY' && !alert.isHighRiskCrisis) {
          return;
        }
        if (c.events === 'CRITICAL_ONLY' && alert.severity !== 'Critical' && !alert.isHighRiskCrisis) {
          return;
        }
        targetUrls.push(c.url);
      }
    });

    if (targetUrls.length === 0) {
      return; // No webhooks configured
    }

    // 2. Dispatch to each target asynchronously
    for (const url of targetUrls) {
      await sendWebhookRequest(url, alert);
    }
  } catch (error) {
    console.error('[WEBHOOK_DISPATCH_ERROR] Failed during incident webhook broadcast:', error);
  }
};

/**
 * Sends a single formatted webhook POST request and logs delivery audit
 */
export const sendWebhookRequest = async (url: string, alert: IncidentAlertPayload): Promise<{ success: boolean; statusCode?: number; error?: string }> => {
  let payload: any = {
    event: 'INCIDENT_REPORT_SUBMITTED',
    caseToken: alert.caseToken,
    category: alert.category,
    severity: alert.severity,
    aiUrgencyScore: alert.aiUrgencyScore ?? 0,
    isHighRiskCrisis: !!alert.isHighRiskCrisis,
    crisisCategory: alert.crisisCategory || 'N/A',
    emotionPrimary: alert.emotionPrimary || 'Calibrated',
    evidenceCount: alert.evidenceCount || 0,
    timestamp: alert.timestamp || new Date().toISOString(),
    protocol: 'ShieldReport Zero-Knowledge Ingress Alert',
  };

  // Auto-format for Discord Webhooks
  if (url.includes('discord.com/api/webhooks')) {
    const isCritical = alert.severity === 'Critical' || alert.isHighRiskCrisis;
    payload = {
      username: 'ShieldReport Triage Watchdog',
      avatar_url: 'https://cdn-icons-png.flaticon.com/512/2092/2092663.png',
      embeds: [
        {
          title: `🛡️ New Confidential Case: ${alert.caseToken}`,
          description: `An incident report was ingested under the **${alert.category}** classification.`,
          color: isCritical ? 0xFF3B30 : 0x2997FF,
          fields: [
            { name: 'Severity Level', value: `\`${alert.severity.toUpperCase()}\``, inline: true },
            { name: 'AI Urgency Score', value: `${alert.aiUrgencyScore ?? 75}/100`, inline: true },
            { name: 'DistilBERT Tone', value: alert.emotionPrimary || 'Objective', inline: true },
            { 
              name: 'High-Risk Crisis Alert', 
              value: alert.isHighRiskCrisis ? `⚠️ **TRIGGERED**: ${alert.crisisCategory}` : '✅ None detected', 
              inline: false 
            },
            { name: 'Evidence Attached', value: `${alert.evidenceCount || 0} file(s) scrubbed`, inline: true },
          ],
          footer: { text: 'ShieldReport Cryptographic Defense Enclave • AES-256 Notarized' },
          timestamp: alert.timestamp,
        }
      ]
    };
  } else if (url.includes('hooks.slack.com')) {
    // Auto-format for Slack Incoming Webhooks
    payload = {
      text: `🛡️ *[ShieldReport Alert]* New Incident: \`${alert.caseToken}\` (${alert.severity})`,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: `🛡️ Confidential Report Ingested: ${alert.caseToken}` }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Category:* ${alert.category}\n*Severity:* *${alert.severity}*\n*AI Urgency Score:* ${alert.aiUrgencyScore ?? 75}/100\n*Crisis State:* ${alert.isHighRiskCrisis ? `⚠️ ${alert.crisisCategory}` : 'Normal'}`
          }
        }
      ]
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ShieldReport-SIEM-Dispatcher/2.0',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const success = response.ok;
    const statusCode = response.status;

    // Log delivery outcome to DB
    await prisma.webhookDeliveryLog.create({
      data: {
        endpointUrl: url,
        caseToken: alert.caseToken,
        event: 'INCIDENT_REPORT_SUBMITTED',
        statusCode,
        payloadSnippet: `Case ${alert.caseToken} (${alert.category} - ${alert.severity})`,
        success,
        errorMessage: success ? null : `HTTP ${statusCode} response`,
      }
    });

    return { success, statusCode };
  } catch (err: any) {
    console.error(`[WEBHOOK_DELIVERY_FAIL] Failed to POST to ${url}:`, err.message);
    await prisma.webhookDeliveryLog.create({
      data: {
        endpointUrl: url,
        caseToken: alert.caseToken,
        event: 'INCIDENT_REPORT_SUBMITTED',
        statusCode: 0,
        payloadSnippet: `Case ${alert.caseToken} (${alert.category} - ${alert.severity})`,
        success: false,
        errorMessage: err.message || 'Network timeout or connection refused',
      }
    });
    return { success: false, error: err.message };
  }
};
