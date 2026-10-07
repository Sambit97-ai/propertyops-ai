# PropertyOps AI &mdash; n8n Automation Workflow

Production-grade n8n automation pipeline for commercial real estate operations.

---

## 1. Workflow Architecture & Flow Diagram

```text
Tenant Submits Maintenance Request
                 │
                 ▼
     [1. Inbound Webhook]  (POST /webhook/propertyops-intake)
                 │
                 ▼
        [2. Validate Input]  (Payload structure & non-empty check)
                 │
                 ▼
     [3. AI Analyzes Request]  (Entity extraction & classification)
                 │
                 ▼
     [4. Validate Property/Unit]  (Database Grounding Rules 1 & 2)
                 │
                 ▼
        [5. Find Tenant]  (Query registered lease records)
                 │
                 ▼
      [6. Create Ticket in Supabase]  (Initial work order inserted)
                 │
                 ▼
     {7. Emergency Escalation?} ───► [TRUE: EMERGENCY]
                 │                          │
                 │ [FALSE: STANDARD]        ▼
                 ▼                 [8A. Emergency Protocol]
     [8B. Find Matching Vendor]         - Set priority EMERGENCY
                 │                      - Escalated for human review
                 ▼                      - Urgent manager push alert
     {9. Matching Vendor Found?}        - Approved safety guidance
         │               │                  │
         │ [MATCH]       │ [NO MATCH]       │
         ▼               ▼                  │
    [10B. Assign    [10A. Set Status        │
      Vendor]       AWAITING_VENDOR]        │
    - Log audit     - Log: No vendor        │
    - Dispatch EDI  - Notify manager        │
         │               │                  │
         └───────────────┴──────────────────┘
                         │
                         ▼
             [11. Format Final Response]
                         │
                         ▼
            [12. Respond to Webhook]
```

---

## 2. Vendor Matching Rules

Matching candidate vendors strictly requires meeting all four conditions:
1. **Service Category**: Matches trade category (`HVAC`, `PLUMBING`, `ELECTRICAL`, `ACCESS_SECURITY`, `GENERAL_MAINTENANCE`).
2. **Service Area**: Matches commercial region (`Gurugram` / `Austin Metro Corridor`).
3. **Active Status**: Must have contract verified and active (`active = true`).
4. **Availability**: Real-time contractor status must be (`availability = 'Available'`).

### Fallback if No Vendor Matches
* **Ticket Status**: Updated to `AWAITING_VENDOR`.
* **Activity Log**: Recorded as `"No matching vendor automatically identified."`.
* **Manager Notification**: Triggered immediately to Sarah Jenkins (Property Operations Director) to assign a specialized contractor manually.

---

## 3. Emergency & Safety Protocol

If `human_escalation_required = true` (or priority is `EMERGENCY`):
* **Autonomous Safety Guardrail**: AI does **NOT** automatically make potentially dangerous decisions or dispatch binding contracts.
* **Priority**: Forced to `EMERGENCY`.
* **Manager Notification**: Immediate emergency push notification dispatched to Sarah Jenkins.
* **Activity Log**: Recorded as `"Emergency request escalated for human review."`.
* **Tenant Guidance**: Enforces application approved safety protocol (*"If there is active flame or gas leak, evacuate immediately and dial 911"*).

---

## 4. Final Response Payload Schema

Every execution returns the exact required structured JSON:

```json
{
  "ticket_id": "e0000000-0000-0000-0000-000000001042",
  "status": "ASSIGNED",
  "category": "HVAC",
  "priority": "HIGH",
  "ai_summary": "Tenant reports HVAC failure in Office 402. The tenant has client meetings scheduled tomorrow, therefore the request has been classified as HIGH priority.",
  "vendor": "CoolAir Services",
  "tenant_message": "Your request has been registered and assigned to CoolAir Services. A technician is preparing for dispatch."
}
```

---

## 5. Automated Vendor Notification Email

When a matching vendor is identified (Node `10B. Vendor Matched: Assign & Notify`), the system automatically compiles and dispatches a standardized work order dispatch email:

* **Recipient**: `dispatch@coolairservices.com`
* **Subject**: `New Maintenance Request #1042 — HIGH Priority`
* **Message Body**:
```text
Hello CoolAir Services,

A new HVAC maintenance request has been assigned to your team.

Ticket:
#1042

Property:
Orion Business Park

Unit:
402

Issue:
HVAC / AC malfunction

Priority:
HIGH

Description:
The AC is not working and the tenant has clients arriving tomorrow.

Please review the request and update the property operations team through the configured process.

PropertyOps AI

This is a demo notification.
```

---

## 6. How to Import into n8n

1. Open your n8n dashboard (`http://localhost:5678` or Cloud).
2. Click **Workflows** &rarr; **Add Workflow**.
3. In the top-right menu, select **Import from File...**.
4. Choose [`n8n/propertyops-ai-automation.json`](./propertyops-ai-automation.json).
5. Activate the workflow!

---

## 7. Testing with cURL

### Scenario A: Standard High-Priority Request
```bash
curl -X POST http://localhost:5678/webhook/propertyops-intake \
  -H "Content-Type: application/json" \
  -d '{
    "text": "The AC in Office 402 is not working and we have clients coming tomorrow.",
    "property": "Orion Business Park",
    "unit": "402"
  }'
```

### Scenario B: Emergency Hazard
```bash
curl -X POST http://localhost:5678/webhook/propertyops-intake \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Strong gas odor and sparking electrical panel in Unit 109!",
    "property": "Orion Business Park",
    "unit": "109"
  }'
```

### Scenario C: No Vendor Match
```bash
curl -X POST http://localhost:5678/webhook/propertyops-intake \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Elevator door sensor optical alignment failed in lobby.",
    "property": "Orion Business Park",
    "unit": "102"
  }'
```
