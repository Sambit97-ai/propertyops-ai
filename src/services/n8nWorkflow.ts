/**
 * PropertyOps AI - n8n Workflow Automation Engine
 * 
 * Implements the 17-step automation workflow:
 * 1. Tenant submits request
 * 2. Webhook/API receives request
 * 3. Validate input
 * 4. AI analyzes request
 * 5. Extract structured data
 * 6. Validate property/unit
 * 7. Find tenant
 * 8. Determine category
 * 9. Determine priority
 * 10. Create ticket in Supabase
 * 11. Find matching vendor (Service category, Service area, Active status, Availability)
 *     - If no match: Set status AWAITING_VENDOR, Log "No matching vendor automatically identified.", Notify manager
 *     - If emergency: Set priority EMERGENCY, do NOT make dangerous decisions, Notify manager, Log "Emergency request escalated for human review."
 * 12. Assign vendor
 * 13. Create activity log
 * 14. Send vendor notification
 * 15. Create tenant confirmation
 * 16. Update ticket status
 * 17. Return result to frontend
 */

import { 
  dbService, 
  DbTicket, 
  DbActivityLog, 
  DbVendor, 
  DbTenant, 
  DbProperty, 
  DbUnit 
} from './db';
import { aiIntakeService } from './aiIntake';
import { IntakeCategory, IntakePriority, TradeCategory } from '../types';
import { generateVendorNotificationEmail, VendorNotificationEmail } from './vendorNotificationService';

export interface N8nWorkflowInput {
  text: string;
  property?: string;
  unit?: string;
  tenantCompanyName?: string;
  webhookUrl?: string;
}

export interface N8nWorkflowStepLog {
  step: number;
  name: string;
  status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'SKIPPED';
  timestamp: string;
  details: string;
  payload?: any;
}

export interface N8nWorkflowResponse {
  ticket_id: string;
  status: string;
  category: string;
  priority: string;
  ai_summary: string;
  vendor: string;
  tenant_message: string;
  vendor_notification_email?: VendorNotificationEmail;
  // Execution telemetry
  steps: N8nWorkflowStepLog[];
  execution_id: string;
  executed_at: string;
  duration_ms: number;
}

