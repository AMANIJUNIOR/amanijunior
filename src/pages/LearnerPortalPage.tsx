import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, ArrowLeft, BookOpen } from 'lucide-react';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';

export const LearnerPortalPage: React.FC = () => {
  const { navigate, settings } = useApp();

  return (
    <div className="max-w-3xl mx-auto my-16 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10 text-center space-y-6">
        <SchoolLogoBadge size="lg" className="justify-center mx-auto" />

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Official Learner Notice</span>
          </div>
          <h1 className="text-2xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
            Classroom Learning & Continuous Assessments
          </h1>
          <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            At {settings.schoolName} ("STRIVE TO ACHIEVE"), learner academic work, assignments, and practical science lab projects are supervised directly in class by appointed subject teachers.
          </p>
        </div>

        <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Direct Instructional Support</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Learners receive their homework sheets, continuous assessment test results, and practical project guidelines directly from their subject teachers in the ICT Lab, Science Station, and homerooms. Public learner login accounts are not maintained.
          </p>
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
            onClick={() => navigate('assignments')}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            View Academic Class Handouts
          </button>
        </div>
      </div>
    </div>
  );
};
