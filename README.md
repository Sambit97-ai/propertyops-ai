# PropertyOps AI — Enterprise Commercial Property Operations Platform

**PropertyOps AI** is an AI-powered operations assistant and facility management platform built for **commercial property management companies, facility management firms, and owners/operators** managing multi-tenant office buildings, business parks, and corporate complexes (typically 5–50 employees).

---

## ⚡ Supabase Database Connection & Architecture

PropertyOps AI is fully integrated with **Supabase PostgreSQL** with database-backed tables, foreign key constraints, high-concurrency indexes, and Row Level Security (RLS) policies.

### Database Schema Specification:
```
properties
├── id (UUID PRIMARY KEY)
├── name (TEXT)
├── address (TEXT)
├── property_manager (TEXT)
├── total_units (INTEGER)
└── created_at (TIMESTAMPTZ)

units
├── id (UUID PRIMARY KEY)
├── property_id (UUID REFERENCES properties(id))
├── unit_number (TEXT)
├── tenant_id (UUID REFERENCES tenants(id))
└── created_at (TIMESTAMPTZ)

tenants
├── id (UUID PRIMARY KEY)
├── company_name (TEXT)
├── contact_name (TEXT)
├── email (TEXT)
├── phone (TEXT)
├── property_id (UUID REFERENCES properties(id))
└── unit_id (UUID REFERENCES units(id))

vendors
├── id (UUID PRIMARY KEY)
├── company_name (TEXT)
├── category (TEXT)
├── service_area (TEXT)
├── phone (TEXT)
├── email (TEXT)
├── availability (TEXT)
└── active (BOOLEAN)

tickets
├── id (UUID PRIMARY KEY)
├── property_id (UUID REFERENCES properties(id))
├── unit_id (UUID REFERENCES units(id))
├── tenant_id (UUID REFERENCES tenants(id))
├── vendor_id (UUID REFERENCES vendors(id))
├── category (TEXT)
├── priority (TEXT)
├── status (TEXT)
├── title (TEXT)
├── description (TEXT)
├── ai_summary (TEXT)
├── created_at (TIMESTAMPTZ)
└── updated_at (TIMESTAMPTZ)

messages
├── id (UUID PRIMARY KEY)
├── ticket_id (UUID REFERENCES tickets(id))
├── sender_type (TEXT)
├── message (TEXT)
└── created_at (TIMESTAMPTZ)

activity_logs
├── id (UUID PRIMARY KEY)
├── ticket_id (UUID REFERENCES tickets(id))
├── actor_type (TEXT)
├── action (TEXT)
├── description (TEXT)
└── created_at (TIMESTAMPTZ)
```

---

## 🎯 Deterministic Seed Dataset

The application includes a deterministic seed dataset containing:
- **1 Commercial Property**: `Orion Business Park` (1000 Orion Way, Austin, TX 78759; Property Manager: Sarah Jenkins; 10 Units)
- **10 Commercial Units**: Units `101`, `102`, `103`, `201`, `204`, `218`, `305`, `310`, `401`, `402`
- **5 Fictional Tenants**:
  1. `Apex Financial Advisors` (Unit 402, Marcus Vance)
  2. `Nexus Software Labs` (Unit 204, Priya Sharma)
  3. `Vanguard Legal Partners` (Unit 218, David Sterling)
  4. `Beacon MedTech` (Unit 305, Dr. Elena Rostova)
  5. `Horizon Global Logistics` (Unit 101, Carlos Mendez)
- **5 Fictional Vendors**:
  1. `CoolAir Services` (HVAC, 45m response)
  2. `SecurityPro Commercial` (Access Control, Available)
  3. `AquaFix Commercial Plumbing` (Plumbing, On Call)
  4. `Otis Elevator Care` (Elevators, Available)
  5. `VoltMaster Electric` (Electrical, Available)
- **10 Maintenance Tickets**:
  1. `#1042`: AC malfunction | Unit 402 | Apex Financial Advisors | CoolAir Services | HIGH | Vendor Contacted
  2. `#1041`: Access card issue | Unit 218 | Vanguard Legal Partners | SecurityPro | MEDIUM | Assigned
  3. `#1040`: Water leakage | Unit 101 | Horizon Global Logistics | AquaFix | HIGH | Resolved
  4. `#1039`: Elevator B vibration | Unit 305 | Beacon MedTech | Otis Elevator Care | MEDIUM | In Progress
  5. `#1038`: Conference room breaker trip | Unit 204 | Nexus Software Labs | VoltMaster Electric | MEDIUM | Assigned
  6. `#1037`: Main entrance sensor delayed | Unit 101 | Horizon Global Logistics | SecurityPro | LOW | Resolved
  7. `#1036`: Restroom faucet continuous run | Unit 402 | Apex Financial Advisors | AquaFix | LOW | Resolved
  8. `#1035`: Server room temperature warning | Unit 204 | Nexus Software Labs | CoolAir Services | HIGH | Resolved
  9. `#1034`: Freight elevator door interlock inspection | Unit 101 | Horizon Global Logistics | Otis Elevator Care | MEDIUM | In Progress
  10. `#1033`: Emergency exit lighting battery check | Unit 305 | Beacon MedTech | VoltMaster Electric | LOW | Resolved
- **Messages**: Inbound tenant request and outbound AI triage confirmation for Ticket #1042.
- **Activity Logs**: 6-step chronological timeline for Ticket #1042 + general operations audit trail.

---

## 🛠️ How to Connect to Live Supabase

### Method 1: Via the Web UI (Fastest)
1. Open the application at `http://localhost:3000`.
2. Navigate to the **Settings** view in the sidebar.
3. In the **Supabase Database Integration** card, input your:
   - **Supabase Project URL** (`https://your-project.supabase.co`)
   - **Supabase Public Anon Key** (`eyJhbGciOi...`)
4. Click **Test Connection** to verify ping.
5. Click **Save Supabase Configuration** to activate live sync!

### Method 2: Via Environment Variables
1. Edit `.env` in the root directory:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```
2. Re-run `npm run build` or the dev server.

### Method 3: One-Click SQL Migration
Copy the contents of `supabase/setup_complete.sql` and paste it directly into the **SQL Editor** in your Supabase dashboard. It will create all tables, foreign keys, indexes, RLS policies, and seed all 10 records with one click!

---

## 🔄 Deterministic Reset
To reset the database back to its exact baseline state at any time:
- Click the **"Reset Seed Data"** button in the **Dashboard** header bar, or
- Click the **"Reset Database to Deterministic Seed Data"** button in the **Settings** tab.
- This will clear mutations and re-insert the exact 1 property, 10 units, 5 tenants, 5 vendors, 10 maintenance tickets, messages, and timeline logs.

---

## 🚀 Running the Project
```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Run production build
npm run build
```
Vite will serve the platform locally at `http://localhost:3000/`.
