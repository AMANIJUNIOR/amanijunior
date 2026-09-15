import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  FileCheck,
  Download,
  Phone,
  CheckCircle2,
  Calendar,
  Bus,
  Sparkles,
  HelpCircle,
  Clock,
  Shirt,
  DollarSign,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const { openAdmissionModal, openEscalationModal, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'process' | 'requirements' | 'fees' | 'uniform' | 'transport'>('process');

  const feeStructure = [
    {
      level: 'Daycare (Tender Care - Below 3 Years)',
      tuition: 'KES 7,000',
      activity: 'KES 1,000',
      lunch: 'KES 3,500 (Optional)',
      total: 'KES 8,000',
    },
    {
      level: 'Playgroup (Early Exploration - Above 3 Years)',
      tuition: 'KES 7,500',
      activity: 'KES 1,000',
      lunch: 'KES 3,500 (Optional)',
      total: 'KES 8,500',
    },
    {
      level: 'Early Years (PP1 & PP2)',
      tuition: 'KES 8,500',
      activity: 'KES 1,500',
      lunch: 'KES 4,000 (Optional)',
      total: 'KES 10,000',
    },
    {
      level: 'Lower Primary (Grade 1 – 3)',
      tuition: 'KES 10,500',
      activity: 'KES 2,000',
      lunch: 'KES 4,000 (Optional)',
      total: 'KES 12,500',
    },
    {
      level: 'Upper Primary (Grade 4 – 6)',
      tuition: 'KES 12,500',
      activity: 'KES 2,500',
      lunch: 'KES 4,500 (Optional)',
      total: 'KES 15,000',
    },
    {
      level: 'Junior Secondary (Grade 7 – 9)',
      tuition: 'KES 15,000',
      activity: 'KES 3,000 (Lab & STEM)',
      lunch: 'KES 4,500 (Optional)',
      total: 'KES 18,000',
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>2026 Academic Year Enrollment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            Admissions & Enrollment Procedures
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Join the Amani Junior Academy and JSS community in Mazeras. Straightforward steps and transparent guidelines.
          </p>
          <div className="pt-2">
            <button
              onClick={() => openAdmissionModal()}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition active:scale-95"
            >
              Fill Online Admission Enquiry
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-200 pb-4">
          {[
            { id: 'process', label: 'Admission Procedure', icon: FileCheck },
            { id: 'requirements', label: 'Entry Requirements', icon: CheckCircle2 },
            { id: 'fees', label: 'Fees Structure', icon: DollarSign },
            { id: 'uniform', label: 'Uniform Guidelines', icon: Shirt },
            { id: 'transport', label: 'Bus Transport Routes', icon: Bus },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition ${
                  activeTab === tab.id
                    ? 'bg-[#0F1E36] text-amber-400 shadow-md'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Tab Contents */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {activeTab === 'process' && (
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <h3 className="text-xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
                Step-by-Step Admission Journey
              </h3>
              <p className="text-xs text-slate-500">From initial contact to the first day of class in Mazeras.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm relative">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-[#0F1E36]">Online Enquiry or Call</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit our online enquiry form or call Director Constance Mwaka Pole (0718540922) to confirm space availability.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm relative">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-[#0F1E36]">Campus Visit & Interview</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Visit the school in Mazeras for a friendly learner evaluation and orientation with Headteacher Nadhiri Chacha Salim.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm relative">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-bold text-[#0F1E36]">Document Submission</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Provide copies of birth certificate, previous school assessment records, NEMIS details, and immunization card.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2 shadow-sm relative">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  4
                </span>
                <h4 className="text-sm font-bold text-[#0F1E36]">Admission & Welcome</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Receive the official admission letter, acquire school uniforms, and onboard onto the Parent Portal.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 text-center space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Need Immediate Assistance with Enrolment?</h4>
              <p className="text-xs text-slate-600 max-w-lg mx-auto">
                Our administrative staff are available Monday to Friday from 7:30 AM to 4:30 PM.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => openAdmissionModal()}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition"
                >
                  Apply Online Now
                </button>
                <button
                  onClick={() => openEscalationModal('Admission Guidance')}
                  className="px-5 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
                >
                  Direct Director Call
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'requirements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-1 rounded inline-block">
                Daycare & Playgroup
              </div>
              <h4 className="text-base font-bold text-[#0F1E36]">Early Childhood Care</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Daycare:</strong> Welcoming children below 3 years of age in a safe, nurturing environment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Playgroup:</strong> Tailored for children above 3 years of age for sensory play & socialization.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Child Health & Immunization card photocopy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Parent/Guardian emergency contact & birth document.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-teal-700 uppercase bg-teal-50 px-2 py-1 rounded inline-block">
                Early Years (PP1 & PP2)
              </div>
              <h4 className="text-base font-bold text-[#0F1E36]">Foundational Entry</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Learner must be at least 4 years old for PP1 or 5 years for PP2.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Certified copy of Birth Certificate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Child Health & Immunization card photocopy.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Two recent passport size color photographs.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <div className="text-xs font-bold text-blue-700 uppercase bg-blue-50 px-2 py-1 rounded inline-block">
                Primary (Grade 1 – 6)
              </div>
              <h4 className="text-base font-bold text-[#0F1E36]">CBC Continuous Progression</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Copy of Learner's Birth Certificate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Official Transfer Letter from previous institution.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Learner NEMIS UPI Number for national portal transfer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Term report cards / CBC Formative Assessment records.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-amber-500 space-y-3 shadow-md">
              <div className="text-xs font-bold text-amber-800 uppercase bg-amber-100 px-2 py-1 rounded inline-block">
                Junior Secondary (Grade 7 – 9)
              </div>
              <h4 className="text-base font-bold text-[#0F1E36]">JSS Flagship Enrolment</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Official KPSEA Result Slip / Assessment transcript (Grade 6).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>NEMIS UPI number and transfer release from previous center.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Learner's Birth Certificate and Parents' ID copies.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Specialization interest interview (STEM, Arts, or Pre-Tech).</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-4 bg-[#0F1E36] text-white flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold font-['Cinzel',serif]">
                    Indicative 2026 Termly Fee Schedule (Per Term)
                  </h4>
                  <p className="text-[11px] text-amber-300">All fees in Kenya Shillings (KES)</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded">
                  Transparent Pricing
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Learning Level</th>
                      <th className="p-3.5">Tuition & Teaching</th>
                      <th className="p-3.5">Activity & Science Lab</th>
                      <th className="p-3.5">Hot Nutritious Lunch</th>
                      <th className="p-3.5 font-extrabold text-[#0F1E36]">Base Term Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {feeStructure.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-slate-900">{row.level}</td>
                        <td className="p-3.5">{row.tuition}</td>
                        <td className="p-3.5">{row.activity}</td>
                        <td className="p-3.5 text-slate-500">{row.lunch}</td>
                        <td className="p-3.5 font-extrabold text-amber-700 font-mono text-sm">
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Flexible Fee Installment Plan:</strong> Parents are supported with staggered termly payments
                (Initial deposit at opening, followed by two convenient installments). Contact the school finance desk
                at 0718540922 for fee bank slips and M-Pesa Paybill payment details.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'uniform' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F1E36]">
                <Shirt className="w-5 h-5 text-amber-600" />
                <span>Primary School Uniform (PP1 – Grade 6)</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>&bull; <strong>Boys:</strong> Navy blue shorts/trousers, sky blue short-sleeved shirts with school crest badge, navy blue socks with yellow rings.</li>
                <li>&bull; <strong>Girls:</strong> Navy blue pleated pinafore or skirt, sky blue blouses with school crest badge, white socks.</li>
                <li>&bull; <strong>Sweater:</strong> Official navy blue V-neck knit sweater with gold trim and embroidered school crest.</li>
                <li>&bull; <strong>Footwear:</strong> Black polished leather shoes.</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border-2 border-amber-500 space-y-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-[#0F1E36]">
                <Shirt className="w-5 h-5 text-amber-600" />
                <span>Junior Secondary Uniform (Grade 7 – 9)</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2">
                <li>&bull; <strong>Young Men:</strong> Official navy blue tailored trousers, crisp white collar shirt, navy blue tie with school gold emblem.</li>
                <li>&bull; <strong>Young Women:</strong> Navy blue pleated skirt, white tailored blouse, navy blue neck tie with school crest.</li>
                <li>&bull; <strong>Blazer:</strong> Distinction navy blue school blazer featuring the official school badge embroidery.</li>
                <li>&bull; <strong>Lab Coats:</strong> White laboratory coats for integrated science practical sessions.</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'transport' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-base font-bold text-[#0F1E36]">
                <Bus className="w-5 h-5 text-amber-600" />
                <span>Safe School Bus Transport Service</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Amani Junior Academy operates verified school vans and buses equipped with speed governors, seatbelts,
                first-aid kits, and trained bus chaperones ensuring door-to-door or designated pick-up security.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs text-slate-800">Route 1: Mazeras Core</h5>
                  <p className="text-[11px] text-slate-500 mt-1">Mazeras Centre, Junction, Railway Quarters, Mwache.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs text-slate-800">Route 2: Mariakani Corridor</h5>
                  <p className="text-[11px] text-slate-500 mt-1">Mariakani Town, Mbuyuni, Kokotoni, Taru junction.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h5 className="font-bold text-xs text-slate-800">Route 3: Miritini / Coast Highway</h5>
                  <p className="text-[11px] text-slate-500 mt-1">Miritini Estate, Bonje, Kibarani turnoff, Jomvu.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
