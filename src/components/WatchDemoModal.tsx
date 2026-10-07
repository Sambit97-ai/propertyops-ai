import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  Building2, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Send, 
  FileCheck 
} from 'lucide-react';

interface WatchDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookDemo: () => void;
}

interface DemoStep {
  step: string;
  time: string;
  title: string;
  actor: string;
  detail: string;
  visual: 'intake' | 'ai' | 'ticket' | 'vendor' | 'update';
}

const DEMO_STEPS: DemoStep[] = [
  {
    step: '01',
    time: '00:15',
    title: 'Tenant reports an issue',
    actor: 'Tenant (ABC Consulting)',
    detail: 'Marcus Vance in Office 402 submits maintenance form: "The AC in our office has stopped working and we have clients coming tomorrow."',
    visual: 'intake',
  },
  {
    step: '02',
    time: '00:35',
    title: 'AI understands and prioritizes the request',
    actor: 'PropertyOps AI Engine',
    detail: 'Semantic classification identifies trade domain: HVAC. Evaluates business operational impact (client meetings tomorrow) and assigns HIGH priority with 2-hour contract SLA.',
    visual: 'ai',
  },
  {
    step: '03',
    time: '00:55',
    title: 'A structured maintenance ticket is created',
    actor: 'Operations Database',
    detail: 'Work Order #1042 generated in Supabase with unit mapping (Office 402), lease verification, and deterministic timestamp audit logs. Zero duplicate entries.',
    visual: 'ticket',
  },
  {
    step: '04',
    time: '01:15',
    title: 'The appropriate vendor can be assigned',
    actor: 'Vendor Matching Engine',
    detail: 'CoolAir Services selected based on active HVAC service agreement for Orion Business Park, Gurugram territory, verified insurance, and 45-min average emergency response.',
    visual: 'vendor',
  },
  {
    step: '05',
    time: '01:30',
    title: 'Tenant and property manager receive updates',
    actor: 'Automated Dispatch & Tracking',
    detail: 'CoolAir Services receives electronic work order dispatch. Marcus Vance receives tenant confirmation and live status tracker link. Manager Sarah Jenkins is notified in operations dashboard.',
    visual: 'update',
  },
];

