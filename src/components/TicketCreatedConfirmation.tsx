import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Building2, 
  ArrowLeft, 
  Clock, 
  FileText, 
  X, 
  ExternalLink, 
  RotateCcw, 
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TicketCreatedConfirmationProps {
  ticketId?: string;
  ticketData?: {
    category?: string;
    property?: string;
    unit?: string;
    status?: string;
    description?: string;
  };
  onReset?: () => void;
  onViewStatus?: () => void;
}

export const TicketCreatedConfirmation: React.FC<TicketCreatedConfirmationProps> = ({
  ticketId: initialTicketId,
  ticketData,
  onReset,
  onViewStatus,
}) => {
  const { tickets, setActiveTab, setSelectedTicketId } = useApp();
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Determine Ticket ID from prop, URL parameter (?ticketId=...), or fallback
  const [resolvedTicketId, setResolvedTicketId] = useState<string>(() => {
    if (initialTicketId) return initialTicketId;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get('ticketId');
      if (paramId) {
        return paramId.startsWith('#') ? paramId : `#${paramId}`;
      }
    }
    return '#1042';
  });

  useEffect(() => {
    if (initialTicketId) {
      setResolvedTicketId(initialTicketId);
      return;
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramId = urlParams.get('ticketId');
      if (paramId) {
        setResolvedTicketId(paramId.startsWith('#') ? paramId : `#${paramId}`);
      }
    }
  }, [initialTicketId]);

  const cleanId = resolvedTicketId.replace('#', '').trim();

  const matchedTicket = tickets.find(
    (t) =>
      t.ticketNumber.replace('#', '').trim() === cleanId ||
      t.ticketNumber === resolvedTicketId ||
      t.id === cleanId
  );

  const ticketNumberDisplay = matchedTicket
    ? matchedTicket.ticketNumber
    : resolvedTicketId.startsWith('#')
    ? resolvedTicketId
    : `#${resolvedTicketId}`;

  const category =
    ticketData?.category ||
    (matchedTicket
      ? matchedTicket.category === 'HVAC'
        ? 'HVAC / Air Conditioning'
        : matchedTicket.category
      : 'HVAC / Air Conditioning');

  const property =
    ticketData?.property ||
    (matchedTicket ? matchedTicket.property : 'Orion Business Park');

  const unit =
    ticketData?.unit ||
    (matchedTicket ? matchedTicket.unit : '402');

  const status = 'OPEN';
  const submitted = 'Just now';

  const description =
    ticketData?.description ||
    (matchedTicket
      ? matchedTicket.conversation?.tenantMessage || matchedTicket.title
      : "The AC in Office 402 isn't working. We have clients coming tomorrow and need this fixed urgently.");

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/request');
      }
      setActiveTab('tenant-portal');
    }
  };

  const handleViewStatus = () => {
    if (onViewStatus) {
      onViewStatus();
      return;
    }
    if (typeof window !== 'undefined') {
      window.history.pushState(
        { ticketId: cleanId },
        '',
        `/request/${cleanId}`
      );
    }
    setActiveTab('tenant-status');
  };

  return (
    <div className="min-h-screen bg-[#090A0D] flex flex-col justify-between font-sans text-[#F4F4F6] antialiased selection:bg-[#C9A96E]/20 selection:text-[#DFCCA3]">
      {/* Top Navigation Bar */}
      <header className="w-full bg-[#101217] border-b border-white/[0.06] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#C9A96E]">✦</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#F4F4F6] text-sm tracking-tight">
                PropertyOps AI
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-xs text-[#8E909B]">
                Tenant Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-[#8E909B] hidden sm:inline">
              Property: <strong className="text-[#F4F4F6] font-medium">{property}</strong>
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-xs text-[#8E909B] hover:text-[#C9A96E] transition flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg hover:bg-white/[0.04]"
              title="Return to Operations Dashboard"
            >
              <span>Operations View</span>
              <ExternalLink className="w-3 h-3 text-white/30" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Confirmation Content Container */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-[560px] w-full bg-[#101217] rounded-2xl border border-white/[0.06] shadow-2xl p-6 sm:p-10 space-y-7">
          
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-medium text-[#F4F4F6] tracking-tight">
              Request Received
            </h1>

            <p className="text-[#8E909B] text-xs sm:text-sm">
              Your maintenance request has been logged.
            </p>

            <div className="pt-2">
              <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-white/[0.03] text-[#DFCCA3] border border-[#C9A96E]/20">
                Request {ticketNumberDisplay}
              </span>
            </div>
          </div>

          {/* Summary Card */}
          <div className="bg-white/[0.02] rounded-xl border border-white/[0.06] divide-y divide-white/[0.05] overflow-hidden text-xs sm:text-sm">
            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[#8E909B]">Category</span>
              <span className="font-medium text-[#F4F4F6]">{category}</span>
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[#8E909B]">Property</span>
              <span className="font-medium text-[#F4F4F6]">{property}</span>
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[#8E909B]">Unit</span>
              <span className="font-medium text-[#F4F4F6] font-mono">{unit}</span>
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[#8E909B]">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20 font-mono">
                {status}
              </span>
            </div>

            <div className="px-5 py-3.5 flex items-center justify-between">
              <span className="text-[#8E909B]">Submitted</span>
              <span className="text-[#8E909B] font-mono text-xs">{submitted}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-4 pt-1">
            <h2 className="text-xs font-medium text-[#8E909B] uppercase tracking-wider text-center">
              Request Milestones
            </h2>

            <div className="bg-[#12141C] rounded-xl border border-white/[0.06] p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium text-[#F4F4F6]">
                    Request received
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#C9A96E]/20 border border-[#C9A96E]/40 flex items-center justify-center shrink-0">
                  <span className="w-2 rounded-full h-2 bg-[#C9A96E] animate-pulse" />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-medium text-[#DFCCA3]">
                    Property team reviewing
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border border-white/[0.1] bg-white/[0.02] flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm text-white/30">
                    Vendor assigned
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border border-white/[0.1] bg-white/[0.02] flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-transparent" />
                </div>
                <div className="flex-1">
                  <span className="text-xs sm:text-sm text-white/30">
                    Work completed
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#8E909B] text-center">
              We'll notify you when the request status changes.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleViewStatus}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold text-xs sm:text-sm transition text-center shadow-lg shadow-[#C9A96E]/20 cursor-pointer"
            >
              Track Request Status
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#F4F4F6] font-medium text-xs sm:text-sm transition text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-white/40" />
              <span>Submit Another Request</span>
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-5 text-center text-xs text-[#8E909B] border-t border-white/[0.06] bg-[#101217]">
        <p>PropertyOps AI &bull; Orion Business Park Operations</p>
      </footer>
    </div>
  );
};

export default TicketCreatedConfirmation;
