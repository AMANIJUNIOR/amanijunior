import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bell,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
  FileText,
  Share2,
} from 'lucide-react';

export const NewsEventsPage: React.FC = () => {
  const { announcements, events } = useApp();
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [newsFilter, setNewsFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredAnnouncements = announcements.filter((ann) => {
    const matchesFilter = newsFilter === 'All' || ann.category === newsFilter;
    const matchesSearch =
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.content.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <Bell className="w-3.5 h-3.5" />
            <span>School Communications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            News, Circulars & School Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Official announcements from Director Constance Mwaka Pole and Headteacher Nadhiri Chacha Salim.
          </p>
        </div>
      </section>

      {/* Main Switch Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'news'
                  ? 'bg-[#0F1E36] text-amber-400 shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Official Notices ({announcements.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                activeTab === 'events'
                  ? 'bg-[#0F1E36] text-amber-400 shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming Events ({events.length})</span>
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search circulars or events..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>
        </div>
      </section>

      {/* Content Display */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        {activeTab === 'news' ? (
          <div className="space-y-4">
            {filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:border-amber-400 transition space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-xs rounded">
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400">Published: {ann.publishedDate}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">
                    Audience: <strong>{ann.targetAudience}</strong>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap">
                    {ann.content}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50">
                  <span>Author: {ann.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-semibold text-[11px]">Official Notice</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:border-emerald-500 transition flex flex-col"
              >
                {evt.imageUrl && (
                  <div className="h-44 w-full overflow-hidden bg-slate-900 relative">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded uppercase">
                      {evt.category}
                    </span>
                  </div>
                )}
                <div className="p-6 flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-[#0F1E36] text-amber-400 flex flex-col items-center justify-center shrink-0 shadow-md">
                    <span className="text-xs font-extrabold uppercase">
                      {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-2xl font-black font-mono leading-none">
                      {new Date(evt.date).getDate()}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {!evt.imageUrl && (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded">
                        {evt.category}
                      </span>
                    )}
                    <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>

                  <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-500">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>{evt.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Audience: {evt.targetAudience}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          </div>
        )}
      </section>
    </div>
  );
};
