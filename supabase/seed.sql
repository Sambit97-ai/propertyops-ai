-- ============================================================================
-- PropertyOps AI - Supabase Deterministic Seed Dataset
-- Commercial Property Operations Assistant
-- Property: Orion Business Park, Gurugram, Haryana
-- 1 Commercial Property | 10 Units | 5 Fictional Tenants | 5 Fictional Vendors | 10 Tickets
-- ============================================================================

-- Clean out existing records cleanly in foreign-key safe order
DELETE FROM activity_logs;
DELETE FROM messages;
DELETE FROM tickets;
UPDATE units SET tenant_id = NULL;
DELETE FROM tenants;
DELETE FROM units;
DELETE FROM vendors;
DELETE FROM properties;

-- ============================================================================
-- 1. COMMERCIAL PROPERTY (Orion Business Park, Gurugram, Haryana)
-- ============================================================================
INSERT INTO properties (id, name, address, property_manager, total_units, created_at)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Orion Business Park',
    'Sector 29, Golf Course Extension Road, Gurugram, Haryana 122002',
    'Sarah Jenkins',
    10,
    '2026-01-01 08:00:00+00'
);

-- ============================================================================
-- 2. UNITS (10 Commercial Units)
-- ============================================================================
INSERT INTO units (id, property_id, unit_number, tenant_id, created_at) VALUES
('b0000000-0000-0000-0000-000000000101', 'a0000000-0000-0000-0000-000000000001', '101', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000102', 'a0000000-0000-0000-0000-000000000001', '102', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000109', 'a0000000-0000-0000-0000-000000000001', '109', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000201', 'a0000000-0000-0000-0000-000000000001', '201', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000204', 'a0000000-0000-0000-0000-000000000001', '204', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000218', 'a0000000-0000-0000-0000-000000000001', '218', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000301', 'a0000000-0000-0000-0000-000000000001', '301', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000305', 'a0000000-0000-0000-0000-000000000001', '305', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000401', 'a0000000-0000-0000-0000-000000000001', '401', NULL, '2026-01-01 08:00:00+00'),
('b0000000-0000-0000-0000-000000000402', 'a0000000-0000-0000-0000-000000000001', '402', NULL, '2026-01-01 08:00:00+00');

-- ============================================================================
-- 3. FICTIONAL TENANTS (5 Commercial Corporate Occupants)
-- ============================================================================
INSERT INTO tenants (id, company_name, contact_name, email, phone, property_id, unit_id, created_at) VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'ABC Consulting',
    'Marcus Vance',
    'marcus.vance@abcconsulting.demo',
    '+91 98100 55142',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000402',
    '2026-01-05 09:00:00+00'
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Northstar Finance',
    'Priya Sharma',
    'priya.sharma@northstarfinance.demo',
    '+91 98100 55204',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000204',
    '2026-01-10 10:00:00+00'
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Vertex Digital',
    'Arjun Mehra',
    'arjun.mehra@vertexdigital.demo',
    '+91 98100 55109',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000109',
    '2026-01-15 11:00:00+00'
),
(
    'c0000000-0000-0000-0000-000000000004',
    'BluePeak Technologies',
    'Dr. Elena Rostova',
    'erostova@bluepeaktech.demo',
    '+91 98100 55218',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000218',
    '2026-02-01 08:30:00+00'
),
(
    'c0000000-0000-0000-0000-000000000005',
    'UrbanEdge Solutions',
    'Carlos Mendez',
    'cmendez@urbanedge.demo',
    '+91 98100 55101',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000101',
    '2026-02-15 09:45:00+00'
);

-- Update units with tenant assignments
UPDATE units SET tenant_id = 'c0000000-0000-0000-0000-000000000001' WHERE id = 'b0000000-0000-0000-0000-000000000402';
UPDATE units SET tenant_id = 'c0000000-0000-0000-0000-000000000002' WHERE id = 'b0000000-0000-0000-0000-000000000204';
UPDATE units SET tenant_id = 'c0000000-0000-0000-0000-000000000003' WHERE id = 'b0000000-0000-0000-0000-000000000109';
UPDATE units SET tenant_id = 'c0000000-0000-0000-0000-000000000004' WHERE id = 'b0000000-0000-0000-0000-000000000218';
UPDATE units SET tenant_id = 'c0000000-0000-0000-0000-000000000005' WHERE id = 'b0000000-0000-0000-0000-000000000101';

