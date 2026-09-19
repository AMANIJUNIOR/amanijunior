import {
  SchoolSettings,
  TeacherProfile,
  SchoolClass,
  Subject,
  Assignment,
  Enquiry,
  NotificationItem,
  AuditLog,
  User,
  Student,
  AcademicResult,
  ResultCorrectionRequest,
  AttendanceSession,
  TeacherStudentLink,
  GradingScaleItem,
  StudentReportCard,
  EnquiryCategory,
  EnquiryStatus,
} from '../types';
import { localDb } from './localDatabase';
import {
  initialSchoolSettings,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialAnnouncements,
  initialEvents,
  initialGallery,
  initialDocuments,
  initialChatbotKnowledge,
} from '../data/schoolInitialData';

export interface SchoolDataPayload {
  settings: SchoolSettings;
  teachers: TeacherProfile[];
  classes: SchoolClass[];
  subjects: Subject[];
  announcements: any[];
  events: any[];
  gallery: any[];
  documents: any[];
  knowledgeBaseSummary: Array<{ id: string; category: string; question: string }>;
}

async function callApiWithFallback<T>(
  url: string,
  options: RequestInit | undefined,
  fallbackFn: () => Promise<T> | T
): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    // If server returned valid JSON
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (!res.ok) {
        // If it's a 404 route on host (e.g. serverless route missing), fallback
        if (res.status === 404) {
          return await fallbackFn();
        }
        throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
      }
      return data;
    }

    // If response was HTML (e.g. Vercel/Netlify SPA rewrite /* -> index.html) or other non-JSON
    return await fallbackFn();
  } catch (err: any) {
    // If network error, connection refused, or unexpected token '<'
    if (
      err.name === 'TypeError' ||
      (err.message &&
        (err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('Unexpected token') ||
          err.message.includes('not valid JSON')))
    ) {
      return await fallbackFn();
    }
    throw err;
  }
}

