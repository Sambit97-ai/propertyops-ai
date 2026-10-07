import React, { useState, useEffect } from 'react';
import { 
  Settings2, 
  ShieldCheck, 
  Workflow, 
  Database, 
  Users, 
  Bell, 
  Check, 
  Copy, 
  Save, 
  RotateCcw, 
  RefreshCw, 
  ExternalLink, 
  Table, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Play, 
  FileCode, 
  ShieldAlert, 
  ArrowRight, 
  Clock, 
  Wrench, 
  Bot, 
  Mail 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getSupabaseConfig, saveSupabaseConfig, testSupabaseConnection } from '../services/supabaseClient';
import { n8nWorkflowService, N8nWorkflowResponse } from '../services/n8nWorkflow';
import { VendorNotificationEmailModal } from './VendorNotificationEmailModal';

export const SettingsView: React.FC = () => {
  const { 
    addToast, 
    tickets, 
    properties, 
    tenants, 
    vendors, 
    aiActivity, 
    isSupabaseLive, 
    dbMode, 
    refreshDatabase 
  } = useApp();

  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // Supabase Configuration State
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [connectionTestResult, setConnectionTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
  } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  // n8n Workflow State
  const [n8nUrl, setN8nUrl] = useState('http://localhost:5678/webhook/propertyops-intake');
  const [workflowTestScenario, setWorkflowTestScenario] = useState<'hvac' | 'emergency' | 'novendor'>('hvac');
  const [workflowInputText, setWorkflowInputText] = useState(
    "The AC in Office 402 isn't working and we have clients coming tomorrow."
  );
  const [isExecutingWorkflow, setIsExecutingWorkflow] = useState(false);
  const [workflowResult, setWorkflowResult] = useState<N8nWorkflowResponse | null>(null);
  const [isSettingsEmailModalOpen, setIsSettingsEmailModalOpen] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setSupabaseUrl(config.url);
    setSupabaseKey(config.anonKey);
  }, []);

  const handleCopySqlScript = () => {
    const sqlNotice = `-- Run supabase/setup_complete.sql in your Supabase SQL Editor\n-- File path: supabase/setup_complete.sql`;
    navigator.clipboard.writeText(sqlNotice);
    setCopiedSection('sql');
    setTimeout(() => setCopiedSection(null), 2000);
    addToast('SQL Migration Path Copied', 'Check supabase/setup_complete.sql in your workspace.');
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      addToast('Input Required', 'Please provide both Supabase URL and Anon Key.', 'warning');
      return;
    }

    setIsTesting(true);
    setConnectionTestResult(null);
    const result = await testSupabaseConnection(supabaseUrl, supabaseKey);
    setConnectionTestResult({
      tested: true,
      success: result.success,
      message: result.message,
    });
    setIsTesting(false);

    if (result.success) {
      addToast('Connection Verified', result.message, 'success');
    } else {
      addToast('Connection Failed', result.message, 'error');
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    await refreshDatabase();
    addToast('Supabase Settings Saved', 'Configured credentials stored. Database reloaded.');
  };

  // Download n8n Workflow JSON File
  const handleDownloadN8nWorkflow = () => {
    const jsonStr = n8nWorkflowService.getN8nWorkflowJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'propertyops-ai-automation.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('Workflow Exported', 'Downloaded propertyops-ai-automation.json ready for n8n import.', 'success');
  };

  // Run Workflow Automation Test
  const handleRunWorkflowTest = async () => {
    setIsExecutingWorkflow(true);
    setWorkflowResult(null);
    try {
      let unit = '402';
      if (workflowTestScenario === 'emergency') unit = '109';
      if (workflowTestScenario === 'novendor') unit = '102';

      const res = await n8nWorkflowService.executeWorkflow({
        text: workflowInputText,
        property: 'Orion Business Park',
        unit,
        webhookUrl: n8nUrl,
      });

      setWorkflowResult(res);
      await refreshDatabase();
      addToast('Workflow Completed', `Work order processed with status: ${res.status}`, 'success');
    } catch (err: any) {
      addToast('Workflow Error', err.message || 'Execution failed', 'error');
    } finally {
      setIsExecutingWorkflow(false);
    }
  };

  const handleSelectScenario = (scenario: 'hvac' | 'emergency' | 'novendor') => {
    setWorkflowTestScenario(scenario);
    setWorkflowResult(null);
    if (scenario === 'hvac') {
      setWorkflowInputText("The AC in Office 402 isn't working and we have clients coming tomorrow.");
    } else if (scenario === 'emergency') {
      setWorkflowInputText("Active electrical sparks and smoke smell coming from suite 109 server panel!");
    } else if (scenario === 'novendor') {
      setWorkflowInputText("Custom stained glass solar acoustic baffle in suite 102 fractured.");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] text-xs font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#F4F4F6]">
            Settings &amp; Automation
          </h1>
          <p className="text-xs text-[#8E909B] mt-1">
            Configure Supabase persistence, automation workflows, and operational guardrails
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium ${
            isSupabaseLive 
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
              : 'bg-white/[0.04] border-white/[0.08] text-[#8E909B]'
          }`}>
            <Database className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Mode: {dbMode}</span>
          </div>
        </div>
      </div>

      {/* N8N AUTOMATION WORKFLOW PIPELINE */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 md:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center font-bold text-xs">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-wide uppercase text-[#F4F4F6]">
                  n8n Automation Engine
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 font-medium">
                  17 Steps Configured
                </span>
              </div>
              <p className="text-[11px] text-[#8E909B] mt-0.5">
                Intake parsing, database validation, emergency escalation, and vendor dispatch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadN8nWorkflow}
            className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-[#F4F4F6] rounded-xl text-xs font-medium flex items-center gap-2 transition cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-[#C9A96E]" />
            <span>Export n8n JSON</span>
          </button>
        </div>

        {/* 17-Step Visual DAG Architecture Pipeline */}
        <div className="space-y-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E909B] block">
            End-to-End Workflow Architecture:
          </span>

          <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/[0.06] space-y-4 font-mono text-[11px]">
            {/* Step Sequence Badges */}
            <div className="flex flex-wrap items-center gap-2 leading-relaxed">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">1. Tenant Submits</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">2. Inbound Webhook</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">3. Validate Input</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">4. AI Analysis</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-[#C9A96E]/15 border border-[#C9A96E]/30 text-[#DFCCA3]">5. Extract JSON</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">6. Validate Unit</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">7. Find Tenant</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">8. Priority Triage</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">9. Create Ticket</span>
            </div>

            {/* Branching Logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/[0.06]">
              {/* Emergency Branch */}
              <div className="p-3.5 rounded-xl bg-[#F87171]/10 border border-[#F87171]/20 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-[#F87171]">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>EMERGENCY BRANCH (Rule 7)</span>
                </div>
                <p className="text-[11px] text-[#F87171]/80 font-sans leading-snug">
                  If <code>human_escalation_required = true</code>: Priority set to EMERGENCY. Halts autonomous dispatch and notifies property director immediately.
                </p>
              </div>

              {/* Vendor Matching Branch */}
              <div className="p-3.5 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-[#DFCCA3]">
                  <Wrench className="w-3.5 h-3.5 text-[#C9A96E]" />
                  <span>VENDOR MATCHING BRANCH</span>
                </div>
                <p className="text-[11px] text-[#DFCCA3]/80 font-sans leading-snug">
                  Matches: Trade Category, Service Area, Active, and Availability. Fallback sets status to AWAITING_VENDOR.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.06] leading-relaxed">
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">10. Assign Vendor</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">11. Activity Log</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">12. Vendor Notification</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">13. Tenant Confirmation</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#F4F4F6]">14. Status Update</span>
              <ArrowRight className="w-3 h-3 text-white/20" />
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">15. Return JSON</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Workflow Tester */}
        <div className="p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#F4F4F6] flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-[#C9A96E] fill-current" />
              <span>Simulate Workflow Execution:</span>
            </span>

            {/* Scenario Toggles */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSelectScenario('hvac')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition cursor-pointer ${
                  workflowTestScenario === 'hvac'
                    ? 'bg-[#C9A96E]/20 text-[#DFCCA3] border-[#C9A96E]/40'
                    : 'bg-white/[0.03] text-[#8E909B] hover:text-[#F4F4F6] border-white/[0.06]'
                }`}
              >
                1. Standard (#1042 HVAC)
              </button>
              <button
                type="button"
                onClick={() => handleSelectScenario('emergency')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition cursor-pointer ${
                  workflowTestScenario === 'emergency'
                    ? 'bg-[#F87171]/20 text-[#F87171] border-[#F87171]/40'
                    : 'bg-white/[0.03] text-[#8E909B] hover:text-[#F4F4F6] border-white/[0.06]'
                }`}
              >
                2. Emergency Escalation
              </button>
              <button
                type="button"
                onClick={() => handleSelectScenario('novendor')}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition cursor-pointer ${
                  workflowTestScenario === 'novendor'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/[0.03] text-[#8E909B] hover:text-[#F4F4F6] border-white/[0.06]'
                }`}
              >
                3. No Vendor Match
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              rows={2}
              value={workflowInputText}
              onChange={(e) => setWorkflowInputText(e.target.value)}
              className="w-full bg-[#101217] border border-white/[0.08] rounded-xl p-3 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50 font-sans placeholder-white/30"
            />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-[11px] text-[#8E909B] font-mono">Webhook:</span>
                <input
                  type="text"
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                  className="flex-1 bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2 text-[11px] font-mono text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>

              <button
                type="button"
                onClick={handleRunWorkflowTest}
                disabled={isExecutingWorkflow || !workflowInputText.trim()}
                className="px-5 py-2.5 bg-[#C9A96E] hover:bg-[#DFCCA3] disabled:opacity-40 text-[#090A0D] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#C9A96E]/20 shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isExecutingWorkflow ? 'Executing...' : 'Execute Automation'}</span>
              </button>
            </div>
          </div>

          {/* Workflow Execution Result */}
          {workflowResult && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-md text-xs font-semibold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  WORKFLOW COMPLETED
                </span>
                <span className="text-[11px] font-mono text-[#8E909B]">
                  Duration: {workflowResult.duration_ms}ms
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                <div className="lg:col-span-6 space-y-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E909B] block">
                    Returned Schema:
                  </span>
                  <pre className="p-4 bg-[#090A0D] text-emerald-400 rounded-xl text-[11px] font-mono overflow-x-auto border border-white/[0.08] leading-relaxed">
{JSON.stringify({
  ticket_id: workflowResult.ticket_id,
  status: workflowResult.status,
  category: workflowResult.category,
  priority: workflowResult.priority,
  ai_summary: workflowResult.ai_summary,
  vendor: workflowResult.vendor,
  tenant_message: workflowResult.tenant_message
}, null, 2)}
                  </pre>
                </div>

                <div className="lg:col-span-6 space-y-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#8E909B] block">
                    Execution Node Trace ({workflowResult.steps.length} Steps):
                  </span>
                  <div className="max-h-56 overflow-y-auto bg-[#090A0D] border border-white/[0.08] rounded-xl p-3 space-y-2 text-[11px]">
                    {workflowResult.steps.map((st, i) => (
                      <div key={i} className="flex items-start justify-between gap-2 border-b border-white/[0.04] pb-2 last:border-0 last:pb-0">
                        <div className="space-y-0.5">
                          <span className="font-medium text-[#F4F4F6] block">{st.name}</span>
                          <span className="text-[10px] text-[#8E909B] block">{st.details}</span>
                        </div>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Database & Supabase Persistence Engine */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 md:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 text-[#C9A96E]" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-[#F4F4F6]">Cloud Database Settings</h2>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-white/[0.04] text-[#8E909B] border border-white/[0.06]">
            PostgreSQL &bull; 7 Tables
          </span>
        </div>

        {/* Database Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-[#8E909B] font-mono block">properties</span>
            <span className="text-base font-medium text-[#F4F4F6] font-mono mt-0.5 block">{properties.length}</span>
            <span className="text-[10px] text-white/30 block">Commercial</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-[#8E909B] font-mono block">units</span>
            <span className="text-base font-medium text-[#F4F4F6] font-mono mt-0.5 block">10</span>
            <span className="text-[10px] text-white/30 block">Suites</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-[#8E909B] font-mono block">tenants</span>
            <span className="text-base font-medium text-[#F4F4F6] font-mono mt-0.5 block">{tenants.length}</span>
            <span className="text-[10px] text-white/30 block">Leases</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-[#8E909B] font-mono block">vendors</span>
            <span className="text-base font-medium text-[#F4F4F6] font-mono mt-0.5 block">{vendors.length}</span>
            <span className="text-[10px] text-white/30 block">Contractors</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-[#8E909B] font-mono block">tickets</span>
            <span className="text-base font-medium text-[#F4F4F6] font-mono mt-0.5 block">{tickets.length}</span>
            <span className="text-[10px] text-white/30 block">Work Orders</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-[#8E909B] font-mono block">messages</span>
            <span className="text-base font-medium text-[#F4F4F6] font-mono mt-0.5 block">14</span>
            <span className="text-[10px] text-white/30 block">Logs</span>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[10px] text-[#8E909B] font-mono block">activity</span>
            <span className="text-base font-medium text-[#F4F4F6] font-mono mt-0.5 block">{aiActivity.length}</span>
            <span className="text-[10px] text-white/30 block">Audit Logs</span>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSaveCredentials} className="pt-3 border-t border-white/[0.06] space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#8E909B] block mb-1.5 font-medium">
                Supabase URL (VITE_SUPABASE_URL):
              </label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
              />
            </div>

            <div>
              <label className="text-[#8E909B] block mb-1.5 font-medium">
                Supabase Anon Key (VITE_SUPABASE_ANON_KEY):
              </label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl px-3.5 py-2.5 font-mono text-[11px] text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
              />
            </div>
          </div>

          {/* Connection Test Result */}
          {connectionTestResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
              connectionTestResult.success 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                : 'bg-[#F87171]/10 text-[#F87171] border-[#F87171]/25'
            }`}>
              {connectionTestResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{connectionTestResult.message}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-[#F4F4F6] rounded-xl font-medium cursor-pointer transition disabled:opacity-40"
              >
                {isTesting ? 'Testing...' : 'Test Ping'}
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] rounded-xl font-semibold cursor-pointer transition shadow-lg shadow-[#C9A96E]/20"
              >
                Save Settings
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopySqlScript}
              className="px-3.5 py-2 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] text-[#8E909B] hover:text-[#F4F4F6] text-xs font-medium flex items-center gap-2 transition cursor-pointer"
            >
              {copiedSection === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy SQL Setup Path</span>
            </button>
          </div>
        </form>
      </div>

      {/* Operations Team Directory */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 md:p-7 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <Users className="w-4 h-4 text-[#C9A96E]" />
            <h3 className="font-semibold uppercase tracking-wider text-[#F4F4F6]">Property Operations Roster</h3>
          </div>
          <span className="text-[11px] text-[#8E909B]">Sarah Jenkins &bull; Senior Director</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-medium text-[#F4F4F6]">Sarah Jenkins</span>
              <span className="text-[#8E909B] ml-2">&bull; Senior Property Operations Director</span>
            </div>
            <span className="font-mono text-[#8E909B] text-[11px]">sjenkins@orionmanagement.com</span>
          </div>
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-medium text-[#F4F4F6]">Robert Lang</span>
              <span className="text-[#8E909B] ml-2">&bull; Facilities Operations Manager</span>
            </div>
            <span className="font-mono text-[#8E909B] text-[11px]">rlang@orionmanagement.com</span>
          </div>
        </div>
      </div>
    </div>
  );
};
