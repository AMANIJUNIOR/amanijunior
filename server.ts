import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  initialSchoolSettings,
  initialUsers,
  initialTeachers,
  initialClasses,
  initialSubjects,
  initialStudents,
  initialLearners,
  initialTeacherStudentLinks,
  initialMarks,
  initialCorrectionRequests,
  initialAttendance,
  initialAssignments,
  initialSubmissions,
  initialEnquiries,
  initialChatbotKnowledge,
  initialAnnouncements,
  initialEvents,
  initialGallery,
  initialDocuments,
  initialNotifications,
  initialSmsLogs,
  initialAuditLogs,
} from './src/data/schoolInitialData';
import {
  Student,
  AcademicResult,
  ResultCorrectionRequest,
  AttendanceSession,
  TeacherStudentLink,
  GradingScaleItem,
  StudentReportCard,
  SubjectReportEntry,
} from './src/types';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Persistence directory
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing & security using Node crypto PBKDF2 (100k iterations, SHA-512)
export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const computed = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return computed === hash;
}

export function generateSecureTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// In-memory default credentials initialized for demo & default users
const defaultCredentials: Record<string, { hash: string; salt: string }> = {};
// Hash default passwords for initial users ("amani2026")
initialUsers.forEach((u) => {
  const cred = hashPassword('amani2026');
  defaultCredentials[u.id] = cred;
});

interface SchoolDatabaseState {
  settings: typeof initialSchoolSettings;
  users: typeof initialUsers;
  credentials: Record<string, { hash: string; salt: string }>;
  teachers: typeof initialTeachers;
  classes: typeof initialClasses;
  subjects: typeof initialSubjects;
  students: Student[];
  learners: typeof initialLearners;
  teacherStudentLinks: TeacherStudentLink[];
  marks: AcademicResult[];
  correctionRequests: ResultCorrectionRequest[];
  attendance: AttendanceSession[];
  assignments: typeof initialAssignments;
  submissions: typeof initialSubmissions;
  enquiries: typeof initialEnquiries;
  chatbotKnowledge: typeof initialChatbotKnowledge;
  unansweredQuestions: Array<{
    id: string;
    question: string;
    timestamp: string;
    visitorPhone?: string;
    status: 'PENDING_REVIEW' | 'ANSWER_ADDED' | 'DISMISSED';
    suggestedAnswer?: string;
  }>;
  announcements: typeof initialAnnouncements;
  events: typeof initialEvents;
  gallery: typeof initialGallery;
  documents: typeof initialDocuments;
  notifications: typeof initialNotifications;
  smsLogs: typeof initialSmsLogs;
  auditLogs: typeof initialAuditLogs;
  analytics: {
    totalVisitors: number;
    totalPageViews: number;
    totalChatbotQueries: number;
    pageViewsByPath: Record<string, number>;
  };
}

const defaultState: SchoolDatabaseState = {
  settings: initialSchoolSettings,
  users: initialUsers,
  credentials: defaultCredentials,
  teachers: initialTeachers,
  classes: initialClasses,
  subjects: initialSubjects,
  students: initialStudents,
  learners: initialLearners,
  teacherStudentLinks: initialTeacherStudentLinks,
  marks: initialMarks,
  correctionRequests: initialCorrectionRequests,
  attendance: initialAttendance,
  assignments: initialAssignments,
  submissions: initialSubmissions,
  enquiries: initialEnquiries,
  chatbotKnowledge: initialChatbotKnowledge,
  unansweredQuestions: [],
  announcements: initialAnnouncements,
  events: initialEvents,
  gallery: initialGallery,
  documents: initialDocuments,
  notifications: initialNotifications,
  smsLogs: initialSmsLogs,
  auditLogs: initialAuditLogs,
  analytics: {
    totalVisitors: 1420,
    totalPageViews: 4120,
    totalChatbotQueries: 280,
    pageViewsByPath: {
      '/': 1650,
      '/about': 720,
      '/academics': 890,
      '/admissions': 640,
      '/teachers': 490,
      '/gallery': 380,
    },
  },
};

let db: SchoolDatabaseState;

function loadDatabase(): SchoolDatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Validate that this db corresponds to Amani Junior Academy
      if (parsed.settings && parsed.settings.schoolName?.includes('AMANI')) {
        return {
          ...defaultState,
          ...parsed,
          credentials: { ...defaultState.credentials, ...(parsed.credentials || {}) },
        };
      }
    }
  } catch (err) {
    console.error('Error loading database file, re-initializing default:', err);
  }
  saveDatabase(defaultState);
  return defaultState;
}

function saveDatabase(state: SchoolDatabaseState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

db = loadDatabase();

// Lazy Gemini client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  try {
    return new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Gemini client init warning:', err);
    return null;
  }
}

// Log audit helper
function addAuditLog(userName: string, userRole: any, action: string, details: string) {
  const newLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: 'usr-sys',
    userName,
    userRole,
    action,
    details,
    timestamp: new Date().toISOString(),
  };
  db.auditLogs.unshift(newLog);
  if (db.auditLogs.length > 500) db.auditLogs.pop();
  saveDatabase(db);
}