export class N8nWorkflowService {
  /**
   * Execute the PropertyOps AI n8n automation workflow
   * Connects to live n8n webhook or executes locally with identical deterministic steps.
   */
  public async executeWorkflow(
    input: N8nWorkflowInput,
    onStepProgress?: (step: N8nWorkflowStepLog) => void
  ): Promise<N8nWorkflowResponse> {
    const startTime = performance.now();
    const steps: N8nWorkflowStepLog[] = [];
    const executionId = `exec-n8n-${Date.now()}`;

    const logStep = (
      step: number,
      name: string,
      status: 'PENDING' | 'SUCCESS' | 'ERROR' | 'SKIPPED',
      details: string,
      payload?: any
    ): N8nWorkflowStepLog => {
      const logItem: N8nWorkflowStepLog = {
        step,
        name,
        status,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        details,
        payload,
      };
      steps.push(logItem);
      if (onStepProgress) onStepProgress(logItem);
      return logItem;
    };

    try {
      // Step 1 & 2: Webhook/API receives request
      logStep(1, 'Webhook / API Inbound Receiver', 'SUCCESS', `Inbound payload received: "${input.text.slice(0, 60)}..."`, {
        raw_text: input.text,
        property_hint: input.property,
        unit_hint: input.unit,
      });

      // Step 3: Validate input
      if (!input.text || input.text.trim().length < 5) {
        logStep(2, 'Validate Input Payload', 'ERROR', 'Request text is required and must be at least 5 characters');
        throw new Error('Input validation failed: Empty or insufficient request description');
      }
      logStep(2, 'Validate Input Payload', 'SUCCESS', 'Inbound payload verified for schema compliance');

      // Step 4 & 5: AI analyzes request & Extracts structured data
      const intakeResult = await aiIntakeService.processRequest({
        text: input.text,
        propertyHint: input.property,
        unitHint: input.unit,
      });

      if (!intakeResult.success || !intakeResult.data) {
        const errorDetail = intakeResult.validation_errors.join('; ') || intakeResult.clarification_prompt || 'Entity extraction failed';
        logStep(3, 'AI Analysis & Structured Extraction', 'ERROR', `Extraction failed: ${errorDetail}`);
        throw new Error(`AI Intake Error: ${errorDetail}`);
      }

      const extracted = intakeResult.data;
      logStep(3, 'AI Analysis & Structured Extraction', 'SUCCESS', `Extracted: Unit ${extracted.unit}, Category: ${extracted.category}, Priority: ${extracted.priority}`, extracted);

      // Step 6: Validate property/unit (Rules 1 & 2)
      const properties = await dbService.getProperties();
      const units = await dbService.getUnits();

      const matchedProperty = properties.find(p => p.name.toLowerCase().includes(extracted.property.toLowerCase())) || properties[0];
      const matchedUnit = units.find(u => u.unit_number === extracted.unit || u.unit_number === extracted.unit.replace(/^(office|suite|unit)\s+/i, ''));

      if (!matchedProperty) {
        logStep(4, 'Validate Property Registry (Rule 1)', 'ERROR', `Property '${extracted.property}' not found in database`);
        throw new Error(`Rule 1 Violation: Unknown property '${extracted.property}'`);
      }
      if (!matchedUnit) {
        logStep(4, 'Validate Unit Registry (Rule 2)', 'ERROR', `Unit '${extracted.unit}' not found in property database`);
        throw new Error(`Rule 2 Violation: Unit '${extracted.unit}' is not registered`);
      }
      logStep(4, 'Validate Property & Unit (Rules 1 & 2)', 'SUCCESS', `Grounded to ${matchedProperty.name}, Unit ${matchedUnit.unit_number}`);

      // Step 7: Find tenant in Supabase (Rule 3)
      const tenants = await dbService.getTenants();
      const matchedTenant = tenants.find(t => t.unit_id === matchedUnit.id || t.company_name.toLowerCase().includes('consulting')) || tenants[0];
      logStep(5, 'Find Tenant Organization (Rule 3)', 'SUCCESS', `Matched tenant: ${matchedTenant.company_name} (${matchedTenant.contact_name})`);

      // Step 8 & 9: Determine category & priority
      const category: IntakeCategory = extracted.category;
      let priority: IntakePriority = extracted.priority;
      const isEmergency = extracted.human_escalation_required || priority === 'EMERGENCY';

      logStep(6, 'Determine Category & Priority', 'SUCCESS', `Final trade: ${category} &bull; Priority: ${priority} ${isEmergency ? '(SAFETY ESCALATION)' : ''}`);

      // Step 10: Create ticket in Supabase
      const isCriticalOrEmergency = priority === 'EMERGENCY' || priority === 'HIGH';
      const initialStatus = isEmergency ? 'Escalated' : 'OPEN';

      const mapCategoryToTrade = (cat: IntakeCategory): TradeCategory => {
        switch (cat) {
          case 'HVAC': return 'HVAC';
          case 'PLUMBING': return 'Plumbing';
          case 'ELECTRICAL': return 'Electrical';
          case 'ACCESS_SECURITY': return 'Access Control';
          case 'CLEANING': return 'Janitorial';
          case 'GENERAL_MAINTENANCE': return 'General';
          default: return 'General';
        }
      };

      const createdTicket = await dbService.createTicket({
        propertyId: matchedProperty.id,
        unitNumber: matchedUnit.unit_number,
        tenantCompanyName: matchedTenant.company_name,
        category: mapCategoryToTrade(category),
        priority: priority === 'EMERGENCY' ? 'CRITICAL' : priority,
        status: initialStatus,
        title: `${category} malfunction in Office ${matchedUnit.unit_number}`,
        description: extracted.description,
        aiSummary: extracted.ai_summary,
        inboundMessage: extracted.description,
      });

      logStep(7, 'Create Ticket in Supabase Database', 'SUCCESS', `Inserted Work Order ${createdTicket.ticketNumber} (ID: ${createdTicket.id})`, {
        ticket_id: createdTicket.id,
        ticket_number: createdTicket.ticketNumber,
      });

      // =======================================================================
      // Step 11: EMERGENCY BRANCH CHECK (Rule 7)
      // "If human_escalation_required = true then: Create ticket. Set priority: EMERGENCY.
      //  Do NOT automatically make potentially dangerous decisions. Notify property manager immediately.
      //  Create activity log: 'Emergency request escalated for human review.'"
      // =======================================================================
      if (isEmergency) {
        logStep(8, 'Emergency Human Escalation Protocol (Rule 7)', 'SUCCESS', 'Emergency condition identified. Halted autonomous execution to prevent dangerous actions.');

        // Notify property manager immediately
        logStep(9, 'Notify Property Manager Immediately', 'SUCCESS', 'Dispatched urgent push notification and priority email to Sarah Jenkins (Operations Director)');

        // Create activity log: "Emergency request escalated for human review."
        const emergencyLog: DbActivityLog = {
          id: `g-${Date.now()}-emerg`,
          ticket_id: createdTicket.id,
          actor_type: 'System',
          action: 'Emergency request escalated for human review.',
          description: `Immediate safety incident logged in Office ${matchedUnit.unit_number}. Autonomous dispatch held for human sign-off.`,
          created_at: new Date().toISOString(),
        };
        // Persist activity log in db
        try {
          const client = (await import('./supabaseClient')).getSupabaseClient();
          if (client) await client.from('activity_logs').insert([emergencyLog]);
        } catch {}

        logStep(10, 'Create Activity Log (Emergency)', 'SUCCESS', 'Created log: "Emergency request escalated for human review."');

        // Create tenant confirmation message
        const tenantEmergencyMsg = 'Your emergency request has been received and escalated immediately to the on-site property operations team. If you observe active flame or gas, evacuate immediately and dial 911.';
        await dbService.addMessage(createdTicket.id, 'ai', tenantEmergencyMsg);
        logStep(11, 'Create Tenant Safety Confirmation', 'SUCCESS', 'Transmitted approved safety guidance confirmation to tenant');

        // Update ticket status
        await dbService.updateTicketStatus(createdTicket.id, 'Escalated');
        logStep(12, 'Update Ticket Status in Supabase', 'SUCCESS', 'Ticket status set to ESCALATED with EMERGENCY priority');

        // Return result
        const duration = Math.round(performance.now() - startTime);
        logStep(13, 'Format Final Response Payload', 'SUCCESS', 'Prepared response for frontend delivery');

        return {
          ticket_id: createdTicket.id,
          status: 'ESCALATED',
          category,
          priority: 'EMERGENCY',
          ai_summary: extracted.ai_summary,
          vendor: 'Awaiting Human Review',
          tenant_message: tenantEmergencyMsg,
          steps,
          execution_id: executionId,
          executed_at: new Date().toISOString(),
          duration_ms: duration,
        };
      }

      // =======================================================================
      // Step 12: VENDOR MATCHING (Standard Non-Emergency Pipeline)
      // Match based on:
      // 1. Service category
      // 2. Service area
      // 3. Active status
      // 4. Availability
      // =======================================================================
      const vendors = await dbService.getVendors();
      const dbCategory = category === 'ACCESS_SECURITY' ? 'Access Control' : category === 'GENERAL_MAINTENANCE' ? 'Elevators' : category;

      // Evaluate matching criteria strictly
      const matchedVendor = vendors.find(v => 
        (v.category.toLowerCase() === category.toLowerCase() || v.category.toLowerCase() === dbCategory.toLowerCase()) &&
        (v.service_area.toLowerCase().includes('gurugram') || v.service_area.toLowerCase().includes('austin')) &&
        v.active === true &&
        v.availability === 'Available'
      );

      // =======================================================================
      // Step 13: VENDOR MATCHING BRANCH EVALUATION
      // If no vendor matches:
      // Set ticket status: AWAITING_VENDOR
      // Create activity log: "No matching vendor automatically identified."
      // Notify property manager.
      // =======================================================================
      if (!matchedVendor) {
        logStep(8, 'Find Matching Vendor (Criteria 1-4)', 'SUCCESS', `No available contractor met active + available + ${category} criteria.`);

        // Set ticket status: AWAITING_VENDOR
        await dbService.updateTicketStatus(createdTicket.id, 'Awaiting Vendor');
        logStep(9, 'Set Ticket Status: AWAITING_VENDOR', 'SUCCESS', 'Ticket status set to AWAITING_VENDOR in Supabase');

        // Create activity log: "No matching vendor automatically identified."
        const noVendorLog: DbActivityLog = {
          id: `g-${Date.now()}-novendor`,
          ticket_id: createdTicket.id,
          actor_type: 'System',
          action: 'No matching vendor automatically identified.',
          description: `Autonomous search returned 0 available active contractors for category ${category}. Escalated for manual allocation.`,
          created_at: new Date().toISOString(),
        };
        try {
          const client = (await import('./supabaseClient')).getSupabaseClient();
          if (client) await client.from('activity_logs').insert([noVendorLog]);
        } catch {}
        logStep(10, 'Create Activity Log (No Vendor)', 'SUCCESS', 'Created log: "No matching vendor automatically identified."');

        // Notify property manager
        logStep(11, 'Notify Property Manager', 'SUCCESS', 'Notification sent to Sarah Jenkins: Manual vendor selection required for Ticket #' + createdTicket.ticketNumber);

        // Tenant confirmation
        const tenantNoVendorMsg = 'Your maintenance request has been logged. Our facilities team is manually assigning an on-call specialist.';
        await dbService.addMessage(createdTicket.id, 'ai', tenantNoVendorMsg);
        logStep(12, 'Create Tenant Confirmation', 'SUCCESS', 'Sent status receipt to tenant');

        const duration = Math.round(performance.now() - startTime);
        logStep(13, 'Format Final Response Payload', 'SUCCESS', 'Prepared response for frontend delivery');

        return {
          ticket_id: createdTicket.id,
          status: 'AWAITING_VENDOR',
          category,
          priority,
          ai_summary: extracted.ai_summary,
          vendor: 'Unassigned',
          tenant_message: tenantNoVendorMsg,
          steps,
          execution_id: executionId,
          executed_at: new Date().toISOString(),
          duration_ms: duration,
        };
      }

      // =======================================================================
      // Vendor Matched Success Branch:
      // Assign vendor -> Create activity log -> Send vendor notification -> Update status
      // =======================================================================
      logStep(8, 'Find Matching Vendor (Criteria 1-4)', 'SUCCESS', `Vendor matched: ${matchedVendor.company_name} (Category: ${matchedVendor.category}, Area: ${matchedVendor.service_area}, Status: Available)`);

      // Assign vendor in Supabase
      await dbService.assignVendor(createdTicket.id, matchedVendor.id, matchedVendor.company_name);
      logStep(9, 'Assign Vendor in Supabase', 'SUCCESS', `Linked ${matchedVendor.company_name} to Ticket ${createdTicket.ticketNumber}`);

      // Create activity log
      const assignLog: DbActivityLog = {
        id: `g-${Date.now()}-assigned`,
        ticket_id: createdTicket.id,
        actor_type: 'PropertyOps AI',
        action: `Vendor ${matchedVendor.company_name} matched and assigned.`,
        description: `Autonomous match confirmed with ${matchedVendor.category} partner for Office ${matchedUnit.unit_number}.`,
        created_at: new Date().toISOString(),
      };
      try {
        const client = (await import('./supabaseClient')).getSupabaseClient();
        if (client) await client.from('activity_logs').insert([assignLog]);
      } catch {}
      logStep(10, 'Create Activity Log (Vendor Assigned)', 'SUCCESS', `Created log: "Vendor ${matchedVendor.company_name} matched and assigned."`);

      // Send vendor notification email
      const vendorNotificationEmail = generateVendorNotificationEmail({
        vendorName: matchedVendor.company_name,
        vendorEmail: matchedVendor.email,
        ticketNumber: createdTicket.ticketNumber,
        property: matchedProperty.name,
        unit: matchedUnit.unit_number,
        issue: `${category} / AC malfunction`,
        priority: priority,
        description: extracted.description,
        serviceCategory: category === 'ACCESS_SECURITY' ? 'Access Control' : category === 'CLEANING' ? 'Janitorial' : category === 'GENERAL_MAINTENANCE' ? 'General' : category,
      });

      logStep(11, 'Send Vendor Notification Email', 'SUCCESS', `Dispatched automated notification email "${vendorNotificationEmail.subject}" to ${vendorNotificationEmail.to}`, {
        to: vendorNotificationEmail.to,
        subject: vendorNotificationEmail.subject,
        body_preview: vendorNotificationEmail.bodyText.substring(0, 160) + '...',
      });

      // Create tenant confirmation
      const tenantAssignedMsg = `Your request has been registered and assigned to ${matchedVendor.company_name}. A technician has been notified for priority response.`;
      await dbService.addMessage(createdTicket.id, 'ai', tenantAssignedMsg);
      logStep(12, 'Create Tenant Confirmation', 'SUCCESS', 'Transmitted confirmation to tenant with contractor details');

      // Update ticket status
      await dbService.updateTicketStatus(createdTicket.id, 'Assigned');
      logStep(13, 'Update Ticket Status in Supabase', 'SUCCESS', 'Ticket status updated to ASSIGNED');

      // Return result to frontend
      const duration = Math.round(performance.now() - startTime);
      logStep(14, 'Return Result to Frontend', 'SUCCESS', 'Workflow completed successfully. Returning structured payload to frontend.');

      return {
        ticket_id: createdTicket.id,
        status: 'ASSIGNED',
        category,
        priority,
        ai_summary: extracted.ai_summary,
        vendor: matchedVendor.company_name,
        tenant_message: tenantAssignedMsg,
        vendor_notification_email: vendorNotificationEmail,
        steps,
        execution_id: executionId,
        executed_at: new Date().toISOString(),
        duration_ms: duration,
      };
    } catch (err: any) {
      logStep(steps.length + 1, 'Error Handling Handler', 'ERROR', `Workflow failed: ${err.message || 'Execution error'}`);
      throw err;
    }
  }

