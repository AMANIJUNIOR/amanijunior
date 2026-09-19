import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StudentReportCard, SchoolClass, SchoolSettings } from '../../types';
import { useApp } from '../../context/AppContext';
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
  Sparkles,
  Phone,
} from 'lucide-react';
import { SchoolLogoBadge } from '../SchoolLogoBadge';
import { AcademicYearTermSelector } from '../common/AcademicYearTermSelector';
import { InfiniteCalendarModal } from '../common/InfiniteCalendarModal';

interface Props {
  classes?: SchoolClass[];
  settings?: SchoolSettings;
}

export const ReportCardsTab: React.FC<Props> = ({ classes: propClasses, settings: propSettings }) => {
  const context = useApp();
  const classes = propClasses || context.classes;
  const settings = propSettings || context.settings;

  const [reportCards, setReportCards] = useState<StudentReportCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState<string>(
    classes && classes.length > 0 ? classes[0].name : 'Grade 7'
  );
  const [academicYear, setAcademicYear] = useState(settings?.academicYear || '2026');
  const [term, setTerm] = useState(settings?.currentTerm || `Term 1, ${settings?.academicYear || '2026'}`);
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedCard, setSelectedCard] = useState<StudentReportCard | null>(null);
  const [isBulkPrintPreview, setIsBulkPrintPreview] = useState(false);

  const fetchReportCards = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReportCards({
        classId: selectedClass === 'ALL' ? undefined : selectedClass,
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

  const handlePrintBulk = () => {
    setIsBulkPrintPreview(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const filteredCards = reportCards.filter((card) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (card.studentName || '').toLowerCase().includes(q) ||
      (card.studentId || '').toLowerCase().includes(q) ||
      (card.admissionNumber || '').toLowerCase().includes(q) ||
      (card.class || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36]">
              Consolidated Learner Report Cards
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
            Official CBC progress reports for Amani Junior Academy and JSS in Mazeras, Kilifi County. Automatically includes all curriculum subjects (recording missing marks as 0%).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handlePrintBulk}
            className="px-4 py-2 bg-[#0F1E36] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm"
            title="Generate and print report cards for all students in this cohort"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Bulk Batch ({filteredCards.length})</span>
          </button>
        </div>
      </div>

      {/* Cohort, Year, Term & Search Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center justify-between print:hidden">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-700">Class:</span>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Classes & Grades</option>
            {classes.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <AcademicYearTermSelector
            selectedYear={academicYear}
            onYearChange={setAcademicYear}
            selectedTerm={term}
            onTermChange={setTerm}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student or Adm No..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>

          <button
            onClick={fetchReportCards}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg transition shrink-0"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 print:hidden">
          Generating consolidated student report cards...
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 print:hidden">
          No students found matching your search. Register students or adjust the class filter to generate report cards.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
          {filteredCards.map((card) => (
            <div
              key={card.studentId || card.admissionNumber}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-[#0F1E36] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {card.studentId}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-1">
                      {card.studentName}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Adm: {card.admissionNumber} • {card.class}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-700 font-serif">
                      {card.overallGrade}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {card.averagePercentage}% Aggregate
                    </div>
                  </div>
                </div>

                {/* Ranking Pill (if enabled) */}
                {card.classPosition && (
                  <div className="mt-2 text-xs font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md inline-block">
                    Position: {card.classPosition}
                  </div>
                )}

                {/* Mini Subject breakdown */}
                <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                    <span>Curriculum Subjects ({card.subjects?.length || 0})</span>
                    <span>Score (Grade)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    {(card.subjects || []).slice(0, 8).map((sub, idx) => (
                      <div
                        key={`${sub.subjectCode || sub.subjectName}-${idx}`}
                        className="flex justify-between items-center bg-slate-50 px-2 py-1 rounded border border-slate-100"
                      >
                        <span className="truncate max-w-[85px] font-medium text-slate-700" title={sub.subjectName}>
                          {sub.subjectName}
                        </span>
                        <span className="font-mono font-bold text-slate-900 shrink-0">
                          {sub.percentage}% ({sub.grade})
                        </span>
                      </div>
                    ))}
                  </div>
                  {(card.subjects?.length || 0) > 8 && (
                    <div className="text-[10px] text-slate-400 text-right pt-0.5">
                      +{(card.subjects?.length || 0) - 8} more subjects in full report
                    </div>
                  )}
                </div>

                {/* Attendance */}
                <div className="mt-3 text-[11px] text-slate-600 flex justify-between items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span>Attendance:</span>
                  <span className="font-bold text-emerald-700">
                    {card.attendanceDaysPresent} / {card.attendanceDaysTotal} Days ({card.attendancePercentage}%)
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setSelectedCard(card)}
                  className="flex-1 py-2 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>View & Print</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SINGLE REPORT CARD MODAL: Full Official Report Card Print Preview */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-4 print:overflow-visible">
            {/* Action Bar (hidden on print) */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Official Learner Progress Report Book Preview
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintSingle}
                  className="px-4 py-2 bg-[#0F1E36] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow hover:bg-slate-800 transition"
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

            {/* Official Report Card Layout */}
            <ReportCardSheet card={selectedCard} issueDate={issueDate} onOpenCalendar={() => setIsCalendarOpen(true)} />
          </div>
        </div>
      )}

      {/* BULK PRINT MODAL / CONTAINER */}
      {isBulkPrintPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white rounded-2xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto print:max-h-none print:shadow-none print:border-none print:p-0 print:overflow-visible">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 print:hidden">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Bulk Batch Report Cards Printing Preview ({filteredCards.length} Learners)
                </h3>
                <p className="text-xs text-slate-500">
                  Each report card is automatically formatted for standard A4 printing with clean page breaks.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#0F1E36] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>Print All {filteredCards.length} Pages</span>
                </button>
                <button
                  onClick={() => setIsBulkPrintPreview(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-8 print:space-y-0">
              {filteredCards.map((c, index) => (
                <div
                  key={c.studentId || index}
                  className="break-after-page print:break-after-page page-break"
                  style={{ pageBreakAfter: 'always', breakAfter: 'page' }}
                >
                  <ReportCardSheet card={c} issueDate={issueDate} onOpenCalendar={() => setIsCalendarOpen(true)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Infinite Calendar Picker Modal */}
      <InfiniteCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        selectedDate={issueDate}
        onSelectDate={(newDate) => setIssueDate(newDate)}
        title="Report Card Issue Date Calendar"
        subtitle="Select any official release date across any academic year without restriction."
      />
    </div>
  );
};

// Reusable Official Single Report Card Sheet for Screen and Print
const ReportCardSheet: React.FC<{
  card: StudentReportCard;
  issueDate: string;
  onOpenCalendar: () => void;
}> = ({ card, issueDate, onOpenCalendar }) => {
  return (
    <div className="border-4 border-[#0F1E36] p-6 sm:p-8 rounded-2xl space-y-5 bg-white text-slate-900 print:border-4 print:p-6 print:rounded-none">
      {/* Institutional Header */}
      <div className="text-center space-y-1.5 pb-3 border-b-2 border-slate-300">
        <div className="flex justify-center mb-1">
          <img
            src="/amani_logo.jpg"
            alt="Amani Junior Academy Official School Logo"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-full border-2 border-amber-500 p-0.5 shadow-sm"
            referrerPolicy="no-referrer"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold font-['Cinzel',serif] text-[#0F1E36] tracking-wide">
          AMANI JUNIOR ACADEMY AND JSS
        </h1>
        <p className="text-xs font-bold tracking-widest text-amber-700 uppercase">
          Motto: "{card.schoolMotto || 'STRIVE TO ACHIEVE'}"
        </p>
        <p className="text-[11px] text-slate-600">
          Mazeras, Kilifi County, Kenya • P.O. Box 93-80114 | Phone: 0718540922 / 0114623408 / 0746529712
        </p>
        <div className="inline-block px-4 py-0.5 bg-[#0F1E36] text-white font-bold text-[11px] uppercase tracking-wider rounded-md mt-1">
          Official Learner Continuous Assessment & Progress Report
        </div>
      </div>

      {/* Learner & Cohort Info Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div>
          <span className="text-slate-500 block text-[10px]">Learner Full Name:</span>
          <span className="font-bold text-slate-900 text-sm">{card.studentName}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Student ID:</span>
          <span className="font-mono font-bold text-[#0F1E36]">{card.studentId}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Admission Number:</span>
          <span className="font-mono font-bold text-slate-800">{card.admissionNumber}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Class & Cohort:</span>
          <span className="font-bold text-slate-800">{card.class}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Academic Year:</span>
          <span className="font-bold text-slate-800">{card.academicYear}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Assessment Term:</span>
          <span className="font-bold text-slate-800">{card.term}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Attendance Register:</span>
          <span className="font-bold text-emerald-800">
            {card.attendanceDaysPresent} / {card.attendanceDaysTotal} Days ({card.attendancePercentage}%)
          </span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Class Standing / Rank:</span>
          <span className="font-bold text-indigo-900">
            {card.classPosition ? `Rank: ${card.classPosition}` : 'CBC Competency-Based'}
          </span>
        </div>
      </div>

      {/* Subject Assessment Matrix */}
      <div className="overflow-x-auto border border-slate-300 rounded-xl">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#0F1E36] text-white font-bold uppercase text-[10px]">
              <th className="p-2">Subject / Learning Area</th>
              <th className="p-2 text-center">Score</th>
              <th className="p-2 text-center">Percentage</th>
              <th className="p-2 text-center">Grade</th>
              <th className="p-2">Competencies & Teacher Remark</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {(card.subjects || []).map((sub, idx) => (
              <tr key={`${sub.subjectCode || sub.subjectName}-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                <td className="p-2 font-bold text-slate-900">
                  {sub.subjectName}
                  {sub.subjectCode && (
                    <span className="ml-1.5 font-mono text-[10px] text-slate-400 font-normal">
                      [{sub.subjectCode}]
                    </span>
                  )}
                </td>
                <td className="p-2 text-center font-mono font-bold text-slate-800">
                  {sub.marksObtained} / {sub.maxMarks}
                </td>
                <td className="p-2 text-center font-mono font-semibold text-slate-800">
                  {sub.percentage}%
                </td>
                <td className="p-2 text-center font-bold text-amber-700">
                  {sub.grade}
                </td>
                <td className="p-2 text-slate-700 text-[11px]">
                  {sub.teacherComment || 'Satisfactory achievement in CBC core competencies.'}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 text-xs">
              <td className="p-2 text-slate-900 font-extrabold">Aggregate Academic Summary</td>
              <td className="p-2 text-center font-mono text-[#0F1E36] font-extrabold">
                {card.totalMarksObtained} / {card.totalMaxPossible}
              </td>
              <td className="p-2 text-center font-mono text-emerald-800 font-extrabold">
                {card.averagePercentage}%
              </td>
              <td className="p-2 text-center text-amber-700 text-sm font-extrabold">
                {card.overallGrade}
              </td>
              <td className="p-2 text-slate-700 italic text-[11px]">
                {card.overallRemark || (
                  card.averagePercentage >= 75
                    ? 'Exceeding Expectations (EE) — High academic dedication'
                    : card.averagePercentage >= 50
                    ? 'Meeting Expectations (ME) — Steady consistent progress'
                    : 'Approaching Expectations (AE) — Requires targeted reinforcement'
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Administrative Remarks & Sign-off */}
      <div className="grid sm:grid-cols-2 gap-3 pt-1 text-xs">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
            Headteacher's Official Remarks
          </div>
          <p className="text-slate-700 italic text-xs leading-relaxed">
            {card.headteacherRemarks || `Learner ${card.studentName} exhibits commendable potential. Strive to achieve excellence.`}
          </p>
          <div className="pt-3 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-200 mt-2">
            <span className="font-bold">{card.headteacherName || 'Nadhiri Chacha Salim'} (Headteacher)</span>
            <button
              type="button"
              onClick={onOpenCalendar}
              title="Click to set date using Infinite Calendar"
              className="font-mono text-slate-700 hover:text-amber-700 hover:underline flex items-center gap-1 cursor-pointer bg-white hover:bg-amber-50 px-2 py-0.5 rounded border border-slate-300 shadow-xs transition print:border-none"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-600 print:hidden" />
              <span>Date: {issueDate.split('-').reverse().join('/')}</span>
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col justify-between">
          <div>
            <div className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Director's Institutional Seal & Authorization
            </div>
            <p className="text-slate-600 text-xs mt-1">
              Amani Junior Academy and JSS — Mazeras, Kilifi County
            </p>
          </div>
          <div className="pt-4 border-b border-dashed border-slate-400 flex justify-between items-end pb-1 text-[11px] text-slate-600">
            <span className="font-bold">{card.directorName || 'Constance Mwaka Pole'} (Director)</span>
            <span className="font-mono font-bold text-slate-500 uppercase tracking-widest text-[9px] border border-slate-300 px-1.5 py-0.5 rounded bg-white">
              Official Seal
            </span>
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-slate-400 tracking-wider">
        "STRIVE TO ACHIEVE" • MAZERAS, KILIFI COUNTY, KENYA • P.O. BOX 93-80114
      </div>
    </div>
  );
};
