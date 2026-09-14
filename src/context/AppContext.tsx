import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SchoolSettings,
  TeacherProfile,
  SchoolClass,
  Subject,
  Announcement,
  SchoolEvent,
  GalleryItem,
  SchoolDocument,
  NotificationItem,
  User,
  Enquiry,
} from '../types';
import { api, SchoolDataPayload } from '../services/api';
import {
  initialSchoolSettings,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialAnnouncements,
  initialEvents,
  initialGallery,
  initialDocuments,
  initialNotifications,
} from '../data/schoolInitialData';

export type AppRoute =
  | 'home'
  | 'about'
  | 'academics'
  | 'junior-secondary'
  | 'teachers'
  | 'gallery'
  | 'assignments'
  | 'news-events'
  | 'admissions'
  | 'contact'
  | 'parent-portal'
  | 'teacher-portal'
  | 'learner-portal'
  | 'admin-portal'
  | 'portal-login';

interface AppContextType {
  currentRoute: AppRoute;
  setCurrentRoute: (route: AppRoute) => void;
  navigate: (route: AppRoute) => void;

  // School data
  settings: SchoolSettings;
  teachers: TeacherProfile[];
  classes: SchoolClass[];
  subjects: Subject[];
  announcements: Announcement[];
  events: SchoolEvent[];
  gallery: GalleryItem[];
  documents: SchoolDocument[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;

  // Refresh
  refreshSchoolData: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // Authentication
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;

  // Modals & Chatbot
  isChatbotOpen: boolean;
  setIsChatbotOpen: (open: boolean) => void;
  toggleChatbot: () => void;

  isAdmissionModalOpen: boolean;
  openAdmissionModal: (preferredGrade?: string) => void;
  closeAdmissionModal: () => void;
  admissionGradeInterest: string;

  isEscalationModalOpen: boolean;
  openEscalationModal: (subject?: string) => void;
  closeEscalationModal: () => void;
  escalationSubject: string;

  // Mobile drawer
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Search filter
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRouteState] = useState<AppRoute>('home');
  const [settings, setSettings] = useState<SchoolSettings>(initialSchoolSettings);
  const [teachers, setTeachers] = useState<TeacherProfile[]>(initialTeachers);
  const [classes, setClasses] = useState<SchoolClass[]>(initialClasses);
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [events, setEvents] = useState<SchoolEvent[]>(initialEvents);
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [documents, setDocuments] = useState<SchoolDocument[]>(initialDocuments);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('amani_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isAdmissionModalOpen, setIsAdmissionModalOpen] = useState(false);
  const [admissionGradeInterest, setAdmissionGradeInterest] = useState('');
  const [isEscalationModalOpen, setIsEscalationModalOpen] = useState(false);
  const [escalationSubject, setEscalationSubject] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch live school data on mount
  const refreshSchoolData = async () => {
    try {
      const data: SchoolDataPayload = await api.getSchoolData();
      if (data.settings) setSettings(data.settings);
      if (data.teachers?.length) setTeachers(data.teachers);
      if (data.classes?.length) setClasses(data.classes);
      if (data.subjects?.length) setSubjects(data.subjects);
      if (data.announcements?.length) setAnnouncements(data.announcements);
      if (data.events?.length) setEvents(data.events);
      if (data.gallery?.length) setGallery(data.gallery);
      if (data.documents?.length) setDocuments(data.documents);
    } catch (err) {
      console.warn('Could not load school data, using initial data:', err);
    }
  };

  const refreshNotifications = async () => {
    try {
      const notifs = await api.getNotifications();
      if (notifs) setNotifications(notifs);
    } catch (err) {
      console.warn('Could not load notifications:', err);
    }
  };

  useEffect(() => {
    refreshSchoolData();
    refreshNotifications();
  }, []);

  // Sync route with URL hash for easy browser back/forward and deep links
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      const validRoutes: AppRoute[] = [
        'home',
        'about',
        'academics',
        'teachers',
        'gallery',
        'assignments',
        'news-events',
        'admissions',
        'contact',
        'parent-portal',
        'teacher-portal',
        'learner-portal',
        'admin-portal',
        'portal-login',
      ];
      if (validRoutes.includes(hash as AppRoute)) {
        setCurrentRouteState(hash as AppRoute);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (route: AppRoute) => {
    setCurrentRouteState(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('amani_user');
    localStorage.removeItem('amani_token');
    navigate('home');
  };

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const toggleChatbot = () => setIsChatbotOpen((prev) => !prev);

  const openAdmissionModal = (grade?: string) => {
    setAdmissionGradeInterest(grade || '');
    setIsAdmissionModalOpen(true);
  };

  const closeAdmissionModal = () => setIsAdmissionModalOpen(false);

  const openEscalationModal = (sub?: string) => {
    setEscalationSubject(sub || 'General Enquiry');
    setIsEscalationModalOpen(true);
  };

  const closeEscalationModal = () => setIsEscalationModalOpen(false);

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        setCurrentRoute: navigate,
        navigate,
        settings,
        teachers,
        classes,
        subjects,
        announcements,
        events,
        gallery,
        documents,
        notifications,
        unreadNotifsCount,
        refreshSchoolData,
        refreshNotifications,
        currentUser,
        setCurrentUser: (user) => {
          setCurrentUser(user);
          if (user) {
            localStorage.setItem('amani_user', JSON.stringify(user));
          } else {
            localStorage.removeItem('amani_user');
          }
        },
        logout,
        isChatbotOpen,
        setIsChatbotOpen,
        toggleChatbot,
        isAdmissionModalOpen,
        openAdmissionModal,
        closeAdmissionModal,
        admissionGradeInterest,
        isEscalationModalOpen,
        openEscalationModal,
        closeEscalationModal,
        escalationSubject,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
