import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Building,
  ShieldCheck,
  Bot,
  Sparkles,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, toggleChatbot, refreshNotifications } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'General Enquiry' | 'Admission' | 'Junior Secondary (JSS)' | 'School Fees' | 'School Visit'>('General Enquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setError('Please fill in Name, Phone, and your Message.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.submitEnquiry({
        fullName,
        phone,
        email,
        category,
        message,
        source: 'Contact Page',
      });
      setSubmittedRef(res.referenceNumber);
      await refreshNotifications();
    } catch (err: any) {
      setError(err.message || 'Error submitting contact form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-14 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Institutional Channels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            Contact Amani Junior Academy & JSS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            We are always here to answer questions from current parents, guardians, and prospective families.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Official Contact Directory */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0F1E36] text-white p-7 rounded-2xl border-2 border-amber-500/50 shadow-xl space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                  School Address & Headquarters
                </span>
                <h3 className="text-xl font-bold font-['Cinzel',serif]">AMANI JUNIOR ACADEMY AND JSS</h3>
                <p className="text-xs text-slate-300 italic font-medium">"STRIVE TO ACHIEVE"</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Postal & Physical Location:</div>
                    <div className="text-slate-300">{settings.postalAddress}</div>
                    <div className="text-[11px] text-amber-300 mt-0.5">Mazeras, Kilifi County, Kenya</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Director (Constance Mwaka Pole):</div>
                    <a href={`tel:${settings.directorPhone}`} className="text-amber-400 font-mono text-sm font-bold hover:underline">
                      {settings.directorPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/40">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 w-full">
                    <div className="font-bold text-white">Deputy Headteacher & Head of Academics (Vitalice Odhiambo):</div>
                    <div className="text-[11px] text-amber-300">Directly in charge of Academics, CBC Curricula & ICT</div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a href="tel:0746529712" className="text-amber-400 font-mono text-sm font-bold hover:underline">
                        +254 746 529 712
                      </a>
                      <a
                        href="https://wa.me/254746529712?text=Hello%20Vitalice,%20I%20am%20contacting%20you%20regarding%20Amani%20Junior%20Academy%20and%20JSS"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        <span>Chat Vitalice on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Headteacher (Nadhiri Chacha Salim):</div>
                    <a href={`tel:${settings.headteacherPhone}`} className="text-amber-400 font-mono text-sm font-bold hover:underline">
                      {settings.headteacherPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Office Visiting Hours:</div>
                    <div className="text-slate-300 leading-relaxed">{settings.officeHours}</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700 flex items-center justify-between">
                <button
                  onClick={toggleChatbot}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Ask Amani Assistant</span>
                </button>
              </div>
            </div>

            {/* Transport & Location Notice */}
            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Visiting from Mombasa, Mariakani, or Kinango?</span>
              </div>
              <p className="leading-relaxed">
                Mazeras is conveniently accessible by both private and public transport along the Mombasa-Nairobi
                Highway. School bus transport is available for morning pickup and afternoon drops.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-[#0F1E36] font-['Cinzel',serif]">
                  Send an Official Enquiry
                </h3>
                <p className="text-xs text-slate-500">
                  Submissions directly trigger notifications to Director Constance Mwaka Pole, Deputy Headteacher
                  Vitalice Odhiambo, and Headteacher Nadhiri Chacha Salim.
                </p>
              </div>

              {submittedRef ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">Message Dispatched Successfully</h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you, <strong>{fullName}</strong>. Your enquiry has been received and school leadership has
                    been alerted.
                  </p>
                  <div className="inline-block px-3 py-1.5 bg-amber-50 border border-amber-300 rounded font-mono text-xs font-bold text-amber-900">
                    Ref ID: {submittedRef}
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => setSubmittedRef(null)}
                      className="px-5 py-2 bg-[#0F1E36] text-white rounded-lg text-xs font-bold"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Samuel Mwadime"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone Number (SMS Contact) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0718000000"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. parent@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Category of Enquiry
                      </label>
                      <select
                        value={category}
                        onChange={(e: any) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
                      >
                        <option value="General Enquiry">General School Enquiry</option>
                        <option value="Admission">Admission Enquiry</option>
                        <option value="Junior Secondary (JSS)">Junior Secondary (JSS)</option>
                        <option value="School Fees">School Fees Structure</option>
                        <option value="School Visit">Campus Visit Booking</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please write your questions or details here..."
                      className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting...' : 'Send Message to School'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
