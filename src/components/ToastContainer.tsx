import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-start justify-between gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200 bg-[#12141C] ${
              isSuccess ? 'border-emerald-500/25' :
              isWarning ? 'border-amber-500/25' :
              isError ? 'border-[#F87171]/25' :
              'border-[#C9A96E]/25'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-[#F87171] mt-0.5 shrink-0" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-[#C9A96E] mt-0.5 shrink-0" />}

              <div className="text-xs">
                <div className="font-medium text-[#F4F4F6]">{toast.title}</div>
                {toast.message && <p className="text-[#8E909B] mt-0.5 leading-snug text-[11px]">{toast.message}</p>}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8E909B] hover:text-[#F4F4F6] cursor-pointer p-0.5 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
