import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Play, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Wrench, 
  Sparkles, 
  AlertTriangle, 
  Users2, 
  FileText, 
  Inbox, 
  Zap, 
  Layers, 
  Compass, 
  Sliders, 
  Check, 
  ExternalLink,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { BookDemoModal } from './BookDemoModal';
import { WatchDemoModal } from './WatchDemoModal';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useApp();
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [isWatchDemoOpen, setIsWatchDemoOpen] = useState(false);
  const [activeStepTab, setActiveStepTab] = useState(0);

  // Workflow steps: From tenant request to resolved ticket.
  const steps = [
    {
      num: '01',
      title: 'Tenant reports an issue.',
      shortDesc: 'Clear natural language intake without conversational friction.',
      detail: 'Tenants submit requests through a dedicated portal capturing property, suite number, and description. No chatbot friction or complex portals.',
      badge: 'Tenant Intake',
      preview: {
        unit: 'Office 402',
        company: 'ABC Consulting',
        issue: 'The AC in our office has stopped working and we have clients coming tomorrow.',
        category: 'HVAC / Climate Control',
      },
    },
    {
      num: '02',
      title: 'AI understands and prioritizes the request.',
      shortDesc: 'Natural language trade classification & business urgency triage.',
      detail: 'The AI intake layer classifies the trade category across core facilities domains and evaluates operational urgency based on business impact and client meetings.',
      badge: 'Triage & Assessment',
      preview: {
        category: 'HVAC',
        confidence: '99.2%',
        priority: 'HIGH (2-Hour SLA)',
        rationale: 'Urgent cooling failure affecting scheduled client presentations tomorrow morning.',
      },
    },
    {
      num: '03',
      title: 'A structured maintenance ticket is created.',
      shortDesc: 'Deterministic work order with complete audit trail.',
      detail: 'Generates a validated ticket synchronized immediately with the property manager queue. Ensures zero manual re-entry and strict database relational integrity.',
      badge: 'Work Order Creation',
      preview: {
        ticketNumber: '#1042',
        property: 'Orion Business Park',
        unit: 'Suite 402',
        status: 'OPEN',
      },
    },
    {
      num: '04',
      title: 'The appropriate vendor can be assigned.',
      shortDesc: 'Intelligent trade matching based on SLA and active insurance.',
      detail: 'Matches contracted service partners based on verified trade specialty, geographic service territory, real-time availability, and active certificate of insurance (COI) compliance.',
      badge: 'Vendor Coordination',
      preview: {
        matchedVendor: 'CoolAir Services',
        serviceArea: 'Gurugram, Haryana',
        status: 'Available',
        insuranceVerified: 'Active COI Verified',
      },
    },
    {
      num: '05',
      title: 'Tenant and property manager receive updates.',
      shortDesc: 'Transparent multi-channel notifications and visual progress.',
      detail: 'The assigned contractor receives a structured dispatch work order, the tenant receives a clean mobile tracking link without exposing internal vendor rates, and the property manager monitors progress.',
      badge: 'Status & Completion',
      preview: {
        tenantNotice: 'Status tracker sent to tenant (WO #1042)',
        vendorNotice: 'Electronic dispatch sent to CoolAir Services',
        managerNotice: 'Audit log logged in property console',
      },
    },
  ];

  // 8 Core Features: Built for commercial property teams.
  const features = [
    {
      icon: Inbox,
      title: 'Maintenance intake',
      description: 'Streamlined, professional request forms tailored for commercial office tenants. Collects accurate unit details and issue context without conversational friction.',
    },
    {
      icon: Sparkles,
      title: 'AI request classification',
      description: 'Accurate natural language categorization across HVAC, plumbing, electrical, access control, cleaning, general maintenance, and elevator systems.',
    },
    {
      icon: Zap,
      title: 'Automatic priority assessment',
      description: 'Evaluates tenant-provided operational context to determine LOW, MEDIUM, HIGH, or EMERGENCY priorities with objective SLA targets.',
    },
    {
      icon: FileText,
      title: 'Work-order creation',
      description: 'Instantly generates standardized work orders with validated unit numbers, tenant lease references, and deterministic timestamp tracking.',
    },
    {
      icon: Wrench,
      title: 'Vendor coordination',
      description: 'Automates vendor dispatch with complete job specifications, location instructions, and contractual response SLA expectations.',
    },
    {
      icon: CheckCircle2,
      title: 'Tenant updates',
      description: 'Keeps commercial occupants informed with clean, branded progress timelines while keeping internal operations notes and vendor pricing confidential.',
    },
    {
      icon: AlertTriangle,
      title: 'Manager escalation',
      description: 'Identifies critical safety hazards, structural risks, or high-cost repairs that require mandatory property manager review and explicit sign-off.',
    },
    {
      icon: Clock,
      title: 'Activity tracking',
      description: 'Maintains an immutable chronological audit trail of all tenant submissions, AI classifications, vendor dispatches, and status transitions.',
    },
  ];

  const handleNavigateToTenant = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/request');
    }
    setActiveTab('tenant-portal');
  };

  const handleNavigateToDashboard = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/tickets');
    }
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#F4F4F6] font-sans antialiased selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
      
      {/* 1. NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-[#090A0D]/90 backdrop-blur-md border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <span className="text-[#C9A96E] text-base">✦</span>
            <div>
              <span className="font-medium text-[#F4F4F6] text-sm tracking-tight block">
                PropertyOps AI
              </span>
              <span className="text-[10px] text-[#8E909B] font-mono hidden sm:block">
                Commercial Operations Assistant
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs text-[#8E909B]">
            <a href="#how-it-works" className="hover:text-[#F4F4F6] transition-colors">
              How It Works
            </a>
            <a href="#features" className="hover:text-[#F4F4F6] transition-colors">
              Features
            </a>
            <a href="#control" className="hover:text-[#F4F4F6] transition-colors">
              Control &amp; Oversight
            </a>
            <button 
              onClick={handleNavigateToTenant}
              className="hover:text-[#C9A96E] transition-colors cursor-pointer"
            >
              Tenant Form
            </button>
            <button 
              onClick={handleNavigateToDashboard}
              className="hover:text-[#C9A96E] transition-colors cursor-pointer"
            >
              Operations App
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsWatchDemoOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-xs font-medium text-[#F4F4F6] transition cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#C9A96E] fill-[#C9A96E]" />
              <span>Watch Demo</span>
            </button>

            <button
              onClick={() => setIsBookDemoOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] text-xs font-semibold transition cursor-pointer shadow-lg shadow-[#C9A96E]/20"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 overflow-hidden border-b border-white/[0.06]">
        {/* Subtle Luxury Radial Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#C9A96E]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs text-[#8E909B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
              <span className="text-[#F4F4F6] font-medium">Commercial Property Operations AI</span>
              <span className="text-white/20">•</span>
              <span className="font-mono text-[#8E909B]">Orion Business Park Model</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-normal text-[#F4F4F6] tracking-tight leading-[1.15]">
              Your property team shouldn't spend hours managing repetitive tenant requests.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#8E909B] max-w-3xl mx-auto leading-relaxed font-normal">
              PropertyOps AI receives maintenance requests, understands the issue, creates work orders, coordinates vendors and keeps tenants updated.
            </p>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={() => setIsWatchDemoOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#F4F4F6] text-xs sm:text-sm font-medium border border-white/[0.08] transition cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#C9A96E]/15 text-[#C9A96E] flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-[#C9A96E]" />
                </div>
                <span>Watch 90-Second Demo</span>
              </button>

              <button
                onClick={() => setIsBookDemoOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] text-xs sm:text-sm font-semibold transition cursor-pointer shadow-lg shadow-[#C9A96E]/20 group"
              >
                <Calendar className="w-4 h-4" />
                <span>Book a Demo</span>
                <ArrowRight className="w-4 h-4 text-[#090A0D]/70 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick Links to live views */}
            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-[#8E909B]">
              <button 
                onClick={handleNavigateToTenant} 
                className="hover:text-[#C9A96E] transition-colors underline underline-offset-4 cursor-pointer"
              >
                Experience Tenant Request Form (/request)
              </button>
              <span>•</span>
              <button 
                onClick={handleNavigateToDashboard} 
                className="hover:text-[#C9A96E] transition-colors underline underline-offset-4 cursor-pointer"
              >
                Open Operations Console
              </button>
            </div>
          </div>

          {/* Hero UI Preview Showcase */}
          <div className="mt-16 max-w-5xl mx-auto">
            <div className="bg-[#101217] rounded-2xl border border-white/[0.08] shadow-2xl overflow-hidden">
              {/* Window Top Bar */}
              <div className="px-5 py-3.5 bg-[#14161F] text-[#8E909B] flex items-center justify-between text-xs border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 font-mono text-[11px] text-white/40">
                    propertyops.ai / operations-dispatch / ticket-1042
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-[#DFCCA3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
                  <span>Deterministic Autonomous Triage</span>
                </div>
              </div>

              {/* Mockup Canvas */}
              <div className="p-6 sm:p-8 bg-[#090A0D] grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Inbound Request */}
                <div className="bg-[#101217] rounded-xl p-5 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#8E909B] border-b border-white/[0.06] pb-2">
                    <span className="font-medium text-[#F4F4F6]">01. Inbound Intake</span>
                    <span className="font-mono text-white/30">10:02 AM</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E909B] block">
                      Tenant &amp; Office
                    </span>
                    <p className="text-xs font-medium text-[#F4F4F6] mt-0.5">
                      ABC Consulting • Suite 402
                    </p>
                    <p className="text-[11px] text-[#8E909B]">
                      Orion Business Park, Gurugram
                    </p>
                  </div>

                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.05] text-xs text-[#8E909B] leading-relaxed italic">
                    "The AC in our office has stopped working and we have clients coming tomorrow."
                  </div>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Unit 402 lease records verified</span>
                  </div>
                </div>

                {/* 2. AI Understanding & Reasoning */}
                <div className="bg-[#12141C] rounded-xl p-5 border border-[#C9A96E]/20 space-y-3 relative">
                  <div className="flex items-center justify-between text-[11px] border-b border-white/[0.06] pb-2">
                    <span className="font-medium text-[#C9A96E] flex items-center gap-1">
                      <span>✦</span>
                      <span>02. AI Triage Engine</span>
                    </span>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20">
                      Grounded
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8E909B]">Trade Category:</span>
                      <span className="font-mono text-[#F4F4F6]">HVAC</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8E909B]">Urgency SLA:</span>
                      <span className="font-mono text-[#F87171] font-medium">HIGH (2hr SLA)</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] rounded-lg border border-white/[0.05] text-[11px] text-[#8E909B] leading-relaxed">
                    "Tenant reported HVAC failure with upcoming client meetings tomorrow, elevating priority."
                  </div>

                  <div className="pt-1 text-[11px] text-[#DFCCA3]">
                    Recommended Action: Assign CoolAir Services
                  </div>
                </div>

                {/* 3. Structured Ticket & Dispatch */}
                <div className="bg-[#101217] rounded-xl p-5 border border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#8E909B] border-b border-white/[0.06] pb-2">
                    <span className="font-medium text-[#F4F4F6]">03. Automated Dispatch</span>
                    <span className="font-mono text-white/30">10:03 AM</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#8E909B] block">
                      Contracted Vendor
                    </span>
                    <p className="text-xs font-medium text-[#F4F4F6] mt-0.5">
                      CoolAir Services
                    </p>
                    <p className="text-[11px] text-[#8E909B]">
                      Gurugram Territory &bull; Available
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5" />
                      <span>Work Order #1042 Issued</span>
                    </div>
                    <p className="text-[11px] text-emerald-400/80">
                      Automated notification transmitted
                    </p>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-[#8E909B]">
                    <span>Status: <strong className="text-emerald-400 font-mono">OPEN</strong></span>
                    <span className="text-white/30">1-click audit trail</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECTION: FROM TENANT REQUEST TO RESOLVED TICKET */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-white/[0.06] bg-[#090A0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A96E]">
              Operational Lifecycle
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#F4F4F6] tracking-tight">
              From tenant request to resolved ticket.
            </h2>
            <p className="text-sm text-[#8E909B] leading-relaxed">
              Five clear operational milestones handle administrative overhead while keeping commercial property teams informed.
            </p>
          </div>

          {/* 5-Step Visual Progression */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((st, idx) => (
              <div
                key={st.num}
                onClick={() => setActiveStepTab(idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                  activeStepTab === idx
                    ? 'bg-[#12141C] border-[#C9A96E]/40 shadow-2xl relative'
                    : 'bg-[#101217] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                {activeStepTab === idx && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#C9A96E] rounded-t-2xl" />
                )}
                <span className="font-mono text-xs text-[#C9A96E] block mb-2">{st.num}</span>
                <h3 className="font-medium text-sm text-[#F4F4F6] mb-1.5">{st.title}</h3>
                <p className="text-xs text-[#8E909B] leading-relaxed">{st.shortDesc}</p>
              </div>
            ))}
          </div>

          {/* Detailed Active Step Inspector */}
          <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 md:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C9A96E]">
                  Milestone {steps[activeStepTab].num}
                </span>
                <h3 className="text-2xl font-normal text-[#F4F4F6]">
                  {steps[activeStepTab].title}
                </h3>
                <p className="text-sm text-[#8E909B] leading-relaxed">
                  {steps[activeStepTab].detail}
                </p>
              </div>

              <div className="lg:col-span-5 bg-[#090A0D] border border-white/[0.06] rounded-xl p-5 space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center text-[#8E909B] border-b border-white/[0.06] pb-2">
                  <span className="font-medium text-[#F4F4F6]">{steps[activeStepTab].badge}</span>
                  <span className="font-mono text-[10px] text-[#C9A96E]">WO #1042</span>
                </div>
                {Object.entries(steps[activeStepTab].preview).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-start gap-2 text-xs">
                    <span className="text-[#8E909B] capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-[#F4F4F6] text-right font-medium max-w-[200px]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION: BUILT FOR COMMERCIAL PROPERTY TEAMS */}
      <section id="features" className="py-20 sm:py-28 border-b border-white/[0.06] bg-[#090A0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A96E]">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-normal text-[#F4F4F6] tracking-tight">
              Built for commercial property teams.
            </h2>
            <p className="text-sm text-[#8E909B] leading-relaxed">
              Eight purpose-built operations modules specifically designed for multi-tenant commercial office buildings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 space-y-3.5 hover:border-white/[0.12] transition">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[#C9A96E] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-medium text-sm text-[#F4F4F6]">{f.title}</h3>
                  <p className="text-xs text-[#8E909B] leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SECTION: YOUR TEAM STAYS IN CONTROL */}
      <section id="control" className="py-20 sm:py-28 border-b border-white/[0.06] bg-[#090A0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#101217] border border-white/[0.08] rounded-3xl p-8 sm:p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9A96E]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl space-y-5 relative z-10">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#C9A96E]">
                Governance &amp; Oversight
              </span>
              <h2 className="text-2xl sm:text-4xl font-normal text-[#F4F4F6] tracking-tight">
                Your team stays in control.
              </h2>
              <p className="text-base sm:text-lg text-[#8E909B] leading-relaxed font-normal">
                PropertyOps AI automates repetitive administrative work while keeping your property team in control of important decisions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs text-[#8E909B]">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mandatory human sign-off on emergency callouts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Full override authority on vendor assignments</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero silent financial commitments or auto-approvals</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Complete immutable chronological audit log</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION (CTA) */}
      <section className="py-24 sm:py-32 bg-[#090A0D] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-normal text-[#F4F4F6] tracking-tight">
            See PropertyOps AI in Action
          </h2>
          <p className="text-sm sm:text-base text-[#8E909B] max-w-xl mx-auto leading-relaxed">
            Schedule a personalized commercial walkthrough tailored to your property portfolio.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsBookDemoOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] text-sm font-semibold transition cursor-pointer shadow-lg shadow-[#C9A96E]/20"
            >
              Book a 15-Minute Demo
            </button>
            <button
              onClick={handleNavigateToDashboard}
              className="px-6 py-3.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#F4F4F6] text-sm font-medium border border-white/[0.08] transition cursor-pointer"
            >
              Explore Operations Console
            </button>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="py-8 border-t border-white/[0.06] bg-[#090A0D] text-xs text-[#8E909B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-[#C9A96E]">✦</span>
            <span>PropertyOps AI &bull; Commercial Property Operations</span>
          </div>
          <div className="text-white/30 font-mono text-[11px]">
            Orion Business Park &bull; Gurugram, Haryana
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookDemoModal isOpen={isBookDemoOpen} onClose={() => setIsBookDemoOpen(false)} />
      <WatchDemoModal 
        isOpen={isWatchDemoOpen} 
        onClose={() => setIsWatchDemoOpen(false)} 
        onOpenBookDemo={() => {
          setIsWatchDemoOpen(false);
          setIsBookDemoOpen(true);
        }} 
      />
    </div>
  );
};
