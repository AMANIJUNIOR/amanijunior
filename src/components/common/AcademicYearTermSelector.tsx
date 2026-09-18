import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface AcademicYearTermSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
  selectedTerm?: string;
  onTermChange?: (term: string) => void;
  showTerm?: boolean;
  compact?: boolean;
  className?: string;
}

export const AcademicYearTermSelector: React.FC<AcademicYearTermSelectorProps> = ({
  selectedYear,
  onYearChange,
  selectedTerm,
  onTermChange,
  showTerm = true,
  compact = false,
  className = '',
}) => {
  const currentNumericYear = new Date().getFullYear();
  const [isCustomYearMode, setIsCustomYearMode] = useState(false);
  const [customYearInput, setCustomYearInput] = useState(selectedYear || String(currentNumericYear));

  // Generate a dynamic, flexible range of years (from 2020 up to 15 years in future)
  const startYear = 2020;
  const endYear = Math.max(currentNumericYear + 10, parseInt(selectedYear || '2026', 10) + 5);
  const availableYears: string[] = [];
  for (let y = endYear; y >= startYear; y--) {
    availableYears.push(String(y));
  }
  if (selectedYear && !availableYears.includes(selectedYear)) {
    availableYears.unshift(selectedYear);
  }

  const handleYearSelectChange = (val: string) => {
    if (val === 'CUSTOM') {
      setIsCustomYearMode(true);
    } else {
      setIsCustomYearMode(false);
      onYearChange(val);
      if (onTermChange && selectedTerm) {
        // preserve term number while adapting year
        const termPrefix = selectedTerm.split(',')[0] || 'Term 1';
        onTermChange(`${termPrefix}, ${val}`);
      }
    }
  };

  const handleCustomYearSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = customYearInput.trim();
    if (clean && /^\d{4}$/.test(clean)) {
      onYearChange(clean);
      if (onTermChange && selectedTerm) {
        const termPrefix = selectedTerm.split(',')[0] || 'Term 1';
        onTermChange(`${termPrefix}, ${clean}`);
      }
      setIsCustomYearMode(false);
    }
  };

  const handlePrevYear = () => {
    const prev = String(parseInt(selectedYear || String(currentNumericYear), 10) - 1);
    onYearChange(prev);
    if (onTermChange && selectedTerm) {
      const termPrefix = selectedTerm.split(',')[0] || 'Term 1';
      onTermChange(`${termPrefix}, ${prev}`);
    }
  };

  const handleNextYear = () => {
    const next = String(parseInt(selectedYear || String(currentNumericYear), 10) + 1);
    onYearChange(next);
    if (onTermChange && selectedTerm) {
      const termPrefix = selectedTerm.split(',')[0] || 'Term 1';
      onTermChange(`${termPrefix}, ${next}`);
    }
  };

  const termOptions = [
    `Term 1, ${selectedYear}`,
    `Term 2, ${selectedYear}`,
    `Term 3, ${selectedYear}`,
    `Annual Consolidated, ${selectedYear}`,
  ];

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Year Selector with infinite navigation */}
      <div className="flex items-center bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={handlePrevYear}
          title="Previous Academic Year"
          className="px-1.5 py-1.5 hover:bg-slate-100 text-slate-600 transition border-r border-slate-200 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {isCustomYearMode ? (
          <form onSubmit={handleCustomYearSubmit} className="flex items-center px-1">
            <input
              type="number"
              min="1990"
              max="2100"
              value={customYearInput}
              onChange={(e) => setCustomYearInput(e.target.value)}
              placeholder="YYYY"
              className="w-16 px-1.5 py-1 text-xs font-mono font-bold text-[#0F1E36] focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold cursor-pointer"
            >
              Set
            </button>
          </form>
        ) : (
          <select
            value={selectedYear}
            onChange={(e) => handleYearSelectChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-bold text-[#0F1E36] bg-transparent focus:outline-none cursor-pointer"
          >
            {availableYears.map((y) => (
              <option key={y} value={y}>
                Academic Year {y}
              </option>
            ))}
            <option value="CUSTOM">Custom Year (Infinite)...</option>
          </select>
        )}

        <button
          type="button"
          onClick={handleNextYear}
          title="Next Academic Year"
          className="px-1.5 py-1.5 hover:bg-slate-100 text-slate-600 transition border-l border-slate-200 cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Term Selector */}
      {showTerm && onTermChange && (
        <div className="flex items-center bg-white border border-slate-300 rounded-lg shadow-xs overflow-hidden">
          <select
            value={selectedTerm || termOptions[0]}
            onChange={(e) => onTermChange(e.target.value)}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
          >
            {termOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
