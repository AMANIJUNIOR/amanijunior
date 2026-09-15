import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  X,
  GraduationCap,
  Calendar,
  User,
  Phone,
  Mail,
  CheckCircle2,
  FileCheck,
  Building,
  Sparkles,
} from 'lucide-react';

export const AdmissionModal: React.FC = () => {
  const {
    isAdmissionModalOpen,
    closeAdmissionModal,
    admissionGradeInterest,
    refreshNotifications,
    settings,
  } = useApp();

  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [targetGrade, setTargetGrade] = useState(admissionGradeInterest || 'Grade 7 Alpha (Junior Secondary)');
  const [transportNeeded, setTransportNeeded] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isAdmissionModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !parentPhone.trim() || !childName.trim()) return;

    setIsSubmitting(true);
    try {
      const summaryMsg = `ADMISSION ENQUIRY: Child: ${childName} (Age: ${childAge || 'N/A'}). Grade: ${targetGrade}. Transport Needed: ${transportNeeded ? 'Yes' : 'No'}. Notes: ${additionalNotes || 'None'}.`;

      const res = await api.submitEnquiry({
        fullName: parentName,
        phone: parentPhone,
        email: parentEmail,
        category: 'Admission',
        message: summaryMsg,
        source: 'Admissions Page',
        studentGradeInterest: targetGrade,
      });

      setSubmittedRef(res.referenceNumber);
      await refreshNotifications();
    } catch (err) {
      alert('Error submitting enquiry. Please call Director directly at 0718540922.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmittedRef(null);
    closeAdmissionModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0F1E36] to-[#1E3A8A] text-white p-5 border-b-2 border-amber-500 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-['Cinzel',serif] text-base font-bold tracking-wide">
                Admission Enquiry Form
              </h3>
              <p className="text-xs text-amber-300">
                Amani Junior Academy and JSS &bull; Mazeras
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
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
                Admission Enquiry Submitted Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{parentName}</strong>. Our admissions team has registered your interest for{' '}
                <strong>{childName}</strong> in <strong>{targetGrade}</strong>. Director{' '}
                <strong>{settings.directorName}</strong> ({settings.directorPhone}) and Headteacher{' '}
                <strong>{settings.headteacherName}</strong> ({settings.headteacherPhone}) have been notified.
              </p>
              <div className="inline-block px-4 py-2 bg-amber-50 border border-amber-300 rounded-lg text-xs font-mono font-bold text-amber-900">
                Application Ref: {submittedRef}
              </div>
              <div className="pt-4">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-2.5 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Ongoing 2026 Admissions:</strong> Early Years (PP1/PP2), Primary (Grade 1-6), and Junior
                  Secondary (Grade 7, 8 & 9 JSS).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent / Guardian Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Christine Mwake"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Parent Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="e.g. 0718000000"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Child's Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="e.g. Emmanuel Baraka"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Child's Current Age / DOB
                  </label>
                  <input
                    type="text"
                    value={childAge}
                    onChange={(e) => setChildAge(e.target.value)}
                    placeholder="e.g. 12 Years"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Class/Grade Applying For
                  </label>
                  <select
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 bg-white"
                  >
                    <option value="Daycare (Children below 3 years)">Daycare (Below 3 Years)</option>
                    <option value="Playgroup (Children above 3 years)">Playgroup (Above 3 Years)</option>
                    <option value="Pre-Primary 1 (PP1)">Pre-Primary 1 (PP1)</option>
                    <option value="Pre-Primary 2 (PP2)">Pre-Primary 2 (PP2)</option>
                    <option value="Grade 1 Primary">Grade 1 Primary</option>
                    <option value="Grade 2 Primary">Grade 2 Primary</option>
                    <option value="Grade 3 Primary">Grade 3 Primary</option>
                    <option value="Grade 4 Primary">Grade 4 Primary</option>
                    <option value="Grade 5 Primary">Grade 5 Primary</option>
                    <option value="Grade 6 Primary">Grade 6 Primary</option>
                    <option value="Grade 7 Alpha (Junior Secondary)">Grade 7 (JSS Intake)</option>
                    <option value="Grade 8 Alpha (Junior Secondary)">Grade 8 (JSS Transfer)</option>
                    <option value="Grade 9 Alpha (Junior Secondary)">Grade 9 (JSS Cohort)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={transportNeeded}
                      onChange={(e) => setTransportNeeded(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Requires School Bus Transport</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Additional Information or Questions
                </label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Previous school, special medical needs, or preferred interview date..."
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Application...' : 'Submit Admission Enquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