export const api = {
  // Public school data
  async getSchoolData(): Promise<SchoolDataPayload> {
    return callApiWithFallback<SchoolDataPayload>('/api/school-data', undefined, () => ({
      settings: localDb.getSettings(),
      teachers: localDb.getAdminTeachers(),
      classes: initialClasses,
      subjects: initialSubjects,
      announcements: initialAnnouncements,
      events: initialEvents,
      gallery: initialGallery,
      documents: initialDocuments,
      knowledgeBaseSummary: initialChatbotKnowledge.map((k) => ({
        id: k.id,
        category: k.category,
        question: k.question,
      })),
    }));
  },

  // Settings
  async getSettings(): Promise<SchoolSettings> {
    return callApiWithFallback<SchoolSettings>('/api/settings', undefined, () => localDb.getSettings());
  },

  async updateSettings(updates: Partial<SchoolSettings>): Promise<{ success: boolean; settings: SchoolSettings }> {
    return callApiWithFallback<{ success: boolean; settings: SchoolSettings }>(
      '/api/settings',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      () => localDb.updateSettings(updates)
    );
  },

  async updateGradingScale(payload: { gradingScale: GradingScaleItem[]; rankingEnabled?: boolean }) {
    return callApiWithFallback(
      '/api/settings/grading-scale',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.updateGradingScale(payload)
    );
  },

  // Authentication
  async login(payload: { identifier: string; password: string }) {
    // Check if running on static cloud hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages)
    const isStaticDeployment =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('vercel.app') ||
        window.location.hostname.includes('netlify.app') ||
        window.location.hostname.includes('pages.dev') ||
        window.location.hostname.includes('cloudflare') ||
        window.location.hostname.includes('github.io'));

    if (isStaticDeployment) {
      return localDb.login(payload.identifier, payload.password);
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok) return data;
        // If server actively returned password rejected
        if (res.status === 401 && data.error && !data.error.includes('Not Found')) {
          try {
            return localDb.login(payload.identifier, payload.password);
          } catch {
            throw new Error(data.error);
          }
        }
      }
      // On static or serverless environments where /api/auth/login is not an Express server
      return localDb.login(payload.identifier, payload.password);
    } catch {
      return localDb.login(payload.identifier, payload.password);
    }
  },

  async forgotPasswordRequestOtp(payload: { identifier: string; method?: string }): Promise<{
    success: boolean;
    userId: string;
    message: string;
    devOtp?: string;
    dispatchedTo?: string;
  }> {
    return callApiWithFallback(
      '/api/auth/forgot-password/request-otp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.forgotPasswordRequestOtp(payload)
    );
  },

  async forgotPasswordVerifyOtp(payload: { userId: string; otp: string; newPassword: string; confirmPassword?: string }): Promise<{
    success: boolean;
    message: string;
    username?: string;
  }> {
    return callApiWithFallback(
      '/api/auth/forgot-password/verify-otp',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.forgotPasswordVerifyOtp(payload)
    );
  },

  async changePassword(payload: { userId: string; newPassword: string; confirmPassword?: string }) {
    return callApiWithFallback(
      '/api/auth/change-password',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.changePassword(payload)
    );
  },

  async completeSecuritySetup(payload: {
    userId: string;
    username?: string;
    fullName: string;
    email: string;
    phone: string;
    newPassword: string;
    confirmPassword?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }) {
    return callApiWithFallback(
      '/api/auth/complete-security-setup',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.completeSecuritySetup(payload)
    );
  },

  // Central Student Database
  async getStudents(params?: { class?: string; grade?: string; search?: string }): Promise<Student[]> {
    const q = new URLSearchParams();
    if (params?.class) q.append('class', params.class);
    if (params?.grade) q.append('grade', params.grade);
    if (params?.search) q.append('search', params.search);
    const url = q.toString() ? `/api/students?${q.toString()}` : '/api/students';

    return callApiWithFallback<Student[]>(url, undefined, () => localDb.getStudents(params));
  },

  async getStudent(idOrStudentId: string) {
    return callApiWithFallback(`/api/students/${encodeURIComponent(idOrStudentId)}`, undefined, () => {
      const student = localDb.getStudents().find((s) => s.id === idOrStudentId || s.studentId === idOrStudentId);
      if (!student) throw new Error('Student profile not found');
      return { student };
    });
  },

  async createStudent(payload: Partial<Student> & { confirmDuplicate?: boolean }) {
    return callApiWithFallback(
      '/api/students',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.createStudent(payload)
    );
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    return callApiWithFallback(
      `/api/students/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      },
      () => localDb.updateStudent(id, updates)
    );
  },

  async deleteStudent(id: string) {
    return callApiWithFallback(
      `/api/students/${encodeURIComponent(id)}`,
      { method: 'DELETE' },
      () => localDb.deleteStudent(id)
    );
  },

  // Teacher Student Roster Linking
  async getTeacherStudents(classId: string, subjectId: string): Promise<{ links: TeacherStudentLink[]; students: Student[] }> {
    return callApiWithFallback<{ links: TeacherStudentLink[]; students: Student[] }>(
      `/api/teacher/classes/${classId}/subjects/${subjectId}/students`,
      undefined,
      () => localDb.getTeacherStudents(classId, subjectId)
    );
  },

  async linkStudentsToClass(payload: {
    teacherId?: string;
    teacherName?: string;
    classId: string;
    className: string;
    subjectId: string;
    subjectName: string;
    studentIds: string[];
  }) {
    return callApiWithFallback(
      '/api/teacher/classes/students',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.linkStudentsToClass(payload)
    );
  },

  // Teacher & Staff Management (Chief Admin)
  async getAdminTeachers(): Promise<Array<TeacherProfile & { username: string; isActive: boolean; mustChangePassword: boolean; lastLogin?: string }>> {
    return callApiWithFallback('/api/admin/teachers', undefined, () => localDb.getAdminTeachers());
  },

  async createAdminTeacher(payload: {
    fullName: string;
    staffId: string;
    phone: string;
    email?: string;
    department?: string;
    subjectSpecialization?: string;
    additionalSpecializations?: string[];
    assignedClasses?: string[];
    assignedSubjects?: string[];
    accountStatus?: 'ACTIVE' | 'DISABLED';
  }): Promise<{
    success: boolean;
    teacher: TeacherProfile;
    username: string;
    temporaryPassword: string;
    tempPassword: string;
  }> {
    return callApiWithFallback(
      '/api/admin/teachers',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.createAdminTeacher(payload)
    );
  },

  async updateTeacherStatus(id: string, status: 'ACTIVE' | 'DISABLED') {
    return callApiWithFallback(
      `/api/admin/teachers/${id}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      },
      () => localDb.updateTeacherStatus(id, status)
    );
  },

  async resetTeacherPassword(id: string): Promise<{
    success: boolean;
    username: string;
    temporaryPassword: string;
    tempPassword: string;
  }> {
    return callApiWithFallback(
      `/api/admin/teachers/${id}/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      () => localDb.resetTeacherPassword(id)
    );
  },

  async updateTeacherCredentials(id: string, payload: {
    username?: string;
    newPassword?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    department?: string;
    subjectSpecialization?: string;
    assignedClasses?: string[];
    assignedSubjects?: string[];
    mustChangePassword?: boolean;
  }) {
    return callApiWithFallback(
      `/api/admin/teachers/${id}/credentials`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.updateTeacherCredentials(id, payload)
    );
  },

  async deleteAdminTeacher(id: string) {
    return callApiWithFallback(
      `/api/admin/teachers/${id}`,
      { method: 'DELETE' },
      () => localDb.deleteAdminTeacher(id)
    );
  },

  // Attendance Module
  async getAttendance(params?: { classId?: string; date?: string; term?: string; academicYear?: string; studentId?: string }): Promise<AttendanceSession[]> {
    const q = new URLSearchParams();
    if (params?.classId) q.append('classId', params.classId);
    if (params?.date) q.append('date', params.date);
    if (params?.term) q.append('term', params.term);
    if (params?.academicYear) q.append('academicYear', params.academicYear);
    if (params?.studentId) q.append('studentId', params.studentId);
    const url = q.toString() ? `/api/attendance?${q.toString()}` : '/api/attendance';

    return callApiWithFallback<AttendanceSession[]>(url, undefined, () => localDb.getAttendance(params));
  },

  async recordAttendance(payload: Partial<AttendanceSession>) {
    return callApiWithFallback(
      '/api/attendance',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.recordAttendance(payload)
    );
  },

  // Academic Marks & Grading Lifecycle
  async getMarks(params?: {
    classId?: string;
    subjectId?: string;
    academicYear?: string;
    term?: string;
    assessmentType?: string;
    teacherId?: string;
    status?: string;
    studentId?: string;
  }): Promise<AcademicResult[]> {
    const q = new URLSearchParams();
    if (params?.classId) q.append('classId', params.classId);
    if (params?.subjectId) q.append('subjectId', params.subjectId);
    if (params?.academicYear) q.append('academicYear', params.academicYear);
    if (params?.term) q.append('term', params.term);
    if (params?.assessmentType) q.append('assessmentType', params.assessmentType);
    if (params?.teacherId) q.append('teacherId', params.teacherId);
    if (params?.status) q.append('status', params.status);
    if (params?.studentId) q.append('studentId', params.studentId);
    const url = q.toString() ? `/api/marks?${q.toString()}` : '/api/marks';

    return callApiWithFallback<AcademicResult[]>(url, undefined, () => localDb.getMarks(params));
  },

  async saveBatchMarks(payload: {
    classId: string;
    className: string;
    grade?: string;
    subjectId: string;
    subjectName: string;
    teacherId?: string;
    teacherName?: string;
    academicYear?: string;
    term?: string;
    assessmentType?: string;
    status?: 'DRAFT' | 'SUBMITTED';
    entries: Array<{
      studentId: string;
      maxMarks: number;
      marksObtained: number;
      strengths?: string;
      areasForImprovement?: string;
      teacherComment?: string;
      recommendedAction?: string;
    }>;
  }) {
    return callApiWithFallback(
      '/api/marks/batch',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.saveBatchMarks(payload)
    );
  },

  async approveMark(id: string, reviewedBy?: string) {
    return callApiWithFallback(
      `/api/marks/${id}/approve`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewedBy }),
      },
      () => localDb.approveMark(id, reviewedBy)
    );
  },

  async batchApproveMarks(markIds: string[], reviewedBy?: string) {
    return callApiWithFallback(
      '/api/marks/batch-approve',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markIds, reviewedBy }),
      },
      () => localDb.batchApproveMarks(markIds, reviewedBy)
    );
  },

  async returnMark(id: string, reason: string, reviewedBy?: string) {
    return callApiWithFallback(
      `/api/marks/${id}/return`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, reviewedBy }),
      },
      () => localDb.returnMark(id, reason, reviewedBy)
    );
  },

  async requestResultCorrection(payload: {
    resultId: string;
    originalMark: number;
    proposedMark: number;
    reason: string;
    explanation: string;
    teacherId?: string;
    teacherName?: string;
  }) {
    return callApiWithFallback(
      '/api/marks/correction-request',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.requestResultCorrection(payload)
    );
  },

  async getCorrectionRequests(): Promise<ResultCorrectionRequest[]> {
    return callApiWithFallback('/api/marks/correction-requests', undefined, () => localDb.getCorrectionRequests());
  },

  async reviewCorrectionRequest(
    id: string,
    payload: { action: 'APPROVED' | 'REJECTED'; adminNotes?: string; reviewedBy?: string }
  ) {
    return callApiWithFallback(
      `/api/marks/correction-requests/${id}/review`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.reviewCorrectionRequest(id, payload)
    );
  },

  // Consolidated Results & Report Cards
  async getReportCards(params: {
    classId?: string;
    academicYear?: string;
    term?: string;
    studentId?: string;
  }): Promise<StudentReportCard[]> {
    const q = new URLSearchParams();
    if (params.classId) q.append('classId', params.classId);
    if (params.academicYear) q.append('academicYear', params.academicYear);
    if (params.term) q.append('term', params.term);
    if (params.studentId) q.append('studentId', params.studentId);
    const url = `/api/report-cards?${q.toString()}`;

    return callApiWithFallback<StudentReportCard[]>(url, undefined, () => localDb.getReportCards(params));
  },

  // Enquiries & Admissions
  async getEnquiries(): Promise<Enquiry[]> {
    return callApiWithFallback<Enquiry[]>('/api/enquiries', undefined, () => localDb.getEnquiries());
  },

  async submitEnquiry(payload: {
    fullName: string;
    phone: string;
    email?: string;
    category?: EnquiryCategory;
    message: string;
    source?: 'Website Form' | 'AI Chatbot Handoff' | 'Admissions Page' | 'Phone' | 'Contact Page' | string;
    studentGradeInterest?: string;
  }): Promise<{ success: boolean; enquiry: Enquiry; referenceNumber: string }> {
    return callApiWithFallback(
      '/api/enquiries',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.submitEnquiry(payload)
    );
  },

  async updateEnquiryStatus(id: string, status: EnquiryStatus, responseNotes?: string) {
    return callApiWithFallback(
      `/api/enquiries/${id}/status`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, responseNotes }),
      },
      () => localDb.updateEnquiryStatus(id, status, responseNotes)
    );
  },

  async deleteEnquiry(id: string) {
    return callApiWithFallback(
      `/api/enquiries/${id}`,
      {
        method: 'DELETE',
      },
      () => localDb.deleteEnquiry(id)
    );
  },

  async clearExhaustedEnquiries(all = false) {
    return callApiWithFallback(
      `/api/enquiries?all=${all}`,
      {
        method: 'DELETE',
      },
      () => localDb.clearExhaustedEnquiries(all)
    );
  },

  // Chatbot
  async queryChatbot(
    message: string,
    visitorPhone?: string
  ): Promise<{ text: string; reply: string; source: string; canEscalate?: boolean }> {
    return callApiWithFallback(
      '/api/chatbot/message',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, visitorPhone }),
      },
      () => localDb.queryChatbot(message, visitorPhone)
    );
  },

  // Assignments
  async getAssignments(classId?: string, subjectId?: string): Promise<Assignment[]> {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (subjectId) params.append('subjectId', subjectId);
    const url = params.toString() ? `/api/assignments?${params.toString()}` : '/api/assignments';

    return callApiWithFallback<Assignment[]>(url, undefined, () => localDb.getAssignments(classId, subjectId));
  },

  async createAssignment(payload: Partial<Assignment>) {
    return callApiWithFallback(
      '/api/assignments',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
      () => localDb.createAssignment(payload)
    );
  },

  // Audit Logs
  async getAuditLogs(params?: { role?: string; search?: string }): Promise<AuditLog[]> {
    const q = new URLSearchParams();
    if (params?.role) q.append('role', params.role);
    if (params?.search) q.append('search', params.search);
    const url = q.toString() ? `/api/audit-logs?${q.toString()}` : '/api/audit-logs';

    return callApiWithFallback<AuditLog[]>(url, undefined, () => localDb.getAuditLogs(params));
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return callApiWithFallback<NotificationItem[]>('/api/notifications', undefined, () => localDb.getNotifications());
  },

  async markNotificationRead(id: string) {
    return callApiWithFallback(`/api/notifications/${id}/read`, { method: 'PATCH' }, () => localDb.markNotificationRead(id));
  },
};
