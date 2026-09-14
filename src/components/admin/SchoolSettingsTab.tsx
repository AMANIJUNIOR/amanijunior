import React, { useState } from 'react';
import { SchoolSettings, GradingScaleItem } from '../../types';
import { api } from '../../services/api';
import {
  Settings,
  Sliders,
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Phone,
  MapPin,
  School,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface Props {
  settings: SchoolSettings;
  onSettingsUpdated: (newSettings: SchoolSettings) => void;
}

export const SchoolSettingsTab: React.FC<Props> = ({ settings, onSettingsUpdated }) => {
  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });
  const [gradingScale, setGradingScale] = useState<GradingScaleItem[]>(
    settings.gradingScale || [
      { min: 80, max: 100, minPercentage: 80, maxPercentage: 100, grade: 'A', description: 'Exceeding Expectations (EE)', descriptor: 'Exceeding Expectations (EE)' },
      { min: 65, max: 79, minPercentage: 65, maxPercentage: 79, grade: 'B', description: 'Meeting Expectations (ME)', descriptor: 'Meeting Expectations (ME)' },
      { min: 50, max: 64, minPercentage: 50, maxPercentage: 64, grade: 'C', description: 'Approaching Expectations (AE)', descriptor: 'Approaching Expectations (AE)' },
      { min: 35, max: 49, minPercentage: 35, maxPercentage: 49, grade: 'D', description: 'Below Expectations (BE)', descriptor: 'Below Expectations (BE)' },
      { min: 0, max: 34, minPercentage: 0, maxPercentage: 34, grade: 'E', description: 'Significantly Below Expectations', descriptor: 'Significantly Below Expectations' },
    ]
  );
  const [rankingEnabled, setRankingEnabled] = useState<boolean>(settings.rankingEnabled ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleGradeChange = (index: number, field: string, value: any) => {
    const updated = [...gradingScale];
    const current = { ...updated[index] };
    if (field === 'min') {
      const num = Number(value);
      current.min = num;
      current.minPercentage = num;
    } else if (field === 'max') {
      const num = Number(value);
      current.max = num;
      current.maxPercentage = num;
    } else if (field === 'grade') {
      current.grade = String(value);
    } else if (field === 'description') {
      current.description = String(value);
      current.descriptor = String(value);
    }
    updated[index] = current;
    setGradingScale(updated);
  };

  const handleAddGradeBand = () => {
    setGradingScale([
      ...gradingScale,
      { min: 0, max: 100, minPercentage: 0, maxPercentage: 100, grade: 'New', description: 'Competency Descriptor', descriptor: 'Competency Descriptor' },
    ]);
  };

  const handleRemoveGradeBand = (index: number) => {
    setGradingScale(gradingScale.filter((_, i) => i !== index));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload: Partial<SchoolSettings> = {
        ...formData,
        gradingScale,
        rankingEnabled,
      };

      const res = await api.updateSettings(payload);
      onSettingsUpdated(res.settings);
      setStatusMessage({ type: 'success', text: 'School settings and grading configuration saved successfully!' });
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update settings.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-lg font-bold font-['Cinzel',serif] text-[#0F1E36] flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600" />
            <span>Academic & Institutional Configuration</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure school particulars, editable CBC assessment grading bands, and report card position ranking policies.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-5 py-2.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-sm self-start sm:self-auto shrink-0"
        >
          <Save className="w-4 h-4 text-amber-400" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
        </button>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Configurable Grading Scale Module */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0F1E36] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>Configurable Assessment Grading Scale (CBC Aligned)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrators can adjust percentage thresholds and competency descriptors dynamically. No hardcoded grade boundaries.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddGradeBand}
            className="px-3 py-1.5 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-bold rounded-lg border border-slate-200 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Grade Band</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <th className="p-2.5">Min %</th>
                <th className="p-2.5">Max %</th>
                <th className="p-2.5">Grade Letter</th>
                <th className="p-2.5">CBC Competency Descriptor</th>
                <th className="p-2.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {gradingScale.map((band, idx) => (
                <tr key={idx}>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={band.min ?? band.minPercentage ?? 0}
                      onChange={(e) => handleGradeChange(idx, 'min', e.target.value)}
                      className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={band.max ?? band.maxPercentage ?? 100}
                      onChange={(e) => handleGradeChange(idx, 'max', e.target.value)}
                      className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-slate-800"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={band.grade}
                      onChange={(e) => handleGradeChange(idx, 'grade', e.target.value)}
                      className="w-20 px-2.5 py-1.5 border border-slate-300 rounded-lg font-bold text-amber-700 uppercase"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={band.description || band.descriptor || ''}
                      onChange={(e) => handleGradeChange(idx, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveGradeBand(idx)}
                      disabled={gradingScale.length <= 1}
                      className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Report Card Position Ranking Toggle */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-4 rounded-xl">
          <div>
            <div className="font-bold text-slate-900 text-xs">
              Class Position & Ranking on Report Cards
            </div>
            <p className="text-[11px] text-slate-500">
              When enabled, consolidated report cards calculate and print the learner's position (e.g. Position 1 of 42). When disabled, cards strictly emphasize individual CBC competency mastery.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRankingEnabled(!rankingEnabled)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs transition ${
              rankingEnabled
                ? 'bg-indigo-700 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {rankingEnabled ? (
              <>
                <ToggleRight className="w-5 h-5 text-indigo-300" />
                <span>Ranking Enabled</span>
              </>
            ) : (
              <>
                <ToggleLeft className="w-5 h-5 text-slate-500" />
                <span>Ranking Disabled</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official School Particulars */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#0F1E36] flex items-center gap-2 pb-2 border-b border-slate-100">
          <School className="w-4 h-4 text-amber-600" />
          <span>Official Institutional Particulars</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Official School Name</label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">School Motto</label>
            <input
              type="text"
              value={formData.motto}
              onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Postal Address</label>
            <input
              type="text"
              value={formData.postalAddress}
              onChange={(e) => setFormData({ ...formData, postalAddress: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Director Contact (Phone)</label>
            <input
              type="text"
              value={formData.directorPhone}
              onChange={(e) => setFormData({ ...formData, directorPhone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Headteacher Contact (Phone)</label>
            <input
              type="text"
              value={formData.headteacherPhone}
              onChange={(e) => setFormData({ ...formData, headteacherPhone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
