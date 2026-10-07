import { getSupabaseClient, getSupabaseConfig } from './supabaseClient';
import { 
  PriorityLevel, 
  TicketStatus, 
  TradeCategory, 
  Ticket, 
  Property, 
  Tenant, 
  Vendor, 
  AIActivityItem, 
  TicketTimelineItem 
} from '../types';

// ============================================================================
// Database Schema Interfaces (Matches Supabase Tables 1:1)
// ============================================================================

export interface DbProperty {
  id: string;
  name: string;
  address: string;
  property_manager: string;
  total_units: number;
  created_at: string;
}

export interface DbUnit {
  id: string;
  property_id: string;
  unit_number: string;
  tenant_id: string | null;
  created_at: string;
}

export interface DbTenant {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  property_id: string;
  unit_id: string | null;
  created_at?: string;
}

export interface DbVendor {
  id: string;
  company_name: string;
  category: string;
  service_area: string;
  phone: string;
  email: string;
  availability: string;
  active: boolean;
  created_at?: string;
}

export interface DbTicket {
  id: string;
  property_id: string;
  unit_id: string | null;
  tenant_id: string | null;
  vendor_id: string | null;
  category: string;
  priority: string;
  status: string;
  title: string;
  description: string;
  ai_summary: string;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  ticket_id: string;
  sender_type: string; // 'tenant' | 'ai' | 'manager'
  message: string;
  created_at: string;
}

export interface DbActivityLog {
  id: string;
  ticket_id: string | null;
  actor_type: string; // 'PropertyOps AI' | 'Tenant' | 'Property Manager' | 'Vendor' | 'System'
  action: string;
  description: string;
  created_at: string;
}

// ============================================================================
// Deterministic Seed Dataset Constants
// ============================================================================

export const SEED_PROPERTIES: DbProperty[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Orion Business Park',
    address: 'Sector 29, Golf Course Extension Road, Gurugram, Haryana 122002',
    property_manager: 'Sarah Jenkins',
    total_units: 10,
    created_at: '2026-01-01T08:00:00Z',
  },
];

export const SEED_UNITS: DbUnit[] = [
  { id: 'b0000000-0000-0000-0000-000000000101', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '101', tenant_id: 'c0000000-0000-0000-0000-000000000005', created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000102', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '102', tenant_id: null, created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000109', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '109', tenant_id: 'c0000000-0000-0000-0000-000000000003', created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000201', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '201', tenant_id: null, created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000204', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '204', tenant_id: 'c0000000-0000-0000-0000-000000000002', created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000218', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '218', tenant_id: 'c0000000-0000-0000-0000-000000000004', created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000301', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '301', tenant_id: null, created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000305', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '305', tenant_id: null, created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000401', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '401', tenant_id: null, created_at: '2026-01-01T08:00:00Z' },
  { id: 'b0000000-0000-0000-0000-000000000402', property_id: 'a0000000-0000-0000-0000-000000000001', unit_number: '402', tenant_id: 'c0000000-0000-0000-0000-000000000001', created_at: '2026-01-01T08:00:00Z' },
];

export const SEED_TENANTS: DbTenant[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    company_name: 'ABC Consulting',
    contact_name: 'Marcus Vance',
    email: 'marcus.vance@abcconsulting.demo',
    phone: '+91 98100 55142',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000402',
    created_at: '2026-01-05T09:00:00Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    company_name: 'Northstar Finance',
    contact_name: 'Priya Sharma',
    email: 'priya.sharma@northstarfinance.demo',
    phone: '+91 98100 55204',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000204',
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    company_name: 'Vertex Digital',
    contact_name: 'Arjun Mehra',
    email: 'arjun.mehra@vertexdigital.demo',
    phone: '+91 98100 55109',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000109',
    created_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000004',
    company_name: 'BluePeak Technologies',
    contact_name: 'Dr. Elena Rostova',
    email: 'erostova@bluepeaktech.demo',
    phone: '+91 98100 55218',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000218',
    created_at: '2026-02-01T08:30:00Z',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000005',
    company_name: 'UrbanEdge Solutions',
    contact_name: 'Carlos Mendez',
    email: 'cmendez@urbanedge.demo',
    phone: '+91 98100 55101',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000101',
    created_at: '2026-02-15T09:45:00Z',
  },
];

