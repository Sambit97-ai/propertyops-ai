import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  Send, 
  RotateCcw, 
  ArrowLeft, 
  TicketCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  Phone 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TenantChatView: React.FC = () => {
  const { 
    tenantChatMessages, 
    sendTenantChatMessage, 
    resetTenantChat, 
    isTenantChatLoading,
    setActiveTab, 
    setSelectedTicketId 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isSimulatedError, setIsSimulatedError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tenantChatMessages, isTenantChatLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTenantChatLoading) return;

    if (isSimulatedError) {
      return;
    }

    sendTenantChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#090A0D] flex flex-col justify-between py-6 px-4 sm:px-6 text-xs text-[#F4F4F6] font-sans antialiased">
      {/* Top Breadcrumb Bar */}
      <div className="max-w-2xl mx-auto w-full mb-3 flex items-center justify-between text-[#8E909B]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-1.5 font-medium text-[#8E909B] hover:text-[#F4F4F6] transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </button>

        <span className="font-mono text-[11px] text-white/30 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/[0.06]">
          Orion Business Park &bull; Suite 402
        </span>
      </div>

      {/* Main Tenant Portal Card */}
      <div className="max-w-2xl mx-auto w-full bg-[#101217] rounded-2xl shadow-2xl border border-white/[0.08] overflow-hidden flex flex-col h-[620px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.06] bg-[#14161F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[#C9A96E] text-base">✦</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-medium text-[#F4F4F6] text-sm leading-none">
                  PropertyOps AI
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <p className="text-[11px] text-[#8E909B] mt-1">
                Orion Business Park &bull; Facilities Operations Desk
              </p>
            </div>
          </div>

          <button
            onClick={resetTenantChat}
            title="Reset conversation to core demo scenario"
            className="px-3 py-1.5 text-[#8E909B] hover:text-[#F4F4F6] rounded-xl border border-white/[0.08] hover:bg-white/[0.04] transition cursor-pointer text-[11px] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3 text-[#C9A96E]" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#090A0D]">
          <div className="text-center my-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#DFCCA3] bg-[#C9A96E]/10 px-2.5 py-1 rounded-md border border-[#C9A96E]/20">
              Commercial Leaseholder Session &bull; Suite 402
            </span>
          </div>

          {/* Messages */}
          {tenantChatMessages.map((msg) => {
            const isTenant = msg.sender === 'tenant';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isTenant ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-white/30 font-mono">
                  <span>{isTenant ? 'You (ABC Consulting)' : 'Property Operations Assistant'}</span>
                  <span>&bull;</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isTenant
                      ? 'bg-[#C9A96E] text-[#090A0D] font-medium shadow-md shadow-[#C9A96E]/15'
                      : 'bg-[#12141C] text-[#F4F4F6] border border-white/[0.08]'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Work Order Created Badge */}
                  {msg.ticketNumber && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-3 text-[11px]">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-medium font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Work Order: {msg.ticketNumber}</span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedTicketId(msg.ticketNumber || 't-1042');
                          setActiveTab('ticket-detail');
                        }}
                        className="text-[#DFCCA3] hover:underline font-medium flex items-center gap-1 cursor-pointer text-[11px]"
                      >
                        <span>Inspect Ticket</span>
                        <ExternalLink className="w-3 h-3 text-[#C9A96E]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Realistic Loading State */}
          {isTenantChatLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-white/30 font-mono">
                <span>Property Operations Assistant</span>
                <span>&bull;</span>
                <span>Analyzing request...</span>
              </div>
              <div className="bg-[#12141C] border border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs text-[#8E909B] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
                <span className="text-[11px] font-mono text-[#8E909B]">Grounding trade category & matching contractor...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Test Chips */}
        <div className="px-5 py-2.5 bg-[#101217] border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-white/30 shrink-0 font-medium text-[10px] uppercase tracking-wider">Test prompts:</span>
          <button
            onClick={() => handleQuickPrompt("Hi, the AC in Office 402 isn't working. We have clients coming tomorrow.")}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#8E909B] hover:text-[#F4F4F6] shrink-0 cursor-pointer"
          >
            "Hi, the AC in Office 402 isn't working..."
          </button>
          <button
            onClick={() => handleQuickPrompt("There is a water leak under the kitchenette sink in 109.")}
            className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-[#8E909B] hover:text-[#F4F4F6] shrink-0 cursor-pointer"
          >
            "Water leak under sink in 109..."
          </button>
        </div>

        {/* Message Input Bar */}
        <div className="p-4 bg-[#14161F] border-t border-white/[0.06]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Describe maintenance issue in natural language..."
              disabled={isTenantChatLoading}
              className="flex-1 bg-[#101217] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTenantChatLoading}
              className="px-4 py-2.5 bg-[#C9A96E] hover:bg-[#DFCCA3] disabled:opacity-40 text-[#090A0D] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-[#C9A96E]/20"
            >
              <span>Submit</span>
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
