import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';
import {
  Image as GalleryIcon,
  Maximize2,
  X,
  Calendar,
  Tag,
  Sparkles,
} from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const categories = [
    'All',
    'Campus & Classrooms',
    'Science & ICT Labs',
    'Infrastructure & Expansion',
    'Governance & Leadership',
  ];

  const filteredGallery =
    selectedCategory === 'All'
      ? gallery
      : gallery.filter((item) =>
          item.category.toLowerCase().includes(selectedCategory.toLowerCase())
        );

  return (
    <div className="space-y-14 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F1E36] via-[#162A4A] to-[#0A1628] text-white py-14 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-400 text-xs font-extrabold uppercase tracking-widest">
            <GalleryIcon className="w-3.5 h-3.5" />
            <span>Visual Campus Life</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Cinzel',serif] tracking-tight">
            Campus Facilities & Activity Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Glimpses into student learning, STEM innovation, sports championships, and school culture in Mazeras.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#0F1E36] text-amber-400 shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-60 overflow-hidden bg-slate-900">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition" />
                <div className="absolute top-3 right-3 p-2 bg-black/40 text-white rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition">
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded uppercase tracking-wider">
                  {item.category}
                </div>
              </div>

              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description || item.caption}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-600" />
                    <span>{item.eventDate || item.date}</span>
                  </span>
                  <span className="text-amber-700 font-bold text-[10px] uppercase">Enlarge</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full shadow-2xl border border-slate-700"
          >
            <div className="relative max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.title}
                className="w-full h-full max-h-[60vh] object-contain"
              />
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 p-2 bg-black/60 text-white hover:text-amber-400 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-2 bg-white">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-1 bg-amber-100 text-amber-900 font-bold rounded-md">
                  {activeItem.category}
                </span>
                <span className="text-slate-400">{activeItem.eventDate || (activeItem as any).date}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Cinzel',serif]">
                {activeItem.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{activeItem.description || (activeItem as any).caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