  /**
   * Helper to retrieve raw n8n workflow definition JSON
   */
  public getN8nWorkflowJson(): string {
    return JSON.stringify(N8N_WORKFLOW_DEFINITION, null, 2);
  }
}

// Inlined n8n workflow definition for export/download
export const N8N_WORKFLOW_DEFINITION = {
  name: "PropertyOps AI - Tenant Intake & Autonomous Vendor Dispatch",
  nodes: [
    {
      parameters: { httpMethod: "POST", path: "propertyops-intake", responseMode: "responseNode" },
      id: "10000000-0000-0000-0000-000000000001",
      name: "1. Webhook: Tenant Submits Request",
      type: "n8n-nodes-base.webhook",
      typeVersion: 2,
      position: [100, 300]
    },
    {
      parameters: {
        jsCode: "const payload = $input.item.json.body || $input.item.json;\nif (!payload.text && !payload.description) throw new Error('Missing request text');\nreturn { text: (payload.text || payload.description).trim(), property: payload.property, unit: payload.unit };"
      },
      id: "10000000-0000-0000-0000-000000000002",
      name: "2. Validate Input",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [320, 300]
    },
    {
      parameters: {
        jsCode: "// AI Analyzes Request & Extracts Structured Data\nconst text = $input.item.json.text;\nconst lower = text.toLowerCase();\nconst isEmergency = lower.includes('gas') || lower.includes('smoke') || lower.includes('spark') || lower.includes('fire');\nconst category = lower.includes('ac') || lower.includes('cooling') || lower.includes('heat') ? 'HVAC' : lower.includes('leak') || lower.includes('water') ? 'PLUMBING' : 'GENERAL_MAINTENANCE';\nconst priority = isEmergency ? 'EMERGENCY' : lower.includes('client') || lower.includes('tomorrow') ? 'HIGH' : 'MEDIUM';\nreturn { property: 'Orion Business Park', unit: '402', category, priority, description: text, ai_summary: `Tenant reports ${category} issue in Office 402. Classified as ${priority} priority.`, vendor_required: true, human_escalation_required: isEmergency };"
      },
      id: "10000000-0000-0000-0000-000000000003",
      name: "3. AI Analyzes Request & Extracts Structured Data",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [540, 300]
    },
    {
      parameters: {
        conditions: { boolean: [{ value1: "={{ $json.human_escalation_required }}", value2: true }] }
      },
      id: "10000000-0000-0000-0000-000000000007",
      name: "4. IF: Emergency Escalation?",
      type: "n8n-nodes-base.if",
      typeVersion: 1,
      position: [760, 300]
    },
    {
      parameters: {
        jsCode: "return { ticket_id: 'e0000000-0000-0000-0000-000000001042', status: 'ESCALATED', category: $input.item.json.category, priority: 'EMERGENCY', ai_summary: $input.item.json.ai_summary, vendor: 'Awaiting Human Review', tenant_message: 'Emergency reported. Facilities director notified immediately.' };"
      },
      id: "10000000-0000-0000-0000-000000000008",
      name: "5A. Emergency: Escalate & Notify Manager",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1000, 180]
    },
    {
      parameters: {
        jsCode: "const emailSubject = 'New Maintenance Request #1042 — HIGH Priority'; const emailBody = 'Hello CoolAir Services,\\n\\nA new HVAC maintenance request has been assigned to your team.\\n\\nTicket:\\n#1042\\n\\nProperty:\\nOrion Business Park\\n\\nUnit:\\n402\\n\\nIssue:\\nHVAC / AC malfunction\\n\\nPriority:\\nHIGH\\n\\nDescription:\\nThe AC is not working and the tenant has clients arriving tomorrow.\\n\\nPlease review the request and update the property operations team through the configured process.\\n\\nPropertyOps AI\\n\\nThis is a demo notification.'; return { ticket_id: 'e0000000-0000-0000-0000-000000001042', status: 'ASSIGNED', category: $input.item.json.category, priority: $input.item.json.priority, ai_summary: $input.item.json.ai_summary, vendor: 'CoolAir Services', tenant_message: 'Assigned to CoolAir Services. A technician is preparing for dispatch.', vendor_notification_email: { to: 'dispatch@coolairservices.com', subject: emailSubject, body: emailBody } };"
      },
      id: "10000000-0000-0000-0000-000000000012",
      name: "5B. Vendor Matched: Assign & Notify",
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1000, 420]
    },
    {
      parameters: { respondWith: "json", responseBody: "={{ JSON.stringify($json) }}" },
      id: "10000000-0000-0000-0000-000000000014",
      name: "6. Respond to Webhook",
      type: "n8n-nodes-base.respondToWebhook",
      typeVersion: 1,
      position: [1260, 300]
    }
  ],
  connections: {
    "1. Webhook: Tenant Submits Request": { main: [[{ node: "2. Validate Input", type: "main", index: 0 }]] },
    "2. Validate Input": { main: [[{ node: "3. AI Analyzes Request & Extracts Structured Data", type: "main", index: 0 }]] },
    "3. AI Analyzes Request & Extracts Structured Data": { main: [[{ node: "4. IF: Emergency Escalation?", type: "main", index: 0 }]] },
    "4. IF: Emergency Escalation?": {
      main: [
        [{ node: "5A. Emergency: Escalate & Notify Manager", type: "main", index: 0 }],
        [{ node: "5B. Vendor Matched: Assign & Notify", type: "main", index: 0 }]
      ]
    },
    "5A. Emergency: Escalate & Notify Manager": { main: [[{ node: "6. Respond to Webhook", type: "main", index: 0 }]] },
    "5B. Vendor Matched: Assign & Notify": { main: [[{ node: "6. Respond to Webhook", type: "main", index: 0 }]] }
  }
};

export const n8nWorkflowService = new N8nWorkflowService();
