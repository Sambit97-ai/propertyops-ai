import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  TicketCheck, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PropertiesView: React.FC = () => {
  const { properties, tickets, setActiveTab, setSelectedTicketId } = useApp();
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(properties[0]?.id || '');

  const activeProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] font-sans">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#F4F4F6]">
          Commercial Properties
        </h1>
        <p className="text-xs text-[#8E909B] mt-1">
          Commercial office parks, corporate suites, and multi-tenant telemetry
        </p>
      </div>

      {/* Property Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {properties.map((prop) => {
          const isSelected = prop.id === activeProperty.id;

          return (
            <div
              key={prop.id}
              onClick={() => setSelectedPropertyId(prop.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#12141C] text-[#F4F4F6] border-[#C9A96E]/40 shadow-2xl relative'
                  : 'bg-[#101217] border-white/[0.06] text-[#F4F4F6] hover:border-white/[0.12]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A96E] to-[#C9A96E]/30 rounded-t-2xl" />
              )}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#F4F4F6]">{prop.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#8E909B] mt-1">
                    <MapPin className="w-3 h-3 text-[#C9A96E]" />
                    <span>{prop.address.split(',')[0]}</span>
                  </div>
                </div>

                <Building2 className={`w-4 h-4 ${isSelected ? 'text-[#C9A96E]' : 'text-white/30'}`} />
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="block text-[10px] uppercase text-[#8E909B]">Units</span>
                  <span className="font-medium font-mono text-[#F4F4F6] mt-0.5 block">{prop.totalUnits}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#8E909B]">Open</span>
                  <span className="font-medium font-mono text-[#F87171] mt-0.5 block">{prop.openTickets}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase text-[#8E909B]">Occupancy</span>
                  <span className="font-medium font-mono text-emerald-400 mt-0.5 block">{prop.occupancyRate}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Property Dossier */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 md:p-7 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-white/[0.06] gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-medium text-[#F4F4F6]">{activeProperty.name}</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-md font-mono font-medium bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20">
                ACTIVE PORTFOLIO
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#8E909B] mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span>{activeProperty.address}</span>
            </div>
          </div>

          <div className="text-xs text-[#8E909B]">
            Footprint: <strong className="text-[#F4F4F6] font-mono ml-1">{activeProperty.sqFt.toLocaleString()} sq ft</strong>
          </div>
        </div>

        {/* 6 Key Attributes */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <span className="text-[10px] text-[#8E909B] block uppercase tracking-wider">Property Name</span>
            <span className="font-medium text-[#F4F4F6] mt-1 block truncate">{activeProperty.name}</span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <span className="text-[10px] text-[#8E909B] block uppercase tracking-wider">Location</span>
            <span className="font-medium text-[#F4F4F6] mt-1 block truncate" title={activeProperty.address}>
              {activeProperty.address}
            </span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <span className="text-[10px] text-[#8E909B] block uppercase tracking-wider">Operations Lead</span>
            <span className="font-medium text-[#F4F4F6] mt-1 block truncate">{activeProperty.propertyManager.name}</span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <span className="text-[10px] text-[#8E909B] block uppercase tracking-wider">Total Units</span>
            <span className="font-medium text-[#F4F4F6] font-mono mt-1 block">{activeProperty.totalUnits} Units</span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <span className="text-[10px] text-[#8E909B] block uppercase tracking-wider">Open Requests</span>
            <span className="font-medium text-[#F87171] font-mono mt-1 block">{activeProperty.openTickets}</span>
          </div>

          <div className="p-3.5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <span className="text-[10px] text-[#8E909B] block uppercase tracking-wider">Contracted Vendors</span>
            <span className="font-medium text-emerald-400 font-mono mt-1 block">{activeProperty.activeVendors} Active</span>
          </div>
        </div>

        {/* Property Manager Card */}
        <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#DFCCA3] font-medium flex items-center justify-center text-xs">
              SJ
            </div>
            <div>
              <div className="font-medium text-[#F4F4F6]">{activeProperty.propertyManager.name}</div>
              <div className="text-[11px] text-[#8E909B] mt-0.5">Senior Property Operations Director &bull; On-site Management</div>
            </div>
          </div>

          <div className="flex items-center gap-5 text-xs font-mono text-[#8E909B]">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="text-[#F4F4F6]">{activeProperty.propertyManager.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C9A96E]" />
              <span className="text-[#F4F4F6]">{activeProperty.propertyManager.email}</span>
            </div>
          </div>
        </div>

        {/* List of Recent Property Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F4F4F6]">
              Recent Property Activity
            </h3>
            <span className="text-[11px] text-[#8E909B]">Telemetry log for {activeProperty.name}</span>
          </div>

          <div className="border border-white/[0.06] rounded-xl divide-y divide-white/[0.04] text-xs">
            {activeProperty.recentActivity.map((act) => (
              <div key={act.id} className="p-4 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] mt-2 shrink-0" />
                  <div>
                    <div className="font-medium text-[#F4F4F6] flex items-center gap-2">
                      <span>{act.action}</span>
                      {act.unit && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-[#8E909B] border border-white/[0.06]">
                          Office {act.unit}
                        </span>
                      )}
                    </div>
                    <p className="text-[#8E909B] mt-0.5 text-xs">{act.details}</p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-white/30 whitespace-nowrap">
                  {act.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
