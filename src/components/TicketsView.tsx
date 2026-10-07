import React, { useState } from 'react';
import { 
  TicketCheck, 
  Search, 
  Filter, 
  ChevronRight, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  Sparkles,
  ArrowUpDown,
  X,
  Building2,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PriorityLevel, TicketStatus, TradeCategory } from '../types';

export const TicketsView: React.FC = () => {
  const { 
    tickets, 
    properties, 
    tenants, 
    vendors, 
    setSelectedTicketId, 
    setActiveTab, 
    createTicket 
  } = useApp();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Create Ticket Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newUnitNumber, setNewUnitNumber] = useState('402');
  const [newTenantCompany, setNewTenantCompany] = useState(tenants[0]?.company || 'ABC Consulting');
  const [newCategory, setNewCategory] = useState<TradeCategory>('HVAC');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('HIGH');
  const [newStatus, setNewStatus] = useState<TicketStatus>('Vendor Contacted');
  const [newVendorName, setNewVendorName] = useState(vendors[0]?.name || 'CoolAir Services');

  const filteredTickets = tickets.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      t.ticketNumber.toLowerCase().includes(q) ||
      t.title.toLowerCase().includes(q) ||
      t.unit.toLowerCase().includes(q) ||
      t.tenant.company.toLowerCase().includes(q) ||
      t.assignedVendor.toLowerCase().includes(q);

    const matchesStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'OPEN' && t.status !== 'Resolved' && t.status !== 'RESOLVED' && t.status !== 'CLOSED') ||
      t.status === statusFilter ||
      (statusFilter === 'Awaiting Vendor' && (t.status === 'Awaiting Vendor' || t.status === 'IN REVIEW')) ||
      (statusFilter === 'Resolved' && (t.status === 'RESOLVED' || t.status === 'Resolved')) ||
      (statusFilter === 'RESOLVED' && (t.status === 'RESOLVED' || t.status === 'Resolved'));

    const matchesPriority = 
      priorityFilter === 'ALL' ||
      t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    try {
      setIsSubmitting(true);
      const property = properties[0];
      const created = await createTicket({
        propertyId: property ? property.id : 'a0000000-0000-0000-0000-000000000001',
        unitNumber: newUnitNumber,
        tenantCompanyName: newTenantCompany,
        vendorName: newVendorName,
        category: newCategory,
        priority: newPriority,
        status: newStatus,
        title: newTitle.trim(),
        description: newDescription.trim(),
        aiSummary: `Autonomous triage: Tenant in Unit ${newUnitNumber} reports ${newCategory} issue: "${newTitle.trim()}". Classified with ${newPriority} priority.`,
        inboundMessage: newDescription.trim(),
      });

      setIsCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      setSelectedTicketId(created.id);
      setActiveTab('ticket-detail');
    } catch (err) {
      console.error('Failed to create ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityBadgeClass = (priority: PriorityLevel) => {
    switch (priority) {
      case 'CRITICAL':
      case 'HIGH':
        return 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/25';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'LOW':
        return 'bg-white/[0.04] text-[#8E909B] border-white/[0.08]';
      default:
        return 'bg-white/[0.04] text-[#8E909B] border-white/[0.08]';
    }
  };

  const getStatusBadgeClass = (status: TicketStatus) => {
    switch (status) {
      case 'RESOLVED':
      case 'Resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25';
      case 'OPEN':
      case 'Vendor Contacted':
        return 'bg-[#C9A96E]/10 text-[#DFCCA3] border-[#C9A96E]/25';
      case 'IN REVIEW':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'VENDOR ASSIGNED':
      case 'Assigned':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25';
      case 'IN PROGRESS':
      case 'In Progress':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/25';
      case 'Awaiting Vendor':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'Escalated':
        return 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/25';
      default:
        return 'bg-white/[0.04] text-[#8E909B] border-white/[0.08]';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#F4F4F6]">
            Requests
          </h1>
          <p className="text-xs text-[#8E909B] mt-1">
            Commercial work orders across Orion Business Park
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setSelectedTicketId('#1042');
              setActiveTab('ticket-detail');
            }}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-[#DFCCA3] border border-[#C9A96E]/30 flex items-center gap-2 transition cursor-pointer"
          >
            <span className="text-[#C9A96E]">✦</span>
            <span>Anchor Ticket (#1042)</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-[#C9A96E]/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Request</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-4 md:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket #, issue, unit, company, or vendor..."
              className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50 transition"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick status tabs */}
            {(['ALL', 'OPEN', 'Awaiting Vendor', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#C9A96E]/15 text-[#DFCCA3] border border-[#C9A96E]/30'
                    : 'bg-white/[0.02] text-[#8E909B] hover:text-[#F4F4F6] border border-white/[0.06]'
                }`}
              >
                {st === 'ALL' ? 'All' : st}
              </button>
            ))}

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#12141C] border border-white/[0.08] text-xs rounded-xl px-3 py-2 text-[#8E909B] focus:outline-none focus:border-[#C9A96E]/50 cursor-pointer"
            >
              <option value="ALL" className="bg-[#101217]">All Priorities</option>
              <option value="CRITICAL" className="bg-[#101217]">Critical</option>
              <option value="HIGH" className="bg-[#101217]">High Priority</option>
              <option value="MEDIUM" className="bg-[#101217]">Medium Priority</option>
              <option value="LOW" className="bg-[#101217]">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#8E909B] pt-2 border-t border-white/[0.05]">
          <span>Showing <strong className="text-[#F4F4F6] font-mono">{filteredTickets.length}</strong> of {tickets.length} requests</span>
          <span className="text-[11px] font-mono text-white/30">Orion Business Park &bull; Gurugram</span>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
        {filteredTickets.length === 0 ? (
          <div className="p-16 text-center text-[#8E909B] text-xs">
            <TicketCheck className="w-8 h-8 mx-auto text-white/20 mb-3" />
            <p className="font-medium text-[#F4F4F6]">No requests found matching current filter.</p>
            <p className="text-[#8E909B] mt-1">Try resetting the search query or priority filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-medium text-[#8E909B] uppercase tracking-wider">
                  <th className="py-3.5 px-5 font-mono">Ticket</th>
                  <th className="py-3.5 px-5">Issue</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Unit</th>
                  <th className="py-3.5 px-5">Tenant</th>
                  <th className="py-3.5 px-5">Vendor</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 font-mono">Created</th>
                  <th className="py-3.5 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicketId(ticket.id);
                      setActiveTab('ticket-detail');
                    }}
                    className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    {/* Ticket # */}
                    <td className="py-4 px-5 font-mono font-medium text-[#C9A96E] whitespace-nowrap">
                      {ticket.ticketNumber}
                    </td>

                    {/* Title */}
                    <td className="py-4 px-5 font-medium text-[#F4F4F6]">
                      <div className="flex items-center gap-2">
                        <span>{ticket.title}</span>
                        {ticket.ticketNumber === '#1042' && (
                          <span className="text-[10px] bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20 px-1.5 py-0.2 rounded font-mono">
                            Anchor
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-5 text-[#8E909B] whitespace-nowrap">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white/[0.03] text-[#8E909B] border border-white/[0.06]">
                        {ticket.category}
                      </span>
                    </td>

                    {/* Unit */}
                    <td className="py-4 px-5 text-[#8E909B] font-mono whitespace-nowrap">
                      Office {ticket.unit}
                    </td>

                    {/* Tenant */}
                    <td className="py-4 px-5 text-[#F4F4F6] whitespace-nowrap">
                      {ticket.tenant.company}
                    </td>

                    {/* Assigned Vendor */}
                    <td className="py-4 px-5 font-medium text-[#8E909B] whitespace-nowrap">
                      {ticket.assignedVendor}
                    </td>

                    {/* Priority Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getPriorityBadgeClass(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${getStatusBadgeClass(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="py-4 px-5 text-[#8E909B] font-mono text-[11px] whitespace-nowrap">
                      {ticket.createdTimeFormatted}
                    </td>

                    {/* Action Arrow */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-white/20 group-hover:text-[#C9A96E] transition flex items-center justify-end">
                        <ChevronRight className="w-4 h-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090A0D]/80 backdrop-blur-sm">
          <div className="bg-[#12141C] rounded-2xl shadow-2xl border border-white/[0.1] max-w-lg w-full overflow-hidden text-xs text-[#F4F4F6]">
            <div className="px-6 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#101217]">
              <div className="flex items-center gap-2.5">
                <span className="text-[#C9A96E]">✦</span>
                <h3 className="font-semibold text-sm">Create Maintenance Request</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#8E909B] hover:text-[#F4F4F6] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Issue Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Elevator door sensor delay, HVAC refrigerant recharge..."
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8E909B] block mb-1.5 font-medium">Trade Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TradeCategory)}
                    className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Access Control">Access Control</option>
                    <option value="Elevators">Elevators</option>
                    <option value="Janitorial">Janitorial</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8E909B] block mb-1.5 font-medium">Priority SLA</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as PriorityLevel)}
                    className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                  >
                    <option value="CRITICAL">CRITICAL (&lt; 1h)</option>
                    <option value="HIGH">HIGH (&lt; 2h)</option>
                    <option value="MEDIUM">MEDIUM (12h)</option>
                    <option value="LOW">LOW (Scheduled)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8E909B] block mb-1.5 font-medium">Commercial Suite</label>
                  <select
                    value={newUnitNumber}
                    onChange={(e) => setNewUnitNumber(e.target.value)}
                    className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F6] font-mono focus:outline-none focus:border-[#C9A96E]/50"
                  >
                    <option value="101">Office 101</option>
                    <option value="102">Office 102</option>
                    <option value="103">Office 103</option>
                    <option value="201">Office 201</option>
                    <option value="204">Office 204</option>
                    <option value="218">Office 218</option>
                    <option value="305">Office 305</option>
                    <option value="310">Office 310</option>
                    <option value="401">Office 401</option>
                    <option value="402">Office 402</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8E909B] block mb-1.5 font-medium">Tenant Company</label>
                  <select
                    value={newTenantCompany}
                    onChange={(e) => setNewTenantCompany(e.target.value)}
                    className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                  >
                    {tenants.map(t => (
                      <option key={t.id} value={t.company}>{t.company}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#8E909B] block mb-1.5 font-medium">Assigned Contractor</label>
                  <select
                    value={newVendorName}
                    onChange={(e) => setNewVendorName(e.target.value)}
                    className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                  >
                    {vendors.map(v => (
                      <option key={v.id} value={v.name}>{v.name} ({v.serviceCategory})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[#8E909B] block mb-1.5 font-medium">Initial Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                    className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                  >
                    <option value="Vendor Contacted">Vendor Contacted</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Vendor">Awaiting Vendor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Request Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detailed description of the maintenance issue..."
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl p-3 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-white/[0.08] rounded-xl text-[#8E909B] hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] rounded-xl font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