export const WatchDemoModal: React.FC<WatchDemoModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenBookDemo 
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setActiveStepIndex(0);
      setIsPlaying(true);
      return;
    }

    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < DEMO_STEPS.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[activeStepIndex];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090A0D]/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="watch-demo-title"
    >
      <div 
        className="relative w-full max-w-4xl bg-[#12141C] rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden transition-all flex flex-col max-h-[92vh] text-[#F4F4F6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#101217]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 id="watch-demo-title" className="text-sm font-semibold text-[#F4F4F6] tracking-tight">
                90-Second Product Walkthrough
              </h2>
              <p className="text-[11px] text-[#8E909B]">
                From tenant request to assigned contractor &bull; Ticket #1042 scenario
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8E909B] hover:text-[#F4F4F6] rounded-lg hover:bg-white/[0.05] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Progress Ribbon */}
        <div className="bg-[#101217]/50 border-b border-white/[0.06] px-6 py-3 flex items-center justify-between gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-2">
            {DEMO_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setActiveStepIndex(idx);
                  setIsPlaying(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-mono text-[11px] transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  idx === activeStepIndex
                    ? 'bg-[#C9A96E]/20 text-[#DFCCA3] border border-[#C9A96E]/30 font-semibold'
                    : idx < activeStepIndex
                    ? 'bg-white/[0.03] text-emerald-400 border border-white/[0.06]'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                <span>{s.step}</span>
                <span className="hidden sm:inline font-sans">{s.title.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg text-[#8E909B] hover:text-[#F4F4F6] hover:bg-white/[0.05] transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current text-[#C9A96E]" />}
            </button>
            <button
              onClick={() => {
                setActiveStepIndex(0);
                setIsPlaying(true);
              }}
              className="p-1.5 rounded-lg text-[#8E909B] hover:text-[#F4F4F6] hover:bg-white/[0.05] transition"
              title="Restart"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Stage Container */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 bg-[#090A0D]">
          {/* Active Step Details */}
          <div className="bg-[#101217] rounded-2xl border border-white/[0.06] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#C9A96E] font-medium uppercase tracking-wider">
                Step {currentStep.step} of 05 &bull; {currentStep.time}
              </span>
              <span className="text-[11px] font-mono text-[#8E909B]">
                Actor: {currentStep.actor}
              </span>
            </div>

            <h3 className="text-xl font-medium text-[#F4F4F6]">
              {currentStep.title}
            </h3>

            <p className="text-xs text-[#8E909B] leading-relaxed">
              {currentStep.detail}
            </p>
          </div>

          {/* Dynamic Mockup Card based on visual stage */}
          <div className="bg-[#12141C] rounded-2xl border border-white/[0.08] p-6 shadow-2xl">
            {currentStep.visual === 'intake' && (
              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between items-center text-[#8E909B] border-b border-white/[0.06] pb-2">
                  <span className="font-medium text-[#F4F4F6]">Inbound Tenant Portal Form</span>
                  <span className="font-mono text-[10px]">10:02 AM</span>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                  <span className="text-[10px] text-[#8E909B] block uppercase">Tenant</span>
                  <span className="font-medium text-[#F4F4F6]">ABC Consulting &bull; Office 402</span>
                </div>
                <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05] text-[#F4F4F6] italic">
                  "The AC in our office has stopped working and we have clients coming tomorrow."
                </div>
              </div>
            )}

            {currentStep.visual === 'ai' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-[#8E909B] border-b border-white/[0.06] pb-2">
                  <span className="font-medium text-[#C9A96E]">AI Triage Engine Extraction</span>
                  <span className="font-mono text-[10px]">10:02 AM</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                    <span className="text-[10px] text-[#8E909B] block uppercase">Trade Category</span>
                    <span className="font-medium text-[#F4F4F6]">HVAC / Air Conditioning</span>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.05]">
                    <span className="text-[10px] text-[#8E909B] block uppercase">Urgency Score</span>
                    <span className="font-medium text-[#F87171] font-mono">HIGH (Client arrival)</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep.visual === 'ticket' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-[#8E909B] border-b border-white/[0.06] pb-2">
                  <span className="font-medium text-[#F4F4F6]">Database Record Synchronized</span>
                  <span className="font-mono text-[10px]">Ticket #1042</span>
                </div>
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] space-y-1 font-mono text-[11px]">
                  <div className="text-[#8E909B]">Status: <span className="text-emerald-400 font-medium">OPEN</span></div>
                  <div className="text-[#8E909B]">Property: <span className="text-[#F4F4F6]">Orion Business Park</span></div>
                  <div className="text-[#8E909B]">Unit: <span className="text-[#F4F4F6]">402</span></div>
                </div>
              </div>
            )}

            {currentStep.visual === 'vendor' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-[#8E909B] border-b border-white/[0.06] pb-2">
                  <span className="font-medium text-[#F4F4F6]">Contracted Vendor Matched</span>
                  <span className="font-mono text-[10px]">10:03 AM</span>
                </div>
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] space-y-1">
                  <div className="font-medium text-sm text-[#F4F4F6]">CoolAir Services</div>
                  <div className="text-[11px] text-[#8E909B]">HVAC &bull; Gurugram Territory &bull; Active COI Verified &bull; Available</div>
                </div>
              </div>
            )}

            {currentStep.visual === 'update' && (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-[#8E909B] border-b border-white/[0.06] pb-2">
                  <span className="font-medium text-[#F4F4F6]">Notifications Dispatched</span>
                  <span className="font-mono text-[10px]">10:03 AM</span>
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Vendor electronic dispatch transmitted</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Tenant tracking link delivered</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#101217] px-6 py-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenBookDemo();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold text-xs transition cursor-pointer shadow-lg shadow-[#C9A96E]/20"
          >
            Book a Live 15-Minute Demo
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#8E909B] hover:text-[#F4F4F6] hover:bg-white/[0.04] transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
