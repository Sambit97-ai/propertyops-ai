import React from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  Building2, 
  Wrench, 
  Sparkles, 
  Settings2,
  ChevronRight,
  ExternalLink,
  Circle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, tickets } = useApp();

  const openTicketsCount = tickets.filter(
    t => t.status !== 'Resolved' && t.status !== 'RESOLVED' && t.status !== 'CLOSED'
  ).length;

  const attentionTicketsCount = tickets.filter(
    t => (t.priority === 'HIGH' || t.priority === 'CRITICAL') && 
         t.status !== 'Resolved' && t.status !== 'RESOLVED'
  ).length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { 
      id: 'tickets', 
      label: 'Requests', 
      icon: Inbox, 
      count: openTicketsCount, 
      hasUrgent: attentionTicketsCount > 0 
    },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'vendors', label: 'Vendors', icon: Wrench },
    { id: 'activity', label: 'AI Activity', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings2 },
  ];

  return (
    <aside className="w-60 bg-[#0C0D11] border-r border-white/[0.06] flex flex-col justify-between shrink-0 select-none text-xs">
      {/* Top Brand Identity */}
      <div>
        <div className="p-5 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#14161F] border border-white/[0.08] flex items-center justify-center text-champagne shadow-panel">
              <span className="text-sm font-semibold tracking-tighter text-champagne">✦</span>
            </div>
            <div>
              <span className="font-semibold text-white text-xs tracking-tight block">
                PropertyOps AI
              </span>
              <span className="text-[10px] text-[#8E909B] font-mono tracking-wider uppercase block mt-0.5">
                Commercial
              </span>
            </div>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 shadow-[0_0_6px_rgba(52,211,153,0.6)]" title="AI Operations Active" />
        </div>

        {/* Minimal Nav List */}
        <nav className="p-3 space-y-1">
          <div className="px-3 pt-3 pb-2 text-[10px] font-mono tracking-wider text-[#686B76] uppercase">
            Platform
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer group ${
                  isActive
                    ? 'bg-[#181922] text-white border border-white/[0.08] shadow-panel'
                    : 'text-[#8E909B] hover:text-[#ECECEE] hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-champagne' : 'text-[#686B76] group-hover:text-[#A1A3AF]'
                  }`} />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                    isActive 
                      ? 'bg-champagne/15 text-champagne border border-champagne/25'
                      : 'bg-white/[0.05] text-[#8E909B] border border-white/[0.04]'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Context Switcher */}
      <div className="p-3 border-t border-white/[0.05] space-y-2 bg-[#090A0D]/50">
        <div className="p-3 rounded-xl bg-[#12141A] border border-white/[0.05] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#8E909B]">
            <span className="font-mono tracking-wider uppercase">Portal Link</span>
            <span className="text-champagne font-mono font-medium">LIVE</span>
          </div>

          <p className="text-[11px] text-[#A6A8B4] leading-snug font-normal">
            Natural-language request intake for commercial occupants.
          </p>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') window.history.pushState({}, '', '/request');
              setActiveTab('tenant-portal');
            }}
            className="w-full py-2 px-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.08] text-white text-[11px] font-medium transition-colors flex items-center justify-between border border-white/[0.06] cursor-pointer group"
          >
            <span>Open Tenant View</span>
            <ChevronRight className="w-3.5 h-3.5 text-champagne group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <button
          onClick={() => {
            if (typeof window !== 'undefined') window.history.pushState({}, '', '/landing');
            setActiveTab('landing');
          }}
          className="w-full py-1.5 px-3 rounded-lg text-[11px] text-[#787B87] hover:text-[#D1D3DC] hover:bg-white/[0.02] flex items-center justify-between transition-colors cursor-pointer"
        >
          <span>Public Presentation</span>
          <ExternalLink className="w-3 h-3 text-[#606370]" />
        </button>
      </div>
    </aside>
  );
};
