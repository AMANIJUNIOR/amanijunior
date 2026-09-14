import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Atom,
  Cpu,
  Palette,
  BookOpen,
  Trophy,
  Shield,
  ArrowRight,
  Download,
  Users,
  Building,
} from 'lucide-react';

export const JuniorSecondaryPage: React.FC = () => {
  const { openAdmissionModal, openEscalationModal, navigate } = useApp();

  const coreSubjects = [
    { name: 'Mathematics', desc: 'Algebraic logic, geometry, statistics, and business financial numeracy.' },
    { name: 'Integrated Science', desc: 'Hands-on physics, chemistry, biology, and laboratory experiments.' },
    { name: 'Pre-Technical Studies', desc: 'Technical drawing, tool handling, materials fabrication, and woodwork.' },
    { name: 'Computer Studies / ICT', desc: 'Coding logic, algorithms, digital literacy, and internet safety.' },
    { name: 'English Language & Lit', desc: 'Functional writing, comprehension, speech, and classic African literature.' },
    { name: 'Kiswahili & Fasihi', desc: 'Sarufi, insha, ushairi, and Kiswahili conversational mastery.' },
    { name: 'Social Studies', desc: 'Kenyan and global geography, history, civic rights, and environmental care.' },
    { name: 'Agriculture & Nutrition', desc: 'Crop farming, livestock management, and culinary sciences.' },
    { name: 'Religious Education (CRE/IRE)', desc: 'Spiritual grounding, ethical decision-making, and moral integrity.' },
    { name: 'Health Education', desc: 'Adolescent health, hygiene, first aid, and disease prevention.' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Flagship Hero */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-16 border-b-4 border-amber-500 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-5 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-500/20 border border-amber-400/50 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kenya CBC Grade 7, 8 & 9 Flagship</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Cinzel',serif] tracking-tight max-w-4xl mx-auto">
            Amani Junior Secondary School (JSS)
          </h1>

          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Fully certified by the Ministry of Education with state-of-the-art Integrated Science laboratories,
            Pre-Technical workshops, and CBC-specialized degree tutors in Mazeras.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => openAdmissionModal('Junior Secondary (Grade 7 - 9)')}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl transition active:scale-95 flex items-center gap-2"
            >
              <span>Enroll for Grade 7 – 9 (2026)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('admissions')}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>View JSS Fee Structure</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3 Career Pathways */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-700">
            Pathways to Senior School
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
            Structured Preparation for 3 Pathways
          </h2>
          <p className="text-xs text-slate-500">
            Our Junior Secondary curriculum nurtures learner aptitude to seamlessly branch into Senior School pathways.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border-2 border-emerald-500/40 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Atom className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36]">1. STEM Pathway</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for future engineers, medical doctors, researchers, and programmers with intensive lab
              experiments and robotics workshops.
            </p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>&bull; Pure & Applied Sciences</li>
              <li>&bull; Pre-Technical & Woodwork</li>
              <li>&bull; Coding & Computational Logic</li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border-2 border-blue-500/40 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36]">2. Social Sciences Pathway</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nurturing future jurists, administrators, economists, educators, and diplomats through debate, civic study,
              and linguistic eloquence.
            </p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>&bull; Languages & Classic Literature</li>
              <li>&bull; History, Civics & Governance</li>
              <li>&bull; Business Studies & Economics</li>
            </ul>
          </div>

          <div className="bg-white p-7 rounded-2xl border-2 border-amber-500/40 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36]">3. Arts & Sports Pathway</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              For talented youth in music, performing arts, visual design, and athletic disciplines backed by trained
              coaches and studio spaces.
            </p>
            <ul className="text-xs text-slate-500 space-y-1">
              <li>&bull; Visual Design & Media Arts</li>
              <li>&bull; Drama, Music & Traditional Dance</li>
              <li>&bull; Competitive Athletics & Ball Games</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Subjects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h3 className="text-xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
              Junior Secondary CBC Core Curriculum
            </h3>
            <p className="text-xs text-slate-500">All 10 required learning areas taught with continuous formative evaluations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coreSubjects.map((sub, i) => (
              <div key={i} className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <h4 className="font-bold text-xs text-slate-900">{sub.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 pl-6">{sub.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JSS Facilities Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h3 className="text-2xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
            Dedicated JSS Infrastructure
          </h3>
          <p className="text-xs text-slate-500">Built to ensure hands-on, competency-based discovery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-52 overflow-hidden relative">
              <img
                src="/images/science_lab_pupils_1789375054803.jpg"
                alt="Junior Secondary Integrated Science Laboratory"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded uppercase">
                Modern Labs & Wings
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl">
                  <Atom className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Integrated Science & Biology Lab</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Equipped with gas taps, safety goggles, optical microscopes, biological models, chemical test kits,
                and digital demonstration boards ensuring practical learning for Grade 7, 8 & 9.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
            <div className="h-52 overflow-hidden relative">
              <img
                src="/images/amani_ict_lab_1789049756612.jpg"
                alt="Modern Computer & Coding Laboratory"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-blue-600 text-white font-extrabold text-[10px] rounded uppercase">
                ICT Hardware
              </span>
            </div>
            <div className="p-6 space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-800 rounded-xl">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Modern Computer & Coding Laboratory</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                High-speed internet workstations overseen by ICT Lead Vitalice Odhiambo, fostering coding proficiency,
                digital design, computational algorithms, and research capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enrolment CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="p-8 bg-gradient-to-r from-[#0F1E36] to-[#1E3A8A] text-white rounded-3xl border-2 border-amber-400/50 text-center space-y-4 shadow-xl">
          <h3 className="text-2xl font-bold font-['Cinzel',serif]">Secure Your Child’s Place in JSS</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Limited slots are available for Grade 7, 8 & 9 transfers and KPSEA qualifiers. Contact Director Constance
            Mwaka Pole today.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => openAdmissionModal('Junior Secondary (Grade 7 - 9)')}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs transition active:scale-95"
            >
              Apply Online Now
            </button>
            <button
              onClick={() => openEscalationModal('JSS Consultation')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition"
            >
              Speak with Leadership
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
