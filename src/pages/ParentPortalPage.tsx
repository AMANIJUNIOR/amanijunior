import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, Phone, Calendar, School } from 'lucide-react';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';

export const ParentPortalPage: React.FC = () => {
  const { navigate, settings } = useApp();

  return (
    <div className="max-w-3xl mx-auto my-16 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <SchoolLogoBadge size="lg" className="justify-center mx-auto" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Institutional Policy</span>
          </div>
          <h1 className="text-2xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
            Parent Academic Consultations
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            In accordance with {settings.schoolName} child data security policies and Kenya Ministry of Education CBC guidelines, online public parent self-registration accounts are not operated.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>Termly Progress Clinics</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Official printed assessment report books, teacher comments, and CBC competency portfolios are issued in person during scheduled Mid-Term and End-of-Term Academic Consultations.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Direct Inquiries</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              For immediate inquiries regarding your child's academic welfare or fee statements, contact Headteacher <strong>Nadhiri Chacha Salim</strong> at <strong>0114623408</strong> or Director <strong>Constance Mwaka Pole</strong> at <strong>0718540922</strong>.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => navigate('home')}
            className="px-5 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to School Homepage</span>
          </button>

          <button
            onClick={() => navigate('portal-login')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition"
          >
            Staff Management Portal Login
          </button>
        </div>
      </div>
    </div>
  );
};