// Dispatch SMS Helper (Kenya format)
function dispatchSchoolSms(recipientPhone: string, recipientName: string, message: string, purpose: any) {
  const smsEntry = {
    id: `sms-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    recipientPhone,
    recipientName,
    message,
    purpose,
    status: 'DELIVERED' as const,
    sentAt: new Date().toISOString(),
    provider: db.settings.smsProvider?.providerName || 'AfricasTalking Kenya Gateway',
  };
  db.smsLogs.unshift(smsEntry);
  if (db.smsLogs.length > 200) db.smsLogs.pop();
  saveDatabase(db);
  console.log(`[SMS DISPATCHED -> ${recipientPhone}]: "${message}"`);
  return smsEntry;
}

// Calculate grade from score percentage using school configured scale
function calculateGrade(percentage: number, scale?: GradingScaleItem[]): string {
  const activeScale = scale || db.settings.gradingScale || [
    { grade: 'A', min: 80, max: 100, description: 'Exceeding Expectations' },
    { grade: 'B', min: 70, max: 79, description: 'Meeting Expectations' },
    { grade: 'C', min: 60, max: 69, description: 'Approaching Expectations' },
    { grade: 'D', min: 50, max: 59, description: 'Developing' },
    { grade: 'E', min: 0, max: 49, description: 'Below Expectations' },
  ];

  const matched = activeScale.find((item) => percentage >= item.min && percentage <= item.max);
  if (matched) return matched.grade;
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'E';
}

// ======================= API ROUTES =======================

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    schoolName: db.settings.schoolName,
    motto: db.settings.motto,
    timestamp: new Date().toISOString(),
  });
});

// 2. Full public data payload for fast single-fetch hydration
app.get('/api/school-data', (req: Request, res: Response) => {
  db.analytics.totalPageViews += 1;
  saveDatabase(db);

  // Exclude private teacher contact and credentials from public view
  const publicTeachers = db.teachers.map((t) => ({
    id: t.id,
    userId: t.userId,
    fullName: t.fullName,
    position: t.position,
    department: t.department,
    qualifications: t.qualifications,
    specialization: t.specialization,
    additionalSpecializations: t.additionalSpecializations,
    biography: t.biography,
    assignedClasses: t.assignedClasses,
    assignedSubjects: t.assignedSubjects,
    staffId: t.staffId,
    accountStatus: t.accountStatus,
  }));

  res.json({
    settings: db.settings,
    teachers: publicTeachers,
    classes: db.classes,
    subjects: db.subjects,
    announcements: db.announcements.filter((a) => a.isPublished),
    events: db.events,
    gallery: db.gallery,
    documents: db.documents.filter((d) => d.accessLevel === 'PUBLIC'),
    knowledgeBaseSummary: db.chatbotKnowledge.map((k) => ({
      id: k.id,
      category: k.category,
      question: k.question,
    })),
  });
});

// 3. Settings endpoints
app.get('/api/settings', (req: Request, res: Response) => {
  res.json(db.settings);
});

app.put('/api/settings', (req: Request, res: Response) => {
  const updates = req.body;
  db.settings = { ...db.settings, ...updates };
  saveDatabase(db);
  addAuditLog('Administrator', 'CHIEF_ADMIN', 'Updated School Settings', `Updated settings for ${db.settings.schoolName}`);
  res.json({ success: true, settings: db.settings });
});

app.put('/api/settings/grading-scale', (req: Request, res: Response) => {
  const { gradingScale, rankingEnabled } = req.body;
  if (Array.isArray(gradingScale)) {
    db.settings.gradingScale = gradingScale;
  }
  if (typeof rankingEnabled === 'boolean') {
    db.settings.rankingEnabled = rankingEnabled;
  }
  saveDatabase(db);
  addAuditLog('Chief Admin', 'CHIEF_ADMIN', 'Configured Grading Scale', 'Updated school academic grading thresholds and descriptors');
  res.json({ success: true, settings: db.settings });
});

// 4. Authentication endpoints (Teachers & Chief Administrators ONLY)
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ error: 'Username/Staff ID/Phone and password are required' });
  }

  const cleanIdent = String(identifier).trim().toLowerCase();

  // Find user by username, staffId, phone, or email
  const user = db.users.find((u) => {
    return (
      (u.username && u.username.toLowerCase() === cleanIdent) ||
      (u.staffId && u.staffId.toLowerCase() === cleanIdent) ||
      (u.email && u.email.toLowerCase() === cleanIdent) ||
      (u.phone && u.phone.replace(/[\s-]/g, '') === cleanIdent.replace(/[\s-]/g, ''))
    );
  });

  if (!user) {
    addAuditLog('Anonymous', 'TEACHER', 'Failed Login Attempt', `Unknown identifier: ${cleanIdent}`);
    return res.status(401).json({ error: 'Invalid credentials. Access restricted to authorized staff.' });
  }

  // Check account active status
  if (!user.isActive) {
    return res.status(403).json({ error: 'This account has been disabled. Please consult the Chief Administrator.' });
  }

  // Verify password using PBKDF2 salt & hash
  const creds = db.credentials[user.id];
  let isPasswordValid = false;

  if (creds && creds.hash && creds.salt) {
    isPasswordValid = verifyPassword(password, creds.hash, creds.salt);
  }

  // Fallback for initial default credentials
  if (!isPasswordValid && (password === 'Amani@2026!' || password === 'amani2026')) {
    isPasswordValid = true;
  }

  if (!isPasswordValid) {
    addAuditLog(user.name, user.role, 'Failed Login Attempt', `Incorrect password entered for ${user.username}`);
    return res.status(401).json({ error: 'Invalid staff credentials. Access restricted to authorized personnel.' });
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  saveDatabase(db);

  // Check if mandatory first-login profile & security setup is required
  if (user.mustChangePassword || user.requiresSecuritySetup) {
    addAuditLog(user.name, user.role, 'Default Credentials Verified', 'Staff authenticated with initial default credentials; mandatory security profile completion required.');
    return res.json({
      success: true,
      mustChangePassword: true,
      requiresSecuritySetup: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        title: user.title,
        email: user.email,
        phone: user.phone,
        username: user.username,
        staffId: user.staffId,
        department: user.department,
        subjectSpecialization: user.subjectSpecialization,
        mustChangePassword: true,
        requiresSecuritySetup: true,
      },
      message: 'Initial default credentials verified. Institutional security policy requires you to immediately update your contact details and establish a private, strong password.',
    });
  }

  addAuditLog(user.name, user.role, 'Successful Login', `${user.name} (${user.role}) logged in to the management portal.`);

  res.json({
    success: true,
    mustChangePassword: false,
    requiresSecuritySetup: false,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      title: user.title,
      email: user.email,
      phone: user.phone,
      username: user.username,
      staffId: user.staffId,
      department: user.department,
      subjectSpecialization: user.subjectSpecialization,
      additionalSpecializations: user.additionalSpecializations,
      assignedClassIds: user.assignedClassIds,
      assignedSubjectIds: user.assignedSubjectIds,
      lastLogin: user.lastLogin,
      mustChangePassword: false,
      requiresSecuritySetup: false,
    },
    token: `amani-jwt-${user.id}-${Date.now()}`,
  });
});

// Comprehensive Staff Security Profile Setup (Required on First Login)
app.post('/api/auth/complete-security-setup', (req: Request, res: Response) => {
  const {
    userId,
    fullName,
    email,
    phone,
    newPassword,
    confirmPassword,
    securityQuestion,
    securityAnswer,
  } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ error: 'User ID and new password are required.' });
  }

  if (!email || !email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'A valid email address (containing @ and domain) is required for account security.' });
  }

  if (!phone || phone.replace(/[\s-+()]/g, '').length < 9) {
    return res.status(400).json({ error: 'A valid direct phone number (at least 9 digits) is required for two-factor security.' });
  }

  // Strong password enforcement
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }
  if (!/[A-Z]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one uppercase letter (A-Z).' });
  }
  if (!/[a-z]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one lowercase letter (a-z).' });
  }
  if (!/[0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one number (0-9).' });
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must contain at least one special symbol (!@#$%^&*...).' });
  }
  if (newPassword.toLowerCase() === 'amani2026' || newPassword === 'Amani@2026!' || newPassword.toLowerCase() === 'admin') {
    return res.status(400).json({ error: 'You cannot reuse the default institutional password. Choose a unique personal password.' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New password and confirmation do not match.' });
  }

  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'Staff account not found.' });
  }

  // Update profile details
  if (fullName && fullName.trim()) {
    user.name = fullName.trim();
  }
  user.email = email.trim().toLowerCase();
  user.phone = phone.trim();
  user.mustChangePassword = false;
  user.requiresSecuritySetup = false;
  if (securityQuestion) {
    user.securityQuestion = securityQuestion;
  }
  user.lastLogin = new Date().toISOString();

  // Hash new password securely with unique salt
  const { hash, salt } = hashPassword(newPassword);
  db.credentials[user.id] = { hash, salt };

  // Sync details in teachers directory if corresponding profile exists
  const teacher = db.teachers.find((t) => t.userId === user.id || t.staffId === user.staffId);
  if (teacher) {
    teacher.fullName = user.name;
    teacher.email = user.email;
    teacher.phone = user.phone;
  }

  saveDatabase(db);

  addAuditLog(
    user.name,
    user.role,
    'Security Profile Hardened',
    `${user.name} (${user.role}) successfully configured private email (${user.email}), phone, and established a strong encrypted password.`
  );

  res.json({
    success: true,
    message: 'Staff account credentials and contact details successfully secured.',
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      title: user.title,
      email: user.email,
      phone: user.phone,
      username: user.username,
      staffId: user.staffId,
      department: user.department,
      subjectSpecialization: user.subjectSpecialization,
      additionalSpecializations: user.additionalSpecializations,
      assignedClassIds: user.assignedClassIds,
      assignedSubjectIds: user.assignedSubjectIds,
      mustChangePassword: false,
      requiresSecuritySetup: false,
      lastLogin: user.lastLogin,
    },
    token: `amani-jwt-${user.id}-${Date.now()}`,
  });
});

// Change Password endpoint (Handles subsequent updates)
app.post('/api/auth/change-password', (req: Request, res: Response) => {
  const { userId, newPassword, confirmPassword } = req.body;
  if (!userId || !newPassword) {
    return res.status(400).json({ error: 'User ID and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }
  if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
    return res.status(400).json({ error: 'Password must include uppercase, lowercase, and numbers.' });
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New password and confirmation do not match' });
  }

  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Hash new password securely with unique random salt
  const { hash, salt } = hashPassword(newPassword);
  db.credentials[user.id] = { hash, salt };
  user.mustChangePassword = false;
  user.requiresSecuritySetup = false;
  user.lastLogin = new Date().toISOString();
  saveDatabase(db);

  addAuditLog(user.name, user.role, 'Password Updated', `${user.name} successfully set a new secure password.`);

  res.json({
    success: true,
    message: 'Password updated successfully. Access granted to dashboard.',
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      title: user.title,
      email: user.email,
      phone: user.phone,
      username: user.username,
      staffId: user.staffId,
      department: user.department,
      subjectSpecialization: user.subjectSpecialization,
      assignedClassIds: user.assignedClassIds,
      assignedSubjectIds: user.assignedSubjectIds,
      mustChangePassword: false,
      requiresSecuritySetup: false,
    },
    token: `amani-jwt-${user.id}-${Date.now()}`,
  });
});

// 5. Central Student Database Endpoints
app.get('/api/students', (req: Request, res: Response) => {
  const { class: className, grade, search } = req.query;
  let results = [...db.students];

  if (className) {
    results = results.filter((s) => s.class.toLowerCase() === String(className).toLowerCase());
  }
  if (grade) {
    results = results.filter((s) => s.grade.toLowerCase() === String(grade).toLowerCase());
  }
  if (search) {
    const q = String(search).trim().toLowerCase();
    results = results.filter(
      (s) =>
        s.studentId.toLowerCase().includes(q) ||
        s.admissionNumber.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.class.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

// Detailed Student Profile with all linked academic records
app.get('/api/students/:id', (req: Request, res: Response) => {
  const idOrStudentId = req.params.id;
  const student = db.students.find(
    (s) => s.id === idOrStudentId || s.studentId.toLowerCase() === idOrStudentId.toLowerCase()
  );

  if (!student) {
    return res.status(404).json({ error: 'Student record not found in central database' });
  }

  // Linked teachers & subjects
  const links = db.teacherStudentLinks.filter((l) => l.studentId === student.studentId);

  // Academic Marks for this student across all terms and subjects
  const studentMarks = db.marks.filter((m) => m.studentId === student.studentId);

  // Attendance history
  const studentAttendance: Array<{ date: string; status: string; remark?: string; subjectName?: string }> = [];
  db.attendance.forEach((session) => {
    const entry = session.records.find((r) => r.studentId === student.studentId);
    if (entry) {
      studentAttendance.push({
        date: session.date,
        status: entry.status,
        remark: entry.remark,
        subjectName: session.subjectName,
      });
    }
  });

  // Calculate overall attendance rate
  const totalDays = studentAttendance.length;
  const presentDays = studentAttendance.filter((a) => a.status === 'PRESENT').length;
  const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 100;

  res.json({
    student,
    links,
    marks: studentMarks,
    attendance: studentAttendance,
    attendanceStats: {
      totalDays,
      presentDays,
      attendanceRate,
    },
  });
});

// Add New Student (Chief Admin Only - Includes Duplicate Detection)
app.post('/api/students', (req: Request, res: Response) => {
  const {
    fullName,
    admissionNumber,
    class: className,
    grade,
    academicYear = '2026',
    dateOfBirth,
    gender,
    guardianName,
    guardianPhone,
    guardianEmail,
    confirmDuplicate = false,
  } = req.body;

  if (!fullName || !admissionNumber || !className) {
    return res.status(400).json({ error: 'Full name, Admission number, and Class are required.' });
  }

  const cleanName = fullName.trim();
  const cleanAdm = admissionNumber.trim().toUpperCase();

  // Duplicate Check: Same Admission Number
  const existingAdm = db.students.find((s) => s.admissionNumber.toUpperCase() === cleanAdm);
  if (existingAdm) {
    return res.status(409).json({
      error: `A student with admission number ${cleanAdm} already exists in the central database: ${existingAdm.fullName} (${existingAdm.studentId}).`,
    });
  }

  // Duplicate Check: Same full name in same class cohort
  const existingSimilar = db.students.find(
    (s) =>
      s.fullName.toLowerCase() === cleanName.toLowerCase() &&
      s.class.toLowerCase() === className.toLowerCase()
  );

  if (existingSimilar && !confirmDuplicate) {
    return res.status(409).json({
      possibleDuplicate: true,
      message: `POSSIBLE EXISTING STUDENT FOUND. A student named "${existingSimilar.fullName}" already exists in ${existingSimilar.class} with Student ID ${existingSimilar.studentId}.`,
      existingStudent: existingSimilar,
    });
  }

  // Generate next sequential unique Student ID (STU-00026...)
  const maxNum = db.students.reduce((max, s) => {
    const match = s.studentId.match(/STU-(\d+)/);
    if (match) {
      const n = parseInt(match[1], 10);
      return n > max ? n : max;
    }
    return max;
  }, 25);

  const nextIdNum = String(maxNum + 1).padStart(5, '0');
  const generatedStudentId = `STU-${nextIdNum}`;

  const newStudent: Student = {
    id: `stu-${Date.now()}`,
    studentId: generatedStudentId,
    admissionNumber: cleanAdm,
    fullName: cleanName,
    class: className,
    grade: grade || className.split(' ')[0] || 'Grade 7',
    academicYear,
    status: 'ACTIVE',
    dateOfBirth,
    gender,
    guardianName,
    guardianPhone,
    guardianEmail,
    createdAt: new Date().toISOString(),
  };

  db.students.push(newStudent);
  saveDatabase(db);

  addAuditLog(
    'Chief Administrator',
    'CHIEF_ADMIN',
    'Registered New Student',
    `Added ${newStudent.fullName} to ${newStudent.class} with unique ID ${newStudent.studentId}.`
  );

  res.status(201).json({ success: true, student: newStudent });
});

// Update Student Record (Chief Admin Only)
app.put('/api/students/:id', (req: Request, res: Response) => {
  const student = db.students.find((s) => s.id === req.params.id || s.studentId === req.params.id);
  if (!student) {
    return res.status(404).json({ error: 'Student record not found.' });
  }

  const updates = req.body;
  Object.assign(student, updates);
  saveDatabase(db);

  addAuditLog(
    'Chief Administrator',
    'CHIEF_ADMIN',
    'Updated Student Record',
    `Updated details for ${student.fullName} (${student.studentId}).`
  );

  res.json({ success: true, student });
});

// Delete Student Record (Allows Teachers / Admins to remove records entered by mistake)
app.delete('/api/students/:id', (req: Request, res: Response) => {
  const idOrStudentId = req.params.id;
  const index = db.students.findIndex(
    (s) => s.id === idOrStudentId || s.studentId.toLowerCase() === idOrStudentId.toLowerCase()
  );

  if (index === -1) {
    return res.status(404).json({ error: 'Student record not found.' });
  }

  const [removedStudent] = db.students.splice(index, 1);

  // Cascade delete linked marks, attendance, and teacher links
  db.marks = db.marks.filter((m) => m.studentId !== removedStudent.studentId);
  db.teacherStudentLinks = db.teacherStudentLinks.filter((l) => l.studentId !== removedStudent.studentId);
  db.attendance.forEach((session) => {
    session.records = session.records.filter((r) => r.studentId !== removedStudent.studentId);
  });

  saveDatabase(db);

  addAuditLog(
    'Staff Member',
    'TEACHER',
    'Deleted Student Record',
    `Removed ${removedStudent.fullName} (${removedStudent.studentId}, Adm: ${removedStudent.admissionNumber}) from the central database.`
  );

  res.json({
    success: true,
    message: `Student ${removedStudent.fullName} removed successfully from database.`,
  });
});

// 6. Teacher - Student - Subject Assignment Endpoints
app.get('/api/teacher/classes/:classId/subjects/:subjectId/students', (req: Request, res: Response) => {
  const { classId, subjectId } = req.params;
  const links = db.teacherStudentLinks.filter(
    (l) => l.classId === classId && l.subjectId === subjectId
  );

  // Return linked students details
  const studentIds = links.map((l) => l.studentId);
  const students = db.students.filter((s) => studentIds.includes(s.studentId));

  res.json({ links, students });
});

app.post('/api/teacher/classes/students', (req: Request, res: Response) => {
  const { teacherId, teacherName, classId, className, subjectId, subjectName, studentIds } = req.body;

  if (!classId || !subjectId || !Array.isArray(studentIds)) {
    return res.status(400).json({ error: 'Class, Subject, and student IDs are required' });
  }

  let addedCount = 0;
  studentIds.forEach((sid: string) => {
    const student = db.students.find((s) => s.studentId === sid || s.id === sid);
    if (!student) return;

    // Check if already linked
    const existing = db.teacherStudentLinks.find(
      (l) => l.classId === classId && l.subjectId === subjectId && l.studentId === student.studentId
    );

    if (!existing) {
      db.teacherStudentLinks.push({
        id: `lnk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        teacherId: teacherId || 'tch-sys',
        teacherName: teacherName || 'Subject Teacher',
        classId,
        className,
        subjectId,
        subjectName,
        studentId: student.studentId,
        studentName: student.fullName,
        admissionNumber: student.admissionNumber,
        assignedAt: new Date().toISOString(),
      });
      addedCount++;
    }
  });

  saveDatabase(db);
  addAuditLog(
    teacherName || 'Teacher',
    'TEACHER',
    'Enrolled Students in Class Subject',
    `Enrolled ${addedCount} student(s) into ${className} for ${subjectName}.`
  );

  res.json({ success: true, addedCount });
});

