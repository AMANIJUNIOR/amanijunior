import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentReportCard, SchoolClass, SchoolSettings } from '../../types';
import {
  FileText,
  Printer,
  Search,
  Filter,
  GraduationCap,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  Eye,
  X,
  School,
} from 'lucide-react';
import { SchoolLogoBadge } from '../SchoolLogoBadge';

interface Props {
  classes: SchoolClass[];
  settings: SchoolSettings;
}

export const ReportCardsTab: React.FC<Props> = ({ classes, settings }) => {
  const [reportCards, setReportCards] = useState<StudentReportCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState('Grade 7A (JSS)');
  const [academicYear, setAcademicYear] = useState('2026');
  const [term, setTerm] = useState('Term 1, 2026');

  // Single report card modal view / print preview
  const [selectedCard, setSelectedCard] = useState<StudentReportCard | null>(null);

  const fetchReportCards = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReportCards({
        classId: selectedClass,
        academicYear,
        term,
      });
      setReportCards(data);
    } catch (err) {
      console.error('Error fetching report cards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportCards();
  }, [selectedClass, academicYear, term]);

  const handlePrintSingle = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <span>Consolidated Report Cards & Assessment Registers</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-compiles verified continuous assessment scores across all subject teachers into official physical report cards.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2.5 bg-[#0F1E36] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm self-start sm:self-auto shrink-0"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print Class Batch Reports</span>
        </button>
      </div>

      {/* Cohort & Term Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="2026">Academic Year 2026</option>
            <option value="2025">Academic Year 2025</option>
          </select>

          <select
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="Term 1, 2026">Term 1, 2026</option>
            <option value="Term 2, 2026">Term 2, 2026</option>
            <option value="Term 3, 2026">Term 3, 2026</option>
          </select>
        </div>

        <button
          onClick={fetchReportCards}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg transition"
        >
          Regenerate
        </button>
      </div>

      {/* Report Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          Generating consolidated student report cards...
        </div>
      ) : reportCards.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
          No approved student marks found for {selectedClass} in {term}. Ensure subject teachers have submitted and approved marks.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((card) => (
            <div
              key={card.student.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#0F1E36] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {card.student.studentId}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">
                      {card.student.fullName}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Adm: {card.student.admissionNumber} | {card.student.class}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-700 font-serif">
                      {card.overallGrade}
                    </div>
                    <div className="text-[11px] text-slate-500">{card.averagePercentage}% Avg</div>
                  </div>
                </div>

                {/* Ranking Pill (if enabled) */}
                {card.rank && (
                  <div className="mt-2 text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md inline-block">
                    Class Position: {card.rank}
                  </div>
                )}

                {/* Mini Subject breakdown */}
                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Subject Scores ({card.subjectResults.length})
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {card.subjectResults.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded border border-slate-100"
                      >
                        <span className="truncate max-w-[90px] font-medium text-slate-700">
                          {sub.subjectName}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {sub.marksObtained} ({sub.calculatedGrade})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance */}
                <div className="mt-3 text-[11px] text-slate-600 flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span>Attendance Record:</span>
                  <span className="font-bold text-emerald-700">
                    {card.attendance.presentDays}/{card.attendance.totalSessions} Days ({card.attendance.rate}%)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCard(card)}
                className="w-full py-2 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>View Full Printable Report</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Full Official Report Card Print Preview */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-6 print:overflow-visible">
            {/* Action Bar (hidden on print) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Learner Progress Report Book Preview
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintSingle}
                  className="px-3.5 py-1.5 bg-[#0F1E36] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print Report Card</span>
                </button>
                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Report Card Body for Physical Print */}
            <div className="border-4 border-[#0F1E36] p-6 sm:p-8 rounded-2xl space-y-6 bg-white text-slate-900">
              {/* Institutional Header */}
              <div className="text-center space-y-2 pb-4 border-b-2 border-slate-300">
                <div className="flex justify-center">
                  <img
                    src="/amani_logo.jpg"
                    alt="Amani Junior Academy Official School Logo"
                    className="w-20 h-20 object-contain rounded-full border-2 border-amber-500 p-0.5 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] text-[#0F1E36] tracking-wide">
                  AMANI JUNIOR ACADEMY AND JSS
                </h1>
                <p className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                  Motto: "STRIVE TO ACHIEVE"
                </p>
                <p className="text-xs text-slate-600">
                  P.O. BOX 93-80114, MAZERAS, KENYA | Phone: 0718540922 / 0114623408
                </p>
                <div className="inline-block px-4 py-1 bg-[#0F1E36] text-white font-bold text-xs uppercase tracking-wider rounded-md mt-1">
                  OFFICIAL LEARNER'S CONTINUOUS ASSESSMENT REPORT
                </div>
              </div>

              {/* Learner & Cohort Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Learner Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedCard.student.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Unique Student ID:</span>
                  <span className="font-mono font-bold text-[#0F1E36]">{selectedCard.student.studentId}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Admission Number:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCard.student.admissionNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Class & Cohort:</span>
                  <span className="font-bold text-slate-800">{selectedCard.student.class}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Academic Year:</span>
                  <span className="font-bold text-slate-800">{selectedCard.academicYear}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Assessment Term:</span>
                  <span className="font-bold text-slate-800">{selectedCard.term}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Term Attendance:</span>
                  <span className="font-bold text-emerald-800">
                    {selectedCard.attendance.presentDays} / {selectedCard.attendance.totalSessions} Days ({selectedCard.attendance.rate}%)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Class Standing:</span>
                  <span className="font-bold text-indigo-900">
                    {selectedCard.rank ? `Position ${selectedCard.rank}` : 'Competency-Based'}
                  </span>
                </div>
              </div>

              {/* Subject Assessment Matrix */}
              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0F1E36] text-white font-bold uppercase text-[11px]">
                      <th className="p-2.5">Subject</th>
                      <th className="p-2.5 text-center">Score</th>
                      <th className="p-2.5 text-center">Percentage</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5">Competencies & Teacher Remark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedCard.subjectResults.map((sub, idx) => (
                      <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="p-2.5 font-bold text-slate-900">{sub.subjectName}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-800">
                          {sub.marksObtained} / {sub.maxMarks}
                        </td>
                        <td className="p-2.5 text-center font-mono font-semibold text-slate-800">
                          {sub.percentage}%
                        </td>
                        <td className="p-2.5 text-center font-bold text-amber-700">
                          {sub.calculatedGrade}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {sub.feedback?.teacherComment ||
                            (sub.feedback?.strengths ? `Strengths: ${sub.feedback.strengths}` : 'Satisfactory achievement in CBC core competencies.')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                      <td className="p-2.5 text-slate-900">Aggregate / Overall Performance</td>
                      <td className="p-2.5 text-center font-mono text-[#0F1E36]">
                        {selectedCard.totalMarks} / {selectedCard.subjectResults.reduce((a, b) => a + b.maxMarks, 0)}
                      </td>
                      <td className="p-2.5 text-center font-mono text-emerald-800">
                        {selectedCard.averagePercentage}%
                      </td>
                      <td className="p-2.5 text-center text-amber-700 text-sm">
                        {selectedCard.overallGrade}
                      </td>
                      <td className="p-2.5 text-slate-700 italic">
                        {selectedCard.averagePercentage >= 75
                          ? 'Exceeding Expectations (EE) — High academic dedication'
                          : selectedCard.averagePercentage >= 50
                          ? 'Meeting Expectations (ME) — Steady consistent progress'
                          : 'Approaching Expectations (AE) — Requires targeted reinforcement'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Administrative Remarks & Sign-off */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                    Headteacher's Official Remarks
                  </div>
                  <p className="text-slate-700 italic text-xs leading-relaxed">
                    {selectedCard.headteacherRemarks}
                  </p>
                  <div className="pt-4 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Nadhiri Chacha Salim (Headteacher)</span>
                    <span className="font-mono">Date: 14/04/2026</span>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                      Director's Institutional Seal & Stamp
                    </div>
                    <p className="text-slate-600 text-xs mt-1">
                      Amani Junior Academy and JSS — Official Assessment Record
                    </p>
                  </div>
                  <div className="pt-6 border-b border-dashed border-slate-400 flex justify-between items-end pb-1 text-[11px] text-slate-500">
                    <span>Constance Mwaka Pole (Director)</span>
                    <span className="font-mono">OFFICIAL SEAL</span>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 tracking-wider">
                "STRIVE TO ACHIEVE" • MAZERAS, KENYA • P.O. BOX 93-80114
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
