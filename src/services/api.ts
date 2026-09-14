import {
  SchoolSettings,
  TeacherProfile,
  SchoolClass,
  Subject,
  Assignment,
  AssignmentSubmission,
  Enquiry,
  ChatbotKnowledgeItem,
  UnansweredQuestion,
  Announcement,
  SchoolEvent,
  GalleryItem,
  SchoolDocument,
  NotificationItem,
  SmsLogItem,
  AuditLog,
  User,
  InternalMessage,
  Student,
  AcademicResult,
  ResultCorrectionRequest,
  AttendanceSession,
  TeacherStudentLink,
  GradingScaleItem,
  StudentReportCard,
} from '../types';

export interface SchoolDataPayload {
  settings: SchoolSettings;
  teachers: TeacherProfile[];
  classes: SchoolClass[];
  subjects: Subject[];
  announcements: Announcement[];
  events: SchoolEvent[];
  gallery: GalleryItem[];
  documents: SchoolDocument[];
  knowledgeBaseSummary: Array<{ id: string; category: string; question: string }>;
}

export const api = {
  // Public school data
  async getSchoolData(): Promise<SchoolDataPayload> {
    const res = await fetch('/api/school-data');
    if (!res.ok) throw new Error('Failed to fetch school data');
    return res.json();
  },

  // Settings
  async getSettings(): Promise<SchoolSettings> {
    const res = await fetch('/api/settings');
    if (!res.ok) throw new Error('Failed to fetch settings');
    return res.json();
  },

  async updateSettings(updates: Partial<SchoolSettings>): Promise<{ success: boolean; settings: SchoolSettings }> {
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return res.json();
  },

  async updateGradingScale(payload: { gradingScale: GradingScaleItem[]; rankingEnabled?: boolean }) {
    const res = await fetch('/api/settings/grading-scale', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update grading scale');
    return data;
  },

  // Authentication
  async login(payload: { identifier: string; password: string }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
  },

  async changePassword(payload: { userId: string; newPassword: string; confirmPassword?: string }) {
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Password update failed');
    return data;
  },

  async completeSecuritySetup(payload: {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    newPassword: string;
    confirmPassword?: string;
    securityQuestion?: string;
    securityAnswer?: string;
  }) {
    const res = await fetch('/api/auth/complete-security-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Security profile setup failed');
    return data;
  },

  // Central Student Database
  async getStudents(params?: { class?: string; grade?: string; search?: string }): Promise<Student[]> {
    const q = new URLSearchParams();
    if (params?.class) q.append('class', params.class);
    if (params?.grade) q.append('grade', params.grade);
    if (params?.search) q.append('search', params.search);
    const url = q.toString() ? `/api/students?${q.toString()}` : '/api/students';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  async getStudent(idOrStudentId: string) {
    const res = await fetch(`/api/students/${encodeURIComponent(idOrStudentId)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch student profile');
    return data;
  },

  async createStudent(payload: Partial<Student> & { confirmDuplicate?: boolean }) {
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const err: any = new Error(data.error || data.message || 'Failed to register student');
      err.data = data;
      throw err;
    }
    return data;
  },

  async updateStudent(id: string, updates: Partial<Student>) {
    const res = await fetch(`/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update student');
    return data;
  },

  async deleteStudent(id: string) {
    const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete student');
    return data;
  },

  // Teacher Student Roster Linking
  async getTeacherStudents(classId: string, subjectId: string): Promise<{ links: TeacherStudentLink[]; students: Student[] }> {
    const res = await fetch(`/api/teacher/classes/${classId}/subjects/${subjectId}/students`);
    if (!res.ok) throw new Error('Failed to fetch class subject roster');
    return res.json();
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
    const res = await fetch('/api/teacher/classes/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  // Teacher & Staff Management (Chief Admin)
  async getAdminTeachers(): Promise<Array<TeacherProfile & { username: string; isActive: boolean; mustChangePassword: boolean; lastLogin?: string }>> {
    const res = await fetch('/api/admin/teachers');
    if (!res.ok) throw new Error('Failed to fetch teachers');
    return res.json();
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
  }) {
    const res = await fetch('/api/admin/teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create teacher account');
    return data;
  },

  async updateTeacherStatus(id: string, status: 'ACTIVE' | 'DISABLED') {
    const res = await fetch(`/api/admin/teachers/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update teacher status');
    return data;
  },

  async resetTeacherPassword(id: string) {
    const res = await fetch(`/api/admin/teachers/${id}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset teacher password');
    return data;
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
    const res = await fetch(url);
    return res.json();
  },

  async recordAttendance(payload: Partial<AttendanceSession>) {
    const res = await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to record attendance');
    return data;
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
    const res = await fetch(url);
    return res.json();
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
    const res = await fetch('/api/marks/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save marks');
    return data;
  },

  async approveMark(id: string, reviewedBy?: string) {
    const res = await fetch(`/api/marks/${id}/approve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewedBy }),
    });
    return res.json();
  },

  async batchApproveMarks(markIds: string[], reviewedBy?: string) {
    const res = await fetch('/api/marks/batch-approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ markIds, reviewedBy }),
    });
    return res.json();
  },

  async returnMark(id: string, reason: string, reviewedBy?: string) {
    const res = await fetch(`/api/marks/${id}/return`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason, reviewedBy }),
    });
    return res.json();
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
    const res = await fetch('/api/marks/correction-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit correction request');
    return data;
  },

  async getCorrectionRequests(): Promise<ResultCorrectionRequest[]> {
    const res = await fetch('/api/marks/correction-requests');
    if (!res.ok) return [];
    return res.json();
  },

  async reviewCorrectionRequest(
    id: string,
    payload: { action: 'APPROVED' | 'REJECTED'; adminNotes?: string; reviewedBy?: string }
  ) {
    const res = await fetch(`/api/marks/correction-requests/${id}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
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
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to generate report cards');
    return res.json();
  },

  // Enquiries & Admissions
  async getEnquiries(): Promise<Enquiry[]> {
    const res = await fetch('/api/enquiries');
    if (!res.ok) throw new Error('Failed to fetch enquiries');
    return res.json();
  },

  async submitEnquiry(payload: {
    fullName: string;
    phone: string;
    email?: string;
    category?: string;
    message: string;
    source?: string;
    studentGradeInterest?: string;
  }): Promise<{ success: boolean; enquiry: Enquiry; referenceNumber: string }> {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry');
    return {
      ...data,
      referenceNumber: data.referenceNumber || data.enquiry?.referenceNumber || '',
    };
  },

  // Chatbot
  async queryChatbot(
    message: string,
    visitorPhone?: string
  ): Promise<{ text: string; reply: string; source: string; canEscalate?: boolean }> {
    const res = await fetch('/api/chatbot/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, visitorPhone }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Chatbot service error');
    return {
      ...data,
      text: data.text || data.reply || '',
      reply: data.reply || data.text || '',
    };
  },

  // Assignments
  async getAssignments(classId?: string, subjectId?: string): Promise<Assignment[]> {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (subjectId) params.append('subjectId', subjectId);
    const url = params.toString() ? `/api/assignments?${params.toString()}` : '/api/assignments';
    const res = await fetch(url);
    return res.json();
  },

  // Audit Logs
  async getAuditLogs(params?: { role?: string; search?: string }): Promise<AuditLog[]> {
    const q = new URLSearchParams();
    if (params?.role) q.append('role', params.role);
    if (params?.search) q.append('search', params.search);
    const url = q.toString() ? `/api/audit-logs?${q.toString()}` : '/api/audit-logs';
    const res = await fetch(url);
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    const res = await fetch('/api/notifications');
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
    return res.json();
  },
};