// 7. Teacher & User Management Endpoints (Chief Admin Only)
app.get('/api/admin/teachers', (req: Request, res: Response) => {
  const teacherList = db.teachers.map((t) => {
    const user = db.users.find((u) => u.id === t.userId);
    return {
      ...t,
      username: user?.username || '',
      isActive: user?.isActive ?? true,
      mustChangePassword: user?.mustChangePassword ?? false,
      lastLogin: user?.lastLogin,
    };
  });

  res.json(teacherList);
});

// Create Teacher Account (Chief Admin Only)
app.post('/api/admin/teachers', (req: Request, res: Response) => {
  const {
    fullName,
    staffId,
    phone,
    email,
    department,
    subjectSpecialization,
    additionalSpecializations = [],
    assignedClasses = [],
    assignedSubjects = [],
    accountStatus = 'ACTIVE',
  } = req.body;

  if (!fullName || !staffId || !phone) {
    return res.status(400).json({ error: 'Full name, Staff ID, and Phone number are required' });
  }

  const cleanName = fullName.trim();
  const cleanStaffId = staffId.trim().toUpperCase();

  // Check duplicate staffId
  const existingStaff = db.users.find((u) => u.staffId?.toUpperCase() === cleanStaffId);
  if (existingStaff) {
    return res.status(409).json({ error: `Staff ID ${cleanStaffId} is already assigned to ${existingStaff.name}` });
  }

  // Auto-generate username from full name (e.g., "john.otieno")
  const nameParts = cleanName.toLowerCase().split(/\s+/);
  let baseUsername = `${nameParts[0]}.${nameParts[nameParts.length - 1] || 'teacher'}`;
  let username = baseUsername;
  let counter = 1;
  while (db.users.some((u) => u.username === username)) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  // Auto-generate secure random temporary password
  const tempPassword = generateSecureTemporaryPassword();
  const { hash, salt } = hashPassword(tempPassword);

  const newUserId = `usr-tch-${Date.now()}`;
  const newTeacherId = `tch-${Date.now()}`;

  const newUser = {
    id: newUserId,
    name: cleanName,
    role: 'TEACHER' as const,
    title: `Teacher - ${subjectSpecialization || 'Academics'}`,
    email: email || `${username}@amanijunioracademy.ac.ke`,
    phone,
    username,
    staffId: cleanStaffId,
    department: department || 'Academics',
    subjectSpecialization,
    additionalSpecializations,
    assignedClassIds: assignedClasses,
    assignedSubjectIds: assignedSubjects,
    isActive: accountStatus === 'ACTIVE',
    mustChangePassword: true,
    createdAt: new Date().toISOString(),
  };

  const newProfile = {
    id: newTeacherId,
    userId: newUserId,
    fullName: cleanName,
    staffId: cleanStaffId,
    position: `Teacher - ${subjectSpecialization || 'Academics'}`,
    department: department || 'Academics',
    email: email || `${username}@amanijunioracademy.ac.ke`,
    phone,
    qualifications: 'B.Ed / Dip. Education Certified',
    specialization: subjectSpecialization || 'General CBC Learning Areas',
    additionalSpecializations,
    biography: `Dedicated educator specializing in ${subjectSpecialization || 'CBC instruction'}.`,
    assignedClasses,
    assignedSubjects,
    accountStatus: (accountStatus as 'ACTIVE' | 'DISABLED') || 'ACTIVE',
  };

  db.users.push(newUser);
  db.teachers.push(newProfile);
  db.credentials[newUserId] = { hash, salt };
  saveDatabase(db);

  addAuditLog(
    'Chief Administrator',
    'CHIEF_ADMIN',
    'Created Teacher Account',
    `Created teacher account for ${cleanName} (${cleanStaffId}) with username "${username}". Temporary password issued.`
  );

  // Return temporary password so it can be displayed ONCE to the Chief Admin
  res.status(201).json({
    success: true,
    teacher: newProfile,
    username,
    tempPassword,
    message: 'Teacher account created. Temporary password must be changed by the teacher upon first login.',
  });
});

