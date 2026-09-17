import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  X,
  PhoneCall,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  Building,
} from 'lucide-react';

export const HumanEscalationModal: React.FC = () => {
  const {
    isEscalationModalOpen,
    closeEscalationModal,
    escalationSubject,
    refreshNotifications,
    settings,
  } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<'Admission' | 'Junior Secondary (JSS)' | 'CBC Curriculum' | 'School Fees' | 'School Visit' | 'General Enquiry'>('Admission');
  const [message, setMessage] = useState('');
  const [studentGradeInterest, setStudentGradeInterest] = useState('Grade 7 Alpha (JSS)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isEscalationModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setError('Please provide your Name, Phone Number, and Message.');
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
        message: escalationSubject ? `[Context: ${escalationSubject}] ${message}` : message,
        source: 'AI Chatbot Handoff',
        studentGradeInterest,
      });

      setSubmittedRef(res.referenceNumber);
      await refreshNotifications();
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try calling directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedRef(null);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    closeEscalationModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0F1E36] text-white p-5 border-b-2 border-amber-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] text-base font-bold tracking-wide">
                Direct School Communication
              </h3>
              <p className="text-xs text-amber-300">
                Amani Junior Academy and JSS &bull; Mazeras
              </p>
            </div>
          </div>
          <button
            onClick={closeEscalationModal}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {submittedRef ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-['Cinzel',serif]">
                Enquiry Dispatched Directly to School Leadership
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{fullName}</strong>. An instant SMS alert has been dispatched to School Director{' '}
                <strong>{settings.directorName}</strong> ({settings.directorPhone}), Deputy Headteacher{' '}
                <strong>Teacher Vitalice Odhiambo</strong> (0746529712), and Headteacher{' '}
                <strong>{settings.headteacherName}</strong> ({settings.headteacherPhone}).
              </p>
              <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-900">
                Reference ID: {submittedRef}
              </div>
              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Official Handoff Channel:</strong> Alerts Director Constance Mwaka Pole (0718540922), Headteacher Nadhiri Chacha Salim (0114623408), and Deputy Headteacher Vitalice Odhiambo (0746529712).
                  </div>
                </div>
                {/* Instant Call Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/60">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Direct Call:</span>
                  <a
                    href="tel:0746529712"
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-mono font-bold text-[11px] shadow-sm transition"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Deputy Vitalice (Academics): 0746529712</span>
                  </a>
                  <a
                    href="tel:0114623408"
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-mono font-bold text-[11px] shadow-sm transition"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Headteacher Salim: 0114623408</span>
                  </a>
                  <a
                    href="tel:0718540922"
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#0F1E36] hover:bg-slate-800 text-amber-400 rounded font-mono font-bold text-[11px] shadow-sm transition"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Director Constance: 0718540922</span>
                  </a>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Mary Atieno or Dr. Harrison Mwangi"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number (SMS Alert) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <PhoneCall className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category of Request
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
                  >
                    <option value="Admission">Admission Enquiry</option>
                    <option value="Junior Secondary (JSS)">Junior Secondary (JSS)</option>
                    <option value="CBC Curriculum">CBC Curriculum & Assessment</option>
                    <option value="School Fees">School Fees Structure</option>
                    <option value="School Visit">Campus Visit Booking</option>
                    <option value="General Enquiry">General School Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Grade / Class
                  </label>
                  <select
                    value={studentGradeInterest}
                    onChange={(e) => setStudentGradeInterest(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
                  >
                    <option value="Daycare (Below 3 years)">Daycare (Below 3 Years)</option>
                    <option value="Playgroup (Above 3 years)">Playgroup (Above 3 Years)</option>
                    <option value="Pre-Primary (PP1/PP2)">Pre-Primary (PP1 / PP2)</option>
                    <option value="Primary (Grade 1-3)">Lower Primary (Grade 1 - 3)</option>
                    <option value="Primary (Grade 4-6)">Upper Primary (Grade 4 - 6)</option>
                    <option value="Grade 7 Alpha (JSS)">Grade 7 (JSS Intake)</option>
                    <option value="Grade 8 Alpha (JSS)">Grade 8 (JSS Transfer)</option>
                    <option value="Grade 9 Alpha (JSS)">Grade 9 (JSS Senior Transition)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Message or Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please state how we can help you or what day you would like to visit..."
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEscalationModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Alert...' : 'Submit & Alert School'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