export const SEED_VENDORS: DbVendor[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    company_name: 'CoolAir Services',
    category: 'HVAC',
    service_area: 'Gurugram, Haryana',
    phone: '+91 98111 88821',
    email: 'dispatch@coolairservices.demo',
    availability: 'Available',
    active: true,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    company_name: 'AquaFix Maintenance',
    category: 'Plumbing',
    service_area: 'Gurugram, Haryana',
    phone: '+91 98111 33311',
    email: 'service@aquafixmaint.demo',
    availability: 'Available',
    active: true,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    company_name: 'SecureAccess Solutions',
    category: 'Access Control',
    service_area: 'Gurugram, Haryana',
    phone: '+91 98111 99944',
    email: 'support@secureaccess.demo',
    availability: 'Available',
    active: true,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    company_name: 'BrightSpark Electrical',
    category: 'Electrical',
    service_area: 'Gurugram, Haryana',
    phone: '+91 98111 44422',
    email: 'commercial@brightspark.demo',
    availability: 'Available',
    active: true,
  },
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    company_name: 'CleanPro Facilities',
    category: 'Cleaning',
    service_area: 'Gurugram, Haryana',
    phone: '+91 98111 55566',
    email: 'dispatch@cleanprofacilities.demo',
    availability: 'Available',
    active: true,
  },
];

export const SEED_TICKETS: DbTicket[] = [
  {
    id: 'e0000000-0000-0000-0000-000000001042',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000402',
    tenant_id: 'c0000000-0000-0000-0000-000000000001',
    vendor_id: 'd0000000-0000-0000-0000-000000000001',
    category: 'HVAC',
    priority: 'HIGH',
    status: 'OPEN',
    title: 'HVAC Malfunction',
    description: 'The AC is not working and we have clients coming tomorrow.',
    ai_summary: 'Tenant reports HVAC failure in Office 402. The tenant has client meetings scheduled tomorrow, therefore the request has been classified as HIGH priority.',
    created_at: '2026-10-05T10:02:00Z',
    updated_at: '2026-10-05T10:03:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001041',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000218',
    tenant_id: 'c0000000-0000-0000-0000-000000000004',
    vendor_id: 'd0000000-0000-0000-0000-000000000003',
    category: 'Access Control',
    priority: 'MEDIUM',
    status: 'VENDOR ASSIGNED',
    title: 'Access card issue',
    description: 'Keycards for two junior associates are failing at the suite 218 reader.',
    ai_summary: 'Access reader failure for BluePeak Technologies Suite 218. SecureAccess Solutions dispatched to reprogram transponders and verify reader firmware.',
    created_at: '2026-10-05T08:45:00Z',
    updated_at: '2026-10-05T08:50:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001040',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000109',
    tenant_id: 'c0000000-0000-0000-0000-000000000003',
    vendor_id: 'd0000000-0000-0000-0000-000000000002',
    category: 'Plumbing',
    priority: 'HIGH',
    status: 'RESOLVED',
    title: 'Water pipe connection leak',
    description: 'Water dripping from shutoff valve under breakroom sink, pooling near cabinetry.',
    ai_summary: 'Active water leak near breakroom plumbing in Suite 109. AquaFix Maintenance isolated supply line and replaced compression fitting.',
    created_at: '2026-10-05T07:30:00Z',
    updated_at: '2026-10-05T09:10:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001039',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000204',
    tenant_id: 'c0000000-0000-0000-0000-000000000002',
    vendor_id: 'd0000000-0000-0000-0000-000000000004',
    category: 'Electrical',
    priority: 'HIGH',
    status: 'IN PROGRESS',
    title: 'Server rack circuit breaker trip',
    description: 'Dedicated 20A breaker in sub-panel 2B tripped during morning market opening data ingest.',
    ai_summary: 'Electrical load spike on financial server rack in Suite 204. BrightSpark Electrical on-site balancing distribution board phases.',
    created_at: '2026-10-05T07:15:00Z',
    updated_at: '2026-10-05T08:30:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001038',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000101',
    tenant_id: 'c0000000-0000-0000-0000-000000000005',
    vendor_id: 'd0000000-0000-0000-0000-000000000005',
    category: 'Cleaning',
    priority: 'LOW',
    status: 'IN REVIEW',
    title: 'Conference room carpet deep steam cleaning',
    description: 'Boardroom carpeting requires deep extraction steam cleaning following design summit.',
    ai_summary: 'Specialized carpet cleaning requested for Suite 101. In review with CleanPro Facilities for evening after-hours dispatch.',
    created_at: '2026-10-04T16:20:00Z',
    updated_at: '2026-10-04T16:45:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001037',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000402',
    tenant_id: 'c0000000-0000-0000-0000-000000000001',
    vendor_id: 'd0000000-0000-0000-0000-000000000005',
    category: 'General Maintenance',
    priority: 'MEDIUM',
    status: 'OPEN',
    title: 'Conference room acoustic sliding partition off track',
    description: 'Meeting Room B soundproof partition door is sticking on the guide rail and cannot close.',
    ai_summary: 'Sliding partition roller guide misalignment in Suite 402. Maintenance review scheduled.',
    created_at: '2026-10-04T14:10:00Z',
    updated_at: '2026-10-04T15:30:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001036',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000204',
    tenant_id: 'c0000000-0000-0000-0000-000000000002',
    vendor_id: 'd0000000-0000-0000-0000-000000000002',
    category: 'Plumbing',
    priority: 'LOW',
    status: 'RESOLVED',
    title: 'Restroom faucet aerator dripping',
    description: 'Cold water tap in private executive washroom has steady drip after shutting off.',
    ai_summary: 'Worn ceramic valve cartridge replaced by AquaFix Maintenance. Zero leak verified.',
    created_at: '2026-10-04T11:00:00Z',
    updated_at: '2026-10-04T12:45:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001035',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000109',
    tenant_id: 'c0000000-0000-0000-0000-000000000003',
    vendor_id: 'd0000000-0000-0000-0000-000000000004',
    category: 'Electrical',
    priority: 'MEDIUM',
    status: 'VENDOR ASSIGNED',
    title: 'Overhead recessed LED fixture flickering',
    description: 'Two recessed LED ceiling panels near visitor reception desk flicker continuously.',
    ai_summary: 'LED ballast driver fault in Suite 109. BrightSpark Electrical assigned for component replacement.',
    created_at: '2026-10-03T22:15:00Z',
    updated_at: '2026-10-04T02:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001034',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000218',
    tenant_id: 'c0000000-0000-0000-0000-000000000004',
    vendor_id: 'd0000000-0000-0000-0000-000000000001',
    category: 'HVAC',
    priority: 'LOW',
    status: 'IN PROGRESS',
    title: 'Thermostat sensor calibration offset',
    description: 'Wall thermostat display reads 76°F while independent room thermometer shows 71°F.',
    ai_summary: 'Smart thermostat sensor drift in Suite 218. CoolAir Services calibrating thermistor offset.',
    created_at: '2026-10-03T08:30:00Z',
    updated_at: '2026-10-03T09:00:00Z',
  },
  {
    id: 'e0000000-0000-0000-0000-000000001033',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    unit_id: 'b0000000-0000-0000-0000-000000000101',
    tenant_id: 'c0000000-0000-0000-0000-000000000005',
    vendor_id: 'd0000000-0000-0000-0000-000000000003',
    category: 'Access Control',
    priority: 'LOW',
    status: 'RESOLVED',
    title: 'Employee RFID keyfob credential batch',
    description: 'Requesting activation of 4 new contactless smart badges for incoming product design team.',
    ai_summary: 'SecureAccess Solutions programmed and validated 4 NFC keyfobs with perimeter turnstile permissions. Verified functional.',
    created_at: '2026-10-02T10:00:00Z',
    updated_at: '2026-10-02T12:30:00Z',
  },
];

