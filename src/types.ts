export type UserRole =
  | 'CHIEF_ADMIN'
  | 'DIRECTOR'
  | 'HEADTEACHER'
  | 'DEPUTY_HEADTEACHER'
  | 'ICT_ADMIN'
  | 'TEACHER';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title?: string;
  email: string;
  phone: string;
  username: string;
  staffId?: string;
  department?: string;
  subjectSpecialization?: string;
  additionalSpecializations?: string[];
  assignedClassIds?: string[];
  assignedSubjectIds?: string[];
  isActive: boolean;
  mustChangePassword?: boolean;
  requiresSecuritySetup?: boolean;
  securityQuestion?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  fullName: string;
  staffId: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  qualifications: string;
  specialization: string;
  additionalSpecializations?: string[];
  biography: string;
  assignedClasses: string[];
  assignedSubjects: string[];
  accountStatus: 'ACTIVE' | 'DISABLED';
}

/**
 * Central Student Database Record
 * Every student has a unique Student ID (e.g. STU-00001, STU-00025)
 * which serves as the primary relationship key across all academic records.
 */
export interface Student {
  id: string;
  studentId: string; // e.g. "STU-00025" - Main identifier
  admissionNumber: string; // e.g. "ADM-2024-089"
  fullName: string;
  class: string; // e.g. "Grade 7A"
  grade: string; // e.g. "Grade 7"
  academicYear: string; // e.g. "2026"
  status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED';
  dateOfBirth?: string;
  gender?: 'M' | 'F';
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  specialNeeds?: string;
  createdAt: string;
}

export interface TeacherStudentLink {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  studentId: string; // Points to Central Student Database
  studentName: string;
  admissionNumber: string;
  assignedAt: string;
}

export interface GradingScaleItem {
  grade: string;
  min: number;
  max: number;
  description: string;
  minPercentage?: number;
  maxPercentage?: number;
  descriptor?: string;
}

export type ResultStatus = 'DRAFT' | 'SUBMITTED' | 'RETURNED' | 'APPROVED' | 'LOCKED';

