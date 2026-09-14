import React, { useState, useEffect } from 'react';
import { useApp, AppRoute } from '../context/AppContext';
import { SchoolLogoBadge } from './SchoolLogoBadge';
import {
  Menu,
  X,
  Bot,
  Phone,
  MapPin,
  LogIn,
  Shield,
  BookOpen,
  UserCheck,
  Lock,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentRoute,
    navigate,
    toggleChatbot,
    openAdmissionModal,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    currentUser,
    logout,
    settings,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; route: AppRoute }[] = [
    { label: 'HOME', route: 'home' },
    { label: 'ABOUT US', route: 'about' },
    { label: 'ACADEMICS', route: 'academics' },
    { label: 'JUNIOR SECONDARY', route: 'junior-secondary' },
    { label: 'TEACHERS', route: 'teachers' },
    { label: 'GALLERY', route: 'gallery' },
    { label: 'ASSIGNMENTS', route: 'assignments' },
    { label: 'NEWS & EVENTS', route: 'news-events' },
    { label: 'ADMISSIONS', route: 'admissions' },
    { label: 'CONTACT', route: 'contact' },
  ];

  const handleStaffPortalClick = () => {
    if (!currentUser) {
      navigate('portal-login');
    } else if (
      currentUser.role === 'CHIEF_ADMIN' ||
      currentUser.role === 'DIRECTOR' ||
      currentUser.role === 'HEADTEACHER' ||
      currentUser.role === 'DEPUTY_HEADTEACHER' ||
      currentUser.role === 'ICT_ADMIN'
    ) {
      navigate('admin-portal');
    } else if (currentUser.role === 'TEACHER') {
      navigate('teacher-portal');
    } else {
      navigate('portal-login');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Institutional Bar */}
      <div className="bg-[#0A1628] text-slate-200 text-xs py-1.5 px-4 border-b border-amber-500/20 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{settings.postalAddress}</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Director: <strong className="text-white">0718540922</strong></span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Headteacher: <strong className="text-white">0114623408</strong></span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-amber-300/90 italic font-medium">Motto: "STRIVE TO ACHIEVE"</span>
            <div className="h-3 w-px bg-slate-700" />
            <button
              onClick={handleStaffPortalClick}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{currentUser ? `${currentUser.name.split(' ')[0]} (Portal)` : 'Staff Management Portal'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-slate-200 py-2.5'
            : 'bg-white shadow-sm border-slate-200 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Official Logo & Brand */}
          <SchoolLogoBadge
            size={isScrolled ? 'sm' : 'md'}
            onClick={() => navigate('home')}
            className="hover:opacity-95 transition"
          />

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => navigate(link.route)}
                  className={`px-3 py-1.5 rounded-md text-[13px] font-bold tracking-wide transition-all ${
                    isActive
                      ? 'text-[#0F1E36] bg-amber-500/15 border-b-2 border-amber-500'
                      : 'text-slate-600 hover:text-[#0F1E36] hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            {/* Staff Management Portal Button */}
            <button
              onClick={handleStaffPortalClick}
              className={`px-3 py-1.5 rounded-md text-[13px] font-bold tracking-wide flex items-center gap-1.5 transition ${
                ['admin-portal', 'teacher-portal', 'portal-login'].includes(currentRoute)
                  ? 'text-amber-600 bg-amber-50 border-b-2 border-amber-500'
                  : 'text-slate-700 hover:text-[#0F1E36] hover:bg-slate-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>STAFF PORTAL</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Prominent "Talk to Amani" Button */}
            <button
              id="btn-talk-to-amani-nav"
              onClick={toggleChatbot}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-[#0F1E36] to-[#1E3A8A] text-white hover:to-[#0F1E36] text-xs font-bold flex items-center gap-2 shadow-sm hover:shadow transition active:scale-95 border border-amber-400/30"
            >
              <div className="relative">
                <Bot className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              </div>
              <span>Talk to Amani</span>
            </button>

            {/* Admission Enquiry Button */}
            <button
              onClick={() => openAdmissionModal()}
              className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold shadow-sm hover:shadow transition active:scale-95"
            >
              Admission Enquiry
            </button>

            {/* Authenticated Staff Status or Login */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={handleStaffPortalClick}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-xs font-semibold text-[#0F1E36]"
                  title="Open Management Portal"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="max-w-[110px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  title="Sign out of Management Portal"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition"
                >
                  <LogIn className="w-4 h-4 rotate-180" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('portal-login')}
                className="p-2 text-slate-600 hover:text-[#0F1E36] rounded-md hover:bg-slate-100 transition flex items-center gap-1 text-xs font-bold"
                title="Staff Login"
              >
                <Lock className="w-4 h-4 text-amber-600" />
                <span className="hidden lg:inline">Staff</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleChatbot}
              className="p-2 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition"
              title="Amani AI Assistant"
            >
              <Bot className="w-5 h-5 text-amber-600" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#0F1E36] rounded-lg hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => navigate(link.route)}
                  className={`text-left px-3.5 py-2.5 rounded-lg text-sm font-bold transition ${
                    currentRoute === link.route
                      ? 'bg-amber-500/20 text-[#0F1E36] border-l-4 border-amber-500'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={handleStaffPortalClick}
                className="w-full p-2.5 bg-slate-900 text-white rounded-lg text-xs font-bold text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>{currentUser ? `Portal (${currentUser.name})` : 'Staff Management Portal (Staff Only)'}</span>
                </div>
                {currentUser && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      logout();
                    }}
                    className="text-xs text-red-400 hover:text-red-300 font-normal underline"
                  >
                    Logout
                  </button>
                )}
              </button>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={toggleChatbot}
                  className="flex-1 py-2.5 bg-[#0F1E36] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>Talk to Amani</span>
                </button>
                <button
                  onClick={() => openAdmissionModal()}
                  className="flex-1 py-2.5 bg-amber-500 text-slate-950 rounded-lg font-extrabold text-xs text-center shadow-sm"
                >
                  Admission Enquiry
                </button>
              </div>

              {/* Direct Leadership Contacts */}
              <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div>Director: Constance Mwaka Pole (0718540922)</div>
                <div>Headteacher: Nadhiri Chacha Salim (0114623408)</div>
                <div>Location: P.O. Box 93-80114, Mazeras, Kenya</div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
