import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { getVitaliceWhatsAppUrl, VITALICE_WHATSAPP } from '../utils/whatsapp';

export const VitaliceWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const url = getVitaliceWhatsAppUrl(
      message.trim() ||
        'Hello Teacher Vitalice, I would like to inquire about admissions and academics at Amani Junior Academy & JSS.'
    );
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end print:hidden">
      {/* Popover Card */}
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border-2 border-emerald-500 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-3">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white font-serif text-sm border border-white/30">
                  VO
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight">{VITALICE_WHATSAPP.name}</h4>
                  <p className="text-[11px] text-emerald-100">{VITALICE_WHATSAPP.role}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    Online &bull; Mazeras, Kilifi County
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSend} className="p-4 space-y-3 bg-slate-50">
            <p className="text-xs text-slate-600 leading-relaxed">
              Have a question about learner admissions, fee structures, or CBC academics? Chat directly with Teacher Vitalice on WhatsApp at{' '}
              <strong className="font-mono text-emerald-700">{VITALICE_WHATSAPP.phoneFormatted}</strong>.
            </p>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message or inquiry here..."
              rows={3}
              className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 resize-none"
            />

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Start WhatsApp Chat</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-xl hover:shadow-2xl transition duration-200 border-2 border-white cursor-pointer"
        title="Chat directly with Teacher Vitalice on WhatsApp (+254 746 529712)"
      >
        <MessageCircle className="w-5 h-5 fill-current animate-bounce" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          WhatsApp Vitalice (+254746529712)
        </span>
      </button>
    </div>
  );
};