export interface AcademicResult {
  id: string;
  studentId: string; // Central Student ID (e.g. STU-00025)
  admissionNumber: string;
  studentName: string;
  classId: string;
  className: string;
  grade: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  academicYear: string;
  term: string;
  assessmentType: string;
  maxMarks: number;
  marksObtained: number;
  percentage: number;
  calculatedGrade: string;
  feedback: {
    strengths: string;
    areasForImprovement: string;
    teacherComment: string;
    recommendedAction: string;
  };
  status: ResultStatus;
  submittedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  returnReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResultCorrectionRequest {
  id: string;
  resultId: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  className: string;
  teacherId: string;
  teacherName: string;
  originalMark: number;
  proposedMark: number;
  reason: string;
  explanation: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewedAt?: string;
  adminNotes?: string;
  createdAt: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceStudentEntry {
  studentId: string;
  admissionNumber?: string;
  studentName: string;
  status: AttendanceStatus;
  remark?: string;
  notes?: string;
}

export interface AttendanceSession {
  id: string;
  academicYear: string;
  term: string;
  classId: string;
  className: string;
  subjectId?: string;
  subjectName?: string;
  date: string;
  teacherId: string;
  teacherName: string;
  records: AttendanceStudentEntry[];
  createdAt: string;
}

export interface SubjectReportEntry {
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  maxMarks: number;
  marksObtained: number;
  percentage: number;
  grade: string;
  teacherComment: string;
  status: ResultStatus;
}

export interface StudentReportCard {
  studentId: string;
  admissionNumber: string;
  studentName: string;
  class: string;
  grade: string;
  academicYear: string;
  term: string;
  generatedDate: string;
  subjects: SubjectReportEntry[];
  totalMarksObtained: number;
  totalMaxPossible: number;
  averagePercentage: number;
  overallGrade: string;
  overallRemark: string;
  attendanceDaysPresent: number;
  attendanceDaysTotal: number;
  attendancePercentage: number;
  classPosition?: string;
  totalStudentsInClass?: number;
  headteacherRemarks: string;
  headteacherName: string;
  directorName: string;
  schoolMotto: string;
  schoolLogoUrl: string;
}

export interface SchoolClass {
  id: string;
  name: string; // e.g. "Grade 7 Alpha (JSS)"
  level: 'Pre-Primary' | 'Primary' | 'Junior Secondary';
  stream?: string;
  classTeacherName?: string;
  classTeacherId?: string;
  capacity: number;
  enrolledCount: number;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  level: 'Pre-Primary' | 'Primary' | 'Junior Secondary';
  department: string;
}

export type AssignmentStatus = 'Pending' | 'Submitted' | 'Late' | 'Reviewed';

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  description: string;
  instructions: string;
  attachmentUrl?: string;
  attachmentName?: string;
  maxMarks: number;
  dueDate: string;
  createdAt: string;
  allowOnlineSubmission: boolean;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  learnerId: string;
  learnerName: string;
  learnerAdmissionNo: string;
  submittedAt: string;
  status: AssignmentStatus;
  submissionContent: string;
  attachmentName?: string;
  marksAwarded?: number;
  teacherFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export type EnquiryCategory =
  | 'Admission'
  | 'Junior Secondary (JSS)'
  | 'CBC Curriculum'
  | 'School Fees'
  | 'School Visit'
  | 'General Enquiry';

export type EnquiryStatus =
  | 'NEW'
  | 'IN PROGRESS'
  | 'RESPONDED'
  | 'RESOLVED'
  | 'CLOSED';

export interface EnquiryReply {
  id: string;
  senderName: string;
  senderRole: string;
  message: string;
  createdAt: string;
}

export interface Enquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  phone: string;
  email?: string;
  category: EnquiryCategory;
  message: string;
  status: EnquiryStatus;
  source: 'Website Form' | 'AI Chatbot Handoff' | 'Admissions Page' | 'Phone';
  assignedStaff?: string;
  studentGradeInterest?: string;
  createdAt: string;
  replies: EnquiryReply[];
}

export interface ChatbotKnowledgeItem {
  id: string;
  category: string;
  question: string;
  keywords: string[];
  answer: string;
  lastUpdated: string;
  helpfulCount: number;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  timestamp: string;
  visitorPhone?: string;
  status: 'PENDING_REVIEW' | 'ANSWER_ADDED' | 'DISMISSED';
  suggestedAnswer?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: string;
  isEscalationPrompt?: boolean;
  suggestedAction?: 'call' | 'visit' | 'enquiry' | 'admission';
}

export interface InternalMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  recipientRole: UserRole;
  subject?: string;
  body: string;
  attachmentName?: string;
  createdAt: string;
  isRead: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'General' | 'Academics' | 'Sports' | 'Holiday' | 'Important Notice';
  content: string;
  targetAudience: 'ALL' | 'PARENTS' | 'TEACHERS' | 'LEARNERS';
  publishedDate: string;
  isPublished: boolean;
  isPinned?: boolean;
  authorName: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  targetAudience: string;
  category: 'Academic' | 'Sports' | 'Parents Meeting' | 'Cultural' | 'Holiday';
  imageUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category:
    | 'Academics'
    | 'Sports'
    | 'Music'
    | 'School Events'
    | 'Trips'
    | 'Competitions'
    | 'Graduation'
    | 'Classroom Activities'
    | 'School Facilities'
    | 'Campus & Classrooms'
    | 'Science & ICT Labs'
    | 'Infrastructure & Expansion'
    | 'Governance & Leadership'
    | 'Clubs';
  imageUrl: string;
  description: string;
  eventDate: string;
}

export type DocumentAccess = 'PUBLIC' | 'PARENTS ONLY' | 'TEACHERS ONLY' | 'ADMIN ONLY';

export interface SchoolDocument {
  id: string;
  title: string;
  category: 'Admissions' | 'Policies' | 'Fee Structures' | 'Circulars' | 'Academic' | 'Calendars';
  fileSize: string;
  fileType: string;
  accessLevel: DocumentAccess;
  downloadUrl: string;
  uploadedAt: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  userId?: string;
  roleTarget?: UserRole | 'ALL';
  title: string;
  message: string;
  type: 'enquiry' | 'assignment' | 'message' | 'announcement' | 'system';
  createdAt: string;
  isRead: boolean;
  actionUrl?: string;
}

export interface SmsLogItem {
  id: string;
  recipientPhone: string;
  recipientName: string;
  message: string;
  purpose: 'ENQUIRY_ALERT' | 'ADMISSION_ALERT' | 'PARENT_MSG' | 'OTP' | 'NOTICE';
  status: 'SENT' | 'DELIVERED' | 'FAILED';
  sentAt: string;
  provider: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface SchoolSettings {
  schoolName: string;
  motto: string;
  postalAddress: string;
  location: string;
  directorName: string;
  directorPhone: string;
  headteacherName: string;
  headteacherPhone: string;
  ictTeacherName: string;
  email: string;
  officeHours: string;
  logoUrl: string;
  heroImageUrl: string;
  ictImageUrl: string;
  primaryColor: string;
  accentGold: string;
  accentGreen: string;
  smsProvider: {
    providerName: string;
    senderId: string;
    apiKey: string;
    active: boolean;
    notifyPhoneNumbers: string[];
  };
  preferredLoginMethod: 'USERNAME' | 'STAFF_ID' | 'PHONE' | 'EMAIL';
  admissionOpen: boolean;
  academicYear: string;
  currentTerm: string;
  gradingScale: GradingScaleItem[];
  rankingEnabled: boolean;
}
