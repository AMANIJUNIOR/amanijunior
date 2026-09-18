import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Clock,
  Check,
} from 'lucide-react';

interface InfiniteCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: string; // YYYY-MM-DD
  onSelectDate: (date: string) => void;
  title?: string;
  subtitle?: string;
}

export const InfiniteCalendarModal: React.FC<InfiniteCalendarModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  title = 'Institutional Infinite Calendar',
  subtitle = 'Navigate past, present, and future academic schedules without limits.',
}) => {
  const initial = selectedDate ? new Date(selectedDate) : new Date();
  const [viewYear, setViewYear] = useState<number>(isNaN(initial.getFullYear()) ? 2026 : initial.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(isNaN(initial.getMonth()) ? 0 : initial.getMonth());
  const [yearInput, setYearInput] = useState<string>(String(viewYear));
  const [isEditingYear, setIsEditingYear] = useState(false);

  if (!isOpen) return null;

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
      setYearInput(String(viewYear - 1));
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
      setYearInput(String(viewYear + 1));
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleYearJump = (delta: number) => {
    const newY = viewYear + delta;
    setViewYear(newY);
    setYearInput(String(newY));
  };

  const handleDirectYearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(yearInput, 10);
    if (!isNaN(parsed) && parsed > 1900 && parsed < 2200) {
      setViewYear(parsed);
      setIsEditingYear(false);
    }
  };

  const handleSelectDay = (day: number) => {
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const formatted = `${viewYear}-${mm}-${dd}`;
    onSelectDate(formatted);
    onClose();
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="bg-[#0F1E36] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-400/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-['Cinzel',serif]">{title}</h3>
              <p className="text-[11px] text-slate-300">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Calendar Controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleYearJump(-1)}
              title="Previous Year (-1)"
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="text-center">
            <div className="font-bold text-[#0F1E36] text-sm">
              {monthNames[viewMonth]}
            </div>
            {isEditingYear ? (
              <form onSubmit={handleDirectYearSubmit} className="flex items-center justify-center gap-1 mt-0.5">
                <input
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  className="w-18 px-1.5 py-0.5 text-xs text-center border border-amber-500 rounded font-mono font-bold"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-0.5 bg-amber-500 text-white rounded text-[10px] font-bold"
                >
                  OK
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingYear(true)}
                className="text-xs font-mono font-bold text-amber-700 hover:underline cursor-pointer"
                title="Click to type any year infinitely"
              >
                Year {viewYear} ✎
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNextMonth}
              title="Next Month"
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleYearJump(1)}
              title="Next Year (+1)"
              className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Grid */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {daysOfWeek.map((d) => (
              <div key={d} className="text-[11px] font-bold text-slate-400 uppercase py-1">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Leading empty days */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-9" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const day = idx + 1;
              const mm = String(viewMonth + 1).padStart(2, '0');
              const dd = String(day).padStart(2, '0');
              const dateKey = `${viewYear}-${mm}-${dd}`;
              const isSelected = selectedDate === dateKey;
              const isToday = todayStr === dateKey;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleSelectDay(day)}
                  className={`h-9 rounded-xl text-xs font-semibold flex items-center justify-center transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F1E36] text-white font-bold shadow-md'
                      : isToday
                      ? 'bg-amber-100 text-amber-900 border border-amber-400 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Quick Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              const now = new Date();
              setViewYear(now.getFullYear());
              setViewMonth(now.getMonth());
              setYearInput(String(now.getFullYear()));
              const mm = String(now.getMonth() + 1).padStart(2, '0');
              const dd = String(now.getDate()).padStart(2, '0');
              onSelectDate(`${now.getFullYear()}-${mm}-${dd}`);
              onClose();
            }}
            className="px-3 py-1.5 text-slate-700 hover:bg-slate-200 font-bold rounded-lg transition cursor-pointer"
          >
            Today
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0F1E36] hover:bg-amber-600 text-white font-bold rounded-lg transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