-- ============================================================================
-- 4. FICTIONAL VENDORS (5 Commercial Trade Contractors)
-- ============================================================================
INSERT INTO vendors (id, company_name, category, service_area, phone, email, availability, active, created_at) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'CoolAir Services',
    'HVAC',
    'Gurugram, Haryana',
    '+91 98111 88821',
    'dispatch@coolairservices.demo',
    'Available',
    true,
    '2026-01-01 08:00:00+00'
),
(
    'd0000000-0000-0000-0000-000000000002',
    'AquaFix Maintenance',
    'Plumbing',
    'Gurugram, Haryana',
    '+91 98111 33311',
    'service@aquafixmaint.demo',
    'Available',
    true,
    '2026-01-01 08:00:00+00'
),
(
    'd0000000-0000-0000-0000-000000000003',
    'SecureAccess Solutions',
    'Access Control',
    'Gurugram, Haryana',
    '+91 98111 99944',
    'support@secureaccess.demo',
    'Available',
    true,
    '2026-01-01 08:00:00+00'
),
(
    'd0000000-0000-0000-0000-000000000004',
    'BrightSpark Electrical',
    'Electrical',
    'Gurugram, Haryana',
    '+91 98111 44422',
    'commercial@brightspark.demo',
    'Available',
    true,
    '2026-01-01 08:00:00+00'
),
(
    'd0000000-0000-0000-0000-000000000005',
    'CleanPro Facilities',
    'Cleaning',
    'Gurugram, Haryana',
    '+91 98111 55566',
    'dispatch@cleanprofacilities.demo',
    'Available',
    true,
    '2026-01-01 08:00:00+00'
);

