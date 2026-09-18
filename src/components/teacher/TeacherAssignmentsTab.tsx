import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Assignment } from '../../types';
import { BookOpen, Plus, Calendar, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

interface Props {
  teacherId: string;
  teacherName: string;
  assignedClasses: string[];
  assignedSubjects: string[];
}

export const TeacherAssignmentsTab: React.FC<Props> = ({
  teacherId,
  teacherName,
  assignedClasses,
  assignedSubjects,
}) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState(assignedClasses[0] || 'Grade 7A (JSS)');
  const [subjectName, setSubjectName] = useState(assignedSubjects[0] || 'Mathematics');
  const [dueDate, setDueDate] = useState('2026-03-30');
  const [instructions, setInstructions] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAssignments();
      setAssignments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handlePublishAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructions) return;

    setIsPublishing(true);
    setStatusMessage(null);

    try {
      await api.createAssignment({
        title,
        className,
        subjectName,
        dueDate,
        instructions,
        description: instructions,
        teacherId,
        teacherName,
        createdAt: new Date().toISOString().split('T')[0],
      });

      setTitle('');
      setInstructions('');
      setStatusMessage('Academic assignment handout published successfully!');
      await fetchAssignments();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to publish assignment');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Assignment Publishing Form */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Plus className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-bold text-[#0F1E36] font-['Cinzel',serif]">
            Publish Class Handout / Homework
          </h3>
        </div>

        {statusMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        <form onSubmit={handlePublishAssignment} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Title / Assignment Topic *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Algebraic Expressions Exercise 4.2"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
            >
              {assignedClasses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject *</label>
            <select
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-semibold"
            >
              {assignedSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Submission Deadline *</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Detailed Instructions / Questions *</label>
            <textarea
              required
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide questions, CBC competencies, or lab practical requirements..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={isPublishing}
            className="w-full py-2.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>{isPublishing ? 'Publishing...' : 'Publish to Students'}</span>
          </button>
        </form>
      </div>

      {/* Published Assignments List */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-[#0F1E36] font-['Cinzel',serif]">
              Active Class Handouts ({assignments.length})
            </h3>
          </div>
          <button
            onClick={fetchAssignments}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 rounded-lg transition"
          >
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              Loading published assignments...
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
              No assignments published yet. Use the form to post coursework handouts.
            </div>
          ) : (
            assignments.map((as) => (
              <div
                key={as.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{as.title}</h4>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span className="font-semibold text-amber-800">{as.subjectName}</span>
                      <span>•</span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700">
                        {as.className}
                      </span>
                    </div>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-500">Due: </span>
                    <span className="font-mono font-bold text-red-600">{as.dueDate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {as.instructions || as.description}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Instructor: {as.teacherName || teacherName}</span>
                  <span>Posted: {as.createdAt}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
