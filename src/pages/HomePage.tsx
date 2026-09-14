import React from 'react';
import { useApp } from '../context/AppContext';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  Compass,
  Laptop,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Bot,
  ShieldCheck,
  Trophy,
  ChevronRight,
  Clock,
  HeartHandshake,
  Lightbulb,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const {
    navigate,
    toggleChatbot,
    openAdmissionModal,
    openEscalationModal,
    settings,
    teachers,
    announcements,
    events,
    gallery,
    classes,
  } = useApp();

  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-[#071120] overflow-hidden text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/amani_hero.jpg"
            alt="Amani Junior Academy and JSS Campus"
            className="w-full h-full object-cover object-center opacity-30 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071120] via-[#071120]/90 to-[#071120]/60" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#071120] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* Badge & Motto Tag */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 text-xs font-bold tracking-widest uppercase animate-in fade-in slide-in-from-left-4 duration-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>MOTTO: "STRIVE TO ACHIEVE"</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-slate-200">MAZERAS, KENYA</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-['Cinzel',serif] tracking-tight leading-tight text-white">
                Building Bright Minds.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
                  Shaping Future Leaders.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl font-normal">
                At <strong>Amani Junior Academy and JSS</strong>, we nurture learners through quality Competency-Based
                Education (CBC), moral character development, creativity, and modern STEM innovation—preparing every
                child to confidently take on the future.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <button
                  onClick={() => navigate('about')}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition backdrop-blur-sm active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Our School</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openAdmissionModal()}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition active:scale-95 flex items-center gap-2"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Admission Enquiry</span>
                </button>

                <button
                  onClick={toggleChatbot}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm shadow-lg transition active:scale-95 flex items-center gap-2"
                >
                  <Bot className="w-4 h-4 text-amber-300" />
                  <span>Talk to Amani</span>
                </button>
              </div>

              {/* Leadership Quick Contact Banner */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                    D
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">School Director</div>
                    <div className="font-semibold text-white">{settings.directorName}</div>
                    <a href={`tel:${settings.directorPhone}`} className="text-amber-400 font-mono text-[11px] hover:underline">
                      {settings.directorPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    H
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Headteacher</div>
                    <div className="font-semibold text-white">{settings.headteacherName}</div>
                    <a href={`tel:${settings.headteacherPhone}`} className="text-amber-400 font-mono text-[11px] hover:underline">
                      {settings.headteacherPhone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Right: Official School Crest Showcase */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-emerald-600 to-blue-600 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-500" />
                <div className="relative bg-gradient-to-b from-[#0F1E36] to-[#0A1424] p-8 rounded-2xl border-2 border-amber-500/60 shadow-2xl text-center space-y-5 max-w-sm">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-amber-400 shadow-xl bg-white p-1">
                    <img
                      src="/amani_logo.jpg"
                      alt="Official Amani Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-['Cinzel',serif] text-xl font-bold tracking-wider text-white">
                      Amani Junior Academy
                    </h3>
                    <div className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
                      & Junior Secondary School
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300">
                    <p className="italic">"STRIVE TO ACHIEVE"</p>
                    <div className="mt-1 text-[11px] text-amber-300 font-medium">P.O. Box 93-80114, Mazeras, Kenya</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700">
                      <div className="font-bold text-white">PP1 – Grade 9</div>
                      <div className="text-[10px] text-slate-400">Complete Levels</div>
                    </div>
                    <div className="p-2 bg-slate-800/80 rounded-lg border border-slate-700">
                      <div className="font-bold text-emerald-400">CBC & STEM</div>
                      <div className="text-[10px] text-slate-400">ICT Lab & Science</div>
                    </div>
                  </div>

                  <button
                    onClick={() => openAdmissionModal()}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-extrabold text-xs tracking-wider uppercase shadow-md transition"
                  >
                    Apply for 2026 Intake
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WELCOME & ABOUT THE SCHOOL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="text-xs font-extrabold text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Welcome to Amani Junior Academy & JSS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif] tracking-tight">
              An Inspiring Sanctuary of Learning in Mazeras
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Founded on the enduring belief that every child possesses unique talents waiting to be awakened, Amani
              Junior Academy and Junior Secondary School provides an exceptional educational journey. Guided by Director{' '}
              <strong>Constance Mwaka Pole</strong> and Headteacher <strong>Nadhiri Chacha Salim</strong>, we foster a
              culture where discipline meets curiosity, and academic rigour is balanced with creativity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Holistic CBC Foundation</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Competencies, values, and practical capabilities.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Junior Secondary Excellence</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Grades 7, 8 & 9 pathways with modern laboratories.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">STEM & Computer Coding</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Dedicated ICT lab led by Deputy Vitalice Odhiambo.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Moral Character & Discipline</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Spiritual, emotional, and social grounding.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('about')}
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 transition"
              >
                <span>Read more about our leadership and vision</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-500/30">
              <img
                src="/amani_ict.jpg"
                alt="Amani STEM & ICT Lab"
                className="w-full h-80 sm:h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1E36] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-[10px] rounded-md uppercase tracking-wider">
                  Innovation in Action
                </span>
                <h4 className="text-sm sm:text-base font-bold font-['Cinzel',serif] mt-1.5">
                  Technology-Enhanced Learning & Junior Secondary Practical Labs
                </h4>
                <p className="text-[11px] text-slate-200">
                  Mazeras learners mastering Python coding, robotics, and integrated science practicals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHY CHOOSE AMANI? */}
      <section className="bg-slate-100/80 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              The Amani Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
              Why Parents Choose Amani Junior Academy & JSS
            </h2>
            <p className="text-xs text-slate-600">
              We provide a balanced ecosystem where children flourish intellectually, morally, and socially.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F1E36]">Approved CBC & JSS Pathways</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Full adherence to the Kenya Institute of Curriculum Development (KICD) standards. From PP1 through
                Grade 9 Junior Secondary, our learners build verifiable core competencies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Laptop className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F1E36]">Modern ICT & Science Labs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hands-on digital literacy and science practical stations. Every learner gains early exposure to computer
                hardware, software programming, and empirical inquiry.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#0F1E36]">Dedicated, Certified Faculty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Passionate educators dedicated to small class sizes, individualized child mentorship, and continuous
                parental reporting via our digital platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCHOOL STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#0F1E36] to-[#1A2E4C] rounded-2xl p-8 sm:p-12 text-white shadow-xl border-2 border-amber-500/40">
          <div className="text-center space-y-2 mb-8">
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest">
              Verified Excellence
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-['Cinzel',serif]">
              Amani Junior Academy & JSS in Numbers
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">100%</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">CBC Transition Rate</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Primary to JSS Progression</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">11</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Grade Classes</div>
              <div className="text-[10px] text-slate-400 mt-0.5">PP1 up to Grade 9 JSS</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">1:25</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Teacher-Learner Ratio</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Focused Personal Attention</div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="text-2xl sm:text-4xl font-extrabold text-amber-400 font-mono">12+</div>
              <div className="text-xs font-semibold text-slate-200 mt-1">Co-Curricular Clubs</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Robotics, Drama, 4-K & Sports</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC EXCELLENCE & CURRICULUM OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
            Structured Pathways
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
            Academic Programmes
          </h2>
          <p className="text-xs text-slate-600">
            Nurturing holistic competence across the three crucial early learning development stages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Level 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-amber-500 transition group flex flex-col">
            <div className="h-36 overflow-hidden relative">
              <img
                src="/images/preschool_early_years_1789375141935.jpg"
                alt="Early Years Learners PP1 & PP2"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-0.5 rounded shadow">
                Foundational
              </span>
            </div>
            <div className="bg-emerald-800 text-white p-4 text-center space-y-0.5">
              <h3 className="text-base font-bold font-['Cinzel',serif]">Early Years (PP1 & PP2)</h3>
              <p className="text-xs text-emerald-100">Ages 4 - 5 Years</p>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                Play-based numeracy, language literacy, psycho-motor creative arts, environmental activities, and social
                etiquette in a cheerful, loving setting.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Interactive storytelling & phonics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Early cognitive manipulation games</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Safe indoor & outdoor play zones</span>
                </li>
              </ul>
              <button
                onClick={() => openAdmissionModal('Pre-Primary (PP1/PP2)')}
                className="w-full py-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-800 font-bold text-xs rounded-lg transition"
              >
                Enquire for Early Years
              </button>
            </div>
          </div>

          {/* Level 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-amber-500 transition group flex flex-col">
            <div className="h-36 overflow-hidden relative">
              <img
                src="/images/school_classroom_1789375038153.jpg"
                alt="Primary School Learners in Class"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-[#0F1E36] text-amber-400 px-2.5 py-0.5 rounded shadow">
                Middle School
              </span>
            </div>
            <div className="bg-[#0F1E36] text-white p-4 text-center space-y-0.5">
              <h3 className="text-base font-bold font-['Cinzel',serif]">Primary (Grade 1 – 6)</h3>
              <p className="text-xs text-amber-300">Ages 6 - 11 Years</p>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                Deepening reading comprehension, mathematical problem solving, agricultural practice, science
                investigation, and creative artistic expression.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Continuous Assessment Tests (CATs)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Digital literacy & computer basics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>KPSEA national benchmark guidance</span>
                </li>
              </ul>
              <button
                onClick={() => openAdmissionModal('Primary (Grade 1-6)')}
                className="w-full py-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-800 font-bold text-xs rounded-lg transition"
              >
                Enquire for Primary
              </button>
            </div>
          </div>

          {/* Level 3 */}
          <div className="bg-white rounded-2xl border-2 border-amber-500 overflow-hidden shadow-md group flex flex-col">
            <div className="h-36 overflow-hidden relative">
              <img
                src="/images/science_lab_pupils_1789375054803.jpg"
                alt="Junior Secondary Science Lab Practical"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded font-extrabold shadow">
                Flagship JSS
              </span>
            </div>
            <div className="bg-gradient-to-r from-[#0F1E36] to-amber-950 text-white p-4 text-center space-y-0.5">
              <h3 className="text-base font-bold font-['Cinzel',serif]">Junior Secondary (Grade 7 – 9)</h3>
              <p className="text-xs text-amber-300">Ages 12 - 14 Years</p>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                Specialized learning pathways: Pure Sciences, Pre-Technical Studies, Computer Coding, Agriculture, and
                Social Studies preparing students for Senior School transitions.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fully equipped science practical laboratory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Computer programming & coding lab</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Career exploration & mentorship</span>
                </li>
              </ul>
              <button
                onClick={() => openAdmissionModal('Grade 7 Alpha (Junior Secondary)')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-lg transition shadow-sm"
              >
                Enquire for Junior Secondary (JSS)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR TEACHERS PREVIEW */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                Passionate Educators
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
                Meet Our School Faculty
              </h2>
            </div>
            <button
              onClick={() => navigate('teachers')}
              className="px-4 py-2 bg-[#0F1E36] hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>View All Teachers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.slice(0, 3).map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
              >
                <div className="h-44 bg-gradient-to-tr from-[#0F1E36] to-[#1E3A8A] relative overflow-hidden flex items-center justify-center p-4">
                  <div className="w-24 h-24 rounded-full border-2 border-amber-400 overflow-hidden bg-white shadow-lg">
                    <img
                      src={teacher.photoUrl || '/amani_logo.jpg'}
                      alt={teacher.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded">
                    {teacher.position}
                  </span>
                </div>

                <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{teacher.fullName}</h4>
                    <p className="text-xs font-semibold text-amber-700">{teacher.department}</p>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                      {teacher.biography}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{teacher.specialization.slice(0, 28)}...</span>
                    <button
                      onClick={() => navigate('teachers')}
                      className="text-amber-700 font-bold hover:underline"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CO-CURRICULAR & FACILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              Beyond the Classroom
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
              Dynamic Co-Curricular & Sports Culture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              At Amani, character is tested and strengthened on the field, on the stage, and in the community.
              Our students participate in athletics, football, netball, chess, drama, scout movement, and agricultural
              4-K projects.
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-bold text-slate-800">Coast Regional Sports Champions</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold text-slate-800">Robotics & STEM Science Club</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-bold text-slate-800">Scouts & Red Cross Society</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="font-bold text-slate-800">Drama & Music Festival Choir</span>
              </div>
            </div>

            <button
              onClick={() => navigate('gallery')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-2"
            >
              <span>View School Activities Gallery</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/images/school_assembly_parade_1789375103863.jpg"
                  alt="Amani Morning Assembly & Campus Quadrangle"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-3 bg-white text-xs font-bold text-slate-800">Morning Assembly & Parade Quadrangle</div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/images/science_lab_pupils_1789375054803.jpg"
                  alt="Junior Secondary Science Practical Lab"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-3 bg-white text-xs font-bold text-slate-800">Junior Secondary Science Labs</div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/images/school_library_kids_1789375085243.jpg"
                  alt="Modern School Library & Reading Resource Center"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-3 bg-white text-xs font-bold text-slate-800">School Library & Reading Hub</div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
              <div className="h-44 overflow-hidden relative">
                <img
                  src="/images/school_sports_field_1789375069974.jpg"
                  alt="School Sports Fields & Athletics Games"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-3 bg-white text-xs font-bold text-slate-800">Athletics & Sports Playing Fields</div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LATEST NEWS & UPCOMING EVENTS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Announcements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                    Bulletins & Circulars
                  </span>
                  <h3 className="text-xl font-bold text-[#0F1E36] font-['Cinzel',serif]">
                    Latest School Notices
                  </h3>
                </div>
                <button
                  onClick={() => navigate('news-events')}
                  className="text-xs font-bold text-amber-700 hover:underline"
                >
                  See All
                </button>
              </div>

              <div className="space-y-3">
                {announcements.slice(0, 3).map((ann) => (
                  <div
                    key={ann.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 transition"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded">
                        {ann.category}
                      </span>
                      <span>{ann.publishedDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest">
                    Academic Calendar
                  </span>
                  <h3 className="text-xl font-bold text-[#0F1E36] font-['Cinzel',serif]">
                    Upcoming School Events
                  </h3>
                </div>
                <button
                  onClick={() => navigate('news-events')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Calendar
                </button>
              </div>

              <div className="space-y-3">
                {events.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-emerald-400 transition"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#0F1E36] text-amber-400 flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-extrabold uppercase">
                        {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black font-mono leading-none">
                        {new Date(evt.date).getDate()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-900">{evt.title}</h4>
                      <div className="text-[11px] text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{evt.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600" />
                          <span>{evt.venue.split(',')[0]}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{evt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. ADMISSIONS CALL-TO-ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] p-8 sm:p-14 text-white shadow-2xl border-2 border-amber-500">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/40 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
              Enrolment Open for 2026 Academic Year
            </span>
            <h2 className="text-2xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
              Give Your Child the Foundation to Strive & Achieve
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We welcome new admissions for <strong>Pre-Primary (PP1 & PP2)</strong>,{' '}
              <strong>Primary (Grade 1–6)</strong>, and our premier{' '}
              <strong>Junior Secondary School (Grade 7, 8 & 9)</strong>. Schedule a campus tour or apply online
              today.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <button
                onClick={() => openAdmissionModal()}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl transition active:scale-95 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Submit Admission Enquiry</span>
              </button>

              <button
                onClick={() => openEscalationModal('Campus Tour Request')}
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call Director: 0718540922</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. LOCATION & CONTACT OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
                Visit Our Campus
              </span>
              <h3 className="text-xl font-bold text-[#0F1E36] font-['Cinzel',serif]">
                Conveniently Situated in Mazeras
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Located within Mazeras, along the Mombasa-Nairobi transportation artery with safe, designated school
                transport coverage extending to Mariakani, Miritini, and surrounding Kwale communities.
              </p>
              <div className="pt-2 text-xs space-y-1.5 font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>{settings.postalAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Director: {settings.directorPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Headteacher: {settings.headteacherPhone}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-slate-100 rounded-xl p-6 border border-slate-200 flex flex-col justify-between">
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#0F1E36]">Office Visiting Hours:</h4>
                <p className="text-xs text-slate-600">
                  {settings.officeHours}. Admissions staff are readily available to guide parents on registration
                  requirements, uniforms, and student transport routes.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => navigate('contact')}
                  className="px-4 py-2 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                >
                  Contact Page & Map Details
                </button>
                <button
                  onClick={toggleChatbot}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask Amani Assistant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