export const SEED_MESSAGES: DbMessage[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    sender_type: 'tenant',
    message: 'The AC is not working and we have clients coming tomorrow.',
    created_at: '2026-10-05T10:02:00Z',
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    sender_type: 'ai',
    message: 'Maintenance request #1042 has been logged and classified as HIGH priority. CoolAir Services has been matched and dispatch notification transmitted.',
    created_at: '2026-10-05T10:03:00Z',
  },
];

export const SEED_ACTIVITY_LOGS: DbActivityLog[] = [
  // 7-step chronological timeline for Ticket #1042 (Exact Prompt Requirements)
  {
    id: 'g0000000-0000-0000-0000-000000000001',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'Tenant',
    action: 'Tenant submitted maintenance request',
    description: 'Submitted via Tenant Request Portal: "The AC is not working and we have clients coming tomorrow."',
    created_at: '2026-10-05T10:02:00Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000002',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'PropertyOps AI',
    action: 'AI classified request as HVAC',
    description: 'Autonomous natural language classifier identified HVAC / Air Conditioning domain with 99% confidence.',
    created_at: '2026-10-05T10:02:10Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000003',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'PropertyOps AI',
    action: 'AI determined priority as HIGH',
    description: 'Classified as HIGH priority due to upcoming client meetings and temperature impact on business operations.',
    created_at: '2026-10-05T10:02:20Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000004',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'System',
    action: 'Ticket #1042 created',
    description: 'System assigned work order reference #1042 and synchronized with manager queue.',
    created_at: '2026-10-05T10:02:30Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000005',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'PropertyOps AI',
    action: 'CoolAir Services matched',
    description: 'Vendor matched based on category HVAC, Gurugram service area, Available status, and contract SLA.',
    created_at: '2026-10-05T10:03:00Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000006',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'System',
    action: 'Vendor notification sent',
    description: 'Automated notification dispatched to CoolAir Services (dispatch@coolairservices.demo).',
    created_at: '2026-10-05T10:03:15Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000007',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'System',
    action: 'Tenant confirmation sent',
    description: 'Confirmation notification sent to ABC Consulting (marcus.vance@abcconsulting.demo).',
    created_at: '2026-10-05T10:03:30Z',
  },
  // Global Operational Audit Logs
  {
    id: 'g0000000-0000-0000-0000-000000000008',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'PropertyOps AI',
    action: 'AI classified Ticket #1042 as HVAC',
    description: 'Natural language extraction detected climate control failure in commercial suite.',
    created_at: '2026-10-05T10:02:10Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000009',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'PropertyOps AI',
    action: 'AI assigned HIGH priority',
    description: 'Calculated SLA urgency score based on tenant-provided client meeting context.',
    created_at: '2026-10-05T10:02:20Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000010',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'PropertyOps AI',
    action: 'AI matched CoolAir Services',
    description: 'Contractor selected using availability scorecard (45m avg response, valid liability insurance).',
    created_at: '2026-10-05T10:03:00Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000011',
    ticket_id: 'e0000000-0000-0000-0000-000000001042',
    actor_type: 'PropertyOps AI',
    action: 'AI generated tenant response',
    description: 'Synthesized professional multi-channel confirmation payload without hallucination.',
    created_at: '2026-10-05T10:03:30Z',
  },
  {
    id: 'g0000000-0000-0000-0000-000000000012',
    ticket_id: 'e0000000-0000-0000-0000-000000001041',
    actor_type: 'PropertyOps AI',
    action: 'AI requested human approval',
    description: 'Flagged access reader credential reprogram for manager signoff.',
    created_at: '2026-10-05T08:46:00Z',
  },
];

