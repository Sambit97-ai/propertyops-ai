import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VendorNotificationEmailModal } from './VendorNotificationEmailModal';

export const VendorsView: React.FC = () => {
  const { vendors, tickets, setSelectedTicketId, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendorForEmail, setSelectedVendorForEmail] = useState<any>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const filteredVendors = vendors.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      v.name.toLowerCase().includes(q) ||
      v.serviceCategory.toLowerCase().includes(q) ||
      v.serviceArea.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#F4F4F6]">
          Contracted Vendors
        </h1>
        <p className="text-xs text-[#8E909B] mt-1">
          Approved commercial service partners with verified certificates and SLA terms
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-4 md:p-5 shadow-2xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contractor, trade category, or service area..."
            className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50 transition"
          />
        </div>
      </div>

      {/* Vendors Table / List */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.06] text-[11px] font-medium text-[#8E909B] uppercase tracking-wider">
                <th className="py-3.5 px-5">Vendor</th>
                <th className="py-3.5 px-5">Trade Category</th>
                <th className="py-3.5 px-5">Service Area</th>
                <th className="py-3.5 px-5">Availability</th>
                <th className="py-3.5 px-5">Active Work Orders</th>
                <th className="py-3.5 px-5">Average Response</th>
                <th className="py-3.5 px-5 text-right">Dispatch &amp; Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredVendors.map((vendor) => {
                const isTargetCoolAir = vendor.name === 'CoolAir Services';

                return (
                  <tr key={vendor.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* 1. Vendor Name */}
                    <td className="py-4 px-5">
                      <div className="font-medium text-[#F4F4F6] flex items-center gap-2">
                        <span>{vendor.name}</span>
                        {isTargetCoolAir && (
                          <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded bg-[#C9A96E]/15 text-[#DFCCA3] border border-[#C9A96E]/25">
                            ANCHOR
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#8E909B] flex items-center gap-1.5 mt-1">
                        <Star className="w-3 h-3 fill-[#C9A96E] text-[#C9A96E]" />
                        <span>{vendor.rating} rating &bull; Insurance Verified</span>
                      </div>
                    </td>

                    {/* 2. Service Category */}
                    <td className="py-4 px-5 font-medium text-[#F4F4F6]">
                      {vendor.serviceCategory}
                    </td>

                    {/* 3. Service Area */}
                    <td className="py-4 px-5 text-[#8E909B]">
                      {vendor.serviceArea}
                    </td>

                    {/* 4. Availability */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                        vendor.availability === 'Available'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                          : 'bg-blue-500/10 text-blue-300 border-blue-500/25'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${vendor.availability === 'Available' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                        {vendor.availability}
                      </span>
                    </td>

                    {/* 5. Current Assigned Tickets */}
                    <td className="py-4 px-5 font-mono text-[#F4F4F6] whitespace-nowrap">
                      {vendor.currentAssignedTickets} Active
                    </td>

                    {/* 6. Average Response Time */}
                    <td className="py-4 px-5 whitespace-nowrap font-mono text-[#C9A96E] font-medium">
                      {vendor.averageResponseTime}
                    </td>

                    {/* Contact Details */}
                    <td className="py-4 px-5 text-right whitespace-nowrap text-[#8E909B] text-[11px]">
                      <div className="font-mono text-[#F4F4F6]">{vendor.contact.phone}</div>
                      <div className="text-white/40 truncate max-w-[150px] ml-auto font-mono text-[10px] mt-0.5">{vendor.contact.email}</div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVendorForEmail(vendor);
                          setIsEmailModalOpen(true);
                        }}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-[#C9A96E] hover:text-[#DFCCA3] bg-[#C9A96E]/10 hover:bg-[#C9A96E]/15 px-2.5 py-1 rounded-lg border border-[#C9A96E]/20 transition cursor-pointer"
                        title="View automated notification email template"
                      >
                        <Mail className="w-3 h-3" />
                        <span>Dispatch Template</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Vendor Email Preview Modal */}
      {selectedVendorForEmail && (
        <VendorNotificationEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          params={{
            vendorName: selectedVendorForEmail.name,
            vendorEmail: selectedVendorForEmail.contact?.email || 'dispatch@coolairservices.com',
            ticketNumber: '#1042',
            property: 'Orion Business Park',
            unit: '402',
            issue: `${selectedVendorForEmail.serviceCategory} / AC malfunction`,
            priority: 'HIGH',
            description: 'The AC is not working and the tenant has clients arriving tomorrow.',
            serviceCategory: selectedVendorForEmail.serviceCategory,
          }}
        />
      )}
    </div>
  );
};
