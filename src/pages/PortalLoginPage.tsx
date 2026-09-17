import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';
import {
  LogIn,
  Key,
  User as UserIcon,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Mail,
  Phone,
  HelpCircle,
  Check,
  KeyRound,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const PortalLoginPage: React.FC = () => {
  const { currentUser, setCurrentUser, navigate, settings, logout } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mandatory First-Login Security Setup State
  const [pendingResetUser, setPendingResetUser] = useState<any | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState(
    'What was the name of your first elementary school?'
  );
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  // Forgot Password Reset Flow State
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotOtpStep, setForgotOtpStep] = useState(false);
  const [forgotUserId, setForgotUserId] = useState('');
  const [forgotOtpCode, setForgotOtpCode] = useState('');
  const [forgotDevOtp, setForgotDevOtp] = useState<string | null>(null);
  const [forgotDispatchedTo, setForgotDispatchedTo] = useState<string | null>(null);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  // Password rules validation for First-Login Setup
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isNotDefault =
    newPassword.toLowerCase() !== 'amani2026' &&
    newPassword !== 'Amani@2026!' &&
    newPassword.toLowerCase() !== 'admin';
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const passwordScore = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    isNotDefault,
  ].filter(Boolean).length;

  const isPasswordStrong =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSymbol &&
    isNotDefault &&
    passwordsMatch;

  // Forgot Password Validation
  const forgotHasMinLength = forgotNewPassword.length >= 8;
  const forgotHasUppercase = /[A-Z]/.test(forgotNewPassword);
  const forgotHasLowercase = /[a-z]/.test(forgotNewPassword);
  const forgotHasNumber = /[0-9]/.test(forgotNewPassword);
  const forgotHasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(forgotNewPassword);
  const forgotPasswordsMatch = forgotNewPassword && forgotConfirmPassword && forgotNewPassword === forgotConfirmPassword;
  const isForgotStrong =
    forgotHasMinLength &&
    forgotHasUppercase &&
    forgotHasLowercase &&
    forgotHasNumber &&
    forgotHasSymbol &&
    forgotPasswordsMatch;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please provide your assigned Staff ID, Username, or Phone Number, and your Password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await api.login({ identifier: identifier.trim(), password });

      // Directly sign in and grant immediate portal access
      setCurrentUser(res.user);
      localStorage.setItem('amani_user', JSON.stringify(res.user));

      if (
        res.user.role === 'CHIEF_ADMIN' ||
        res.user.role === 'DIRECTOR' ||
        res.user.role === 'HEADTEACHER' ||
        res.user.role === 'DEPUTY_HEADTEACHER' ||
        res.user.role === 'ICT_ADMIN'
      ) {
        navigate('admin-portal');
      } else if (res.user.role === 'TEACHER') {
        navigate('teacher-portal');
      } else {
        navigate('home');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Access restricted to authorized school faculty.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUsername.trim() || newUsername.trim().length < 3) {
      setError('Please choose a valid unique portal username (at least 3 characters).');
      return;
    }

    if (!fullName.trim()) {
      setError('Please verify your official full name.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('A valid personal/staff email address is required for account security and recovery.');
      return;
    }

    if (!phone.trim() || phone.replace(/[\s-+()]/g, '').length < 9) {
      setError('A valid direct mobile phone number (at least 9 digits) is required for two-factor recovery.');
      return;
    }

    if (!isPasswordStrong) {
      setError('Please satisfy all password security requirements before proceeding.');
      return;
    }

    setIsResetting(true);
    setError(null);

    try {
      const res = await api.completeSecuritySetup({
        userId: pendingResetUser.id,
        username: newUsername.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        newPassword,
        confirmPassword,
        securityQuestion,
        securityAnswer: securityAnswer.trim(),
      });

      setResetSuccessMessage(
        'Account profile and security credentials successfully hardened! Directing to your portal station...'
      );
      setCurrentUser(res.user);
      localStorage.setItem('amani_user', JSON.stringify(res.user));

      setTimeout(() => {
        if (
          res.user.role === 'CHIEF_ADMIN' ||
          res.user.role === 'DIRECTOR' ||
          res.user.role === 'HEADTEACHER' ||
          res.user.role === 'DEPUTY_HEADTEACHER' ||
          res.user.role === 'ICT_ADMIN'
        ) {
          navigate('admin-portal');
        } else {
          navigate('teacher-portal');
        }
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to complete security setup.');
    } finally {
      setIsResetting(false);
    }
  };

  // Forgot Password Handler: Request OTP
  const handleRequestForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      setError('Please enter your Staff ID, Username, Email, or Phone Number.');
      return;
    }

    setIsForgotLoading(true);
    setError(null);

    try {
      const res = await api.forgotPasswordRequestOtp({ identifier: forgotIdentifier.trim() });
      setForgotUserId(res.userId);
      setForgotDevOtp(res.devOtp || null);
      setForgotDispatchedTo(res.dispatchedTo || null);
      setForgotOtpStep(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to request reset OTP. Check your identifier.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  // Forgot Password Handler: Verify OTP & Reset
  const handleVerifyForgotOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtpCode.trim()) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    if (!isForgotStrong) {
      setError('Please ensure your new password satisfies all strength requirements.');
      return;
    }

    setIsForgotLoading(true);
    setError(null);

    try {
      const res = await api.forgotPasswordVerifyOtp({
        userId: forgotUserId,
        otp: forgotOtpCode.trim(),
        newPassword: forgotNewPassword,
        confirmPassword: forgotConfirmPassword,
      });

      setResetSuccessMessage(res.message || 'Password successfully updated! You can now log in.');
      setIdentifier(res.username || forgotIdentifier);
      setPassword('');
      setIsForgotPasswordMode(false);
      setForgotOtpStep(false);
      setForgotOtpCode('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setForgotDevOtp(null);
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div className="w-full max-w-2xl space-y-6">
        {/* School Header Badge */}
        <div className="text-center space-y-3">
          <SchoolLogoBadge size="lg" className="justify-center" />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] text-[#0F1E36]">
              Staff & Academic Management Portal
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {settings.schoolName} — Official Administrative Gateway
            </p>
          </div>
        </div>

        {/* Security Policy Notice */}
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-950 shadow-sm">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <div className="font-bold text-amber-900">
              Institutional Security & Access Firewall Active
            </div>
            <p className="text-amber-800 text-[11px]">
              Access is restricted to authenticated Teachers and Chief Administrators. Public registrations are permanently disabled to safeguard learner CBC academic records and assessment marks.
            </p>
          </div>
        </div>

        {/* Active Logged-In User Banner with Logout Option */}
        {currentUser && !pendingResetUser && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-4 text-emerald-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0F1E36] text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 border border-amber-400/30">
                {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Currently Signed In
                </div>
                <div className="text-sm font-extrabold text-slate-900 truncate">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-600">
                  {currentUser.role === 'TEACHER' ? 'Faculty Instructor' : 'Chief Administrator'} • ID: {currentUser.staffId || currentUser.username}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={() => {
                  if (
                    currentUser.role === 'CHIEF_ADMIN' ||
                    currentUser.role === 'DIRECTOR' ||
                    currentUser.role === 'HEADTEACHER' ||
                    currentUser.role === 'DEPUTY_HEADTEACHER' ||
                    currentUser.role === 'ICT_ADMIN'
                  ) {
                    navigate('admin-portal');
                  } else {
                    navigate('teacher-portal');
                  }
                }}
                className="flex-1 py-2.5 px-4 bg-[#0F1E36] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Go to Staff Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="btn-login-page-logout"
                onClick={() => {
                  setError(null);
                  setResetSuccessMessage('You have logged out successfully.');
                  logout();
                }}
                className="py-2.5 px-4 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          {resetSuccessMessage && (
            <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span className="font-medium">{resetSuccessMessage}</span>
            </div>
          )}

          {/* SCREEN 1: Mandatory First-Login Security & Username Setup */}
          {pendingResetUser ? (
            <form onSubmit={handleSecuritySetupSubmit} className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-2">
                <div className="font-bold flex items-center gap-2 text-blue-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Mandatory First-Time Security & Profile Update</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  Welcome, <strong>{pendingResetUser.name}</strong> ({pendingResetUser.role}). Because you authenticated using default initial credentials, school security protocol requires you to update your <strong>username</strong>, <strong>personal contacts</strong>, and <strong>create a strong personal password</strong> before access is granted.
                </p>
              </div>

              {/* Step 1: Choose Username & Profile */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Update Your Unique Username & Contact Details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Choose Your Preferred Portal Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="e.g. raheli.wali, vitalice, or m.tatu"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800 font-mono"
                    />
                    <span className="text-[10px] text-slate-500">
                      This will be your permanent login username across all staff sessions.
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Madam Raheli Wali"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Personal / Staff Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">Used for password recovery & alerts</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Direct Mobile Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0746529712"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">For SMS OTP recovery & urgent alerts</span>
                  </div>
                </div>
              </div>

              {/* Step 2: Security Recovery Question */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>2. Account Recovery Security Question</span>
                </div>

                <div className="space-y-2">
                  <select
                    value={securityQuestion}
                    onChange={(e) => setSecurityQuestion(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-white text-slate-800"
                  >
                    <option value="What was the name of your first elementary school?">
                      What was the name of your first elementary school?
                    </option>
                    <option value="In what town or city did you begin your teaching career?">
                      In what town or city did you begin your teaching career?
                    </option>
                    <option value="What is the name of your favorite childhood educator?">
                      What is the name of your favorite childhood educator?
                    </option>
                    <option value="What is your mother's maiden name?">
                      What is your mother's maiden name?
                    </option>
                  </select>

                  <input
                    type="text"
                    required
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    placeholder="Your private secret answer (case insensitive)..."
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Step 3: High-Entropy Password Setup */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                  <span>3. Create Your Strong Personal Password</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Hardened Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter personal password"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter password"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter & Checklist */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">Security Strength:</span>
                    <span
                      className={`font-bold ${
                        passwordScore <= 2
                          ? 'text-red-600'
                          : passwordScore <= 4
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {passwordScore <= 2 ? 'Weak' : passwordScore <= 4 ? 'Moderate' : 'Strong & Compliant'}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordScore <= 2
                          ? 'w-1/3 bg-red-500'
                          : passwordScore <= 4
                          ? 'w-2/3 bg-amber-500'
                          : 'w-full bg-emerald-600'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] text-slate-600 pt-1">
                    <div className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-700 font-bold' : ''}`}>
                      <Check className={`w-3 h-3 ${hasMinLength ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasUppercase ? 'text-emerald-700 font-bold' : ''}`}>
                      <Check className={`w-3 h-3 ${hasUppercase ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>Uppercase letter (A-Z)</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasLowercase ? 'text-emerald-700 font-bold' : ''}`}>
                      <Check className={`w-3 h-3 ${hasLowercase ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>Lowercase letter (a-z)</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasNumber ? 'text-emerald-700 font-bold' : ''}`}>
                      <Check className={`w-3 h-3 ${hasNumber ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>At least 1 number (0-9)</span>
                    </div>
                    <div className={`flex items-center gap-1 ${hasSymbol ? 'text-emerald-700 font-bold' : ''}`}>
                      <Check className={`w-3 h-3 ${hasSymbol ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>Special symbol (!@#$...)</span>
                    </div>
                    <div className={`flex items-center gap-1 ${passwordsMatch ? 'text-emerald-700 font-bold' : ''}`}>
                      <Check className={`w-3 h-3 ${passwordsMatch ? 'text-emerald-600' : 'text-slate-300'}`} />
                      <span>Passwords match</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setPendingResetUser(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentUser(pendingResetUser);
                      localStorage.setItem('amani_user', JSON.stringify(pendingResetUser));
                      if (
                        pendingResetUser.role === 'CHIEF_ADMIN' ||
                        pendingResetUser.role === 'DIRECTOR' ||
                        pendingResetUser.role === 'HEADTEACHER' ||
                        pendingResetUser.role === 'DEPUTY_HEADTEACHER' ||
                        pendingResetUser.role === 'ICT_ADMIN'
                      ) {
                        navigate('admin-portal');
                      } else {
                        navigate('teacher-portal');
                      }
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition"
                  >
                    Skip & Enter Portal Directly →
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isResetting || !isPasswordStrong}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isResetting ? 'Securing Account...' : 'Save Details & Enter Portal'}</span>
                </button>
              </div>
            </form>
          ) : isForgotPasswordMode ? (
            /* SCREEN 2: Forgot Password OTP-Based Reset Flow */
            <div className="space-y-5">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1.5">
                <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>Staff & Admin Password Recovery</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Enter your assigned Staff ID, Username, Email, or Mobile Phone. We will dispatch a 6-digit verification code to reset your password securely.
                </p>
              </div>

              {!forgotOtpStep ? (
                <form onSubmit={handleRequestForgotOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Staff ID / Username / Email / Mobile Phone
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={forgotIdentifier}
                        onChange={(e) => setForgotIdentifier(e.target.value)}
                        placeholder="e.g. vitalice, director, or m.raheli"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPasswordMode(false);
                        setError(null);
                      }}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading}
                      className="px-5 py-2.5 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>{isForgotLoading ? 'Dispatching Code...' : 'Send Verification Code (OTP)'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                  {forgotDispatchedTo && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>A 6-digit verification code has been dispatched to <strong>{forgotDispatchedTo}</strong>.</span>
                    </div>
                  )}

                  {forgotDevOtp && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sandbox Test Code:</span>
                        <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded text-xs">{forgotDevOtp}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForgotOtpCode(forgotDevOtp)}
                        className="text-[10px] font-bold text-emerald-700 underline hover:text-emerald-900"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code (OTP) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtpCode}
                      onChange={(e) => setForgotOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full px-3 py-2 text-center text-base tracking-widest font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-900 bg-slate-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="At least 8 chars"
                          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="password"
                          required
                          value={forgotConfirmPassword}
                          onChange={(e) => setForgotConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Checklist */}
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-600 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className={forgotHasMinLength ? 'text-emerald-600 font-bold' : ''}>• 8+ characters</span>
                    <span className={forgotHasUppercase ? 'text-emerald-600 font-bold' : ''}>• Uppercase (A-Z)</span>
                    <span className={forgotHasLowercase ? 'text-emerald-600 font-bold' : ''}>• Lowercase (a-z)</span>
                    <span className={forgotHasNumber ? 'text-emerald-600 font-bold' : ''}>• Number (0-9)</span>
                    <span className={forgotHasSymbol ? 'text-emerald-600 font-bold' : ''}>• Symbol (!@#$)</span>
                    <span className={forgotPasswordsMatch ? 'text-emerald-600 font-bold' : ''}>• Passwords match</span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotOtpStep(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                    >
                      Resend Code
                    </button>
                    <button
                      type="submit"
                      disabled={isForgotLoading || !isForgotStrong || !forgotOtpCode}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isForgotLoading ? 'Updating Password...' : 'Verify Code & Reset Password'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* SCREEN 3: Standard Faculty Sign-In */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Staff ID / Username / Direct Mobile Phone
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter Staff ID, Username, or Registered Phone"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Secret Staff Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPasswordMode(true);
                      setForgotIdentifier(identifier);
                      setForgotOtpStep(false);
                      setError(null);
                    }}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter assigned password"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Verifying Authorized Credentials...' : 'Sign In to Portal Station'}</span>
              </button>

              {/* Helpful Staff Sign-in Information */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>How to Sign In:</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
                    <li>Use your assigned <strong>Staff ID</strong> (e.g. AMANI-DIR-001, AMANI-HT-002, AMANI-ICT-003, AMANI-TCH-001...), registered <strong>Phone Number</strong>, or <strong>Username</strong>.</li>
                    <li>Default initial institutional password: <strong className="text-slate-900 bg-amber-100 px-1.5 py-0.5 rounded font-mono">Amani@2026!</strong></li>
                  </ul>
                </div>

                {/* 1-Click Fast Portal Access */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Instant 1-Click Portal Access:
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('AMANI-DIR-001');
                        setPassword('Amani@2026!');
                      }}
                      className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-[11px] font-bold text-amber-900 text-center transition cursor-pointer"
                    >
                      Director
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('0746529712');
                        setPassword('Amani@2026!');
                      }}
                      className="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-300 rounded-xl text-[11px] font-bold text-purple-900 text-center transition cursor-pointer"
                    >
                      Deputy Head (Academics)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('AMANI-HT-002');
                        setPassword('Amani@2026!');
                      }}
                      className="p-2 bg-blue-50 hover:bg-blue-100 border border-blue-300 rounded-xl text-[11px] font-bold text-blue-900 text-center transition cursor-pointer"
                    >
                      Headteacher
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIdentifier('AMANI-TCH-001');
                        setPassword('Amani@2026!');
                      }}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-[11px] font-bold text-emerald-900 text-center transition cursor-pointer"
                    >
                      Teacher Portal
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