// ============================================================================
// Local Storage Persistence Cache
// Keeps local demo state deterministic and persistent across reloads
// ============================================================================

const LOCAL_STORAGE_DB_PREFIX = 'propertyops_db_v4_';

class LocalDatabaseStore {
  properties: DbProperty[] = [];
  units: DbUnit[] = [];
  tenants: DbTenant[] = [];
  vendors: DbVendor[] = [];
  tickets: DbTicket[] = [];
  messages: DbMessage[] = [];
  activityLogs: DbActivityLog[] = [];

  constructor() {
    this.loadOrSeed();
  }

  loadOrSeed(forceReset = false) {
    if (typeof window === 'undefined') return;

    const hasStored = !forceReset && localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}initialized`);
    if (hasStored) {
      try {
        this.properties = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}properties`) || '[]');
        this.units = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}units`) || '[]');
        this.tenants = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}tenants`) || '[]');
        this.vendors = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}vendors`) || '[]');
        this.tickets = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}tickets`) || '[]');
        this.messages = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}messages`) || '[]');
        this.activityLogs = JSON.parse(localStorage.getItem(`${LOCAL_STORAGE_DB_PREFIX}activity_logs`) || '[]');
        return;
      } catch (e) {
        console.warn('Error reading local database store, resetting to seed dataset:', e);
      }
    }

    // Initialize with exact deterministic seed dataset
    this.resetToSeed();
  }

  resetToSeed() {
    this.properties = JSON.parse(JSON.stringify(SEED_PROPERTIES));
    this.units = JSON.parse(JSON.stringify(SEED_UNITS));
    this.tenants = JSON.parse(JSON.stringify(SEED_TENANTS));
    this.vendors = JSON.parse(JSON.stringify(SEED_VENDORS));
    this.tickets = JSON.parse(JSON.stringify(SEED_TICKETS));
    this.messages = JSON.parse(JSON.stringify(SEED_MESSAGES));
    this.activityLogs = JSON.parse(JSON.stringify(SEED_ACTIVITY_LOGS));
    this.persist();
  }

  persist() {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}initialized`, 'true');
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}properties`, JSON.stringify(this.properties));
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}units`, JSON.stringify(this.units));
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}tenants`, JSON.stringify(this.tenants));
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}vendors`, JSON.stringify(this.vendors));
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}tickets`, JSON.stringify(this.tickets));
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}messages`, JSON.stringify(this.messages));
    localStorage.setItem(`${LOCAL_STORAGE_DB_PREFIX}activity_logs`, JSON.stringify(this.activityLogs));
  }
}

const localStore = new LocalDatabaseStore();

// ============================================================================
// Unified Database Service (Supabase Cloud + Local Deterministic Engine)
// ============================================================================

export class DatabaseService {
  /**
   * Determine whether live Supabase client is active and reachable
   */
  async isLiveSupabaseAvailable(): Promise<boolean> {
    const client = getSupabaseClient();
    if (!client) return false;

    try {
      const { error } = await client.from('properties').select('id').limit(1);
      return !error;
    } catch {
      return false;
    }
  }

