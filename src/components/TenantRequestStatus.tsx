import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Building2, 
  Clock, 
  AlertCircle, 
  Loader2, 
  RotateCcw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { dbService } from '../services/db';
import { Ticket } from '../types';

export type TenantDisplayStatus = 
  | 'OPEN'
  | 'IN REVIEW'
  | 'VENDOR ASSIGNED'
  | 'IN PROGRESS'
  | 'RESOLVED'
  | 'CLOSED';

interface TenantRequestStatusProps {
  ticketId?: string;
  onBack?: () => void;
}

export const TenantRequestStatus: React.FC<TenantRequestStatusProps> = ({
  ticketId: propTicketId,
  onBack,
}) => {
  const { tickets, setActiveTab, setSelectedTicketId } = useApp();

  // 1. Resolve Ticket ID from prop, pathname (/request/:id), or query param (?ticketId=...)
  const [resolvedId, setResolvedId] = useState<string>(() => {
    if (propTicketId) return propTicketId.replace('#', '').trim();
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/\/request\/([^/?#]+)/);
      if (match && match[1] && match[1] !== 'success') {
        return match[1].replace('#', '').trim();
      }
      const searchParam = new URLSearchParams(window.location.search).get('ticketId');
      if (searchParam) {
        return searchParam.replace('#', '').trim();
      }
    }
    return '1042';
  });

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [overrideStatus, setOverrideStatus] = useState<TenantDisplayStatus | null>(null);

  // Sync resolved ID if prop or URL updates
  useEffect(() => {
    if (propTicketId) {
      setResolvedId(propTicketId.replace('#', '').trim());
    } else if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/\/request\/([^/?#]+)/);
      if (match && match[1] && match[1] !== 'success') {
        setResolvedId(match[1].replace('#', '').trim());
      }
    }
  }, [propTicketId]);

  // 2. Fetch or Match Ticket from backend
  useEffect(() => {
    let isMounted = true;
    const fetchTicket = async () => {
      setIsLoading(true);
      const cleanTarget = resolvedId.toLowerCase().trim();

      // Check context in-memory tickets first
      const contextMatch = tickets.find((t) => {
        const num = t.ticketNumber.replace('#', '').toLowerCase().trim();
        return num === cleanTarget || t.id.toLowerCase() === cleanTarget;
      });

      if (contextMatch) {
        if (isMounted) {
          setTicket(contextMatch);
          setIsLoading(false);
        }
        return;
      }

      // If not yet loaded in context, query backend dbService
      try {
        const dbMatch = await dbService.getTicket(resolvedId);
        if (isMounted) {
          if (dbMatch) {
            setTicket(dbMatch);
          } else {
            // Fallback to ticket #1042 if not found or demo default
            const fallback = tickets.find((t) => t.ticketNumber.includes('1042')) || tickets[0] || null;
            setTicket(fallback);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching ticket status:', err);
        if (isMounted) {
          const fallback = tickets.find((t) => t.ticketNumber.includes('1042')) || tickets[0] || null;
          setTicket(fallback);
          setIsLoading(false);
        }
      }
    };

    fetchTicket();

    return () => {
      isMounted = false;
    };
  }, [resolvedId, tickets]);

  // 3. Map Internal Status to 6 Tenant-Facing Display Statuses
  const mapStatusToTenant = (rawStatus: string): TenantDisplayStatus => {
    if (overrideStatus) return overrideStatus;

    const s = rawStatus.toUpperCase().trim();
    if (s.includes('RESOLVED')) return 'RESOLVED';
    if (s.includes('CLOSED')) return 'CLOSED';
    if (s.includes('IN PROGRESS')) return 'IN PROGRESS';
    if (s.includes('ASSIGNED') || s.includes('VENDOR CONTACTED') || s.includes('VENDOR ASSIGNED')) {
      return 'VENDOR ASSIGNED';
    }
    if (s.includes('AWAITING') || s.includes('REVIEW') || s.includes('PENDING') || s.includes('ESCALATED')) {
      return 'IN REVIEW';
    }
    return 'OPEN';
  };

  const currentDisplayStatus: TenantDisplayStatus = ticket 
    ? mapStatusToTenant(ticket.status) 
    : (overrideStatus || 'OPEN');

  // Format Status Badge Styles (Dark luxury palette)
  const getStatusBadgeStyle = (status: TenantDisplayStatus) => {
    switch (status) {
      case 'OPEN':
        return 'bg-[#C9A96E]/10 text-[#DFCCA3] border-[#C9A96E]/25';
      case 'IN REVIEW':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'VENDOR ASSIGNED':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25';
      case 'IN PROGRESS':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/25';
      case 'RESOLVED':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
      case 'CLOSED':
        return 'bg-white/[0.04] text-[#8E909B] border-white/[0.08]';
      default:
        return 'bg-white/[0.04] text-[#8E909B] border-white/[0.08]';
    }
  };

  // 4. Format Timestamps from Backend
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Today, 9:15 AM';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'Today, 9:15 AM';
    }
  };

  const createdTime = ticket ? formatTime(ticket.createdAt) : 'Today, 9:15 AM';
  const updatedTime = ticket ? formatTime(ticket.createdAt) : 'Today, 9:18 AM';

  // Format category display label
  const issueDisplay = ticket
    ? ticket.category === 'HVAC'
      ? 'HVAC / Air Conditioning'
      : ticket.category
    : 'HVAC / Air Conditioning';

  const propertyDisplay = ticket?.property || 'Orion Business Park';
  const officeDisplay = ticket?.unit || '402';
  const ticketNumberDisplay = ticket ? ticket.ticketNumber : `#${resolvedId}`;
  const tenantDescription = ticket?.conversation?.tenantMessage || ticket?.description || 
    "The AC in our office isn't working and we have clients coming tomorrow.";

  // 5. Visual Progress Timeline Stage Determinations
  // Stages:
  // 1: Request received
  // 2: Property team notified
  // 3: Maintenance being arranged
  // 4: Vendor assigned
  // 5: Work completed
  const getTimelineStages = (status: TenantDisplayStatus) => {
    switch (status) {
      case 'OPEN':
        return [
          { label: 'Request received', state: 'completed', time: createdTime },
          { label: 'Property team notified', state: 'completed', time: createdTime },
          { label: 'Maintenance being arranged', state: 'current', time: 'In progress' },
          { label: 'Vendor assigned', state: 'pending' },
          { label: 'Work completed', state: 'pending' },
        ];
      case 'IN REVIEW':
        return [
          { label: 'Request received', state: 'completed', time: createdTime },
          { label: 'Property team notified', state: 'completed', time: createdTime },
          { label: 'Maintenance being arranged', state: 'current', time: 'In progress' },
          { label: 'Vendor assigned', state: 'pending' },
          { label: 'Work completed', state: 'pending' },
        ];
      case 'VENDOR ASSIGNED':
        return [
          { label: 'Request received', state: 'completed', time: createdTime },
          { label: 'Property team notified', state: 'completed', time: createdTime },
          { label: 'Maintenance being arranged', state: 'completed', time: updatedTime },
          { label: 'Vendor assigned', state: 'current', time: updatedTime },
          { label: 'Work completed', state: 'pending' },
        ];
      case 'IN PROGRESS':
        return [
          { label: 'Request received', state: 'completed', time: createdTime },
          { label: 'Property team notified', state: 'completed', time: createdTime },
          { label: 'Maintenance being arranged', state: 'completed', time: updatedTime },
          { label: 'Vendor assigned', state: 'completed', time: updatedTime },
          { label: 'Work completed', state: 'current', time: 'Technician on site' },
        ];
      case 'RESOLVED':
      case 'CLOSED':
        return [
          { label: 'Request received', state: 'completed', time: createdTime },
          { label: 'Property team notified', state: 'completed', time: createdTime },
          { label: 'Maintenance being arranged', state: 'completed', time: updatedTime },
          { label: 'Vendor assigned', state: 'completed', time: updatedTime },
          { label: 'Work completed', state: 'completed', time: 'Resolved' },
        ];
    }
  };

  const timelineSteps = getTimelineStages(currentDisplayStatus);

  // Handle Back Button
  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.history.pushState({}, '', '/request');
        setActiveTab('tenant-portal');
      }
    } else {
      setActiveTab('tenant-portal');
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0D] flex flex-col font-sans text-[#F4F4F6] antialiased selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
      
      {/* Top Mobile-Friendly Header */}
      <header className="w-full bg-[#101217] border-b border-white/[0.06] sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Accessible "Back" Button */}
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 py-2 px-3 -ml-2 rounded-xl text-[#8E909B] hover:text-[#F4F4F6] hover:bg-white/[0.04] transition font-medium text-xs sm:text-sm cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Center Brand Identity */}
          <div className="flex items-center gap-2.5">
            <span className="text-[#C9A96E] text-sm">✦</span>
            <span className="font-medium text-[#F4F4F6] text-xs sm:text-sm tracking-tight">
              PropertyOps AI
            </span>
          </div>

          {/* Quick link to submit another request */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.history.pushState({}, '', '/request');
              }
              setActiveTab('tenant-portal');
            }}
            className="text-xs text-[#8E909B] hover:text-[#C9A96E] transition py-2 px-2.5 rounded-xl hover:bg-white/[0.04] cursor-pointer min-h-[44px] flex items-center"
          >
            New Request
          </button>
        </div>
      </header>

      {/* Main Responsive Body Container */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-8 space-y-6">
        
        {/* Loading State */}
        {isLoading ? (
          <div className="bg-[#101217] rounded-2xl border border-white/[0.06] p-12 text-center shadow-2xl space-y-4">
            <Loader2 className="w-8 h-8 text-[#C9A96E] animate-spin mx-auto" />
            <p className="text-[#8E909B] text-sm">Retrieving request #{resolvedId}...</p>
          </div>
        ) : (
          <>
            {/* Primary Request Overview Card */}
            <div className="bg-[#101217] rounded-2xl border border-white/[0.06] shadow-2xl overflow-hidden divide-y divide-white/[0.05]">
              
              {/* Header: Request ID + Current Status Badge */}
              <div className="p-5 sm:p-6 flex items-center justify-between gap-3 bg-white/[0.02]">
                <div>
                  <span className="text-[11px] font-mono text-[#8E909B] uppercase tracking-wider block">
                    Maintenance Request
                  </span>
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#F4F4F6] font-mono tracking-tight mt-0.5">
                    Request {ticketNumberDisplay}
                  </h1>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border font-mono tracking-wider ${getStatusBadgeStyle(currentDisplayStatus)}`}>
                    {currentDisplayStatus}
                  </span>
                </div>
              </div>

              {/* Key Details Rows */}
              <div className="divide-y divide-white/[0.05] text-xs sm:text-sm">
                
                {/* Issue */}
                <div className="px-5 py-3.5 sm:px-6 flex items-center justify-between">
                  <span className="text-[#8E909B]">Issue</span>
                  <span className="font-medium text-[#F4F4F6] text-right">{issueDisplay}</span>
                </div>

                {/* Property */}
                <div className="px-5 py-3.5 sm:px-6 flex items-center justify-between">
                  <span className="text-[#8E909B]">Property</span>
                  <span className="font-medium text-[#F4F4F6] text-right">{propertyDisplay}</span>
                </div>

                {/* Office */}
                <div className="px-5 py-3.5 sm:px-6 flex items-center justify-between">
                  <span className="text-[#8E909B]">Office</span>
                  <span className="font-medium text-[#F4F4F6] font-mono text-right">{officeDisplay}</span>
                </div>

                {/* Current Status Row */}
                <div className="px-5 py-3.5 sm:px-6 flex items-center justify-between">
                  <span className="text-[#8E909B]">Current status</span>
                  <span className="font-semibold text-[#C9A96E] font-mono text-right">{currentDisplayStatus}</span>
                </div>

              </div>

            </div>

            {/* Original Tenant Description Section */}
            <div className="bg-[#101217] rounded-2xl border border-white/[0.06] shadow-2xl p-5 sm:p-6 space-y-3">
              <h2 className="text-xs font-medium text-[#8E909B] uppercase tracking-wider">
                Original Request Details
              </h2>
              <div className="bg-white/[0.02] rounded-xl border border-white/[0.05] p-4">
                <p className="text-[#F4F4F6] text-xs sm:text-sm leading-relaxed whitespace-pre-line italic font-normal">
                  "{tenantDescription}"
                </p>
              </div>
            </div>

            {/* Visual Progress Timeline Section */}
            <div className="bg-[#101217] rounded-2xl border border-white/[0.06] shadow-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                <h2 className="text-xs font-medium text-[#8E909B] uppercase tracking-wider">
                  Request Progress
                </h2>
                <span className="text-[11px] text-[#C9A96E] font-mono">
                  Live Operations Updates
                </span>
              </div>

              {/* 5-Step Vertical Progress Timeline */}
              <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-white/[0.08]">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = step.state === 'completed';
                  const isCurrent = step.state === 'current';
                  const isPending = step.state === 'pending';

                  return (
                    <div key={idx} className="relative flex items-start gap-3">
                      {/* Step Indicator Bullet */}
                      <div className="absolute -left-7 top-0.5 flex items-center justify-center">
                        {isCompleted && (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        {isCurrent && (
                          <div className="w-6 h-6 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#C9A96E] animate-pulse" />
                          </div>
                        )}
                        {isPending && (
                          <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/[0.1] flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                          </div>
                        )}
                      </div>

                      {/* Step Content */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                        <span 
                          className={`text-xs sm:text-sm ${
                            isCompleted 
                              ? 'font-medium text-[#F4F4F6]' 
                              : isCurrent 
                              ? 'font-semibold text-[#DFCCA3]' 
                              : 'text-white/30 font-normal'
                          }`}
                        >
                          {step.label}
                        </span>

                        {/* Timestamp (When Available) */}
                        {step.time && (
                          <span className="text-[11px] font-mono text-[#8E909B] shrink-0">
                            {step.time}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Notification Notice Message */}
              <div className="pt-4 border-t border-white/[0.06] text-center">
                <p className="text-xs sm:text-sm text-[#8E909B] font-normal">
                  We'll notify you when the request status changes.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#F4F4F6] font-medium text-xs sm:text-sm transition text-center border border-white/[0.08] cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.history.pushState({}, '', '/request');
                  }
                  setActiveTab('tenant-portal');
                }}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold text-xs sm:text-sm transition text-center cursor-pointer min-h-[44px] flex items-center justify-center gap-2 shadow-lg shadow-[#C9A96E]/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Submit Another Request</span>
              </button>
            </div>

            {/* Status Demonstration Selector (Interactive Demo) */}
            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/[0.06] text-[11px] text-[#8E909B] space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#F4F4F6]">Simulate Lifecycle States:</span>
                <span className="text-[10px] text-[#C9A96E] font-mono">Interactive Demo</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(['OPEN', 'IN REVIEW', 'VENDOR ASSIGNED', 'IN PROGRESS', 'RESOLVED', 'CLOSED'] as TenantDisplayStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setOverrideStatus(st)}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono font-medium transition cursor-pointer ${
                      currentDisplayStatus === st
                        ? 'bg-[#C9A96E] text-[#090A0D] font-bold shadow-md shadow-[#C9A96E]/20'
                        : 'bg-white/[0.04] text-[#8E909B] hover:text-[#F4F4F6] hover:bg-white/[0.08] border border-white/[0.06]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtle Operations Portal Link */}
            {ticket && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTicketId(ticket.id);
                    setActiveTab('ticket-detail');
                  }}
                  className="text-xs text-white/30 hover:text-[#C9A96E] transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Property Manager Operations View</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </>
        )}

      </main>

      {/* Clean Mobile-Friendly Footer */}
      <footer className="w-full py-5 text-center text-xs text-[#8E909B] border-t border-white/[0.06] bg-[#101217]">
        <p>PropertyOps AI &bull; Orion Business Park Operations</p>
      </footer>

    </div>
  );
};

export default TenantRequestStatus;
