import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Laptop,
  Lightbulb,
  FileText,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const AcademicsPage: React.FC = () => {
  const { subjects, classes, openAdmissionModal } = useApp();
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'Early Years' | 'Primary' | 'Junior Secondary'>('All');

  const filteredSubjects =
    selectedLevel === 'All'
      ? subjects
      : subjects.filter((s) => s.curriculumLevel === selectedLevel);

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Kenyan CBC Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            Academics & Junior Secondary Learning
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Comprehensive Competency-Based Curriculum (CBC) from Early Years (PP1) through Grade 9 Junior Secondary.
          </p>
        </div>
      </section>

      {/* 1. Curriculum Overview & Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              Educational Framework
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
              Competency-Based Curriculum (CBC)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At Amani Junior Academy and JSS, our academic structure is anchored in the Kenyan 2-6-3-3-3
              Competency-Based Curriculum approved by the Kenya Institute of Curriculum Development (KICD).
              Unlike rote-learning models, CBC emphasizes the application of knowledge, hands-on creativity, digital
              fluency, and moral values.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Communication & Collaboration</span>
                </div>
                <p className="text-[11px] text-slate-500">Learners present projects and work in structured teams.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Critical Thinking & Problem Solving</span>
                </div>
                <p className="text-[11px] text-slate-500">Formulating hypotheses and scientific inquiry in real life.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Digital Literacy & STEM</span>
                </div>
                <p className="text-[11px] text-slate-500">Computer coding, robotics, and integrated sciences.</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Citizenship & Moral Values</span>
                </div>
                <p className="text-[11px] text-slate-500">Community service learning and ethical civic responsibility.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-[#0F1E36] to-[#1E3A8A] text-white p-6 sm:p-8 rounded-2xl border-2 border-amber-500/50 shadow-xl space-y-4">
            <span className="text-[10px] font-extrabold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
              Amani Learning Journey
            </span>
            <h3 className="text-xl font-bold font-['Cinzel',serif]">Progression Stages</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <div className="font-bold text-amber-300">Level 1: Early Years (PP1 – PP2)</div>
                <div className="text-slate-300 text-[11px] mt-0.5">Foundational motor skills, language phonics & socialization.</div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-white/10">
                <div className="font-bold text-amber-300">Level 2: Primary (Grade 1 – 6)</div>
                <div className="text-slate-300 text-[11px] mt-0.5">Reading, numeracy, agricultural science & preparation for KPSEA.</div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl border border-amber-400/40 bg-amber-500/10">
                <div className="font-bold text-amber-400">Level 3: Junior Secondary School (Grade 7 – 9)</div>
                <div className="text-slate-200 text-[11px] mt-0.5">Advanced STEM practicals, pre-technical studies & career exploration.</div>
              </div>
            </div>

            <button
              onClick={() => openAdmissionModal()}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg uppercase tracking-wider transition"
            >
              Enrol for 2026 Academic Year
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Learning Areas & Subjects Filter */}
      <section className="bg-slate-50 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              Subject Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
              Key Learning Areas & Subjects
            </h2>
            <p className="text-xs text-slate-600">
              Curriculum aligned with national CBC guidelines with enriched STEM and practical applications.
            </p>

            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {(['All', 'Early Years', 'Primary', 'Junior Secondary'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    selectedLevel === lvl
                      ? 'bg-[#0F1E36] text-amber-400 shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((sub) => (
              <div
                key={sub.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-400 transition space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-mono text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded text-[10px]">
                      {sub.curriculumLevel}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{sub.name}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sub.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-amber-800">
                    Lead: {sub.leadTeacher.split(' ')[0]} {sub.leadTeacher.split(' ').pop()}
                  </span>
                  <span className="font-semibold text-emerald-700">{sub.weeklyPeriods} periods/wk</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Teaching Methodology & Assessment */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            <h3 className="text-base font-bold text-[#0F1E36]">Teaching Methodology</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We employ inquiry-based learning, practical laboratory experiments, group collaborations, digital visual
              simulations, and field research in agriculture to deepen pupil retention and engagement.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold text-[#0F1E36]">Assessment & Reporting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Assessment for Learning (Formative) and Assessment of Learning (Summative). Parents receive comprehensive
              termly rubric reports detailing competencies achieved rather than only single test ranks.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <Award className="w-6 h-6 text-blue-600" />
            <h3 className="text-base font-bold text-[#0F1E36]">Remedial & Enrichment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dedicated after-school clinic hours for learners requiring additional numeracy or literacy support, plus
              accelerated challenge projects for mathematically and creatively gifted pupils.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Academic Calendar Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0F1E36] text-white p-8 sm:p-10 rounded-2xl border-2 border-amber-500/50 shadow-xl space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Structure & Dates
            </span>
            <h3 className="text-2xl font-bold font-['Cinzel',serif]">2026 Academic Term Structure</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold text-sm">
                <span>TERM 1</span>
                <span className="text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">13 Weeks</span>
              </div>
              <div className="text-xs text-slate-300">January – April 2026</div>
              <ul className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/10">
                <li>&bull; Admissions & Orientation</li>
                <li>&bull; Mid-Term Diagnostic CATs</li>
                <li>&bull; Regional Athletics Championships</li>
              </ul>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold text-sm">
                <span>TERM 2</span>
                <span className="text-xs bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-300">14 Weeks</span>
              </div>
              <div className="text-xs text-slate-300">May – August 2026</div>
              <ul className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/10">
                <li>&bull; Music & Drama Festival Entries</li>
                <li>&bull; JSS Integrated Science Projects</li>
                <li>&bull; Mid-Year Parents' Academic Conference</li>
              </ul>
            </div>

            <div className="p-4 bg-white/10 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold text-sm">
                <span>TERM 3</span>
                <span className="text-xs bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">9 Weeks</span>
              </div>
              <div className="text-xs text-slate-300">September – November 2026</div>
              <ul className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-white/10">
                <li>&bull; KPSEA National Assessment (Grade 6)</li>
                <li>&bull; End-of-Year JSS Evaluations</li>
                <li>&bull; Annual Speech & Prize Giving Gala</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