  /**
   * Fetch all commercial properties
   */
  async getProperties(): Promise<DbProperty[]> {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client.from('properties').select('*').order('created_at', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return localStore.properties;
  }

  /**
   * Fetch all commercial units
   */
  async getUnits(propertyId?: string): Promise<DbUnit[]> {
    const client = getSupabaseClient();
    if (client) {
      let query = client.from('units').select('*').order('unit_number', { ascending: true });
      if (propertyId) query = query.eq('property_id', propertyId);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    }
    return propertyId 
      ? localStore.units.filter(u => u.property_id === propertyId)
      : localStore.units;
  }

  /**
   * Fetch all tenants
   */
  async getTenants(): Promise<DbTenant[]> {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client.from('tenants').select('*').order('company_name', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return localStore.tenants;
  }

  /**
   * Fetch all vendors
   */
  async getVendors(): Promise<DbVendor[]> {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client.from('vendors').select('*').order('company_name', { ascending: true });
      if (!error && data && data.length > 0) return data;
    }
    return localStore.vendors;
  }

  /**
   * Fetch all tickets with complete relationships (Property, Unit, Tenant, Vendor, Timeline from Activity Logs)
   */
  async getTickets(): Promise<Ticket[]> {
    const client = getSupabaseClient();
    let dbTickets: DbTicket[] = [];
    let properties: DbProperty[] = [];
    let units: DbUnit[] = [];
    let tenants: DbTenant[] = [];
    let vendors: DbVendor[] = [];
    let activityLogs: DbActivityLog[] = [];
    let messages: DbMessage[] = [];

    if (client) {
      try {
        const [tRes, pRes, uRes, tnRes, vRes, alRes, mRes] = await Promise.all([
          client.from('tickets').select('*').order('created_at', { ascending: false }),
          client.from('properties').select('*'),
          client.from('units').select('*'),
          client.from('tenants').select('*'),
          client.from('vendors').select('*'),
          client.from('activity_logs').select('*').order('created_at', { ascending: true }),
          client.from('messages').select('*').order('created_at', { ascending: true }),
        ]);

        if (!tRes.error && tRes.data && tRes.data.length > 0) {
          dbTickets = tRes.data;
          properties = pRes.data || [];
          units = uRes.data || [];
          tenants = tnRes.data || [];
          vendors = vRes.data || [];
          activityLogs = alRes.data || [];
          messages = mRes.data || [];
        }
      } catch (err) {
        console.warn('Falling back to local database store for tickets:', err);
      }
    }

    if (dbTickets.length === 0) {
      dbTickets = localStore.tickets;
      properties = localStore.properties;
      units = localStore.units;
      tenants = localStore.tenants;
      vendors = localStore.vendors;
      activityLogs = localStore.activityLogs;
      messages = localStore.messages;
    }

    return dbTickets.map(dbT => this.mapDbTicketToUi(dbT, properties, units, tenants, vendors, activityLogs, messages));
  }

  /**
   * Fetch a single ticket by UUID or Ticket Number (e.g. '1042', '#1042')
   */
  async getTicket(idOrNumber: string): Promise<Ticket | null> {
    const clean = idOrNumber.replace('#', '').trim().toLowerCase();
    const tickets = await this.getTickets();
    return tickets.find(t => 
      t.id.toLowerCase() === clean || 
      t.ticketNumber.replace('#', '').toLowerCase() === clean ||
      t.ticketNumber.toLowerCase() === clean
    ) || null;
  }

  /**
   * Fetch activity logs for a specific ticket to generate its execution timeline
   */
  async getTicketActivityLogs(ticketId: string): Promise<DbActivityLog[]> {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client
        .from('activity_logs')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (!error && data) return data;
    }

    return localStore.activityLogs.filter(al => al.ticket_id === ticketId);
  }

  /**
   * Fetch messages for a specific ticket
   */
  async getTicketMessages(ticketId: string): Promise<DbMessage[]> {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client
        .from('messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (!error && data) return data;
    }

    return localStore.messages.filter(m => m.ticket_id === ticketId);
  }

  /**
   * Fetch all activity logs (for AI Activity View)
   */
  async getAllActivityLogs(): Promise<AIActivityItem[]> {
    const client = getSupabaseClient();
    let logs: DbActivityLog[] = [];

    if (client) {
      const { data, error } = await client
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        logs = data;
      }
    }