-- ============================================================================
-- 5. MAINTENANCE TICKETS (10 Work Orders)
-- ============================================================================
INSERT INTO tickets (id, property_id, unit_id, tenant_id, vendor_id, category, priority, status, title, description, ai_summary, created_at, updated_at) VALUES
(
    'e0000000-0000-0000-0000-000000001042',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000402',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000001',
    'HVAC',
    'HIGH',
    'OPEN',
    'HVAC Malfunction',
    'The AC is not working and we have clients coming tomorrow.',
    'Tenant reports HVAC failure in Office 402. The tenant has client meetings scheduled tomorrow, therefore the request has been classified as HIGH priority.',
    '2026-10-05 10:02:00+00',
    '2026-10-05 10:03:00+00'
),
(
    'e0000000-0000-0000-0000-000000001041',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000218',
    'c0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000003',
    'Access Control',
    'MEDIUM',
    'VENDOR ASSIGNED',
    'Access card issue',
    'Keycards for two junior associates are failing at the suite 218 reader.',
    'Access reader failure for BluePeak Technologies Suite 218. SecureAccess Solutions dispatched to reprogram transponders and verify reader firmware.',
    '2026-10-05 08:45:00+00',
    '2026-10-05 08:50:00+00'
),
(
    'e0000000-0000-0000-0000-000000001040',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000109',
    'c0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000002',
    'Plumbing',
    'HIGH',
    'RESOLVED',
    'Water pipe connection leak',
    'Water dripping from shutoff valve under breakroom sink, pooling near cabinetry.',
    'Active water leak near breakroom plumbing in Suite 109. AquaFix Maintenance isolated supply line and replaced compression fitting.',
    '2026-10-05 07:30:00+00',
    '2026-10-05 09:10:00+00'
),
(
    'e0000000-0000-0000-0000-000000001039',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000204',
    'c0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000004',
    'Electrical',
    'HIGH',
    'IN PROGRESS',
    'Server rack circuit breaker trip',
    'Dedicated 20A breaker in sub-panel 2B tripped during morning market opening data ingest.',
    'Electrical load spike on financial server rack in Suite 204. BrightSpark Electrical on-site balancing distribution board phases.',
    '2026-10-05 07:15:00+00',
    '2026-10-05 08:30:00+00'
),
(
    'e0000000-0000-0000-0000-000000001038',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000101',
    'c0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000005',
    'Cleaning',
    'LOW',
    'IN REVIEW',
    'Conference room carpet deep steam cleaning',
    'Boardroom carpeting requires deep extraction steam cleaning following design summit.',
    'Specialized carpet cleaning requested for Suite 101. In review with CleanPro Facilities for evening after-hours dispatch.',
    '2026-10-04 16:20:00+00',
    '2026-10-04 16:45:00+00'
),
(
    'e0000000-0000-0000-0000-000000001037',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000402',
    'c0000000-0000-0000-0000-000000000001',
    'd0000000-0000-0000-0000-000000000005',
    'General Maintenance',
    'MEDIUM',
    'OPEN',
    'Conference room acoustic sliding partition off track',
    'Meeting Room B soundproof partition door is sticking on the guide rail and cannot close.',
    'Sliding partition roller guide misalignment in Suite 402. Maintenance review scheduled.',
    '2026-10-04 14:10:00+00',
    '2026-10-04 15:30:00+00'
),
(
    'e0000000-0000-0000-0000-000000001036',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000204',
    'c0000000-0000-0000-0000-000000000002',
    'd0000000-0000-0000-0000-000000000002',
    'Plumbing',
    'LOW',
    'RESOLVED',
    'Restroom faucet aerator dripping',
    'Cold water tap in private executive washroom has steady drip after shutting off.',
    'Worn ceramic valve cartridge replaced by AquaFix Maintenance. Zero leak verified.',
    '2026-10-04 11:00:00+00',
    '2026-10-04 12:45:00+00'
),
(
    'e0000000-0000-0000-0000-000000001035',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000109',
    'c0000000-0000-0000-0000-000000000003',
    'd0000000-0000-0000-0000-000000000004',
    'Electrical',
    'MEDIUM',
    'VENDOR ASSIGNED',
    'Overhead recessed LED fixture flickering',
    'Two recessed LED ceiling panels near visitor reception desk flicker continuously.',
    'LED ballast driver fault in Suite 109. BrightSpark Electrical assigned for component replacement.',
    '2026-10-03 22:15:00+00',
    '2026-10-04 02:00:00+00'
),
(
    'e0000000-0000-0000-0000-000000001034',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000218',
    'c0000000-0000-0000-0000-000000000004',
    'd0000000-0000-0000-0000-000000000001',
    'HVAC',
    'LOW',
    'IN PROGRESS',
    'Thermostat sensor calibration offset',
    'Wall thermostat display reads 76°F while independent room thermometer shows 71°F.',
    'Smart thermostat sensor drift in Suite 218. CoolAir Services calibrating thermistor offset.',
    '2026-10-03 08:30:00+00',
    '2026-10-03 09:00:00+00'
),
(
    'e0000000-0000-0000-0000-000000001033',
    'a0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000101',
    'c0000000-0000-0000-0000-000000000005',
    'd0000000-0000-0000-0000-000000000003',
    'Access Control',
    'LOW',
    'RESOLVED',
    'Employee RFID keyfob credential batch',
    'Requesting activation of 4 new contactless smart badges for incoming product design team.',
    'SecureAccess Solutions programmed and validated 4 NFC keyfobs with perimeter turnstile permissions. Verified functional.',
    '2026-10-02 10:00:00+00',
    '2026-10-02 12:30:00+00'
);

