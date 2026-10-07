import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Wrench, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  UserCheck, 
  ExternalLink,
  Sparkles,
  Bot,
  Check,
  ChevronRight,
  MapPin,
  Calendar,
  AlertCircle,
  FileText,
  Sliders,
  BellRing
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, TicketStatus } from '../types';
import { formatSubmittedDate } from '../services/db';
import { VendorNotificationEmailModal } from './VendorNotificationEmailModal';

export const TicketDetailPage: React.FC = () => {
  const { 
    selectedTicket, 
    setActiveTab, 
    vendors, 
    assignVendor, 
    changePriority, 
    updateStatus, 
    contactTenant, 
    escalateToManager,
    addTicketNote
  } = useApp();

  // Action Modals State
  const [isAssignVendorOpen, setIsAssignVendorOpen] = useState(false);
  const [selectedVendorToAssign, setSelectedVendorToAssign] = useState(selectedTicket?.assignedVendor || 'CoolAir Services');
  const [isChangePriorityOpen, setIsChangePriorityOpen] = useState(false);
  const [selectedPriorityToSet, setSelectedPriorityToSet] = useState<PriorityLevel>(selectedTicket?.priority || 'HIGH');
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [selectedStatusToSet, setSelectedStatusToSet] = useState<TicketStatus>(selectedTicket?.status || 'OPEN');
  const [isContactTenantOpen, setIsContactTenantOpen] = useState(false);
  const [tenantContactMessage, setTenantContactMessage] = useState('');
  const [isContactVendorOpen, setIsContactVendorOpen] = useState(false);
  const [vendorContactMessage, setVendorContactMessage] = useState('');
  const [newInternalNote, setNewInternalNote] = useState('');
  const [isVendorEmailModalOpen, setIsVendorEmailModalOpen] = useState(false);

  // Human Governance & Accept Flow State
  const [isAiRecommendationApproved, setIsAiRecommendationApproved] = useState(false);
  const [humanApprovalTimestamp, setHumanApprovalTimestamp] = useState<string | null>(null);
  const [approvalAnimationStep, setApprovalAnimationStep] = useState<number>(0);

  if (!selectedTicket) {
    return (
      <div className="p-16 text-center text-[#8E909B]">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-[#C9A96E]">
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="font-medium text-[#F4F4F6] text-sm">No Request Selected</p>
        <p className="text-[#8E909B] text-xs mt-1">Select a maintenance request from the queue to inspect operational context.</p>
        <button
          onClick={() => setActiveTab('tickets')}
          className="mt-5 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-[#F4F4F6] rounded-lg text-xs font-medium border border-white/[0.08] transition cursor-pointer"
        >
          Return to Requests
        </button>
      </div>
    );
  }

  // Find assigned vendor details
  const matchedVendor = vendors.find(v => 
    v.name.toLowerCase() === selectedTicket.assignedVendor.toLowerCase()
  ) || vendors.find(v => v.serviceCategory === 'HVAC') || vendors[0];

  const vendorName = selectedTicket.assignedVendor && selectedTicket.assignedVendor !== 'Unassigned' 
    ? selectedTicket.assignedVendor 
    : 'CoolAir Services';
  const vendorCategory = matchedVendor?.serviceCategory || 'HVAC';
  const vendorServiceArea = matchedVendor?.serviceArea || 'Gurugram';
  const vendorAvailability = matchedVendor?.availability || 'Available';

  // Submissions formatting
  const submittedFormatted = formatSubmittedDate(selectedTicket.createdAt);

  // Handlers for Manager Actions
  const handleAssignVendorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedVendorToAssign) {
      await assignVendor(selectedTicket.id, selectedVendorToAssign);
      setIsAssignVendorOpen(false);
    }
  };

  const handleChangePrioritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await changePriority(selectedTicket.id, selectedPriorityToSet);
    setIsChangePriorityOpen(false);
  };

  const handleUpdateStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStatus(selectedTicket.id, selectedStatusToSet);
    setIsUpdateStatusOpen(false);
  };

  const handleContactTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tenantContactMessage.trim()) {
      await contactTenant(selectedTicket.id, tenantContactMessage.trim());
      setTenantContactMessage('');
      setIsContactTenantOpen(false);
    }
  };

  const handleContactVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vendorContactMessage.trim()) {
      addTicketNote(selectedTicket.id, `Transmitted dispatch message to ${vendorName}: "${vendorContactMessage.trim()}"`);
      setVendorContactMessage('');
      setIsContactVendorOpen(false);
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newInternalNote.trim()) {
      addTicketNote(selectedTicket.id, newInternalNote.trim());
      setNewInternalNote('');
    }
  };

  // Critical Governance Handler: Human Approval for High-Impact Action
  const handleApproveRecommendation = () => {
    setIsAiRecommendationApproved(true);
    const nowTime = '10:05 AM';
    setHumanApprovalTimestamp(nowTime);
    setApprovalAnimationStep(1);
    setTimeout(() => setApprovalAnimationStep(2), 350);
    setTimeout(() => setApprovalAnimationStep(3), 700);

    addTicketNote(
      selectedTicket.id,
      `[HUMAN GOVERNANCE ACCEPTED] Sarah Jenkins confirmed autonomous recommendation: Assigned ${vendorName} with pre-authorized SLA emergency dispatch.`
    );
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F87171] animate-pulse" />
            {priority}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            MEDIUM
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-white/[0.05] text-[#8E909B] border border-white/[0.08]">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            LOW
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    const isResolved = status === 'Resolved' || status === 'RESOLVED' || status === 'CLOSED';
    const isOpen = status === 'OPEN' || status === 'Vendor Contacted';
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wider uppercase ${
        isOpen 
          ? 'bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/25' 
          : isResolved 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25'
            : 'bg-white/[0.05] text-[#F4F4F6] border border-white/[0.08]'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${
          isOpen ? 'bg-[#C9A96E]' : isResolved ? 'bg-emerald-400' : 'bg-cyan-400'
        }`} />
        {status}
      </span>
    );
  };

  // Timeline Actor Classification Helper
  const getActorBadge = (actor: string, title?: string) => {
    const lowerActor = (actor || '').toLowerCase();
    const lowerTitle = (title || '').toLowerCase();

    if (
      lowerActor.includes('ai') || 
      lowerTitle.startsWith('ai ') || 
      lowerTitle.includes('ai determined') || 
      lowerTitle.includes('ai classified') || 
      lowerTitle.includes('matched')
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20">
          <Sparkles className="w-2.5 h-2.5 text-[#C9A96E]" />
          <span>AI action</span>
        </span>
      );
    }

    if (
      lowerActor.includes('system') || 
      lowerTitle.includes('created') || 
      lowerTitle.includes('notification sent') || 
      lowerTitle.includes('confirmation sent') ||
      lowerTitle.includes('synchronized')
    ) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
          <span>Automated system</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
        <User className="w-2.5 h-2.5 text-blue-400" />
        <span>Human action ({actor})</span>
      </span>
    );
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] font-sans">
      
      {/* Top Breadcrumb & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5 text-xs">
          <button
            onClick={() => setActiveTab('tickets')}
            className="flex items-center gap-1.5 text-[#8E909B] hover:text-[#F4F4F6] transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Requests</span>
          </button>
          <span className="text-white/20">/</span>
          <span className="text-[#C9A96E] font-mono font-medium">{selectedTicket.ticketNumber}</span>
          <span className="text-white/20">/</span>
          <span className="text-[#F4F4F6] truncate max-w-xs">{selectedTicket.title}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => setIsUpdateStatusOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8E909B] hover:text-[#F4F4F6] font-medium transition cursor-pointer"
          >
            Change Status
          </button>

          <button
            onClick={() => setIsChangePriorityOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8E909B] hover:text-[#F4F4F6] font-medium transition cursor-pointer"
          >
            Change Priority
          </button>

          <button
            onClick={() => setIsAssignVendorOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8E909B] hover:text-[#F4F4F6] font-medium transition cursor-pointer"
          >
            Assign Vendor
          </button>

          <button
            onClick={() => setIsContactTenantOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#8E909B] hover:text-[#F4F4F6] font-medium transition cursor-pointer"
          >
            Contact Tenant
          </button>

          <button
            type="button"
            onClick={() => {
              const cleanNum = selectedTicket.ticketNumber.replace('#', '');
              if (typeof window !== 'undefined') {
                window.history.pushState(
                  { ticketId: selectedTicket.ticketNumber },
                  '',
                  `/request/${encodeURIComponent(cleanNum)}`
                );
              }
              setActiveTab('tenant-status');
            }}
            className="flex items-center gap-1.5 text-[#C9A96E] hover:text-[#DFCCA3] bg-[#C9A96E]/10 hover:bg-[#C9A96E]/15 px-3 py-1.5 rounded-lg border border-[#C9A96E]/25 transition cursor-pointer"
            title="Preview tenant request status view"
          >
            <span>Tenant View</span>
            <ExternalLink className="w-3 h-3 text-[#C9A96E]" />
          </button>
        </div>
      </div>

      {/* Ticket Overview Header Card */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A96E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold font-mono text-[#C9A96E]">
                {selectedTicket.ticketNumber}
              </span>
              {getPriorityBadge(selectedTicket.priority)}
              {getStatusBadge(selectedTicket.status)}
              <span className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.04] text-[#8E909B] border border-white/[0.06]">
                {selectedTicket.category || 'HVAC'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-medium text-[#F4F4F6] tracking-tight">
              {selectedTicket.title}
            </h1>

            <div className="flex items-center gap-6 text-xs text-[#8E909B] pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/40" />
                <span>SUBMITTED: <strong className="text-[#F4F4F6] font-normal">{submittedFormatted}</strong></span>
              </span>
            </div>
          </div>

          {/* Property Context Strip */}
          <div className="text-left lg:text-right text-xs space-y-1.5 bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl lg:min-w-[280px]">
            <div className="text-[#8E909B]">
              PROPERTY: <strong className="text-[#F4F4F6] font-medium ml-1">{selectedTicket.property}</strong>
            </div>
            <div className="text-[#8E909B]">
              UNIT: <strong className="text-[#F4F4F6] font-mono font-medium ml-1">Office {selectedTicket.unit}</strong>
            </div>
            <div className="text-[#8E909B]">
              TENANT: <strong className="text-[#C9A96E] font-medium ml-1">{selectedTicket.tenant.company}</strong>
            </div>
          </div>
        </div>

        {/* Original Description Display */}
        <div className="mt-6 pt-5 border-t border-white/[0.05]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#8E909B] mb-2">
            ORIGINAL TENANT DESCRIPTION
          </div>
          <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] text-xs sm:text-sm text-[#F4F4F6] leading-relaxed font-sans">
            "{selectedTicket.description || 'The AC is not working and we have clients coming tomorrow.'}"
          </div>
        </div>
      </div>

      {/* Prominent AI UNDERSTANDING Panel */}
      <div className="bg-[#12141C] border border-[#C9A96E]/20 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#C9A96E] to-[#C9A96E]/20" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <span className="text-[#C9A96E] text-base">✦</span>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-[#F4F4F6]">
              AI Understanding
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#DFCCA3] bg-[#C9A96E]/10 px-2.5 py-1 rounded-md border border-[#C9A96E]/25 self-start sm:self-auto">
            Autonomous Triage &bull; Lease Policy Grounded
          </span>
        </div>

        {/* AI Summary Statement */}
        <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.06] text-sm text-[#F4F4F6] leading-relaxed font-normal">
          "{selectedTicket.aiSummary || 'Tenant reports HVAC failure in Office 402. The tenant has client meetings scheduled tomorrow, therefore the request has been classified as HIGH priority.'}"
        </div>

        {/* Recommendation & Direct Action Bar */}
        <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="text-xs text-[#8E909B]">
              Recommended Action: <strong className="text-[#F4F4F6] font-medium">Assign CoolAir Services</strong>
            </div>
            <div className="text-xs text-[#8E909B]">
              Priority Classification: <strong className="text-[#F87171] font-medium font-mono">HIGH</strong> (&lt; 2hr arrival SLA)
            </div>
            <p className="text-[11px] text-[#8E909B] pt-0.5">
              High-impact operational policy preserves human oversight before issuing binding financial commitment.
            </p>
          </div>

          {/* Action Buttons & Post-Accept Checklist Animation */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {isAiRecommendationApproved ? (
              <div className="flex flex-col gap-1.5 py-1 px-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
                <div className={`flex items-center gap-2 text-xs text-emerald-400 font-medium transition-opacity duration-300 ${approvalAnimationStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>Vendor assigned ({vendorName})</span>
                </div>
                <div className={`flex items-center gap-2 text-xs text-emerald-400 font-medium transition-opacity duration-300 ${approvalAnimationStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>Vendor notified</span>
                </div>
                <div className={`flex items-center gap-2 text-xs text-emerald-400 font-medium transition-opacity duration-300 ${approvalAnimationStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>Tenant updated</span>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleApproveRecommendation}
                  className="px-5 py-2.5 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold text-xs transition shadow-lg shadow-[#C9A96E]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAssignVendorOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#F4F4F6] border border-white/[0.08] font-medium text-xs transition cursor-pointer text-center"
                >
                  Review
                </button>
              </>
            )}
          </div>
        </div>

        {/* Operational Context Metadata Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
            <span className="text-[#8E909B] block text-[10px] uppercase tracking-wider">Trade Category</span>
            <span className="font-medium text-[#F4F4F6] mt-0.5 block">{selectedTicket.category || 'HVAC'}</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
            <span className="text-[#8E909B] block text-[10px] uppercase tracking-wider">Urgency Trigger</span>
            <span className="font-medium text-[#F87171] mt-0.5 block">Client Arrival Tomorrow</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
            <span className="text-[#8E909B] block text-[10px] uppercase tracking-wider">Contracted Vendor</span>
            <span className="font-medium text-[#C9A96E] mt-0.5 block">{vendorName}</span>
          </div>
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
            <span className="text-[#8E909B] block text-[10px] uppercase tracking-wider">Governance State</span>
            <span className="font-medium text-emerald-400 mt-0.5 block">Human-in-the-Loop</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Grid: Left (Timeline, Communication, Notes) vs Right (Request Details, Vendor, Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols): Activity Timeline, Conversation, Manager Notes */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* ACTIVITY Section (Execution Timeline) */}
          <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C9A96E]" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F6]">
                  Activity Timeline
                </h2>
              </div>

              {/* Actor Distinction Legend */}
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-[#DFCCA3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E]" />
                  AI action
                </span>
                <span className="text-white/20">&bull;</span>
                <span className="flex items-center gap-1 text-blue-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Human
                </span>
                <span className="text-white/20">&bull;</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  System
                </span>
              </div>
            </div>

            {/* Timeline Stream */}
            <div className="relative border-l border-white/[0.08] ml-3 pl-6 space-y-6">
              {/* Human Approval Event if accepted */}
              {isAiRecommendationApproved && (
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-emerald-400 bg-emerald-400" />
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="font-medium text-xs text-[#F4F4F6]">
                      Recommendation approved by Property Director
                    </span>
                    <span className="text-[11px] text-[#8E909B] font-mono">
                      {humanApprovalTimestamp || '10:05 AM'}
                    </span>
                  </div>
                  <p className="text-[#8E909B] text-xs mt-1 leading-snug">
                    Human sign-off granted by Sarah Jenkins. Financial authorization confirmed for {vendorName}.
                  </p>
                  <div className="mt-1.5">
                    {getActorBadge('Property Director', 'Human approval')}
                  </div>
                </div>
              )}

              {/* Database-backed Activity Logs */}
              {selectedTicket.timeline.map((item, idx) => (
                <div key={item.id || idx} className="relative">
                  <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white/40 bg-[#101217]" />

                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="font-medium text-xs text-[#F4F4F6]">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-[#8E909B] font-mono">
                      {item.timestamp}
                    </span>
                  </div>

                  <p className="text-[#8E909B] text-xs mt-1 leading-snug">
                    {item.description}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    {getActorBadge(item.actor, item.title)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation & Communication Record */}
          <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#C9A96E]" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F6]">
                  Tenant Communication Log
                </h3>
              </div>
              <span className="text-[10px] text-[#8E909B] font-mono">{selectedTicket.conversation.timestamp || '10:02 AM'}</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                <div className="flex items-center justify-between mb-1 text-[11px] text-[#8E909B]">
                  <span className="font-medium text-[#F4F4F6]">Inbound Request ({selectedTicket.tenant.name}):</span>
                  <span className="font-mono text-[10px]">10:02 AM</span>
                </div>
                <p className="text-[#8E909B] italic leading-relaxed text-xs">
                  "{selectedTicket.conversation.tenantMessage || 'The AC is not working and we have clients coming tomorrow.'}"
                </p>
              </div>

              <div className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                <div className="flex items-center justify-between mb-1 text-[11px] text-[#8E909B]">
                  <span className="font-medium text-[#C9A96E]">Automated Dispatch Response:</span>
                  <span className="font-mono text-[10px]">10:03 AM</span>
                </div>
                <p className="text-[#F4F4F6] leading-relaxed text-xs">
                  "{selectedTicket.conversation.aiResponse || 'Maintenance request #1042 has been logged and classified as HIGH priority. CoolAir Services has been matched and dispatch notification transmitted.'}"
                </p>
              </div>
            </div>
          </div>

          {/* Internal Manager Notes */}
          <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F6]">
              Internal Notes ({selectedTicket.notes.length})
            </h3>

            {selectedTicket.notes.length === 0 ? (
              <p className="text-xs text-[#8E909B] italic">No internal manager notes recorded.</p>
            ) : (
              selectedTicket.notes.map((n) => (
                <div key={n.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs">
                  <div className="flex justify-between text-[#8E909B] text-[11px] mb-1">
                    <span className="font-medium text-[#F4F4F6]">{n.author}</span>
                    <span className="font-mono text-[10px]">{n.timestamp}</span>
                  </div>
                  <p className="text-[#8E909B] leading-snug">{n.text}</p>
                </div>
              ))
            )}

            <form onSubmit={handleAddNoteSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                value={newInternalNote}
                onChange={(e) => setNewInternalNote(e.target.value)}
                placeholder="Log an internal operations note..."
                className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
              />
              <button
                type="submit"
                disabled={!newInternalNote.trim()}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-40 text-[#F4F4F6] rounded-xl text-xs font-medium border border-white/[0.08] transition cursor-pointer"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>

        {/* Right Column (5 cols): REQUEST DETAILS, VENDOR, and ACTIONS */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* REQUEST DETAILS Section */}
          <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F6]">
                Request Details
              </h2>
              <span className="text-[10px] text-[#8E909B] font-mono">Work Order Context</span>
            </div>

            <div className="divide-y divide-white/[0.05] text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Category:</span>
                <span className="font-medium text-[#F4F4F6]">{selectedTicket.category || 'HVAC'}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Priority:</span>
                <div>{getPriorityBadge(selectedTicket.priority)}</div>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Property:</span>
                <span className="font-medium text-[#F4F4F6]">{selectedTicket.property}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Unit:</span>
                <span className="font-medium text-[#F4F4F6] font-mono">{selectedTicket.unit}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Tenant:</span>
                <span className="font-medium text-[#C9A96E]">{selectedTicket.tenant.company}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Contact Person:</span>
                <span className="text-[#F4F4F6]">{selectedTicket.tenant.name}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Phone:</span>
                <span className="font-mono text-[#F4F4F6]">{selectedTicket.tenant.phone}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#8E909B]">Email:</span>
                <span className="font-mono text-[#F4F4F6] truncate max-w-[180px]">{selectedTicket.tenant.email}</span>
              </div>
            </div>
          </div>

          {/* VENDOR Section */}
          <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-[#C9A96E]" />
                <h2 className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F6]">
                  Assigned Vendor
                </h2>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/25 font-medium">
                Contract Partner
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#8E909B]">Vendor:</span>
                <span className="font-semibold text-[#F4F4F6] text-sm">{vendorName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E909B]">Category:</span>
                <span className="text-[#F4F4F6]">{vendorCategory}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E909B]">Service Area:</span>
                <span className="text-[#F4F4F6]">{vendorServiceArea}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8E909B]">Availability:</span>
                <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {vendorAvailability}
                </span>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium text-xs">Vendor notification sent</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsVendorEmailModalOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                  title="View automated dispatch email"
                >
                  <Mail className="w-3 h-3" />
                  <span>View Email</span>
                </button>
              </div>
            </div>

            {/* Vendor Action Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 border-t border-white/[0.05]">
              <button
                type="button"
                onClick={() => setIsAssignVendorOpen(true)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#F4F4F6] font-medium text-xs transition cursor-pointer text-center"
              >
                Change Vendor
              </button>

              <button
                type="button"
                onClick={() => setIsContactVendorOpen(true)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#C9A96E]/15 hover:bg-[#C9A96E]/25 text-[#DFCCA3] border border-[#C9A96E]/30 font-medium text-xs transition cursor-pointer text-center"
              >
                Contact Vendor
              </button>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F6]">
                Manager Actions
              </h2>
              <span className="text-[10px] text-[#8E909B]">Manual Controls</span>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => setIsUpdateStatusOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <div className="font-medium text-[#F4F4F6]">Change Status</div>
                  <div className="text-[11px] text-[#8E909B]">Currently: {selectedTicket.status}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-white/40" />
              </button>

              <button
                onClick={() => setIsChangePriorityOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <div className="font-medium text-[#F4F4F6]">Change Priority</div>
                  <div className="text-[11px] text-[#8E909B]">Currently: {selectedTicket.priority}</div>
                </div>
                <AlertTriangle className="w-4 h-4 text-white/40" />
              </button>

              <button
                onClick={() => setIsAssignVendorOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <div className="font-medium text-[#F4F4F6]">Assign Vendor</div>
                  <div className="text-[11px] text-[#8E909B]">Currently: {vendorName}</div>
                </div>
                <Wrench className="w-4 h-4 text-white/40" />
              </button>

              <button
                onClick={() => setIsContactTenantOpen(true)}
                className="w-full text-left p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <div className="font-medium text-[#F4F4F6]">Contact Tenant</div>
                  <div className="text-[11px] text-[#8E909B]">Send update to {selectedTicket.tenant.name}</div>
                </div>
                <Send className="w-4 h-4 text-white/40" />
              </button>

              <button
                onClick={() => {
                  if (confirm('Escalate this ticket to the Senior Property Operations Director with CRITICAL priority?')) {
                    escalateToManager(selectedTicket.id, 'High-impact commercial HVAC failure in suite 402 with client meeting.');
                  }
                }}
                className="w-full text-left p-3 rounded-xl border border-[#F87171]/20 bg-[#F87171]/10 hover:bg-[#F87171]/15 flex items-center justify-between transition cursor-pointer"
              >
                <div>
                  <div className="font-medium text-[#F87171]">Escalate to Director</div>
                  <div className="text-[11px] text-[#F87171]/80">Immediate push alert to Sarah Jenkins</div>
                </div>
                <UserCheck className="w-4 h-4 text-[#F87171]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION MODALS (Dark Luxury Theme) --- */}

      {/* Modal 1: Assign Vendor */}
      {isAssignVendorOpen && (
        <div className="fixed inset-0 z-50 bg-[#090A0D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141C] rounded-2xl border border-white/[0.1] shadow-2xl max-w-md w-full p-6 space-y-5 text-[#F4F4F6]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-semibold text-sm">Assign Vendor &bull; {selectedTicket.ticketNumber}</h3>
              <button onClick={() => setIsAssignVendorOpen(false)} className="text-[#8E909B] hover:text-[#F4F4F6] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAssignVendorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8E909B] block mb-2 font-medium">Select Approved Contractor:</label>
                <select
                  value={selectedVendorToAssign}
                  onChange={(e) => setSelectedVendorToAssign(e.target.value)}
                  className="w-full bg-[#101217] border border-white/[0.1] rounded-xl p-3 text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.name} className="bg-[#101217] text-[#F4F4F6]">
                      {v.name} ({v.serviceCategory}) &bull; {v.serviceArea} &bull; {v.availability}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssignVendorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#8E909B] hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold cursor-pointer"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Change Priority */}
      {isChangePriorityOpen && (
        <div className="fixed inset-0 z-50 bg-[#090A0D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141C] rounded-2xl border border-white/[0.1] shadow-2xl max-w-sm w-full p-6 space-y-5 text-[#F4F4F6]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-semibold text-sm">Change Priority Level</h3>
              <button onClick={() => setIsChangePriorityOpen(false)} className="text-[#8E909B] hover:text-[#F4F4F6] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleChangePrioritySubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8E909B] block mb-2 font-medium">Select Urgency SLA:</label>
                <select
                  value={selectedPriorityToSet}
                  onChange={(e) => setSelectedPriorityToSet(e.target.value as PriorityLevel)}
                  className="w-full bg-[#101217] border border-white/[0.1] rounded-xl p-3 text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                >
                  <option value="CRITICAL" className="bg-[#101217]">CRITICAL (&lt; 1h emergency response)</option>
                  <option value="HIGH" className="bg-[#101217]">HIGH (&lt; 2h rapid response)</option>
                  <option value="MEDIUM" className="bg-[#101217]">MEDIUM (Standard 12h resolution)</option>
                  <option value="LOW" className="bg-[#101217]">LOW (Scheduled routine)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePriorityOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#8E909B] hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold cursor-pointer"
                >
                  Save Priority
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Update Status */}
      {isUpdateStatusOpen && (
        <div className="fixed inset-0 z-50 bg-[#090A0D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141C] rounded-2xl border border-white/[0.1] shadow-2xl max-w-sm w-full p-6 space-y-5 text-[#F4F4F6]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="font-semibold text-sm">Change Request Status</h3>
              <button onClick={() => setIsUpdateStatusOpen(false)} className="text-[#8E909B] hover:text-[#F4F4F6] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8E909B] block mb-2 font-medium">Select Lifecycle Stage:</label>
                <select
                  value={selectedStatusToSet}
                  onChange={(e) => setSelectedStatusToSet(e.target.value as TicketStatus)}
                  className="w-full bg-[#101217] border border-white/[0.1] rounded-xl p-3 text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                >
                  <option value="OPEN" className="bg-[#101217]">OPEN</option>
                  <option value="IN REVIEW" className="bg-[#101217]">IN REVIEW</option>
                  <option value="VENDOR ASSIGNED" className="bg-[#101217]">VENDOR ASSIGNED</option>
                  <option value="Vendor Contacted" className="bg-[#101217]">Vendor Contacted</option>
                  <option value="Assigned" className="bg-[#101217]">Assigned</option>
                  <option value="In Progress" className="bg-[#101217]">In Progress</option>
                  <option value="Resolved" className="bg-[#101217]">Resolved</option>
                  <option value="CLOSED" className="bg-[#101217]">CLOSED</option>
                  <option value="Awaiting Vendor" className="bg-[#101217]">Awaiting Vendor</option>
                  <option value="Escalated" className="bg-[#101217]">Escalated</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateStatusOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#8E909B] hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold cursor-pointer"
                >
                  Update Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Contact Tenant */}
      {isContactTenantOpen && (
        <div className="fixed inset-0 z-50 bg-[#090A0D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141C] rounded-2xl border border-white/[0.1] shadow-2xl max-w-md w-full p-6 space-y-5 text-[#F4F4F6]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-semibold text-sm">Send Update to Tenant</h3>
                <p className="text-[11px] text-[#8E909B] mt-0.5">{selectedTicket.tenant.name} &bull; {selectedTicket.tenant.company}</p>
              </div>
              <button onClick={() => setIsContactTenantOpen(false)} className="text-[#8E909B] hover:text-[#F4F4F6] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleContactTenantSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8E909B] block mb-2 font-medium">Message Body:</label>
                <textarea
                  rows={4}
                  value={tenantContactMessage}
                  onChange={(e) => setTenantContactMessage(e.target.value)}
                  placeholder={`Hi ${selectedTicket.tenant.name}, technician Dave from ${vendorName} is scheduled to arrive at ${selectedTicket.property} Suite ${selectedTicket.unit}...`}
                  className="w-full bg-[#101217] border border-white/[0.1] rounded-xl p-3 text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsContactTenantOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#8E909B] hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!tenantContactMessage.trim()}
                  className="px-5 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] disabled:opacity-40 text-[#090A0D] font-semibold cursor-pointer"
                >
                  Send Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 5: Contact Vendor */}
      {isContactVendorOpen && (
        <div className="fixed inset-0 z-50 bg-[#090A0D]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12141C] rounded-2xl border border-white/[0.1] shadow-2xl max-w-md w-full p-6 space-y-5 text-[#F4F4F6]">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h3 className="font-semibold text-sm">Contact Vendor &bull; {vendorName}</h3>
                <p className="text-[11px] text-[#8E909B] mt-0.5">{vendorServiceArea} &bull; {matchedVendor?.contact.phone || '(512) 555-8821'}</p>
              </div>
              <button onClick={() => setIsContactVendorOpen(false)} className="text-[#8E909B] hover:text-[#F4F4F6] cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleContactVendorSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8E909B] block mb-2 font-medium">Work Order Dispatch Note:</label>
                <textarea
                  rows={4}
                  value={vendorContactMessage}
                  onChange={(e) => setVendorContactMessage(e.target.value)}
                  placeholder={`Attention Dispatch: Suite ${selectedTicket.unit} climate failure at ${selectedTicket.property}. Tenant has client meeting scheduled tomorrow. Expedited arrival requested.`}
                  className="w-full bg-[#101217] border border-white/[0.1] rounded-xl p-3 text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsContactVendorOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#8E909B] hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!vendorContactMessage.trim()}
                  className="px-5 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] disabled:opacity-40 text-[#090A0D] font-semibold cursor-pointer"
                >
                  Transmit Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 6: Automated Vendor Notification Email Preview */}
      <VendorNotificationEmailModal
        isOpen={isVendorEmailModalOpen}
        onClose={() => setIsVendorEmailModalOpen(false)}
        params={{
          vendorName: vendorName,
          vendorEmail: matchedVendor?.contact?.email || 'dispatch@coolairservices.com',
          ticketNumber: selectedTicket.ticketNumber,
          property: selectedTicket.property,
          unit: selectedTicket.unit,
          issue: selectedTicket.title || 'HVAC / AC malfunction',
          priority: selectedTicket.priority,
          description: selectedTicket.description || 'The AC is not working and the tenant has clients arriving tomorrow.',
          serviceCategory: vendorCategory,
        }}
        onResend={() => {
          addTicketNote(
            selectedTicket.id,
            `[AUTOMATED DISPATCH] Re-sent automated vendor notification email to ${vendorName} (${matchedVendor?.contact?.email || 'dispatch@coolairservices.com'})`
          );
        }}
      />
    </div>
  );
};