    if (logs.length === 0) {
      logs = [...localStore.activityLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return logs.map(l => ({
      id: l.id,
      action: l.action,
      details: l.description,
      ticketNumber: this.extractTicketNumberFromId(l.ticket_id),
      timestamp: formatTimestamp(l.created_at),
      category: determineCategoryFromAction(l.action),
      confidence: 0.98,
    }));
  }

  /**
   * Create a new ticket in Supabase (with initial messages & activity log timeline)
   */
  async createTicket(input: {
    propertyId: string;
    unitNumber: string;
    tenantCompanyName?: string;
    vendorName?: string;
    category: TradeCategory;
    priority: PriorityLevel;
    status: TicketStatus;
    title: string;
    description: string;
    aiSummary: string;
    inboundMessage?: string;
  }): Promise<Ticket> {
    const properties = await this.getProperties();
    const units = await this.getUnits();
    const tenants = await this.getTenants();
    const vendors = await this.getVendors();

    const property = properties.find(p => p.id === input.propertyId) || properties[0];
    const unit = units.find(u => u.unit_number === input.unitNumber) || units[0];
    const tenant = tenants.find(t => t.company_name === input.tenantCompanyName) || tenants[0];
    const vendor = vendors.find(v => v.company_name === input.vendorName) || null;

    const now = new Date().toISOString();
    
    // Calculate next sequential ticket number (e.g. 1043, 1044...)
    let maxTicketNum = 1042;
    for (const t of localStore.tickets) {
      const match = t.id.match(/(\d{4})$/);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > maxTicketNum) maxTicketNum = val;
      }
    }
    const nextTicketNum = maxTicketNum + 1;
    const newTicketId = `e0000000-0000-0000-0000-00000000${nextTicketNum}`;

    const newDbTicket: DbTicket = {
      id: newTicketId,
      property_id: property.id,
      unit_id: unit.id,
      tenant_id: tenant.id,
      vendor_id: vendor ? vendor.id : null,
      category: input.category,
      priority: input.priority,
      status: input.status,
      title: input.title,
      description: input.description,
      ai_summary: input.aiSummary,
      created_at: now,
      updated_at: now,
    };

    // Prepare initial timeline activity logs
    const initialLogs: DbActivityLog[] = [
      {
        id: `g-${Date.now()}-1`,
        ticket_id: newTicketId,
        actor_type: 'Tenant',
        action: 'Tenant request received',
        description: input.description,
        created_at: now,
      },
      {
        id: `g-${Date.now()}-2`,
        ticket_id: newTicketId,
        actor_type: 'PropertyOps AI',
        action: 'AI analyzed request',
        description: `Categorized as ${input.category}. Evaluated priority as ${input.priority}.`,
        created_at: new Date(Date.now() + 1000).toISOString(),
      },
      {
        id: `g-${Date.now()}-3`,
        ticket_id: newTicketId,
        actor_type: 'PropertyOps AI',
        action: 'Ticket created',
        description: `Maintenance ticket synchronized with queue.`,
        created_at: new Date(Date.now() + 2000).toISOString(),
      },
    ];

    if (vendor) {
      initialLogs.push({
        id: `g-${Date.now()}-4`,
        ticket_id: newTicketId,
        actor_type: 'PropertyOps AI',
        action: 'Vendor selected',
        description: `Matched preferred partner ${vendor.company_name}.`,
        created_at: new Date(Date.now() + 3000).toISOString(),
      });
      initialLogs.push({
        id: `g-${Date.now()}-5`,
        ticket_id: newTicketId,
        actor_type: 'PropertyOps AI',
        action: 'Vendor notified',
        description: `Dispatched electronic work order to ${vendor.company_name}.`,
        created_at: new Date(Date.now() + 4000).toISOString(),
      });
    }

    initialLogs.push({
      id: `g-${Date.now()}-6`,
      ticket_id: newTicketId,
      actor_type: 'PropertyOps AI',
      action: 'Tenant updated',
      description: `Dispatched status confirmation to ${tenant.contact_name}.`,
      created_at: new Date(Date.now() + 5000).toISOString(),
    });

    // Prepare conversation messages
    const initialMessages: DbMessage[] = [];
    if (input.inboundMessage) {
      initialMessages.push({
        id: `f-${Date.now()}-1`,
        ticket_id: newTicketId,
        sender_type: 'tenant',
        message: input.inboundMessage,
        created_at: now,
      });
      initialMessages.push({
        id: `f-${Date.now()}-2`,
        ticket_id: newTicketId,
        sender_type: 'ai',
        message: `Thanks. I've logged ticket #${this.extractTicketNumberFromId(newTicketId)} and marked it as ${input.priority} priority.${vendor ? ` ${vendor.company_name} has been notified.` : ''}`,
        created_at: new Date(Date.now() + 2000).toISOString(),
      });
    }

