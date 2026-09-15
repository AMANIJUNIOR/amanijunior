import React from 'react';
import { useApp } from '../context/AppContext';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';
import {
  Award,
  Target,
  Compass,
  Eye,
  Heart,
  BookOpen,
  Laptop,
  Users,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, teachers, openAdmissionModal, openEscalationModal } = useApp();

  const leadership = [
    {
      role: 'School Director',
      name: 'CONSTANCE MWAKA POLE',
      phone: '0718540922',
      email: 'director@amanijunioracademy.ac.ke',
      qualifications: 'B.Ed (Arts), Dip. Educational Management & Institutional Governance',
      biography:
        'Director Constance Mwaka Pole provides the strategic vision and moral foundation for Amani Junior Academy and JSS. With deep dedication to the Mazeras community, she has championed accessible academic excellence, disciplined leadership, and a compassionate learning sanctuary.',
      photo: '/director_cynthia.jpg',
    },
    {
      role: 'Headteacher',
      name: 'NADHIRI CHACHA SALIM',
      phone: '0114623408',
      email: 'headteacher@amanijunioracademy.ac.ke',
      qualifications: 'B.Ed (Sc), Higher Dip. Quality Assurance & Standards in Education',
      biography:
        'Headteacher Nadhiri Chacha Salim commands daily school administration, curriculum alignment with KICD standards, and faculty supervision. He is committed to nurturing each child’s intellectual curiosity and ensuring high performance in CBC assessments.',
      photo: '/director_prestine.jpg',
    },
    {
      role: 'Deputy Headteacher / ICT Teacher',
      name: 'VITALICE ODHIAMBO',
      phone: '0746529712',
      email: 'vitalice@amanijunioracademy.ac.ke',
      qualifications: 'B.Sc Computer Science & Education, Certified CBC Digital Educator',
      biography:
        'Mr. Vitalice Odhiambo leads the STEM department and student discipline. As the ICT administrator, he manages the computer laboratory, digital learning platforms, coding clubs, and school technology systems.',
      photo: '/amani_ict.jpg',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Institutional Profile</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            About Amani Junior Academy and JSS
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            "STRIVE TO ACHIEVE" &bull; P.O. Box 93-80114, Mazeras, Kenya
          </p>
        </div>
      </section>

      {/* 1. Our Story & Who We Are */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              Foundational Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
              Our Story & Who We Are
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong>Amani Junior Academy and JSS</strong> was founded to provide transformative, value-based education
              in Mazeras, Kwale County. Established under the banner of peace, integrity, and relentless striving for
              excellence, the school has evolved into a premier educational institution providing seamless progression
              from Early Childhood Development Education (PP1 and PP2) through Primary (Grade 1 to 6) and Junior
              Secondary School (Grade 7 to 9).
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Our campus provides an environment where pupils are treated as unique individuals, equipped with the
              technological literacy and moral fortitude required to thrive in a dynamic, modern world.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-slate-800">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-amber-700 block text-[11px] uppercase">School Motto</span>
                <span className="text-sm font-['Cinzel',serif]">"STRIVE TO ACHIEVE"</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-emerald-700 block text-[11px] uppercase">Location</span>
                <span className="text-sm">Mazeras, Kenya</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-amber-500/20">
              <img
                src="/amani_hero.jpg"
                alt="Amani Campus Learning Environment"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Vision, Mission & Core Values */}
      <section className="bg-slate-100/80 py-14 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Vision */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-['Cinzel',serif] text-[#0F1E36]">Our Vision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To be a renowned center of academic distinction, character formation, and technological innovation,
                inspiring every learner to fulfill their God-given potential and impact society positively.
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-['Cinzel',serif] text-[#0F1E36]">Our Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                To nurture all-round, disciplined, and innovative learners through quality competency-based curriculum,
                modern technology, and holistic co-curricular programmes grounded in moral principles.
              </p>
            </div>

            {/* Core Values */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-['Cinzel',serif] text-[#0F1E36]">Core Values</h3>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span><strong>Excellence:</strong> Relentless pursuit of quality.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span><strong>Integrity:</strong> Moral character, honesty and truth.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span><strong>Discipline:</strong> Self-control and respectful stewardship.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span><strong>Innovation:</strong> Creative STEM problem solving.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. School Philosophy & Educational Approaches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <BookOpen className="w-6 h-6 text-amber-600" />
            <h4 className="text-sm font-bold text-[#0F1E36]">Academic Approach</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Learner-centered pedagogies emphasizing critical thinking, hands-on scientific projects, and regular
              diagnostic assessments to identify and bridge learning gaps.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <Heart className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-bold text-[#0F1E36]">Learner Development</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Fostering emotional intelligence, leadership roles through student councils, public speaking confidence,
              and spiritual wellness through pastoral care.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <Award className="w-6 h-6 text-blue-600" />
            <h4 className="text-sm font-bold text-[#0F1E36]">Co-Curricular Growth</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vibrant sports programmes in football, volleyball, athletics, complemented by creative arts, music choir,
              debating, and 4-K agriculture clubs.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <Laptop className="w-6 h-6 text-purple-600" />
            <h4 className="text-sm font-bold text-[#0F1E36]">Technology in Education</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              State-of-the-art computer laboratory introducing learners to coding, typing literacy, research skills,
              and online educational learning portals.
            </p>
          </div>
        </div>
      </section>

      {/* 4. OFFICIAL SCHOOL LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
            Institutional Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
            School Leadership
          </h2>
          <p className="text-xs text-slate-600">
            Dedicated administrative stewardship ensuring uncompromised educational quality and child safeguarding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {leadership.map((leader, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm hover:border-amber-500 transition group flex flex-col"
            >
              <div className="h-52 bg-gradient-to-tr from-[#0F1E36] to-[#1E3A8A] flex flex-col items-center justify-center p-6 relative">
                <div className="w-28 h-28 rounded-full border-4 border-amber-400 overflow-hidden shadow-xl bg-white">
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-amber-500 text-slate-950 font-extrabold text-[10px] rounded uppercase">
                  {leader.role}
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
                    {leader.name}
                  </h3>
                  <div className="text-xs text-amber-700 font-semibold mt-0.5">{leader.qualifications}</div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">{leader.biography}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs space-y-1">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Direct Phone: <a href={`tel:${leader.phone}`} className="font-mono font-bold text-amber-700 hover:underline">{leader.phone}</a></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-mono text-[11px] text-slate-600">{leader.email}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CAMPUS FACILITIES & SCHOOL LIFE SHOWCASE */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-amber-600 uppercase tracking-widest">
              Nurturing Excellence & Discovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] font-['Cinzel',serif]">
              Campus Facilities & School Life
            </h2>
            <p className="text-xs text-slate-600">
              Modern classrooms, integrated CBC science labs, digital ICT coding centers, libraries, and vibrant athletics fields.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Primary & CBC Classrooms */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/school_classroom_1789375038153.jpg"
                  alt="Modern CBC Classrooms & Collaborative Learning"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-extrabold rounded uppercase">
                  Active Classrooms
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-[#0F1E36]">Modern CBC Classrooms</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Spacious, well-ventilated learning spaces with individual learner desks, teaching aids, and collaborative seating.
                </p>
              </div>
            </div>

            {/* Science Laboratory */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/science_lab_pupils_1789375054803.jpg"
                  alt="Hands-on Integrated Science & Biology Lab"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-extrabold rounded uppercase">
                  STEM & Science
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-[#0F1E36]">Integrated Science Laboratory</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Equipped with optical microscopes, biology specimen kits, glassware, and experiment stations for Junior Secondary.
                </p>
              </div>
            </div>

            {/* ICT Lab */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/amani_ict_lab_1789049756612.jpg"
                  alt="Modern ICT Computer & Coding Lab"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded uppercase">
                  Digital Hub
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-[#0F1E36]">Modern ICT & Coding Lab</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Networked student workstations, coding tutorials, digital typing software, and internet research tools.
                </p>
              </div>
            </div>

            {/* School Library */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/school_library_kids_1789375085243.jpg"
                  alt="School Library & Reading Hub"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-purple-600 text-white text-[10px] font-extrabold rounded uppercase">
                  Reading & Research
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-[#0F1E36]">School Library & Resource Hub</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enriching collection of storybooks, reference materials, national exam guides, and silent study tables.
                </p>
              </div>
            </div>

            {/* School Assembly & Grounds */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/school_assembly_parade_1789375103863.jpg"
                  alt="Morning Assembly & Campus Quadrangle"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#0F1E36] text-amber-400 text-[10px] font-extrabold rounded uppercase">
                  Assembly Grounds
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-[#0F1E36]">Morning Assembly & Parade Quad</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Paved ceremonial quadrangle where daily morning devotions, national anthem ceremonies, and awards take place.
                </p>
              </div>
            </div>

            {/* Sports Playing Fields */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition group">
              <div className="h-48 overflow-hidden relative">
                <img
                  src="/images/school_sports_field_1789375069974.jpg"
                  alt="Athletics & Sports Playing Fields"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-extrabold rounded uppercase">
                  Athletics & Sports
                </span>
              </div>
              <div className="p-4 space-y-1.5">
                <h3 className="font-bold text-sm text-[#0F1E36]">Sports Grounds & Athletics Fields</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vibrant sports field hosting soccer matches, track athletics, physical education lessons, and inter-house competitions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="p-8 bg-slate-100 rounded-2xl border border-slate-300 text-center space-y-4">
          <h3 className="text-xl font-bold text-[#0F1E36] font-['Cinzel',serif]">
            Want to Discuss Your Child’s Educational Journey?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl mx-auto">
            Our Director Constance Mwaka Pole and Headteacher Nadhiri Chacha Salim welcome prospective parents for
            personalized school tours and academic consultations in Mazeras.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => openAdmissionModal()}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition"
            >
              Book Admission Tour
            </button>
            <button
              onClick={() => openEscalationModal('Leadership Consultation')}
              className="px-5 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
            >
              Talk to Leadership
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
