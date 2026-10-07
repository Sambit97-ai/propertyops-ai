import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  Calendar, 
  Download, 
  Filter 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsView: React.FC = () => {
  const { addToast } = useApp();
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const categories = [
    { name: 'HVAC & Climate Control', count: 12, percent: 35, color: 'bg-[#C9A96E]' },
    { name: 'Access Control & Security', count: 8, percent: 24, color: 'bg-blue-400' },
    { name: 'Plumbing & Drainage', count: 7, percent: 21, color: 'bg-emerald-400' },
    { name: 'Elevators & Vertical Transport', count: 4, percent: 12, color: 'bg-amber-400' },
    { name: 'Commercial Electrical', count: 3, percent: 8, color: 'bg-cyan-400' },
  ];

  const vendorPerformance = [
    { name: 'CoolAir Services', jobs: 18, avgResp: '45 mins', slaRate: '99.4%', rating: 4.9 },
    { name: 'AquaFix Maintenance', jobs: 14, avgResp: '35 mins', slaRate: '98.8%', rating: 4.7 },
    { name: 'SecureAccess Solutions', jobs: 11, avgResp: '1h 15m', slaRate: '97.2%', rating: 4.8 },
    { name: 'BrightSpark Electrical', jobs: 8, avgResp: '1h 45m', slaRate: '96.5%', rating: 4.8 },
    { name: 'CleanPro Facilities', jobs: 6, avgResp: '30 mins', slaRate: '100%', rating: 4.9 },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#F4F4F6]">
            Operational Reports
          </h1>
          <p className="text-xs text-[#8E909B] mt-1">
            SLA compliance metrics, resolution velocity, and contractor performance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            aria-label="Report Date Range"
            className="bg-[#101217] border border-white/[0.08] text-xs rounded-xl px-3.5 py-2 text-[#8E909B] focus:outline-none focus:border-[#C9A96E]/50 cursor-pointer"
          >
            <option value="Today" className="bg-[#101217]">Today</option>
            <option value="Last 7 Days" className="bg-[#101217]">Last 7 Days</option>
            <option value="Last 30 Days" className="bg-[#101217]">Last 30 Days</option>
            <option value="Year to Date" className="bg-[#101217]">Year to Date</option>
          </select>

          <button
            onClick={() => addToast('Report Exported', 'CSV summary generated and downloaded.')}
            className="px-3.5 py-2 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-[#F4F4F6] font-medium text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-5 shadow-2xl">
          <span className="text-xs text-[#8E909B] font-medium block uppercase tracking-wider">SLA Compliance</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold font-mono text-emerald-400">98.4%</span>
            <span className="text-[11px] text-emerald-400/80 font-medium">&gt; 95% target</span>
          </div>
          <p className="text-[11px] text-[#8E909B] mt-2">On-time contractor arrivals</p>
        </div>

        <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-5 shadow-2xl">
          <span className="text-xs text-[#8E909B] font-medium block uppercase tracking-wider">Resolution Velocity</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold font-mono text-[#F4F4F6]">1.8 hrs</span>
            <span className="text-[11px] text-[#C9A96E] font-medium">-72% turnaround</span>
          </div>
          <p className="text-[11px] text-[#8E909B] mt-2">Intake to verified completion</p>
        </div>

        <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-5 shadow-2xl">
          <span className="text-xs text-[#8E909B] font-medium block uppercase tracking-wider">Autonomous Triage</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold font-mono text-[#F4F4F6]">89.2%</span>
            <span className="text-[11px] text-[#8E909B]">Grounded</span>
          </div>
          <p className="text-[11px] text-[#8E909B] mt-2">Zero classification errors</p>
        </div>

        <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-5 shadow-2xl">
          <span className="text-xs text-[#8E909B] font-medium block uppercase tracking-wider">Active Portfolio Orders</span>
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-2xl font-semibold font-mono text-[#C9A96E]">24</span>
            <span className="text-[11px] text-[#8E909B]">Total YTD: 248</span>
          </div>
          <p className="text-[11px] text-[#8E909B] mt-2">Orion Business Park &bull; Gurugram</p>
        </div>
      </div>

      {/* Grid: Category Distribution vs Contractor Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-[#F4F4F6]">Requests by Category</h2>
            <p className="text-xs text-[#8E909B] mt-0.5">Distribution across active commercial requests</p>
          </div>

          <div className="space-y-4 pt-2">
            {categories.map((c) => (
              <div key={c.name} className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#8E909B]">
                  <span className="font-medium text-[#F4F4F6]">{c.name}</span>
                  <span className="font-mono text-[#DFCCA3]">{c.count} ({c.percent}%)</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full`} style={{ width: `${c.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contractor Performance Scorecard (7 cols) */}
        <div className="lg:col-span-7 bg-[#101217] border border-white/[0.06] rounded-2xl p-6 shadow-2xl space-y-4">
          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-[#F4F4F6]">Contractor Performance</h2>
            <p className="text-xs text-[#8E909B] mt-0.5">SLA arrival benchmarks and satisfaction ratings</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.06] text-[#8E909B] font-medium uppercase text-[10px] tracking-wider">
                  <th className="py-3">Vendor</th>
                  <th className="py-3">Jobs Completed</th>
                  <th className="py-3">Avg Response</th>
                  <th className="py-3">SLA Rate</th>
                  <th className="py-3 text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {vendorPerformance.map((v) => (
                  <tr key={v.name} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 font-medium text-[#F4F4F6]">{v.name}</td>
                    <td className="py-3.5 font-mono text-[#8E909B]">{v.jobs}</td>
                    <td className="py-3.5 font-mono text-[#F4F4F6]">{v.avgResp}</td>
                    <td className="py-3.5 font-mono text-emerald-400 font-medium">{v.slaRate}</td>
                    <td className="py-3.5 text-right font-mono font-medium text-[#C9A96E]">★ {v.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