    // Persist to Supabase if connected
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('tickets').insert([newDbTicket]);
        await client.from('activity_logs').insert(initialLogs);
        if (initialMessages.length > 0) {
          await client.from('messages').insert(initialMessages);
        }
      } catch (err) {
        console.warn('Supabase insert failed, storing in local database:', err);
      }
    }

    // Persist locally
    localStore.tickets.unshift(newDbTicket);
    localStore.activityLogs.push(...initialLogs);
    localStore.messages.push(...initialMessages);
    localStore.persist();

    return this.mapDbTicketToUi(newDbTicket, properties, units, tenants, vendors, initialLogs, initialMessages);
  }

  /**
   * Update ticket status in Supabase & log in activity_logs
   */
  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<void> {
    const now = new Date().toISOString();
    const log: DbActivityLog = {
      id: `g-${Date.now()}`,
      ticket_id: ticketId,
      actor_type: 'Property Manager',
      action: `Status updated to ${status}`,
      description: `Workflow stage modified by property operations director.`,
      created_at: now,
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        await client
          .from('tickets')
          .update({ status, updated_at: now })
          .eq('id', ticketId);
        await client.from('activity_logs').insert([log]);
      } catch (err) {
        console.warn('Supabase status update failed:', err);
      }
    }

    // Update local store
    const t = localStore.tickets.find(item => item.id === ticketId);
    if (t) {
      t.status = status;
      t.updated_at = now;
    }
    localStore.activityLogs.push(log);
    localStore.persist();
  }

  /**
   * Assign vendor to ticket in Supabase & log in activity_logs
   */
  async assignVendor(ticketId: string, vendorId: string, vendorName: string): Promise<void> {
    const now = new Date().toISOString();
    const log: DbActivityLog = {
      id: `g-${Date.now()}`,
      ticket_id: ticketId,
      actor_type: 'Property Manager',
      action: `Vendor assigned: ${vendorName}`,
      description: `Manual dispatch confirmed. Electronic work order transmitted.`,
      created_at: now,
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        await client
          .from('tickets')
          .update({ 
            vendor_id: vendorId, 
            status: 'Assigned',
            updated_at: now 
          })
          .eq('id', ticketId);
        await client.from('activity_logs').insert([log]);
      } catch (err) {
        console.warn('Supabase vendor assignment failed:', err);
      }
    }

    // Update local store
    const t = localStore.tickets.find(item => item.id === ticketId);
    if (t) {
      t.vendor_id = vendorId;
      t.status = 'Assigned';
      t.updated_at = now;
    }
    localStore.activityLogs.push(log);
    localStore.persist();
  }

  /**
   * Change priority in Supabase & log in activity_logs
   */
  async changePriority(ticketId: string, priority: PriorityLevel): Promise<void> {
    const now = new Date().toISOString();
    const log: DbActivityLog = {
      id: `g-${Date.now()}`,
      ticket_id: ticketId,
      actor_type: 'Property Manager',
      action: `Priority updated to ${priority}`,
      description: `SLA recalculated according to lease schedule.`,
      created_at: now,
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        await client
          .from('tickets')
          .update({ priority, updated_at: now })
          .eq('id', ticketId);
        await client.from('activity_logs').insert([log]);
      } catch (err) {
        console.warn('Supabase priority update failed:', err);
      }
    }

    const t = localStore.tickets.find(item => item.id === ticketId);
    if (t) {
      t.priority = priority;
      t.updated_at = now;
    }
    localStore.activityLogs.push(log);
    localStore.persist();
  }

  /**
   * Add message to conversation
   */
  async addMessage(ticketId: string, senderType: 'tenant' | 'ai' | 'manager', message: string): Promise<DbMessage> {
    const now = new Date().toISOString();
    const msg: DbMessage = {
      id: `f-${Date.now()}`,
      ticket_id: ticketId,
      sender_type: senderType,
      message,
      created_at: now,
    };

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('messages').insert([msg]);
      } catch (err) {
        console.warn('Supabase message insert failed:', err);
      }
    }

    localStore.messages.push(msg);
    localStore.persist();
    return msg;
  }

  /**
   * Reset database to deterministic seed dataset (Both Supabase Cloud and Local Store)
   */
  async resetDatabaseToSeedData(): Promise<{ success: boolean; message: string }> {
    // 1. Reset local store
    localStore.resetToSeed();

    // 2. If Supabase client configured, reset Supabase tables
    const client = getSupabaseClient();
    if (client) {
      try {
        // Delete in foreign key order
        await client.from('activity_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await client.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await client.from('tickets').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await client.from('tenants').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await client.from('units').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await client.from('vendors').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await client.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        // Insert fresh seed dataset
        await client.from('properties').insert(SEED_PROPERTIES);
        await client.from('units').insert(SEED_UNITS);
        await client.from('tenants').insert(SEED_TENANTS);
        await client.from('vendors').insert(SEED_VENDORS);
        await client.from('tickets').insert(SEED_TICKETS);
        await client.from('messages').insert(SEED_MESSAGES);
        await client.from('activity_logs').insert(SEED_ACTIVITY_LOGS);

        return { 
          success: true, 
          message: 'Database successfully reset and seeded in both Supabase Cloud and Local Engine.' 
        };
      } catch (err: any) {
        console.error('Failed to reset Supabase cloud database:', err);
        return { 
          success: true, 
          message: `Local store reset to seed data. (Cloud sync notice: ${err.message || 'Check table RLS'})` 
        };
      }
    }

    return { 
      success: true, 
      message: 'Local database engine successfully reset to deterministic seed dataset (1 property, 10 units, 5 tenants, 5 vendors, 10 tickets).' 
    };
  }

  // ============================================================================
  // Helper Mapping Methods
  // ============================================================================

  extractTicketNumberFromId(ticketId: string | null): string {
    if (!ticketId) return '#1042';
    const match = ticketId.match(/(\d{4})$/);
    if (match) return `#${match[1]}`;
    return `#${ticketId.slice(-4)}`;
  }

  private mapDbTicketToUi(
    dbT: DbTicket,
    properties: DbProperty[],
    units: DbUnit[],
    tenants: DbTenant[],
    vendors: DbVendor[],
    activityLogs: DbActivityLog[],
    messages: DbMessage[]
  ): Ticket {
    const property = properties.find(p => p.id === dbT.property_id);
    const unit = units.find(u => u.id === dbT.unit_id);
    const tenant = tenants.find(t => t.id === dbT.tenant_id);
    const vendor = vendors.find(v => v.id === dbT.vendor_id);

    const ticketNumber = this.extractTicketNumberFromId(dbT.id);

    // Build timeline strictly from activity_logs table for this ticket
    const ticketLogs = activityLogs.filter(al => al.ticket_id === dbT.id);
    const timeline: TicketTimelineItem[] = ticketLogs.length > 0 
      ? ticketLogs.map(log => ({
          id: log.id,
          title: log.action,
          description: log.description,
          timestamp: formatTimelineTime(log.created_at),
          completed: true,
          actor: log.actor_type as any,
        }))
      : [
          {
            id: `tl-init-${dbT.id}`,
            title: 'Ticket logged in Supabase',
            description: dbT.description,
            timestamp: formatTimelineTime(dbT.created_at),
            completed: true,
            actor: 'System',
          }
        ];

    // Build conversation from messages table for this ticket
    const ticketMsgs = messages.filter(m => m.ticket_id === dbT.id);
    const tenantMsg = ticketMsgs.find(m => m.sender_type === 'tenant')?.message || dbT.description;
    const aiMsg = ticketMsgs.find(m => m.sender_type === 'ai')?.message || 
      `Thanks. I've created maintenance request ${ticketNumber} and marked it as ${dbT.priority} priority. ${vendor?.company_name || 'Assigned contractor'} has been notified.`;

    return {
      id: dbT.id,
      ticketNumber,
      title: dbT.title,
      description: dbT.description,
      property: property?.name || 'Orion Business Park',
      unit: unit?.unit_number || '402',
      priority: dbT.priority as PriorityLevel,
      assignedVendor: vendor?.company_name || (dbT.status === 'Resolved' ? 'Completed' : 'Unassigned'),
      status: dbT.status as TicketStatus,
      createdAt: dbT.created_at,
      createdTimeFormatted: formatTimestamp(dbT.created_at),
      category: dbT.category as TradeCategory,
      tenant: {
        name: tenant?.contact_name || 'Tenant Contact',
        company: tenant?.company_name || 'Commercial Tenant',
        email: tenant?.email || 'tenant@orionpark.com',
        phone: tenant?.phone || '(512) 555-0100',
      },
      aiSummary: dbT.ai_summary,
      timeline,
      conversation: {
        tenantMessage: tenantMsg,
        aiResponse: aiMsg,
        timestamp: formatTimestamp(dbT.created_at),
      },
      notes: [
        {
          id: `n-${dbT.id}`,
          author: 'Sarah Jenkins (Property Director)',
          timestamp: formatTimestamp(dbT.created_at),
          text: `Logged in Supabase with ${dbT.priority} priority SLA.`,
        }
      ],
    };
  }
}

export const dbService = new DatabaseService();

// ============================================================================
// Formatting Utility Functions
// ============================================================================

export function formatTimelineTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${strMinutes} ${ampm}`;
  } catch {
    return '10:02 AM';
  }
}

export function formatSubmittedDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[date.getUTCMonth()];
    const day = date.getUTCDate();
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const strMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${month} ${day}, ${year} at ${hours}:${strMinutes} ${ampm}`;
  } catch {
    return 'October 5, 2026 at 10:02 AM';
  }
}

export function formatTimestamp(isoString: string): string {
  try {
    const date = new Date(isoString);
    return formatTimelineTime(isoString);
  } catch {
    return 'Recently';
  }
}

function determineCategoryFromAction(action: string): AIActivityItem['category'] {
  const lower = action.toLowerCase();
  if (lower.includes('classif')) return 'Classification';
  if (lower.includes('priority')) return 'Priority';
  if (lower.includes('match') || lower.includes('vendor')) return 'Vendor Matching';
  if (lower.includes('response') || lower.includes('generat')) return 'Response Generation';
  if (lower.includes('approv') || lower.includes('escalat')) return 'Human Approval';
  return 'Classification';
}
