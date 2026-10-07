export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type TicketStatus = 
  | 'OPEN'
  | 'IN REVIEW'
  | 'VENDOR ASSIGNED'
  | 'IN PROGRESS'
  | 'RESOLVED'
  | 'Vendor Contacted'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Awaiting Vendor'
  | 'Escalated'
  | 'Pending Approval'
  | 'CLOSED';

export type TradeCategory = 
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Access'
  | 'Access Control'
  | 'Security'
  | 'Elevators'
  | 'Janitorial'
  | 'Cleaning'
  | 'General Maintenance'
  | 'General';

export interface TicketTimelineItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  actor: 'Tenant' | 'PropertyOps AI' | 'Vendor' | 'Property Manager' | 'System';
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. "#1042"
  title: string;
  description?: string;
  property: string;
  unit: string;
  priority: PriorityLevel;
  assignedVendor: string;
  status: TicketStatus;
  createdAt: string;
  createdTimeFormatted: string;
  tenant: {
    name: string;
    company: string;
    email: string;
    phone: string;
  };
  aiSummary: string;
  timeline: TicketTimelineItem[];
  conversation: {
    tenantMessage: string;
    aiResponse: string;
    timestamp: string;
  };
  notes: {
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }[];
  category: TradeCategory;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  propertyManager: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  totalUnits: number;
  openTickets: number;
  activeVendors: number;
  occupancyRate: number;
  sqFt: number;
  recentActivity: {
    id: string;
    action: string;
    details: string;
    timestamp: string;
    unit?: string;
  }[];
}

export interface Tenant {
  id: string;
  company: string;
  unit: string;
  property: string;
  contact: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  leaseExpiry: string;
  openTickets: number;
  previousTickets: number;
  activeTicketsList?: string[]; // ticket numbers
}

export interface Vendor {
  id: string;
  name: string;
  serviceCategory: string;
  serviceArea: string;
  availability: 'Available' | 'On Call' | 'Busy' | 'Off Duty';
  currentAssignedTickets: number;
  averageResponseTime: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  rating: number;
  insuranceVerified: boolean;
}

export interface AIActivityItem {
  id: string;
  action: string;
  details: string;
  ticketNumber?: string;
  timestamp: string;
  category: 'Classification' | 'Priority' | 'Vendor Matching' | 'Response Generation' | 'Human Approval' | 'Safety';
  confidence?: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

// ============================================================================
// AI Intake Layer Types (Specification Matching)
// ============================================================================

export type IntakeCategory = 
  | 'HVAC'
  | 'PLUMBING'
  | 'ELECTRICAL'
  | 'ACCESS_SECURITY'
  | 'CLEANING'
  | 'GENERAL_MAINTENANCE'
  | 'OTHER';

export type IntakePriority = 
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'EMERGENCY';

export interface AIIntakeOutput {
  property: string;
  unit: string;
  category: IntakeCategory;
  priority: IntakePriority;
  description: string;
  ai_summary: string;
  vendor_required: boolean;
  human_escalation_required: boolean;
}

export interface AIIntakeValidationResult {
  valid: boolean;
  errors: string[];
}

export interface AIIntakeResult {
  success: boolean;
  data: AIIntakeOutput | null;
  clarification_needed: boolean;
  clarification_prompt?: string;
  missing_fields: string[];
  validation_errors: string[];
  safety_escalation: boolean;
  safety_guidance?: string;
  grounded_entities?: {
    property_matched?: string;
    unit_matched?: string;
    tenant_matched?: string;
    vendor_matched?: string;
  };
  audit_trail?: {
    raw_input: string;
    normalized_category: string;
    normalized_priority: string;
    rules_applied: string[];
    validated_at: string;
  };
}

