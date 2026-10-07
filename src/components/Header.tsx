import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Bell, 
  ChevronDown, 
  ExternalLink,
  Sparkles,
  X,
  Check,
  SlidersHorizontal,
  Circle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    tickets, 
    tenants, 
    vendors, 
    setSelectedTicketId, 
    setActiveTab, 
    activeTab,
    globalSearchQuery, 
    setGlobalSearchQuery,
    addToast
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const notifications = [
    {
      id: 'n-1',
      title: 'CoolAir Services Dispatched',
      message: 'Work order #1042 acknowledged for Suite 402 with 45m emergency response.',
      time: '12m ago',
      ticketId: '#1042',
      urgent: true,
    },
    {
      id: 'n-2',
      title: 'Plumbing Repair Verified',
      message: 'AquaFix Maintenance completed shut-off valve replacement in Suite 109.',
      time: '48m ago',
      ticketId: '#1040',
      urgent: false,
    },
    {
      id: 'n-3',
      title: 'Perimeter Credential Sync',
      message: 'SecureAccess Solutions reprogrammed associate RFID badges for Suite 218.',
      time: '1h ago',
      ticketId: '#1041',
      urgent: false,
    },
  ];

  // Global search filtering
  const searchTickets = tickets.filter(t => 
    globalSearchQuery && (
      t.ticketNumber.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      t.tenant.company.toLowerCase().includes(globalSearchQuery.toLowerCase())
    )
  ).slice(0, 4);

  const searchTenants = tenants.filter(tn =>
    globalSearchQuery && (
      tn.company.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      tn.unit.toLowerCase().includes(globalSearchQuery.toLowerCase())
    )
  ).slice(0, 3);

  return (
    <header className="h-14 bg-[#090A0D] border-b border-white/[0.06] px-6 flex items-center justify-between text-xs select-none sticky top-0 z-30">
      {/* Left: Property Selector & Live Indicator */}
      <div className="flex items-center gap-4">
        {/* Active Property Menu */}
        <div className="relative">
          <button 
            onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#12141A] border border-white/[0.06] text-[#ECECEE] hover:border-white/[0.12] transition-colors cursor-pointer group"
          >
            <div className="w-2 h-2 rounded-full bg-champagne" />
            <span className="font-medium tracking-tight text-white">Orion Business Park</span>
            <span className="text-[10px] font-mono text-[#8E909B]">Gurugram</span>
            <ChevronDown className="w-3 h-3 text-[#686B76] group-hover:text-white transition-colors" />
          </button>

          {isPropertyDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-[#14161F] border border-white/[0.08] rounded-xl shadow-luxury p-2 z-50">
              <div className="px-3 py-2 border-b border-white/[0.05]">
                <div className="font-semibold text-white text-xs">Orion Business Park</div>
                <div className="text-[11px] text-[#8E909B]">Sector 29, Golf Course Ext. Rd</div>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-champagne font-mono">
                  <span>10 Suites</span>
                  <span>•</span>
                  <span>5 Leased</span>
                  <span>•</span>
                  <span>85% Occupancy</span>
                </div>
              </div>
              <div className="p-1">
                <button
                  onClick={() => setIsPropertyDropdownOpen(false)}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-[#A6A8B4] hover:bg-white/[0.04] hover:text-white transition-colors"
                >
                  Manage Portfolio Settings →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live System Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#12141A] border border-white/[0.05] text-[10px] font-mono text-[#8E909B]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400/90 font-medium">AI OPERATIONS LIVE</span>
        </div>
      </div>

      {/* Center: Minimal Command Search */}
      <div className="flex-1 max-w-md mx-6 relative">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#686B76]" />
          <input
            ref={searchInputRef}
            type="text"
            value={globalSearchQuery}
            onChange={(e) => {
              setGlobalSearchQuery(e.target.value);
              setIsSearchOpen(e.target.value.length > 0);
            }}
            onFocus={() => setIsSearchOpen(globalSearchQuery.length > 0)}
            placeholder="Search tickets (#1042), offices, tenants, or vendors..."
            className="w-full bg-[#12141A] border border-white/[0.06] rounded-lg pl-9 pr-8 py-1.5 text-xs text-[#ECECEE] placeholder-[#5C5F6D] focus:outline-none focus:border-champagne/40 focus:ring-1 focus:ring-champagne/20 transition-all font-sans"
          />
          {globalSearchQuery ? (
            <button
              onClick={() => {
                setGlobalSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-2.5 top-2 text-[#686B76] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono text-[#5C5F6D] bg-white/[0.03] border border-white/[0.04] hidden md:inline">
              /
            </kbd>
          )}
        </div>

        {/* Search Results Drawer */}
        {isSearchOpen && globalSearchQuery && (
          <div className="absolute left-0 right-0 mt-2 bg-[#14161F] border border-white/[0.08] rounded-xl shadow-luxury p-2 z-50 max-h-80 overflow-y-auto">
            {searchTickets.length === 0 && searchTenants.length === 0 ? (
              <div className="p-4 text-center text-[#686B76] text-xs">
                No matching records for &ldquo;{globalSearchQuery}&rdquo;
              </div>
            ) : (
              <div className="space-y-2">
                {searchTickets.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-mono text-[#686B76] uppercase">
                      Requests
                    </div>
                    {searchTickets.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTicketId(t.id);
                          setActiveTab('ticket-detail');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-champagne font-semibold">{t.ticketNumber}</span>
                          <span className="text-[#ECECEE]">{t.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#8E909B]">Suite {t.unit}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchTenants.length > 0 && (
                  <div>
                    <div className="px-2 py-1 text-[10px] font-mono text-[#686B76] uppercase">
                      Tenants
                    </div>
                    {searchTenants.map(tn => (
                      <button
                        key={tn.id}
                        onClick={() => {
                          setActiveTab('tenants');
                          setIsSearchOpen(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/[0.04] flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
                      >
                        <span className="text-white font-medium">{tn.company}</span>
                        <span className="text-[10px] font-mono text-[#8E909B]">Suite {tn.unit}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Notifications & Manager Profile */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg text-[#8E909B] hover:text-white hover:bg-white/[0.04] transition-colors relative cursor-pointer"
            aria-label="View activity alerts"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-champagne" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#14161F] border border-white/[0.08] rounded-xl shadow-luxury p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.05] text-xs">
                <span className="font-semibold text-white">Operations Activity</span>
                <span className="text-[10px] font-mono text-champagne">3 unread</span>
              </div>
              <div className="divide-y divide-white/[0.04] py-1 max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="py-2.5 px-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white text-xs">{n.title}</span>
                      <span className="text-[10px] font-mono text-[#686B76]">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#8E909B] leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Manager Avatar / Profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.06]">
          <div className="w-7 h-7 rounded-full bg-[#181A24] border border-white/[0.1] text-champagne flex items-center justify-center font-medium text-xs shadow-panel">
            SJ
          </div>
          <div className="hidden lg:block text-left">
            <span className="font-medium text-white text-xs block leading-tight tracking-tight">
              Sarah Jenkins
            </span>
            <span className="text-[10px] text-[#686B76] font-mono block">
              Director of Operations
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