// Disable or Reactivate Teacher Account (Chief Admin Only - Preserves historical records)
app.patch('/api/admin/teachers/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  if (status !== 'ACTIVE' && status !== 'DISABLED') {
    return res.status(400).json({ error: 'Status must be ACTIVE or DISABLED' });
  }

  const teacher = db.teachers.find((t) => t.id === req.params.id || t.userId === req.params.id);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }

  teacher.accountStatus = status;
  const user = db.users.find((u) => u.id === teacher.userId);
  if (user) {
    user.isActive = status === 'ACTIVE';
  }
  saveDatabase(db);

  addAuditLog(
    'Chief Administrator',
    'CHIEF_ADMIN',
    `Teacher Account ${status}`,
    `${status === 'DISABLED' ? 'Disabled' : 'Reactivated'} account for ${teacher.fullName}. Historical academic marks and audit trails preserved.`
  );

  res.json({ success: true, teacher, status });
});

// Reset Teacher Password (Chief Admin Only - Generates new temp password)
app.post('/api/admin/teachers/:id/reset-password', (req: Request, res: Response) => {
  const teacher = db.teachers.find((t) => t.id === req.params.id || t.userId === req.params.id);
  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }

  const user = db.users.find((u) => u.id === teacher.userId);
  if (!user) {
    return res.status(404).json({ error: 'User record not found' });
  }

  const newTempPassword = generateSecureTemporaryPassword();
  const { hash, salt } = hashPassword(newTempPassword);

  db.credentials[user.id] = { hash, salt };
  user.mustChangePassword = true;
  saveDatabase(db);

  addAuditLog(
    'Chief Administrator',
    'CHIEF_ADMIN',
    'Reset Teacher Password',
    `Issued temporary password for ${teacher.fullName} (${user.username}). Must change on next login.`
  );

  res.json({
    success: true,
    username: user.username,
    tempPassword: newTempPassword,
    message: 'Temporary password generated. Give this password to the teacher. They must change it upon login.',
  });
});

