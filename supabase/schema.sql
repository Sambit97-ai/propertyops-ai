-- ============================================================================
-- PropertyOps AI - Supabase Database Schema
-- Commercial Property Operations Assistant
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order if recreating
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS tickets CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS properties CASCADE;

-- ============================================================================
-- 1. PROPERTIES
-- Commercial office parks, facilities, and commercial buildings
-- ============================================================================
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    property_manager TEXT NOT NULL,
    total_units INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. TENANTS (Created before units foreign key constraint)
-- Commercial corporate occupants with lease contacts
-- ============================================================================
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_id UUID, -- Foreign key to units added below
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 3. UNITS
-- Individual commercial suites, offices, and floorplates
-- ============================================================================
CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_number TEXT NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add foreign key constraint back to tenants.unit_id
ALTER TABLE tenants 
    ADD CONSTRAINT fk_tenants_unit 
    FOREIGN KEY (unit_id) 
    REFERENCES units(id) 
    ON DELETE SET NULL;

-- ============================================================================
-- 4. VENDORS
-- Approved commercial contractors and trade service providers
-- ============================================================================
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'HVAC', 'Access Control', 'Plumbing', 'Elevators', 'Electrical', etc.
    service_area TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    availability TEXT NOT NULL DEFAULT 'Available', -- 'Available', 'On Call', 'Busy', 'Off Duty'
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. TICKETS
-- Operational maintenance work orders
-- ============================================================================
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    category TEXT NOT NULL, -- 'HVAC', 'Access Control', 'Plumbing', 'Elevators', 'Electrical', etc.
    priority TEXT NOT NULL, -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    status TEXT NOT NULL,   -- 'Vendor Contacted', 'Assigned', 'In Progress', 'Resolved', 'Awaiting Vendor', 'Escalated'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    ai_summary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 6. MESSAGES
-- Multi-turn dialogue between tenants and AI / property managers
-- ============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    sender_type TEXT NOT NULL, -- 'tenant', 'ai', 'manager'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. ACTIVITY_LOGS
-- Immutable chronological audit trail & ticket timeline
-- ============================================================================
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    actor_type TEXT NOT NULL, -- 'PropertyOps AI', 'Tenant', 'Property Manager', 'Vendor', 'System'
    action TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES FOR HIGH-CONCURRENCY QUERYING & JOINS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_units_property_id ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_tenant_id ON units(tenant_id);

CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_unit_id ON tenants(unit_id);

CREATE INDEX IF NOT EXISTS idx_tickets_property_id ON tickets(property_id);
CREATE INDEX IF NOT EXISTS idx_tickets_unit_id ON tickets(unit_id);
CREATE INDEX IF NOT EXISTS idx_tickets_tenant_id ON tickets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tickets_vendor_id ON tickets(vendor_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_messages_ticket_id ON messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at ASC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_ticket_id ON activity_logs(ticket_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configured for commercial operations demo
-- ============================================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo operations
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Public write properties" ON properties FOR ALL USING (true);

CREATE POLICY "Public read units" ON units FOR SELECT USING (true);
CREATE POLICY "Public write units" ON units FOR ALL USING (true);

CREATE POLICY "Public read tenants" ON tenants FOR SELECT USING (true);
CREATE POLICY "Public write tenants" ON tenants FOR ALL USING (true);

CREATE POLICY "Public read vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Public write vendors" ON vendors FOR ALL USING (true);

CREATE POLICY "Public read tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Public write tickets" ON tickets FOR ALL USING (true);

CREATE POLICY "Public read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public write messages" ON messages FOR ALL USING (true);

CREATE POLICY "Public read activity_logs" ON activity_logs FOR SELECT USING (true);
CREATE POLICY "Public write activity_logs" ON activity_logs FOR ALL USING (true);

-- Enable Realtime publication for reactive dashboard updates
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
  END IF;
EXCEPTION
  WHEN others THEN NULL;
END $$;
