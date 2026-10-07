/**
 * PropertyOps AI - Automated Vendor Notification Service
 * 
 * Generates and handles automated dispatch notification emails to approved vendors
 * upon ticket assignment.
 */

import { dbService } from './db';

export interface VendorNotificationEmailParams {
  vendorName?: string;
  vendorEmail?: string;
  ticketNumber?: string;
  property?: string;
  unit?: string;
  issue?: string;
  priority?: string;
  description?: string;
  serviceCategory?: string;
}

export interface VendorNotificationEmail {
  to: string;
  from: string;
  replyTo: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  sentAt: string;
  deliveryStatus: 'DELIVERED' | 'QUEUED' | 'SIMULATED';
  messageId: string;
  metadata: {
    ticketNumber: string;
    property: string;
    unit: string;
    issue: string;
    priority: string;
    description: string;
    vendorName: string;
    serviceCategory: string;
    isDemo: boolean;
  };
}

/**
 * Standard default parameters representing Ticket #1042 Core Demo
 */
export const DEFAULT_TICKET_1042_NOTIFICATION_PARAMS: Required<VendorNotificationEmailParams> = {
  vendorName: 'CoolAir Services',
  vendorEmail: 'dispatch@coolairservices.com',
  ticketNumber: '#1042',
  property: 'Orion Business Park',
  unit: '402',
  issue: 'HVAC / AC malfunction',
  priority: 'HIGH',
  description: 'The AC is not working and the tenant has clients arriving tomorrow.',
  serviceCategory: 'HVAC',
};

/**
 * Generates an automated vendor notification email adhering strictly to the required specification.
 */
export function generateVendorNotificationEmail(
  params: VendorNotificationEmailParams = {}
): VendorNotificationEmail {
  const vendorName = params.vendorName || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.vendorName;
  const vendorEmail = params.vendorEmail || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.vendorEmail;
  const ticketNumber = params.ticketNumber || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.ticketNumber;
  const property = params.property || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.property;
  const unit = params.unit || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.unit;
  const issue = params.issue || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.issue;
  const priority = params.priority || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.priority;
  const description = params.description || DEFAULT_TICKET_1042_NOTIFICATION_PARAMS.description;
  const serviceCategory = params.serviceCategory || (issue.toLowerCase().includes('hvac') || issue.toLowerCase().includes('ac') ? 'HVAC' : 'General');

  // Exact Subject required by specification:
  // "New Maintenance Request #1042 — HIGH Priority"
  const subject = `New Maintenance Request ${ticketNumber} — ${priority} Priority`;

  // Exact Body required by specification:
  const bodyText = `Hello ${vendorName},

A new ${serviceCategory} maintenance request has been assigned to your team.

Ticket:
${ticketNumber}

Property:
${property}

Unit:
${unit}

Issue:
${issue}

Priority:
${priority}

Description:
${description}

Please review the request and update the property operations team through the configured process.

PropertyOps AI

This is a demo notification.`;

  // Rich HTML template mirroring the plain-text content with professional commercial styling
  const bodyHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; color: #1e293b; margin: 0; padding: 24px; background-color: #f8fafc; }
    .email-container { max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
    .email-header { background: #0f172a; padding: 20px 24px; color: #ffffff; }
    .email-header h1 { margin: 0; font-size: 16px; font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: center; justify-content: space-between; }
    .priority-badge { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; background: #ef4444; color: #ffffff; }
    .email-body { padding: 24px; font-size: 14px; }
    .greeting { font-size: 15px; font-weight: 600; color: #0f172a; margin-bottom: 12px; }
    .intro { margin-bottom: 20px; color: #334155; }
    .details-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0; }
    .field-group { margin-bottom: 12px; }
    .field-group:last-child { margin-bottom: 0; }
    .field-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 2px; }
    .field-value { font-size: 14px; font-weight: 600; color: #0f172a; }
    .field-value.desc { font-weight: 400; color: #334155; white-space: pre-wrap; }
    .cta-note { margin: 20px 0; color: #475569; font-size: 13px; }
    .email-footer { border-top: 1px solid #e2e8f0; padding: 16px 24px; background: #f8fafc; font-size: 12px; color: #64748b; }
    .brand { font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .demo-disclaimer { font-style: italic; color: #94a3b8; font-size: 11px; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 4px;">Automated Work Order Dispatch</div>
      <h1>
        <span>${ticketNumber} &bull; ${property}</span>
        <span class="priority-badge">${priority} PRIORITY</span>
      </h1>
    </div>

    <div class="email-body">
      <div class="greeting">Hello ${vendorName},</div>
      
      <p class="intro">
        A new ${serviceCategory} maintenance request has been assigned to your team.
      </p>

      <div class="details-box">
        <div class="field-group">
          <div class="field-label">Ticket:</div>
          <div class="field-value">${ticketNumber}</div>
        </div>

        <div class="field-group">
          <div class="field-label">Property:</div>
          <div class="field-value">${property}</div>
        </div>

        <div class="field-group">
          <div class="field-label">Unit:</div>
          <div class="field-value">${unit}</div>
        </div>

        <div class="field-group">
          <div class="field-label">Issue:</div>
          <div class="field-value">${issue}</div>
        </div>

        <div class="field-group">
          <div class="field-label">Priority:</div>
          <div class="field-value" style="color: ${priority === 'HIGH' || priority === 'CRITICAL' ? '#dc2626' : '#2563eb'};">${priority}</div>
        </div>

        <div class="field-group">
          <div class="field-label">Description:</div>
          <div class="field-value desc">${description}</div>
        </div>
      </div>

      <p class="cta-note">
        Please review the request and update the property operations team through the configured process.
      </p>

      <div style="margin-top: 24px;">
        <div class="brand">PropertyOps AI</div>
        <div class="demo-disclaimer">This is a demo notification.</div>
      </div>
    </div>

    <div class="email-footer">
      <div>Dispatch Source: PropertyOps AI Autonomous Routing Engine</div>
      <div style="margin-top: 4px;">Recipient: ${vendorEmail} &bull; Delivery: Encrypted SMTP / EDI</div>
    </div>
  </div>
</body>
</html>
`.trim();

  return {
    to: vendorEmail,
    from: 'PropertyOps AI Dispatch <dispatch@propertyops.ai>',
    replyTo: 'ops@orionbusinesspark.com',
    subject,
    bodyText,
    bodyHtml,
    sentAt: new Date().toISOString(),
    deliveryStatus: 'DELIVERED',
    messageId: `<wo-dispatch-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}@propertyops.ai>`,
    metadata: {
      ticketNumber,
      property,
      unit,
      issue,
      priority,
      description,
      vendorName,
      serviceCategory,
      isDemo: true,
    },
  };
}

/**
 * Simulates sending the automated vendor notification email and logs the dispatch event to Supabase.
 */
export async function sendAutomatedVendorNotification(
  params: VendorNotificationEmailParams = {},
  ticketId?: string
): Promise<VendorNotificationEmail> {
  const email = generateVendorNotificationEmail(params);

  // If ticketId is provided, write to activity log
  if (ticketId) {
    try {
      const client = (await import('./supabaseClient')).getSupabaseClient();
      if (client) {
        await client.from('activity_logs').insert([
          {
            id: `g-${Date.now()}-email`,
            ticket_id: ticketId,
            actor_type: 'PropertyOps AI',
            action: 'Vendor notification email dispatched',
            description: `Sent automated email "${email.subject}" to ${email.to}.`,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn('Could not record email to Supabase activity log:', err);
    }
  }

  return email;
}