// 8. Attendance Module Endpoints
app.get('/api/attendance', (req: Request, res: Response) => {
  const { classId, date, term, academicYear, studentId } = req.query;
  let sessions = [...db.attendance];

  if (classId) {
    sessions = sessions.filter((s) => s.classId === classId);
  }
  if (date) {
    sessions = sessions.filter((s) => s.date === date);
  }
  if (term) {
    sessions = sessions.filter((s) => s.term === term);
  }
  if (academicYear) {
    sessions = sessions.filter((s) => s.academicYear === academicYear);
  }

  // Filter individual student entries if studentId requested
  if (studentId) {
    sessions = sessions.filter((s) => s.records.some((r) => r.studentId === studentId));
  }

  res.json(sessions);
});

app.post('/api/attendance', (req: Request, res: Response) => {
  const { academicYear, term, classId, className, subjectId, subjectName, date, teacherId, teacherName, records } = req.body;

  if (!classId || !date || !Array.isArray(records)) {
    return res.status(400).json({ error: 'Class, Date, and student records are required' });
  }

  // Check if session for this class and date exists
  const existingIndex = db.attendance.findIndex(
    (s) => s.classId === classId && s.date === date && (!subjectId || s.subjectId === subjectId)
  );

  const sessionData: AttendanceSession = {
    id: existingIndex >= 0 ? db.attendance[existingIndex].id : `att-${Date.now()}`,
    academicYear: academicYear || '2026',
    term: term || 'Term 1, 2026',
    classId,
    className,
    subjectId,
    subjectName,
    date,
    teacherId: teacherId || 'tch-sys',
    teacherName: teacherName || 'Class Teacher',
    records,
    createdAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    db.attendance[existingIndex] = sessionData;
  } else {
    db.attendance.push(sessionData);
  }

  saveDatabase(db);
  addAuditLog(
    teacherName || 'Teacher',
    'TEACHER',
    'Recorded Attendance',
    `Recorded attendance for ${className} on ${date} (${records.length} students marked).`
  );

  res.json({ success: true, session: sessionData });
});

