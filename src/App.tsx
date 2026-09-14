import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AskAmaniChatbot } from './components/AskAmaniChatbot';
import { AdmissionModal } from './components/AdmissionModal';
import { HumanEscalationModal } from './components/HumanEscalationModal';

// Pages for Amani Junior Academy and JSS
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { JuniorSecondaryPage } from './pages/JuniorSecondaryPage';
import { TeachersPage } from './pages/TeachersPage';
import { GalleryPage } from './pages/GalleryPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { NewsEventsPage } from './pages/NewsEventsPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { ContactPage } from './pages/ContactPage';
import { PortalLoginPage } from './pages/PortalLoginPage';
import { ParentPortalPage } from './pages/ParentPortalPage';
import { TeacherPortalPage } from './pages/TeacherPortalPage';
import { LearnerPortalPage } from './pages/LearnerPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const AppContent: React.FC = () => {
  const { currentRoute, currentUser } = useApp();

  // Scroll to top upon page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'academics':
        return <AcademicsPage />;
      case 'junior-secondary':
        return <JuniorSecondaryPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'assignments':
        return <AssignmentsPage />;
      case 'news-events':
        return <NewsEventsPage />;
      case 'admissions':
        return <AdmissionsPage />;
      case 'contact':
        return <ContactPage />;
      case 'portal-login':
        return <PortalLoginPage />;
      case 'parent-portal':
        return <ParentPortalPage />;
      case 'teacher-portal':
        return <TeacherPortalPage />;
      case 'learner-portal':
        return <LearnerPortalPage />;
      case 'admin-portal':
        return <AdminPortalPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Primary Navigation Header */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1 w-full bg-slate-50 text-slate-900">
        {renderCurrentPage()}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Floating AI Assistant ("Talk to Amani") */}
      <AskAmaniChatbot />

      {/* Interactive Global Modals */}
      <AdmissionModal />
      <HumanEscalationModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
