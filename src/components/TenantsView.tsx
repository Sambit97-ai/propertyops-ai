import React, { useState } from 'react';
import { 
  Users2, 
  Search, 
  Phone, 
  Mail, 
  Building2, 
  TicketCheck, 
  ChevronRight, 
  ExternalLink, 
  MessageSquare 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TenantsView: React.FC = () => {
  const { tenants, tickets, setSelectedTicketId, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = tenants.filter(t => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      t.company.toLowerCase().includes(q) ||
      t.unit.toLowerCase().includes(q) ||
      t.contact.name.toLowerCase().includes(q) ||
      t.property.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#F4F4F6]">
            Commercial Tenants
          </h1>
          <p className="text-xs text-[#8E909B] mt-1">
            Active corporate occupants, lease contacts, and operations history
          </p>
        </div>

        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.history.pushState({}, '', '/request');
            }
            setActiveTab('tenant-portal');
          }}
          className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[#F4F4F6] border border-white/[0.08] font-medium text-xs flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
        >
          <span className="text-[#C9A96E]">✦</span>
          <span>Tenant Intake Form</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-4 md:p-5 shadow-2xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenant company, suite (e.g. 402), or contact..."
            className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50 transition"
          />
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-medium text-[#8E909B] uppercase tracking-wider">
                <th className="py-3.5 px-5">Tenant / Company</th>
                <th className="py-3.5 px-5 font-mono">Unit</th>
                <th className="py-3.5 px-5">Property</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Open Requests</th>
                <th className="py-3.5 px-5">Resolved</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredTenants.map((tenant) => {
                const isTargetDemo = tenant.unit === '402';

                return (
                  <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* 1. Tenant / Company */}
                    <td className="py-4 px-5">
                      <div className="font-medium text-[#F4F4F6] flex items-center gap-2">
                        <span>{tenant.company}</span>
                        {isTargetDemo && (
                          <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-[#C9A96E]/15 text-[#DFCCA3] border border-[#C9A96E]/25">
                            ANCHOR
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8E909B] mt-0.5">Lease through {tenant.leaseExpiry}</div>
                    </td>

                    {/* 2. Unit */}
                    <td className="py-4 px-5 font-mono font-medium text-[#C9A96E] whitespace-nowrap">
                      Office {tenant.unit}
                    </td>

                    {/* 3. Property */}
                    <td className="py-4 px-5 text-[#8E909B]">
                      {tenant.property}
                    </td>

                    {/* 4. Contact Information */}
                    <td className="py-4 px-5">
                      <div className="font-medium text-[#F4F4F6]">{tenant.contact.name}</div>
                      <div className="text-[11px] text-[#8E909B]">{tenant.contact.title}</div>
                      <div className="text-[11px] text-white/40 font-mono mt-0.5">
                        {tenant.contact.phone} &bull; {tenant.contact.email}
                      </div>
                    </td>

                    {/* 5. Open Tickets */}
                    <td className="py-4 px-5 whitespace-nowrap font-mono">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/25">
                        {tenant.openTickets} Open
                      </span>
                    </td>

                    {/* 6. Previous Tickets */}
                    <td className="py-4 px-5 whitespace-nowrap font-mono text-[#8E909B]">
                      {tenant.previousTickets} Resolved
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      {tenant.activeTicketsList && tenant.activeTicketsList.length > 0 && (
                        <button
                          onClick={() => {
                            const firstTicketNumber = tenant.activeTicketsList![0];
                            const matched = tickets.find(t => t.ticketNumber === firstTicketNumber);
                            if (matched) {
                              setSelectedTicketId(matched.id);
                              setActiveTab('ticket-detail');
                            }
                          }}
                          className="px-3 py-1.5 text-xs rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-[#DFCCA3] font-medium transition cursor-pointer"
                        >
                          View {tenant.activeTicketsList[0]}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
