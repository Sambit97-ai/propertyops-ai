import React, { useState } from 'react';
import { X, Calendar, Clock, Building2, Mail, User, CheckCircle2, ArrowRight } from 'lucide-react';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({ isOpen, onClose, defaultTopic }) => {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [portfolioSize, setPortfolioSize] = useState('1 to 5 Commercial Properties');
  const [preferredDate, setPreferredDate] = useState('Tomorrow');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [notes, setNotes] = useState(defaultTopic ? `Interested in: ${defaultTopic}` : '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !workEmail.trim() || !companyName.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFullName('');
    setWorkEmail('');
    setCompanyName('');
    setNotes('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#090A0D]/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-demo-title"
    >
      <div 
        className="relative w-full max-w-lg bg-[#12141C] rounded-2xl border border-white/[0.1] shadow-2xl overflow-hidden transition-all text-[#F4F4F6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.08] bg-[#101217]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C9A96E]/10 border border-[#C9A96E]/20 text-[#C9A96E] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 id="book-demo-title" className="text-sm font-semibold text-[#F4F4F6] tracking-tight">
                Book a 15-Minute Demo
              </h2>
              <p className="text-[11px] text-[#8E909B]">
                Experience PropertyOps AI tailored to your commercial portfolio
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 text-[#8E909B] hover:text-[#F4F4F6] rounded-lg hover:bg-white/[0.05] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-medium text-[#F4F4F6]">Demo Scheduled</h3>
              <p className="text-xs text-[#8E909B] max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-medium text-[#F4F4F6]">{fullName}</span>. A calendar invitation for <span className="font-medium text-[#DFCCA3]">{preferredDate} at {preferredTime}</span> has been sent to <span className="font-medium text-[#F4F4F6]">{workEmail}</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-left text-xs space-y-2 max-w-sm mx-auto mt-4">
              <div className="flex items-center justify-between text-[#8E909B]">
                <span>Portfolio:</span>
                <span className="text-[#F4F4F6] font-medium">{companyName}</span>
              </div>
              <div className="flex items-center justify-between text-[#8E909B]">
                <span>Scope:</span>
                <span className="text-[#F4F4F6] font-medium">{portfolioSize}</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] text-xs font-semibold transition cursor-pointer shadow-lg shadow-[#C9A96E]/20"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Your Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarah Jenkins"
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>

              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Work Email</label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="sjenkins@company.com"
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Company / Property Group</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Orion Asset Management"
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
                />
              </div>

              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Portfolio Size</label>
                <select
                  value={portfolioSize}
                  onChange={(e) => setPortfolioSize(e.target.value)}
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                >
                  <option value="1 to 5 Commercial Properties" className="bg-[#101217]">1 to 5 Commercial Assets</option>
                  <option value="6 to 20 Commercial Properties" className="bg-[#101217]">6 to 20 Commercial Assets</option>
                  <option value="20+ Commercial Properties" className="bg-[#101217]">20+ Commercial Assets</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Preferred Day</label>
                <select
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                >
                  <option value="Tomorrow" className="bg-[#101217]">Tomorrow</option>
                  <option value="In 2 Days" className="bg-[#101217]">In 2 Days</option>
                  <option value="Next Week" className="bg-[#101217]">Next Week</option>
                </select>
              </div>

              <div>
                <label className="text-[#8E909B] block mb-1.5 font-medium">Preferred Time</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full bg-[#101217] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-[#F4F4F6] focus:outline-none focus:border-[#C9A96E]/50"
                >
                  <option value="09:00 AM" className="bg-[#101217]">09:00 AM</option>
                  <option value="10:00 AM" className="bg-[#101217]">10:00 AM</option>
                  <option value="02:00 PM" className="bg-[#101217]">02:00 PM</option>
                  <option value="04:00 PM" className="bg-[#101217]">04:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[#8E909B] block mb-1.5 font-medium">Operations Focus (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Specific operational bottlenecks (e.g. after-hours HVAC response, vendor SLAs)..."
                className="w-full bg-[#101217] border border-white/[0.08] rounded-xl p-3 text-xs text-[#F4F4F6] placeholder-white/30 focus:outline-none focus:border-[#C9A96E]/50"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl border border-white/[0.08] text-[#8E909B] hover:bg-white/[0.04] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#C9A96E] hover:bg-[#DFCCA3] text-[#090A0D] font-semibold text-xs transition cursor-pointer shadow-lg shadow-[#C9A96E]/20"
              >
                {isSubmitting ? 'Confirming...' : 'Schedule 15-Min Demo'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