-- ============================================================================
-- 6. MESSAGES (Tenant-AI Dialogue for Core Demo Ticket #1042)
-- ============================================================================
INSERT INTO messages (id, ticket_id, sender_type, message, created_at) VALUES
(
    'f0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000001042',
    'tenant',
    'The AC is not working and we have clients coming tomorrow.',
    '2026-10-05 10:02:00+00'
),
(
    'f0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000001042',
    'ai',
    'Maintenance request #1042 has been logged and classified as HIGH priority. CoolAir Services has been matched and dispatch notification transmitted.',
    '2026-10-05 10:03:00+00'
);

-- ============================================================================
-- 7. ACTIVITY_LOGS (Chronological Timeline & System Audit)
-- ============================================================================
INSERT INTO activity_logs (id, ticket_id, actor_type, action, description, created_at) VALUES
(
    'g0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000001042',
    'Tenant',
    'Tenant submitted maintenance request',
    'Submitted via Tenant Request Portal: "The AC is not working and we have clients coming tomorrow."',
    '2026-10-05 10:02:00+00'
),
(
    'g0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000001042',
    'PropertyOps AI',
    'AI classified request as HVAC',
    'Autonomous natural language classifier identified HVAC / Air Conditioning domain with 99% confidence.',
    '2026-10-05 10:02:10+00'
),
(
    'g0000000-0000-0000-0000-000000000003',
    'e0000000-0000-0000-0000-000000001042',
    'PropertyOps AI',
    'AI determined priority as HIGH',
    'Classified as HIGH priority due to upcoming client meetings and temperature impact on business operations.',
    '2026-10-05 10:02:20+00'
),
(
    'g0000000-0000-0000-0000-000000000004',
    'e0000000-0000-0000-0000-000000001042',
    'System',
    'Ticket #1042 created',
    'System assigned work order reference #1042 and synchronized with manager queue.',
    '2026-10-05 10:02:30+00'
),
(
    'g0000000-0000-0000-0000-000000000005',
    'e0000000-0000-0000-0000-000000001042',
    'PropertyOps AI',
    'CoolAir Services matched',
    'Vendor matched based on category HVAC, Gurugram service area, Available status, and contract SLA.',
    '2026-10-05 10:03:00+00'
),
(
    'g0000000-0000-0000-0000-000000000006',
    'e0000000-0000-0000-0000-000000001042',
    'System',
    'Vendor notification sent',
    'Automated notification dispatched to CoolAir Services (dispatch@coolairservices.demo).',
    '2026-10-05 10:03:15+00'
),
(
    'g0000000-0000-0000-0000-000000000007',
    'e0000000-0000-0000-0000-000000001042',
    'System',
    'Tenant confirmation sent',
    'Confirmation notification sent to ABC Consulting (marcus.vance@abcconsulting.demo).',
    '2026-10-05 10:03:30+00'
),
(
    'g0000000-0000-0000-0000-000000000008',
    'e0000000-0000-0000-0000-000000001042',
    'PropertyOps AI',
    'AI classified Ticket #1042 as HVAC',
    'Natural language extraction detected climate control failure in commercial suite.',
    '2026-10-05 10:02:10+00'
),
(
    'g0000000-0000-0000-0000-000000000009',
    'e0000000-0000-0000-0000-000000001042',
    'PropertyOps AI',
    'AI assigned HIGH priority',
    'Calculated SLA urgency score based on tenant-provided client meeting context.',
    '2026-10-05 10:02:20+00'
),
(
    'g0000000-0000-0000-0000-000000000010',
    'e0000000-0000-0000-0000-000000001042',
    'PropertyOps AI',
    'AI matched CoolAir Services',
    'Contractor selected using availability scorecard (45m avg response, valid liability insurance).',
    '2026-10-05 10:03:00+00'
),
(
    'g0000000-0000-0000-0000-000000000011',
    'e0000000-0000-0000-0000-000000001042',
    'PropertyOps AI',
    'AI generated tenant response',
    'Synthesized professional multi-channel confirmation payload without hallucination.',
    '2026-10-05 10:03:30+00'
),
(
    'g0000000-0000-0000-0000-000000000012',
    'e0000000-0000-0000-0000-000000001041',
    'PropertyOps AI',
    'AI requested human approval',
    'Flagged access reader credential reprogram for manager signoff.',
    '2026-10-05 08:46:00+00'
);
