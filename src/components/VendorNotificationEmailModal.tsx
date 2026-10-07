import React, { useState } from 'react';
import { 
  Mail, 
  Copy, 
  Check, 
  X, 
  Send, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  FileText, 
  Code 
} from 'lucide-react';
import { 
  generateVendorNotificationEmail, 
  VendorNotificationEmailParams 
} from '../services/vendorNotificationService';

interface VendorNotificationEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  params?: Partial<VendorNotificationEmailParams>;
  onResend?: () => void;
}

export const VendorNotificationEmailModal: React.FC<VendorNotificationEmailModalProps> = ({
  isOpen,
  onClose,
  params,
  onResend,
}) => {
  const [activeView, setActiveView] = useState<'formatted' | 'plaintext' | 'html'>('formatted');
  const [copied, setCopied] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  if (!isOpen) return null;

  const emailData = generateVendorNotificationEmail(params);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(emailData.bodyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      if (onResend) onResend();
      setTimeout(() => setResendSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#090A0D]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="bg-[#12141C] rounded-2xl border border-white/[0.08] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col my-auto max-h-[92vh] text-[#F4F4F6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="bg-[#101217] px-6 py-4 flex items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 flex items-center justify-center text-[#C9A96E]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-[#F4F4F6]">Automated Vendor Notification</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20">
                  Automated Dispatch
                </span>
              </div>
              <p className="text-[11px] text-[#8E909B] mt-0.5">
                Triggered upon ticket creation & contractor matching
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-7 h-7 rounded-lg hover:bg-white/[0.05] flex items-center justify-center text-[#8E909B] hover:text-[#F4F4F6] transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher & Action Ribbon */}
        <div className="bg-[#101217]/50 border-b border-white/[0.06] px-6 py-3 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="inline-flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setActiveView('formatted')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'formatted'
                  ? 'bg-[#C9A96E]/15 text-[#DFCCA3] border border-[#C9A96E]/25'
                  : 'text-[#8E909B] hover:text-[#F4F4F6]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('plaintext')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'plaintext'
                  ? 'bg-[#C9A96E]/15 text-[#DFCCA3] border border-[#C9A96E]/25'
                  : 'text-[#8E909B] hover:text-[#F4F4F6]'
              }`}
            >
              <span>Plain Text</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('html')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'html'
                  ? 'bg-[#C9A96E]/15 text-[#DFCCA3] border border-[#C9A96E]/25'
                  : 'text-[#8E909B] hover:text-[#F4F4F6]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML Source</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className={`px-3 py-1.5 rounded-xl border font-medium text-xs flex items-center gap-1.5 transition cursor-pointer ${
                copied 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-white/[0.04] text-[#8E909B] border-white/[0.08] hover:text-[#F4F4F6] hover:bg-white/[0.08]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied Text</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#8E909B]" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className={`px-3.5 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition cursor-pointer ${
                resendSuccess
                  ? 'bg-emerald-500 text-[#090A0D]'
                  : 'bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D]'
              }`}
            >
              {isResending ? (
                <span>Sending...</span>
              ) : resendSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Resend Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Email Envelope Header */}
        <div className="p-5 bg-white/[0.02] border-b border-white/[0.06] text-xs space-y-2.5">
          <div className="grid grid-cols-[70px_1fr] items-center gap-3">
            <span className="font-medium text-[#8E909B] text-right">From:</span>
            <div className="font-mono text-[#F4F4F6] bg-[#101217] px-3 py-1.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
              <span>{emailData.from}</span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium uppercase">
                Verified Sender
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[70px_1fr] items-center gap-3">
            <span className="font-medium text-[#8E909B] text-right">To:</span>
            <div className="font-mono text-[#F4F4F6] bg-[#101217] px-3 py-1.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
              <span>{emailData.metadata.vendorName} &lt;{emailData.to}&gt;</span>
              <span className="text-[10px] font-sans px-2 py-0.5 rounded bg-[#C9A96E]/10 text-[#DFCCA3] border border-[#C9A96E]/20 font-medium uppercase">
                Contracted Vendor
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[70px_1fr] items-center gap-3">
            <span className="font-medium text-[#8E909B] text-right">Subject:</span>
            <div className="font-medium text-[#F4F4F6] bg-[#101217] px-3 py-1.5 rounded-xl border border-white/[0.06] flex items-center justify-between">
              <span>{emailData.subject}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-medium uppercase bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/25">
                {emailData.metadata.priority} PRIORITY
              </span>
            </div>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#090A0D] text-xs">
          {activeView === 'formatted' && (
            <div className="max-w-xl mx-auto border border-white/[0.08] rounded-2xl overflow-hidden bg-[#101217]">
              {/* Internal Mock Header */}
              <div className="bg-[#14161F] p-5 border-b border-white/[0.06]">
                <div className="text-[10px] font-mono tracking-widest text-[#C9A96E] uppercase mb-1">
                  PropertyOps AI &bull; Commercial Dispatch
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-[#F4F4F6]">
                    {emailData.metadata.ticketNumber} &bull; {emailData.metadata.property}
                  </h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F87171]/15 text-[#F87171] uppercase tracking-wider border border-[#F87171]/25">
                    {emailData.metadata.priority} PRIORITY
                  </span>
                </div>
              </div>

              {/* Rendered Email Body */}
              <div className="p-6 space-y-4 text-[#8E909B] leading-relaxed font-sans text-xs">
                <p className="font-medium text-sm text-[#F4F4F6]">
                  Hello {emailData.metadata.vendorName},
                </p>

                <p className="text-[#8E909B]">
                  A new {emailData.metadata.serviceCategory} maintenance request has been assigned to your team.
                </p>

                {/* Structured Fields Block */}
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-2.5 font-mono text-[11px]">
                  <div>
                    <span className="text-[#8E909B] font-sans block text-[10px] uppercase tracking-wider">Ticket:</span>
                    <span className="text-[#F4F4F6] font-medium">{emailData.metadata.ticketNumber}</span>
                  </div>

                  <div>
                    <span className="text-[#8E909B] font-sans block text-[10px] uppercase tracking-wider">Property:</span>
                    <span className="text-[#F4F4F6] font-medium">{emailData.metadata.property}</span>
                  </div>

                  <div>
                    <span className="text-[#8E909B] font-sans block text-[10px] uppercase tracking-wider">Unit:</span>
                    <span className="text-[#F4F4F6] font-medium">{emailData.metadata.unit}</span>
                  </div>

                  <div>
                    <span className="text-[#8E909B] font-sans block text-[10px] uppercase tracking-wider">Issue:</span>
                    <span className="text-[#F4F4F6] font-medium">{emailData.metadata.issue}</span>
                  </div>

                  <div>
                    <span className="text-[#8E909B] font-sans block text-[10px] uppercase tracking-wider">Priority:</span>
                    <span className="font-medium text-[#F87171]">{emailData.metadata.priority}</span>
                  </div>

                  <div>
                    <span className="text-[#8E909B] font-sans block text-[10px] uppercase tracking-wider">Description:</span>
                    <span className="text-[#F4F4F6] font-sans text-xs block mt-1 bg-black/40 p-3 rounded-lg border border-white/[0.06]">
                      {emailData.metadata.description}
                    </span>
                  </div>
                </div>

                <p className="text-[#8E909B]">
                  Please review the request and update the property operations team through the configured process.
                </p>

                <div className="pt-3 border-t border-white/[0.06]">
                  <div className="font-medium text-[#F4F4F6] text-xs">PropertyOps AI</div>
                  <div className="text-[11px] text-[#8E909B] italic mt-0.5">This is a demo notification.</div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'plaintext' && (
            <div className="relative">
              <div className="text-[11px] font-mono text-[#8E909B] mb-2">
                Raw Plain-Text Content (Exact Transmission Body):
              </div>
              <pre className="bg-[#101217] text-emerald-400 p-4 rounded-xl font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto border border-white/[0.06]">
{emailData.bodyText}
              </pre>
            </div>
          )}

          {activeView === 'html' && (
            <div className="relative">
              <div className="text-[11px] font-mono text-[#8E909B] mb-2">
                Responsive HTML MIME Content:
              </div>
              <pre className="bg-[#101217] text-[#8E909B] p-4 rounded-xl font-mono text-[11px] whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[380px] border border-white/[0.06]">
{emailData.bodyHtml}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#101217] px-6 py-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-[#8E909B]">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Delivered via Automated SMTP &bull; ID: {emailData.messageId}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-[#F4F4F6] font-medium cursor-pointer transition border border-white/[0.08]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