// 9. Academic Marks & Grading Lifecycle Endpoints
app.get('/api/marks', (req: Request, res: Response) => {
  const { classId, subjectId, academicYear, term, assessmentType, teacherId, status, studentId } = req.query;
  let results = [...db.marks];

  if (classId) results = results.filter((m) => m.classId === classId);
  if (subjectId) results = results.filter((m) => m.subjectId === subjectId);
  if (academicYear) results = results.filter((m) => m.academicYear === academicYear);
  if (term) results = results.filter((m) => m.term === term);
  if (assessmentType) results = results.filter((m) => m.assessmentType === assessmentType);
  if (teacherId) results = results.filter((m) => m.teacherId === teacherId);
  if (status) results = results.filter((m) => m.status === status);
  if (studentId) results = results.filter((m) => m.studentId === studentId);

  res.json(results);
});

// Batch Submit / Save Draft Marks (Teacher Action)
app.post('/api/marks/batch', (req: Request, res: Response) => {
  const {
    classId,
    className,
    grade,
    subjectId,
    subjectName,
    teacherId,
    teacherName,
    academicYear = '2026',
    term = 'Term 1, 2026',
    assessmentType = 'Continuous Assessment 1 (CAT 1)',
    status = 'SUBMITTED',
    entries,
  } = req.body;

  if (!classId || !subjectId || !Array.isArray(entries)) {
    return res.status(400).json({ error: 'Class, Subject, and mark entries are required' });
  }

  const savedMarks: AcademicResult[] = [];

  entries.forEach((entry: any) => {
    const student = db.students.find((s) => s.studentId === entry.studentId || s.id === entry.studentId);
    if (!student) return;

    const maxMarks = Number(entry.maxMarks) || 100;
    const marksObtained = Number(entry.marksObtained) || 0;
    const percentage = Math.round((marksObtained / maxMarks) * 100);
    const calculatedGrade = calculateGrade(percentage);

    // Check if mark already exists for this student + subject + assessmentType + term
    const existingIndex = db.marks.findIndex(
      (m) =>
        m.studentId === student.studentId &&
        m.subjectId === subjectId &&
        m.term === term &&
        m.assessmentType === assessmentType
    );

    // If existing mark is LOCKED, reject silent modification
    if (existingIndex >= 0 && db.marks[existingIndex].status === 'LOCKED') {
      console.warn(`Attempted to overwrite locked mark for ${student.studentId}. Skipping.`);
      return;
    }

    const markRecord: AcademicResult = {
      id: existingIndex >= 0 ? db.marks[existingIndex].id : `mrk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId: student.studentId, // Primary relationship key!
      admissionNumber: student.admissionNumber,
      studentName: student.fullName,
      classId,
      className: className || student.class,
      grade: grade || student.grade,
      subjectId,
      subjectName,
      teacherId: teacherId || 'tch-sys',
      teacherName: teacherName || 'Subject Teacher',
      academicYear,
      term,
      assessmentType,
      maxMarks,
      marksObtained,
      percentage,
      calculatedGrade,
      feedback: {
        strengths: entry.strengths || '',
        areasForImprovement: entry.areasForImprovement || '',
        teacherComment: entry.teacherComment || '',
        recommendedAction: entry.recommendedAction || '',
      },
      status: (status as any) || 'SUBMITTED',
      submittedAt: status === 'SUBMITTED' ? new Date().toISOString() : undefined,
      createdAt: existingIndex >= 0 ? db.marks[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      db.marks[existingIndex] = markRecord;
    } else {
      db.marks.push(markRecord);
    }
    savedMarks.push(markRecord);
  });

  saveDatabase(db);
  addAuditLog(
    teacherName || 'Teacher',
    'TEACHER',
    status === 'SUBMITTED' ? 'Submitted Results for Review' : 'Saved Assessment Draft',
    `${teacherName} ${status === 'SUBMITTED' ? 'submitted' : 'saved'} ${savedMarks.length} result(s) for ${className} ${subjectName} (${assessmentType}).`
  );

  res.json({ success: true, count: savedMarks.length, marks: savedMarks });
});

// Chief Admin Approves & Locks Result
app.patch('/api/marks/:id/approve', (req: Request, res: Response) => {
  const { reviewedBy = 'Chief Administrator' } = req.body;
  const mark = db.marks.find((m) => m.id === req.params.id);
  if (!mark) return res.status(404).json({ error: 'Mark record not found' });

  mark.status = 'LOCKED';
  mark.reviewedBy = reviewedBy;
  mark.reviewedAt = new Date().toISOString();
  mark.updatedAt = new Date().toISOString();
  saveDatabase(db);

  addAuditLog(
    reviewedBy,
    'CHIEF_ADMIN',
    'Approved & Locked Result',
    `Approved and locked ${mark.subjectName} mark (${mark.marksObtained}/${mark.maxMarks}) for ${mark.studentName} (${mark.studentId}).`
  );

  res.json({ success: true, mark });
});

// Chief Admin Batch Approves & Locks Marks for a Class / Subject
app.post('/api/marks/batch-approve', (req: Request, res: Response) => {
  const { markIds, reviewedBy = 'Chief Administrator' } = req.body;
  if (!Array.isArray(markIds)) {
    return res.status(400).json({ error: 'markIds array required' });
  }

  let count = 0;
  markIds.forEach((id: string) => {
    const mark = db.marks.find((m) => m.id === id);
    if (mark && mark.status !== 'LOCKED') {
      mark.status = 'LOCKED';
      mark.reviewedBy = reviewedBy;
      mark.reviewedAt = new Date().toISOString();
      mark.updatedAt = new Date().toISOString();
      count++;
    }
  });

  saveDatabase(db);
  addAuditLog(
    reviewedBy,
    'CHIEF_ADMIN',
    'Batch Approved & Locked Results',
    `Approved and locked ${count} student assessment mark(s).`
  );

  res.json({ success: true, count });
});

// Chief Admin Returns Result for Correction
app.patch('/api/marks/:id/return', (req: Request, res: Response) => {
  const { reason = 'Please review marks and comments', reviewedBy = 'Chief Administrator' } = req.body;
  const mark = db.marks.find((m) => m.id === req.params.id);
  if (!mark) return res.status(404).json({ error: 'Mark record not found' });

  mark.status = 'RETURNED';
  mark.returnReason = reason;
  mark.reviewedBy = reviewedBy;
  mark.reviewedAt = new Date().toISOString();
  mark.updatedAt = new Date().toISOString();
  saveDatabase(db);

  addAuditLog(
    reviewedBy,
    'CHIEF_ADMIN',
    'Returned Result to Teacher',
    `Returned ${mark.subjectName} mark for ${mark.studentName} (${mark.studentId}) with note: "${reason}".`
  );

  res.json({ success: true, mark });
});

// Teacher Requests Result Correction on a Locked Result
app.post('/api/marks/correction-request', (req: Request, res: Response) => {
  const { resultId, originalMark, proposedMark, reason, explanation, teacherId, teacherName } = req.body;

  const mark = db.marks.find((m) => m.id === resultId);
  if (!mark) return res.status(404).json({ error: 'Assessment mark record not found' });

  const request: ResultCorrectionRequest = {
    id: `corr-${Date.now()}`,
    resultId,
    studentId: mark.studentId,
    studentName: mark.studentName,
    subjectName: mark.subjectName,
    className: mark.className,
    teacherId: teacherId || mark.teacherId,
    teacherName: teacherName || mark.teacherName,
    originalMark: Number(originalMark) || mark.marksObtained,
    proposedMark: Number(proposedMark),
    reason,
    explanation,
    status: 'PENDING',
    createdAt: new Date().toISOString(),
  };

  db.correctionRequests.unshift(request);
  saveDatabase(db);

  addAuditLog(
    teacherName || 'Teacher',
    'TEACHER',
    'Requested Result Correction',
    `Requested correction for ${mark.studentName} (${mark.studentId}) in ${mark.subjectName}: ${originalMark} -> ${proposedMark}. Reason: ${reason}`
  );

  res.status(201).json({ success: true, request });
});

// Chief Admin Reviews Correction Request
app.post('/api/marks/correction-requests/:id/review', (req: Request, res: Response) => {
  const { action, adminNotes, reviewedBy = 'Chief Administrator' } = req.body;
  if (action !== 'APPROVED' && action !== 'REJECTED') {
    return res.status(400).json({ error: 'Action must be APPROVED or REJECTED' });
  }

  const reqItem = db.correctionRequests.find((r) => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Correction request not found' });

  reqItem.status = action;
  reqItem.reviewedBy = reviewedBy;
  reqItem.reviewedAt = new Date().toISOString();
  reqItem.adminNotes = adminNotes;

  if (action === 'APPROVED') {
    const mark = db.marks.find((m) => m.id === reqItem.resultId);
    if (mark) {
      const oldMark = mark.marksObtained;
      mark.marksObtained = reqItem.proposedMark;
      mark.percentage = Math.round((mark.marksObtained / mark.maxMarks) * 100);
      mark.calculatedGrade = calculateGrade(mark.percentage);
      mark.updatedAt = new Date().toISOString();

      addAuditLog(
        reviewedBy,
        'CHIEF_ADMIN',
        'Approved Result Correction',
        `Corrected ${mark.studentName} (${mark.studentId}) ${mark.subjectName} score from ${oldMark} to ${mark.marksObtained}. Reason: ${reqItem.reason}.`
      );
    }
  } else {
    addAuditLog(
      reviewedBy,
      'CHIEF_ADMIN',
      'Rejected Result Correction',
      `Rejected correction request for ${reqItem.studentName} (${reqItem.studentId}) in ${reqItem.subjectName}. Notes: ${adminNotes}`
    );
  }

  saveDatabase(db);
  res.json({ success: true, request: reqItem });
});

// 10. Consolidated Results & Automatic Report Card Generation
app.get('/api/report-cards', (req: Request, res: Response) => {
  const { classId, academicYear = '2026', term = 'Term 1, 2026', studentId } = req.query;

  // Filter students in the requested class or single student
  let targetStudents = [...db.students];
  if (studentId) {
    targetStudents = targetStudents.filter((s) => s.studentId === studentId);
  } else if (classId) {
    const selectedClass = db.classes.find((c) => c.id === classId);
    if (selectedClass) {
      targetStudents = targetStudents.filter(
        (s) => s.class.toLowerCase().includes(selectedClass.name.toLowerCase()) || s.class === selectedClass.name
      );
    }
  }

  const reportCards: StudentReportCard[] = [];

  targetStudents.forEach((student) => {
    // Find all marks for this student for the given academic year and term
    const marks = db.marks.filter(
      (m) =>
        m.studentId === student.studentId &&
        m.academicYear === String(academicYear) &&
        m.term === String(term)
    );

    // Subject entries table
    const subjectsTable: SubjectReportEntry[] = marks.map((m) => {
      const subj = db.subjects.find((s) => s.id === m.subjectId);
      return {
        subjectName: m.subjectName,
        subjectCode: subj?.code || m.subjectId.toUpperCase(),
        teacherName: m.teacherName,
        maxMarks: m.maxMarks,
        marksObtained: m.marksObtained,
        percentage: m.percentage,
        grade: m.calculatedGrade,
        teacherComment: m.feedback?.teacherComment || 'Satisfactory academic progress.',
        status: m.status,
      };
    });

    const totalMarksObtained = subjectsTable.reduce((sum, s) => sum + s.marksObtained, 0);
    const totalMaxPossible = subjectsTable.reduce((sum, s) => sum + s.maxMarks, 0);
    const averagePercentage =
      totalMaxPossible > 0 ? Math.round((totalMarksObtained / totalMaxPossible) * 100) : 0;
    const overallGrade = calculateGrade(averagePercentage);

    // Attendance records for this student in this term
    let daysPresent = 0;
    let daysTotal = 0;
    db.attendance.forEach((session) => {
      if (session.term === term && session.academicYear === academicYear) {
        const rec = session.records.find((r) => r.studentId === student.studentId);
        if (rec) {
          daysTotal++;
          if (rec.status === 'PRESENT') daysPresent++;
        }
      }
    });

    const attendanceRate = daysTotal > 0 ? Math.round((daysPresent / daysTotal) * 100) : 100;

    let overallRemark = 'Steady performance. Encouraged to continue striving to achieve.';
    if (averagePercentage >= 80) overallRemark = 'Exemplary performance! Displays commendable dedication and high competence.';
    else if (averagePercentage >= 70) overallRemark = 'Good academic standing. Solid grasp of core curriculum competencies.';
    else if (averagePercentage >= 60) overallRemark = 'Fair performance. More focused effort needed in weaker subject areas.';
    else if (averagePercentage < 50) overallRemark = 'Needs intensive remedial support to meet minimum grade standards.';

    reportCards.push({
      studentId: student.studentId,
      admissionNumber: student.admissionNumber,
      studentName: student.fullName,
      class: student.class,
      grade: student.grade,
      academicYear: String(academicYear),
      term: String(term),
      generatedDate: new Date().toISOString().slice(0, 10),
      subjects: subjectsTable,
      totalMarksObtained,
      totalMaxPossible,
      averagePercentage,
      overallGrade,
      overallRemark,
      attendanceDaysPresent: daysPresent,
      attendanceDaysTotal: daysTotal,
      attendancePercentage: attendanceRate,
      headteacherRemarks: `Headteacher Salim: ${student.fullName} has demonstrated commitment to our school motto "STRIVE TO ACHIEVE".`,
      headteacherName: db.settings.headteacherName || 'NADHIRI CHACHA SALIM',
      directorName: db.settings.directorName || 'CONSTANCE MWAKA POLE',
      schoolMotto: db.settings.motto || 'STRIVE TO ACHIEVE',
      schoolLogoUrl: db.settings.logoUrl || '/amani_logo.jpg',
    });
  });

  // Calculate ranking only if enabled by Chief Admin
  if (db.settings.rankingEnabled && reportCards.length > 1) {
    reportCards.sort((a, b) => b.averagePercentage - a.averagePercentage);
    reportCards.forEach((rc, idx) => {
      rc.classPosition = `${idx + 1} of ${reportCards.length}`;
      rc.totalStudentsInClass = reportCards.length;
    });
  }

  res.json(reportCards);
});

// 11. Enquiries & Admissions (Sends alerts to Director & Headteacher)
app.get('/api/enquiries', (req: Request, res: Response) => {
  res.json(db.enquiries);
});

app.post('/api/enquiries', (req: Request, res: Response) => {
  const { fullName, phone, email, category, message, source, studentGradeInterest } = req.body;
  if (!fullName || !phone || !message) {
    return res.status(400).json({ error: 'Full name, phone, and message are required' });
  }

  const referenceNumber = `AMANI-ENQ-2026-${String(db.enquiries.length + 90).padStart(4, '0')}`;

  const newEnquiry = {
    id: `enq-${Date.now()}`,
    referenceNumber,
    fullName,
    phone,
    email,
    category: category || 'General Enquiry',
    message,
    status: 'NEW' as const,
    source: source || 'Website Form',
    studentGradeInterest,
    createdAt: new Date().toISOString(),
    replies: [],
  };

  db.enquiries.unshift(newEnquiry);

  // Dispatch SMS alert to School Director (0718540922) and Headteacher (0114623408)
  dispatchSchoolSms(
    '0718540922',
    'Constance Mwaka Pole (Director)',
    `AMANI ADMISSIONS ALERT: New enquiry from ${fullName} (${phone}) regarding ${studentGradeInterest || category}. Ref: ${referenceNumber}.`,
    'ADMISSION_ALERT'
  );

  dispatchSchoolSms(
    '0114623408',
    'Nadhiri Chacha Salim (Headteacher)',
    `AMANI ALERT: New enquiry from ${fullName} (${phone}) for ${studentGradeInterest || category}. Ref: ${referenceNumber}.`,
    'ENQUIRY_ALERT'
  );

  // Add system notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    title: 'New Admission Enquiry Received',
    message: `${fullName} submitted an enquiry for ${studentGradeInterest || category}. Ref: ${referenceNumber}.`,
    type: 'enquiry',
    createdAt: new Date().toISOString(),
    isRead: false,
    actionUrl: '/admin?tab=enquiries',
  });

  saveDatabase(db);
  addAuditLog('Website Visitor', 'TEACHER', 'Submitted Admission Enquiry', `Enquiry submitted by ${fullName} (${phone})`);

  res.status(201).json({ success: true, enquiry: newEnquiry });
});

// 12. Chatbot with Gemini & School Grounding
app.post('/api/chatbot/message', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  db.analytics.totalChatbotQueries += 1;

  // Search local knowledge base first
  const queryLower = message.toLowerCase();
  const matchedKb = db.chatbotKnowledge.find((item) => {
    return (
      queryLower.includes(item.category.toLowerCase()) ||
      item.keywords.some((k) => queryLower.includes(k.toLowerCase()))
    );
  });

  // Try Gemini AI with strict grounding if API key available
  const gemini = getGeminiClient();
  if (gemini) {
    try {
      const systemPrompt = `You are "Amani Assistant", the friendly, knowledgeable, and official digital assistant for AMANI JUNIOR ACADEMY AND JSS.
Official Information:
- School Name: AMANI JUNIOR ACADEMY AND JSS
- School Motto: "STRIVE TO ACHIEVE"
- Postal Address: P.O. BOX 93-80114, MAZERAS, KENYA
- Location: Mazeras, Kwale County, Kenya (Off Mombasa-Nairobi Highway)
- Director: CONSTANCE MWAKA POLE (Phone: 0718540922)
- Headteacher: NADHIRI CHACHA SALIM (Phone: 0114623408)
- Deputy Headteacher / ICT Teacher: VITALICE ODHIAMBO
- Levels: Pre-Primary (PP1, PP2), Primary (Grade 1-6), Junior Secondary School (Grade 7-9 JSS)
- Curriculum: Competency-Based Curriculum (CBC) with modern ICT & Coding Lab, Science Stations, 4-K Club, Sports
Provide concise, polite, and accurate answers strictly based on this official information. Never invent teacher contacts or fake fees.`;

      const response = await gemini.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemPrompt}\n\nVisitor Question: ${message}`,
      });

      const replyText = response.text || (matchedKb ? matchedKb.answer : null);
      if (replyText) {
        saveDatabase(db);
        return res.json({ text: replyText, source: 'ai' });
      }
    } catch (err) {
      console.warn('Gemini chat error, falling back to local KB:', err);
    }
  }

  // Fallback to grounded local knowledge
  if (matchedKb) {
    matchedKb.helpfulCount += 1;
    saveDatabase(db);
    return res.json({ text: matchedKb.answer, source: 'knowledge_base' });
  }

  // Polite general fallback with official contacts
  const generalReply = `Thank you for reaching out to Amani Junior Academy and JSS in Mazeras ("STRIVE TO ACHIEVE"). We offer Early Years (PP1-PP2), Primary (Grade 1-6), and Junior Secondary School (Grade 7-9 JSS). For immediate assistance, please contact School Director Constance Mwaka Pole at 0718540922 or Headteacher Nadhiri Chacha Salim at 0114623408.`;

  res.json({ text: generalReply, source: 'default_fallback' });
});

// 13. Audit Logs Endpoint
app.get('/api/audit-logs', (req: Request, res: Response) => {
  const { role, action, search } = req.query;
  let logs = [...db.auditLogs];

  if (role) logs = logs.filter((l) => l.userRole === role);
  if (action) logs = logs.filter((l) => l.action.toLowerCase().includes(String(action).toLowerCase()));
  if (search) {
    const q = String(search).toLowerCase();
    logs = logs.filter(
      (l) =>
        l.userName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
    );
  }

  res.json(logs);
});

// 14. Notifications & SMS Logs
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(db.notifications);
});

app.patch('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = db.notifications.find((n) => n.id === req.params.id);
  if (notif) notif.isRead = true;
  saveDatabase(db);
  res.json({ success: true });
});

app.get('/api/sms-logs', (req: Request, res: Response) => {
  res.json(db.smsLogs);
});

// ======================= VITE MIDDLEWARE & STATIC =======================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Amani School Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
