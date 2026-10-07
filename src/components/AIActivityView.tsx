import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  Filter, 
  Bot, 
  Play, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  FileCode, 
  ShieldAlert, 
  Info 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { aiIntakeService } from '../services/aiIntake';
import { AIIntakeResult } from '../types';

export const AIActivityView: React.FC = () => {
  const { aiActivity, setSelectedTicketId, setActiveTab } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // AI Intake Inspector State
  const [testInputText, setTestInputText] = useState(
    "The AC in Office 402 isn't working and we have clients coming tomorrow."
  );
  const [isProcessingIntake, setIsProcessingIntake] = useState(false);
  const [intakeResult, setIntakeResult] = useState<AIIntakeResult | null>(null);

  // Quick Preset Scenarios for reviewer testing
  const presetScenarios = [
    {
      label: 'Standard Request (Specification Example)',
      text: "The AC in Office 402 isn't working and we have clients coming tomorrow.",
    },
    {
      label: 'Life-Safety / Emergency Escalation',
      text: "Active electrical sparks and smoke smell coming from suite 109 server panel!",
    },
    {
      label: 'Missing Unit (Rule 6: Clarification)',
      text: "The plumbing in our breakroom has sprung a leak on the floor.",
    },
    {
      label: 'Invalid Property (Rule 1: Reject Foreign)',
      text: "Broken keycard scanner in Office 218 at Empire State Tower.",
    },
  ];

  const handleRunIntakeTest = async () => {
    setIsProcessingIntake(true);
    try {
      const result = await aiIntakeService.processRequest(testInputText);
      setIntakeResult(result);
    } catch (err: any) {
      console.error('Intake test failed:', err);
    } finally {
      setIsProcessingIntake(false);
    }
  };

  const filteredActivity = aiActivity.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      item.action.toLowerCase().includes(q) ||
      item.details.toLowerCase().includes(q) ||
      (item.ticketNumber && item.ticketNumber.toLowerCase().includes(q));

    const matchesCategory = 
      categoryFilter === 'ALL' ||
      item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 text-[#F4F4F6] text-xs font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-medium tracking-tight text-[#F4F4F6]">
            AI Operations &amp; Intake
          </h1>
          <p className="text-xs text-[#8E909B] mt-1">
            Autonomous triage parsing, JSON schema validation, and chronological governance trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#DFCCA3] text-xs font-medium">
            <span className="text-[#C9A96E]">✦</span>
            <span>Grounding Guardrails Active</span>
          </div>
        </div>
      </div>

      {/* AI INTAKE LAYER INSPECTOR */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-6 md:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.06] gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-[#C9A96E] text-base">✦</span>
            <div>
              <h2 className="text-sm font-semibold tracking-wide uppercase text-[#F4F4F6]">
                AI Intake Layer &bull; Live Inspector &amp; JSON Validator
              </h2>
              <p className="text-[11px] text-[#8E909B] mt-0.5">
                Deterministic extraction, database grounding, and structured JSON output
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20 self-start sm:self-center">
            Zero Hallucination Grounding
          </span>
        </div>

        {/* Preset Buttons */}
        <div>
          <label className="text-[11px] font-medium text-[#8E909B] block mb-2">
            Select Preset Test Scenarios:
          </label>
          <div className="flex flex-wrap gap-2">
            {presetScenarios.map((scenario, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTestInputText(scenario.text);
                  setIntakeResult(null);
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] border transition cursor-pointer ${
                  testInputText === scenario.text
                    ? 'bg-[#C9A96E]/20 text-[#DFCCA3] border-[#C9A96E]/40 font-medium'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] text-[#8E909B] hover:text-[#F4F4F6] border-white/[0.06]'
                }`}
              >
                {scenario.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea & Process Button */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[11px]">
            <label className="font-medium text-[#8E909B]">
              Tenant Maintenance Request Input:
            </label>
            <span className="text-white/30">Natural language text</span>
          </div>

          <div className="relative">
            <textarea
              rows={3}
              value={testInputText}
              onChange={(e) => setTestInputText(e.target.value)}
              placeholder="Enter tenant request text..."
              className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl p-3.5 text-xs text-[#F4F4F6] font-sans focus:outline-none focus:border-[#C9A96E]/50 leading-relaxed placeholder-white/30 transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-[#8E909B]">
              Press "Process with AI Intake" to extract grounded entities and validate JSON
            </span>

            <button
              type="button"
              onClick={handleRunIntakeTest}
              disabled={!testInputText.trim() || isProcessingIntake}
              className="px-5 py-2.5 bg-[#C9A96E] hover:bg-[#DFCCA3] disabled:opacity-40 text-[#090A0D] rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#C9A96E]/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isProcessingIntake ? 'Processing...' : 'Process with AI Intake'}</span>
            </button>
          </div>
        </div>

        {/* Execution Output Display */}
        {intakeResult && (
          <div className="pt-4 border-t border-white/[0.06] space-y-4">
            {/* Status Header */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                {intakeResult.success ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    STATUS: JSON VALIDATED &amp; GROUNDED
                  </span>
                ) : intakeResult.clarification_needed ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    STATUS: CLARIFICATION REQUIRED (RULE 6)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold font-mono bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/25">
                    <AlertCircle className="w-3.5 h-3.5 text-[#F87171]" />
                    STATUS: VALIDATION REJECTED
                  </span>
                )}

                {intakeResult.safety_escalation && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold font-mono bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/30 animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#F87171]" />
                    SAFETY ESCALATION (RULE 7)
                  </span>
                )}
              </div>

              <span className="text-[11px] font-mono text-[#8E909B]">
                Engine: Deterministic Grounding
              </span>
            </div>

            {/* Clarification Box (Rule 6) */}
            {intakeResult.clarification_needed && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200 space-y-2">
                <div className="flex items-center gap-2 font-medium text-xs text-amber-300">
                  <Info className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Rule 6 Enforced: Missing Information &ndash; Clarification Prompt Generated</span>
                </div>
                <p className="text-xs leading-relaxed text-[#F4F4F6] font-normal">
                  "{intakeResult.clarification_prompt}"
                </p>
                <div className="text-[11px] font-mono text-amber-400/80">
                  Missing Fields: {intakeResult.missing_fields.join(', ')}
                </div>
              </div>
            )}

            {/* Safety Guidance Box (Rule 8) */}
            {intakeResult.safety_guidance && (
              <div className="p-4 rounded-xl bg-[#F87171]/10 border border-[#F87171]/25 text-[#F87171] space-y-1.5">
                <div className="flex items-center gap-2 font-medium text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Rule 8 Enforced: Application Approved Safety Guidance</span>
                </div>
                <p className="text-xs leading-relaxed text-[#F4F4F6]">
                  {intakeResult.safety_guidance}
                </p>
              </div>
            )}

            {/* Extracted Structured JSON */}
            {intakeResult.data && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left: JSON Code Block */}
                <div className="lg:col-span-7 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold uppercase tracking-wider text-[#8E909B] flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-[#C9A96E]" />
                      Extracted Structured JSON (Validated)
                    </span>
                    <span className="text-[10px] font-mono text-white/30">application/json</span>
                  </div>

                  <pre className="p-4 bg-[#090A0D] text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto border border-white/[0.08] shadow-inner leading-relaxed">
                    {JSON.stringify(intakeResult.data, null, 2)}
                  </pre>
                </div>

                {/* Right: Field-by-Field Breakdown */}
                <div className="lg:col-span-5 space-y-2.5">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#8E909B]">
                    Field-by-Field Grounding Matrix
                  </div>

                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-2.5 divide-y divide-white/[0.05] text-xs">
                    <div className="flex justify-between items-center pt-1 first:pt-0">
                      <span className="text-[#8E909B]">property:</span>
                      <span className="font-medium text-[#F4F4F6]">{intakeResult.data.property}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[#8E909B]">unit:</span>
                      <span className="font-medium text-[#F4F4F6] font-mono">Office {intakeResult.data.unit}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[#8E909B]">category:</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium font-mono bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20">
                        {intakeResult.data.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[#8E909B]">priority:</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium font-mono ${
                        intakeResult.data.priority === 'EMERGENCY'
                          ? 'bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/30'
                          : intakeResult.data.priority === 'HIGH'
                            ? 'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20'
                            : 'bg-white/[0.04] text-[#8E909B] border border-white/[0.08]'
                      }`}>
                        {intakeResult.data.priority}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[#8E909B]">vendor_required:</span>
                      <span className="font-mono font-medium text-emerald-400">
                        {String(intakeResult.data.vendor_required)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-[#8E909B]">human_escalation_required:</span>
                      <span className={`font-mono font-medium ${
                        intakeResult.data.human_escalation_required ? 'text-[#F87171]' : 'text-[#8E909B]'
                      }`}>
                        {String(intakeResult.data.human_escalation_required)}
                      </span>
                    </div>

                    <div className="pt-2 text-[11px]">
                      <span className="text-[#8E909B] block mb-1">ai_summary:</span>
                      <p className="text-[#F4F4F6] italic bg-[#090A0D] p-3 rounded-lg border border-white/[0.06] leading-snug">
                        "{intakeResult.data.ai_summary}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search for Audit Logs */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit actions (e.g. #1042, HVAC, CoolAir)..."
            className="w-full bg-[#12141C] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50 transition"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter Action Type"
          className="bg-[#12141C] border border-white/[0.08] text-xs rounded-xl px-3 py-2 text-[#8E909B] focus:outline-none focus:border-[#C9A96E]/50 cursor-pointer"
        >
          <option value="ALL" className="bg-[#101217]">All Action Types</option>
          <option value="Classification" className="bg-[#101217]">Classification</option>
          <option value="Priority" className="bg-[#101217]">Priority</option>
          <option value="Vendor Matching" className="bg-[#101217]">Vendor Matching</option>
          <option value="Response Generation" className="bg-[#101217]">Response Generation</option>
          <option value="Human Approval" className="bg-[#101217]">Human Approval</option>
          <option value="Safety" className="bg-[#101217]">Safety &amp; Life-Safety</option>
        </select>
      </div>

      {/* Chronological Audit Log List */}
      <div className="bg-[#101217] border border-white/[0.06] rounded-2xl shadow-2xl p-6 md:p-7 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] text-xs text-[#8E909B]">
          <span className="font-medium text-[#F4F4F6]">Chronological Audit Log</span>
          <span>{filteredActivity.length} events recorded</span>
        </div>

        <div className="relative border-l border-white/[0.08] ml-3.5 pl-6 space-y-6">
          {filteredActivity.map((item) => (
            <div key={item.id} className="relative text-xs group">
              <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#C9A96E] bg-[#101217] group-hover:bg-[#C9A96E] transition" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#F4F4F6]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm text-[#F4F4F6]">
                    {item.action}
                  </span>
                  {item.ticketNumber && (
                    <button
                      onClick={() => {
                        setSelectedTicketId(item.ticketNumber!);
                        setActiveTab('ticket-detail');
                      }}
                      className="font-mono text-[11px] font-medium text-[#DFCCA3] bg-[#C9A96E]/10 hover:bg-[#C9A96E]/20 px-2 py-0.5 rounded border border-[#C9A96E]/25 cursor-pointer transition"
                    >
                      {item.ticketNumber}
                    </button>
                  )}
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/[0.04] text-[#8E909B] border border-white/[0.06]">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[#8E909B] font-mono text-[11px]">
                  <Clock className="w-3 h-3 text-white/30" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              <p className="text-[#8E909B] text-xs mt-1 leading-relaxed">
                {item.details}
              </p>

              {item.confidence && (
                <div className="mt-1.5 text-[10px] font-mono text-white/40 flex items-center gap-2">
                  <span>Confidence: {Math.round(item.confidence * 100)}%</span>
                  <span>&bull;</span>
                  <span>Grounding: Lease Matrix Verified</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
