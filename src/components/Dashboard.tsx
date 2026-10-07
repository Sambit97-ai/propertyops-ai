import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Search,
  Filter,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Ticket, TicketStatus, PriorityLevel } from '../types';

type FilterTab = 'All' | 'High Priority' | 'Awaiting Vendor' | 'Resolved';

export const Dashboard: React.FC = () => {
  const { 
    tickets, 
    setSelectedTicketId, 
    setActiveTab,
    resetDatabase,
    addToast
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  // Filtered live feed
  const filteredFeed = useMemo(() => {
    return tickets.filter((t) => {
      // Filter tab
      if (activeFilter === 'High Priority' && t.priority !== 'HIGH' && t.priority !== 'CRITICAL') {
        return false;
      }
      if (activeFilter === 'Awaiting Vendor' && t.status !== 'Awaiting Vendor' && t.status !== 'IN REVIEW' && t.status !== 'Vendor Contacted') {
        return false;
      }
      if (activeFilter === 'Resolved' && t.status !== 'Resolved' && t.status !== 'RESOLVED') {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          t.ticketNumber.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.unit.toLowerCase().includes(q) ||
          t.tenant.company.toLowerCase().includes(q) ||
          t.assignedVendor.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [tickets, activeFilter, searchQuery]);

  const handleTicketClick = (ticket: Ticket) => {
    const cleanId = ticket.ticketNumber.replace('#', '').trim();
    if (typeof window !== 'undefined') {
      window.history.pushState({ ticketId: ticket.ticketNumber }, '', `/tickets/${cleanId}`);
    }
    setSelectedTicketId(ticket.id);
    setActiveTab('ticket-detail');
  };

  const handleReviewRecommendations = () => {
    const highUrgency = tickets.find(t => t.priority === 'HIGH' && (t.status === 'OPEN' || t.status === 'Vendor Contacted')) || tickets[0];
    if (highUrgency) {
      handleTicketClick(highUrgency);
    } else {
      setActiveTab('tickets');
    }
  };

  return (
    <div className="min-h-full bg-[#090A0D] text-[#F4F4F6] p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">
      {/* ===================================================================
          1. EDITORIAL HEADER & LIVE OPERATIONAL BANNER
      ==================================================================== */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.05] pb-8">
        <div className="space-y-2">
          {/* Live Indicator */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#12141C] border border-white/[0.06] text-[11px] font-mono tracking-wider text-[#A0A2AE]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            <span className="text-emerald-400 font-semibold uppercase">AI OPERATIONS LIVE</span>
            <span className="text-white/[0.2]">•</span>
            <span>Orion Business Park · Gurugram</span>
          </div>

          {/* Editorial Greeting & Subtitle */}
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-white mt-1">
            Good evening, <span className="font-semibold text-white">Sarah</span>.
          </h1>
          <p className="text-sm font-normal text-[#8E909B] tracking-wide">
            Everything is under control.
          </p>
        </div>

        {/* Global Context Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/request');
              setActiveTab('tenant-portal');
            }}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-[#ECECEE] border border-white/[0.07] transition-all cursor-pointer flex items-center gap-2 group"
          >
            <span>Open Tenant Form</span>
            <ArrowRight className="w-3.5 h-3.5 text-champagne group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleReviewRecommendations}
            className="px-4 py-2 rounded-xl bg-[#14161F] hover:bg-[#1A1C27] text-xs font-semibold text-champagne border border-champagne/30 shadow-panel transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Review Priority Queue</span>
            <Sparkles className="w-3.5 h-3.5 text-champagne" />
          </button>
        </div>
      </section>

      {/* ===================================================================
          2. ASYMMETRIC COMMAND GRID: PROPERTY PULSE & AI OPERATIONS
      ==================================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Property Pulse (Editorial Metrics) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-baseline justify-between border-b border-white/[0.04] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-champagne font-semibold block">
                PROPERTY PULSE
              </span>
              <h2 className="text-xl font-normal text-white mt-0.5 tracking-tight">
                Orion Business Park
              </h2>
            </div>
            <span className="text-xs text-[#8E909B] font-mono">10 Commercial Suites</span>
          </div>

          {/* Large Stat Numbers (Linear/Stripe Precision) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-1">
            <div className="space-y-1">
              <span className="text-[11px] text-[#8E909B] font-mono uppercase tracking-wider block">
                Operational
              </span>
              <div className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                96<span className="text-xl font-normal text-champagne">%</span>
              </div>
              <span className="text-[10px] text-emerald-400/90 font-mono flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" /> Normal operating load
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#8E909B] font-mono uppercase tracking-wider block">
                Tenants
              </span>
              <div className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                127
              </div>
              <span className="text-[10px] text-[#737684] font-mono">
                Across 5 corporate leases
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-[#8E909B] font-mono uppercase tracking-wider block">
                Active Requests
              </span>
              <div className="text-3xl sm:text-4xl font-extralight text-white tracking-tight">
                24
              </div>
              <span className="text-[10px] text-[#737684] font-mono">
                7 resolved today
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-coral/90 font-mono uppercase tracking-wider block">
                Attention Required
              </span>
              <div className="text-3xl sm:text-4xl font-light text-coral tracking-tight">
                3
              </div>
              <span className="text-[10px] text-coral/80 font-mono">
                High-priority SLA triage
              </span>
            </div>
          </div>

          {/* Quick Context Summary Strip */}
          <div className="p-4 rounded-xl bg-[#101218] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#A0A2AE]">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-champagne" />
              <span>Core demo focus: <strong className="text-white font-medium">Ticket #1042 (Office 402 HVAC Malfunction)</strong></span>
            </div>
            <button
              onClick={() => {
                const target = tickets.find(t => t.ticketNumber === '#1042') || tickets[0];
                handleTicketClick(target);
              }}
              className="text-champagne hover:underline flex items-center gap-1 font-mono text-[11px] cursor-pointer"
            >
              <span>Inspect Ticket #1042</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: AI Operations Panel (✦ AI OPERATIONS) */}
        <div className="lg:col-span-5 bg-[#11131A] border border-white/[0.07] rounded-2xl p-6 shadow-luxury space-y-5 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-champagne/[0.06] rounded-full blur-2xl pointer-events-none" />

          {/* Panel Header */}
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <div className="flex items-center gap-2 text-champagne text-xs font-mono font-bold tracking-wider">
              <span>✦</span>
              <span>AI OPERATIONS</span>
            </div>
            <span className="text-[10px] font-mono text-[#8E909B] bg-white/[0.03] px-2 py-0.5 rounded border border-white/[0.04]">
              Autonomous Triage
            </span>
          </div>

          {/* AI Intelligence Insights (Requested exact copy) */}
          <div className="space-y-3.5 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-coral mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-white font-medium leading-snug">
                  I detected 7 requests requiring attention today.
                </p>
                <p className="text-[11px] text-[#8E909B]">
                  Client meetings scheduled tomorrow in Suite 402 elevated priority.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-white font-medium leading-snug">
                  3 vendors can be automatically assigned.
                </p>
                <p className="text-[11px] text-[#8E909B]">
                  CoolAir Services, AquaFix Maintenance &amp; BrightSpark Electrical ready.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <span className="w-1.5 h-1.5 rounded-full bg-champagne mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-white font-medium leading-snug">
                  2 requests require manager review.
                </p>
                <p className="text-[11px] text-[#8E909B]">
                  After-hours janitorial scheduling and badge reprogram authority.
                </p>
              </div>
            </div>
          </div>

          {/* Contextual Action Button */}
          <div className="pt-2">
            <button
              onClick={handleReviewRecommendations}
              className="w-full py-2.5 px-4 rounded-xl bg-champagne/10 hover:bg-champagne/15 text-champagne border border-champagne/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-glow-champagne group"
            >
              <span>Review Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================================
          3. REQUEST FEED: MODERN LIVE ACTIVITY FEED
      ==================================================================== */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-champagne font-semibold block">
              LIVE REQUEST FEED
            </span>
            <h3 className="text-lg font-normal text-white mt-0.5 tracking-tight">
              Recent Maintenance Requests
            </h3>
          </div>

          {/* Filter Tabs & Search */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'High Priority', 'Awaiting Vendor', 'Resolved'] as FilterTab[]).map((tab) => {
              const isSelected = activeFilter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#181A24] text-white border border-white/[0.1] shadow-xs'
                      : 'text-[#8E909B] hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}

            <div className="relative ml-2">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#686B76]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter feed..."
                className="bg-[#101218] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-[#5C5F6D] focus:outline-none focus:border-champagne/30"
              />
            </div>
          </div>
        </div>

        {/* The Feed Table / List (Linear-Inspired Editorial Stream) */}
        <div className="divide-y divide-white/[0.04] bg-[#0E1015]/60 rounded-2xl border border-white/[0.05] overflow-hidden">
          {filteredFeed.length === 0 ? (
            <div className="p-12 text-center text-[#686B76] text-xs">
              No maintenance requests match the current filter criteria.
            </div>
          ) : (
            filteredFeed.map((ticket) => {
              const isHigh = ticket.priority === 'HIGH' || ticket.priority === 'CRITICAL';
              const isResolved = ticket.status === 'Resolved' || ticket.status === 'RESOLVED';
              const isTargetDemo = ticket.ticketNumber === '#1042';

              return (
                <div
                  key={ticket.id}
                  onClick={() => handleTicketClick(ticket)}
                  className={`px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer group ${
                    isTargetDemo ? 'bg-champagne/[0.02]' : ''
                  }`}
                >
                  {/* Left: Ticket Identity & Issue */}
                  <div className="flex items-start gap-4">
                    {/* Priority Indicator Dot */}
                    <div className="mt-1">
                      <span className={`w-2 h-2 rounded-full block ${
                        isHigh ? 'bg-coral shadow-[0_0_6px_rgba(248,113,113,0.7)]' : 'bg-[#686B76]'
                      }`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-champagne font-semibold text-xs">
                          {ticket.ticketNumber}
                        </span>
                        <h4 className="text-sm font-medium text-white tracking-tight group-hover:text-champagne transition-colors">
                          {ticket.title}
                        </h4>
                        {isTargetDemo && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-champagne/10 text-champagne border border-champagne/20 font-semibold">
                            CORE DEMO
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#8E909B]">
                        <span>Orion Business Park · Office {ticket.unit}</span>
                        <span>•</span>
                        <span>{ticket.tenant.company}</span>
                        <span>•</span>
                        <span className="text-[#686B76]">{ticket.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Vendor, Status & Timestamp */}
                  <div className="flex items-center gap-6 self-start md:self-auto pl-6 md:pl-0">
                    {/* Assigned Vendor */}
                    <div className="text-right hidden sm:block">
                      <span className="text-xs text-white font-medium block">
                        {ticket.assignedVendor}
                      </span>
                      <span className="text-[10px] text-[#686B76] font-mono block">
                        Assigned Contractor
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isResolved
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : isHigh
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                            : 'bg-white/[0.04] text-[#A6A8B4] border border-white/[0.06]'
                      }`}>
                        {ticket.status}
                      </span>

                      <ChevronRight className="w-4 h-4 text-[#505360] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};
