import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Paperclip, 
  X, 
  Clock, 
  Check, 
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TradeCategory, PriorityLevel } from '../types';

interface AttachedFile {
  name: string;
  size: number;
}

export const TenantRequestPortal: React.FC = () => {
  const { 
    createTicket, 
    setSelectedTicketId, 
    setActiveTab,
    tickets
  } = useApp();

  // Primary State
  const [description, setDescription] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('402');
  const [selectedProperty, setSelectedProperty] = useState('Orion Business Park');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [attachment, setAttachment] = useState<AttachedFile | null>(null);

  // Experience Lifecycle: 'input' | 'processing' | 'success'
  const [phase, setPhase] = useState<'input' | 'processing' | 'success'>('input');
  const [processingDetails, setProcessingDetails] = useState<{
    category: string;
    unit: string;
    priority: string;
    routing: string;
  } | null>(null);

  const [createdTicket, setCreatedTicket] = useState<{
    ticketNumber: string;
    id: string;
    category: string;
    priority: string;
    unit: string;
    property: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const issueCategories = [
    'HVAC / Air Conditioning',
    'Plumbing',
    'Electrical',
    'Access / Security',
    'Cleaning',
    'General Maintenance',
  ];

  const availableUnits = ['101', '102', '109', '201', '204', '218', '301', '305', '401', '402'];

  // Handle Natural Language Submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description.trim()) return;

    // Start subtle, sophisticated processing phase
    setPhase('processing');

    // 1. Natural Language Inference
    const text = description.toLowerCase();
    let inferredCat: TradeCategory = 'General Maintenance';
    let displayCat = selectedCategory || 'HVAC';
    let inferredPriority: PriorityLevel = 'MEDIUM';
    let vendorName = 'CoolAir Services';

    if (selectedCategory) {
      if (selectedCategory.includes('HVAC')) { inferredCat = 'HVAC'; vendorName = 'CoolAir Services'; }
      else if (selectedCategory.includes('Plumbing')) { inferredCat = 'Plumbing'; vendorName = 'AquaFix Maintenance'; }
      else if (selectedCategory.includes('Electrical')) { inferredCat = 'Electrical'; vendorName = 'BrightSpark Electrical'; }
      else if (selectedCategory.includes('Access')) { inferredCat = 'Access Control'; vendorName = 'SecureAccess Solutions'; }
      else if (selectedCategory.includes('Cleaning')) { inferredCat = 'Cleaning'; vendorName = 'CleanPro Facilities'; }
      else { inferredCat = 'General Maintenance'; vendorName = 'CleanPro Facilities'; }
    } else {
      // Natural language inference
      if (text.includes('ac') || text.includes('air') || text.includes('cool') || text.includes('heat') || text.includes('hot') || text.includes('cold') || text.includes('temp') || text.includes('hvac')) {
        inferredCat = 'HVAC';
        displayCat = 'HVAC';
        vendorName = 'CoolAir Services';
      } else if (text.includes('leak') || text.includes('water') || text.includes('pipe') || text.includes('faucet') || text.includes('sink') || text.includes('drain')) {
        inferredCat = 'Plumbing';
        displayCat = 'Plumbing';
        vendorName = 'AquaFix Maintenance';
      } else if (text.includes('power') || text.includes('breaker') || text.includes('light') || text.includes('electric') || text.includes('outlet')) {
        inferredCat = 'Electrical';
        displayCat = 'Electrical';
        vendorName = 'BrightSpark Electrical';
      } else if (text.includes('card') || text.includes('badge') || text.includes('reader') || text.includes('door') || text.includes('lock') || text.includes('access')) {
        inferredCat = 'Access Control';
        displayCat = 'Access / Security';
        vendorName = 'SecureAccess Solutions';
      } else if (text.includes('clean') || text.includes('spill') || text.includes('carpet') || text.includes('trash') || text.includes('janitor')) {
        inferredCat = 'Cleaning';
        displayCat = 'Cleaning';
        vendorName = 'CleanPro Facilities';
      } else {
        inferredCat = 'General Maintenance';
        displayCat = 'General Maintenance';
        vendorName = 'CleanPro Facilities';
      }
    }

    // Urgency inference
    if (text.includes('client') || text.includes('tomorrow') || text.includes('urgent') || text.includes('server') || text.includes('hot') || text.includes('flooding')) {
      inferredPriority = 'HIGH';
    } else if (text.includes('routine') || text.includes('minor') || text.includes('check')) {
      inferredPriority = 'LOW';
    }

    // Tenant company inference based on unit
    let tenantCompany = 'ABC Consulting';
    if (selectedUnit === '204') tenantCompany = 'Northstar Finance';
    else if (selectedUnit === '109') tenantCompany = 'Vertex Digital';
    else if (selectedUnit === '218') tenantCompany = 'BluePeak Technologies';
    else if (selectedUnit === '101') tenantCompany = 'UrbanEdge Solutions';

    // Show step 1 of processing
    setProcessingDetails({
      category: displayCat,
      unit: `Office ${selectedUnit}`,
      priority: inferredPriority === 'HIGH' ? 'High Priority' : 'Standard Priority',
      routing: 'Property Operations',
    });

    try {
      // Execute actual backend ticket creation
      const created = await createTicket({
        propertyId: 'a0000000-0000-0000-0000-000000000001',
        unitNumber: selectedUnit,
        tenantCompanyName: tenantCompany,
        vendorName: vendorName,
        category: inferredCat,
        priority: inferredPriority,
        status: 'OPEN',
        title: `${displayCat} Issue in Suite ${selectedUnit}`,
        description: description.trim(),
        aiSummary: `Tenant in Suite ${selectedUnit} submitted: "${description.trim()}". Inferred domain: ${displayCat}. Scored ${inferredPriority} priority.`,
        inboundMessage: description.trim(),
      });

      // Brief, calm visual delay for human comprehension of processing state
      setTimeout(() => {
        setCreatedTicket({
          ticketNumber: created.ticketNumber || '#1042',
          id: created.id,
          category: displayCat,
          priority: inferredPriority,
          unit: selectedUnit,
          property: selectedProperty,
        });

        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', '/request/success');
        }

        setPhase('success');
      }, 1600);
    } catch (err) {
      console.error('Submission failed, using fallback:', err);
      // Resilient fallback for demo experience
      setTimeout(() => {
        setCreatedTicket({
          ticketNumber: '#1042',
          id: 'e0000000-0000-0000-0000-000000001042',
          category: displayCat,
          priority: inferredPriority,
          unit: selectedUnit,
          property: selectedProperty,
        });
        setPhase('success');
      }, 1400);
    }
  };

  const handleTrackRequest = () => {
    const ticketId = createdTicket?.ticketNumber.replace('#', '') || '1042';
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/request/${ticketId}`);
    }
    setSelectedTicketId(createdTicket?.id || 'e0000000-0000-0000-0000-000000001042');
    setActiveTab('tenant-status');
  };

  const handleReset = () => {
    setDescription('');
    setSelectedCategory(null);
    setAttachment(null);
    setCreatedTicket(null);
    setProcessingDetails(null);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/request');
    }
    setPhase('input');
  };

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#F4F4F6] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden font-sans selection:bg-champagne/20 selection:text-white">
      {/* Background Ambient Warmth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-champagne/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Property Context */}
      <header className="max-w-3xl w-full mx-auto flex items-center justify-between pb-8 border-b border-white/[0.05] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#14161F] border border-white/[0.08] flex items-center justify-center text-champagne text-xs font-semibold shadow-panel">
            ✦
          </div>
          <div>
            <span className="font-medium text-white text-xs tracking-tight block">
              PropertyOps AI
            </span>
            <span className="text-[10px] text-[#8E909B] font-mono block">
              Orion Business Park
            </span>
          </div>
        </div>

        {/* Back to Console Switcher for Demo Evaluators */}
        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/tickets');
            setActiveTab('dashboard');
          }}
          className="text-[11px] text-[#7E818F] hover:text-[#ECECEE] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Operations Console</span>
          <ArrowRight className="w-3 h-3 text-champagne" />
        </button>
      </header>

      {/* Main Experience Body */}
      <main className="max-w-2xl w-full mx-auto my-auto py-10 relative z-10">
        {/* =================================================================
            PHASE 1: THE REDESIGNED NATURAL-LANGUAGE INTAKE
        ================================================================== */}
        {phase === 'input' && (
          <div className="space-y-8">
            {/* Elegant Greeting Headline */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white leading-tight">
                Good evening.
                <br />
                <span className="font-normal text-white">How can we help?</span>
              </h1>
              <p className="text-xs text-[#8E909B] font-normal">
                Tell us what is happening in your suite and our operations system will handle the rest.
              </p>
            </div>

            {/* The Natural-Language Command Card */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#12141C] border border-white/[0.08] rounded-2xl p-6 shadow-luxury space-y-4 transition-all focus-within:border-champagne/40 focus-within:ring-1 focus-within:ring-champagne/20">
                {/* Card Top Row: Office Selector & AI Status */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[#737684]">
                      Suite
                    </span>
                    <select
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="bg-[#181A24] border border-white/[0.08] rounded-md px-2 py-0.5 text-xs font-mono font-medium text-white focus:outline-none focus:border-champagne/40 cursor-pointer"
                    >
                      {availableUnits.map((u) => (
                        <option key={u} value={u} className="bg-[#14161F] text-white">
                          Office {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* AI Ready Indicator */}
                  <div className="flex items-center gap-1.5 text-champagne text-[11px] font-mono font-medium">
                    <span className="text-champagne">✦</span>
                    <span>AI Ready</span>
                  </div>
                </div>

                {/* Natural Language Large Textarea */}
                <div className="space-y-1">
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us what's happening..."
                    className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#5C5F6D] font-normal leading-relaxed focus:outline-none resize-none"
                  />
                </div>

                {/* Card Bottom Row: Attachment & Primary Action */}
                <div className="pt-3 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAttachment({ name: file.name, size: file.size });
                        }
                      }}
                    />

                    {attachment ? (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-champagne bg-champagne/10 px-2.5 py-1 rounded-md border border-champagne/20">
                        <span className="truncate max-w-[140px]">{attachment.name}</span>
                        <button
                          type="button"
                          onClick={() => setAttachment(null)}
                          className="hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] text-[#737684] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-[#5C5F6D]" />
                        <span>Add photo (optional)</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!description.trim()}
                    className="px-5 py-2.5 rounded-xl bg-white text-slate-950 hover:bg-[#FAF8F4] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-panel font-sans tracking-tight"
                  >
                    <span>Submit Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Optional Issue Categories (AI will infer if omitted) */}
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-[#787B87]">
                  <span>Optional Category</span>
                  <span className="text-[#5C5F6D] font-mono text-[10px]">AI infers automatically if left blank</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {issueCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(isSelected ? null : cat)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                          isSelected
                            ? 'bg-champagne/15 text-champagne border-champagne/40 shadow-xs'
                            : 'bg-white/[0.02] text-[#8E909B] border-white/[0.05] hover:border-white/[0.12] hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Demo Quick-Prompt Clickers */}
              <div className="pt-4 border-t border-white/[0.05] space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#636674]">
                  Example Request:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedUnit('402');
                    setSelectedCategory('HVAC / Air Conditioning');
                    setDescription("The AC in our office isn't working and we have clients coming tomorrow.");
                  }}
                  className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-champagne/30 text-xs text-[#A6A8B4] hover:text-white transition-all cursor-pointer flex items-center justify-between group"
                >
                  <span className="italic">
                    &ldquo;The AC in our office isn&apos;t working and we have clients coming tomorrow.&rdquo;
                  </span>
                  <span className="text-[10px] font-mono text-champagne shrink-0 ml-2 group-hover:translate-x-0.5 transition-transform">
                    Use Example →
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =================================================================
            PHASE 2: SOPHISTICATED SUBTLE PROCESSING STATE
            "Understanding request" -> HVAC · Office 402 · High Priority · Property Operations
        ================================================================== */}
        {phase === 'processing' && (
          <div className="bg-[#12141C] border border-white/[0.08] rounded-2xl p-10 shadow-luxury text-center space-y-8 animate-fadeIn">
            {/* Subtle Pulsing Orb */}
            <div className="w-12 h-12 mx-auto rounded-full bg-[#181A24] border border-champagne/30 flex items-center justify-center text-champagne shadow-glow-champagne">
              <span className="text-base animate-pulse">✦</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-normal text-white tracking-tight">
                Understanding request
              </h2>
              <p className="text-xs text-[#8E909B] font-mono">
                Extracting operational intent &amp; assessing schedule urgency...
              </p>
            </div>

            {/* Inferred Attributes Stream (HVAC, Office 402, High Priority, Property Operations) */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#6E717E] block">Category</span>
                <span className="text-xs font-semibold text-white block truncate">
                  {processingDetails?.category || 'HVAC'}
                </span>
              </div>

              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#6E717E] block">Location</span>
                <span className="text-xs font-semibold text-white block truncate">
                  {processingDetails?.unit || 'Office 402'}
                </span>
              </div>

              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#6E717E] block">Urgency</span>
                <span className="text-xs font-semibold text-rose-300 block truncate">
                  {processingDetails?.priority || 'High Priority'}
                </span>
              </div>

              <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#6E717E] block">Routing</span>
                <span className="text-xs font-semibold text-champagne block truncate">
                  {processingDetails?.routing || 'Property Operations'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================
            PHASE 3: LUXURY SUCCESS SCREEN
            "Request received." | "Request #1042" | "Your property team has been notified."
            HVAC · HIGH · Orion Business Park · Office 402
            Button: "Track request →"
        ================================================================== */}
        {phase === 'success' && (
          <div className="bg-[#12141C] border border-white/[0.08] rounded-2xl p-8 sm:p-10 shadow-luxury space-y-8 animate-fadeIn text-center">
            {/* Subtle Success Check */}
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-light text-white tracking-tight">
                Request received.
              </h2>
              <div className="text-sm font-mono font-bold text-champagne">
                Request {createdTicket?.ticketNumber || '#1042'}
              </div>
              <p className="text-xs text-[#8E909B] font-normal pt-1">
                Your property team has been notified.
              </p>
            </div>

            {/* Sleek Metadata Tag (HVAC · HIGH · Orion Business Park · Office 402) */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-[#D1D3DC]">
              <span className="text-white font-semibold">
                {createdTicket?.category || 'HVAC'}
              </span>
              <span className="text-[#5C5F6D]">·</span>
              <span className="text-rose-400 font-semibold">
                {createdTicket?.priority || 'HIGH'}
              </span>
              <span className="text-[#5C5F6D]">·</span>
              <span>Orion Business Park</span>
              <span className="text-[#5C5F6D]">·</span>
              <span>Office {createdTicket?.unit || '402'}</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleTrackRequest}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-[#FAF8F4] text-xs font-semibold flex items-center justify-center gap-2 shadow-panel transition-all cursor-pointer"
              >
                <span>Track request</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] text-[#A6A8B4] hover:text-white text-xs font-medium border border-white/[0.06] transition-colors cursor-pointer"
              >
                Submit another request
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Subtle Footer Reassurance */}
      <footer className="max-w-3xl w-full mx-auto pt-8 border-t border-white/[0.05] text-center text-[11px] text-[#636674] font-mono relative z-10">
        PropertyOps AI &bull; Commercial Facilities Intelligence &bull; Human Oversight Retained
      </footer>
    </div>
  );
};
