import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SchoolLogoBadge } from '../components/SchoolLogoBadge';
import {
  LogIn,
  Shield,
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
  ChevronDown,
  ChevronUp,
  Info,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export const PortalLoginPage: React.FC = () => {
  const { setCurrentUser, navigate, settings } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mandatory First-Login Security Setup State
  const [pendingResetUser, setPendingResetUser] = useState<any | null>(null);
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
  const [showCredentialsGuide, setShowCredentialsGuide] = useState(true);

  // Password rules validation
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

      // Check if mandatory first-login profile & security setup is required
      if (res.mustChangePassword || res.requiresSecuritySetup) {
        setPendingResetUser(res.user);
        setFullName(res.user.name || '');
        setEmail(res.user.email || '');
        setPhone(res.user.phone || '');
        setError(null);
        return;
      }

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
          res.user.role === 'HEADTEACHER'
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

  const handleSelectStaff = (userIdent: string) => {
    setIdentifier(userIdent);
    setPassword('Amani@2026!');
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div className="w-full max-w-xl space-y-6">
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
              Access is strictly restricted to authenticated Teachers and Chief Administrators. Public user registrations are permanently disabled to safeguard learner CBC academic records, national assessment marks, and parent contacts.
            </p>
          </div>
        </div>

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

          {/* Conditional Screen: First-Login Security Setup vs. Regular Staff Login */}
          {pendingResetUser ? (
            <form onSubmit={handleSecuritySetupSubmit} className="space-y-5">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-950 space-y-2">
                <div className="font-bold flex items-center gap-2 text-blue-900 text-sm">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Mandatory Account Security Setup</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-800">
                  Welcome, <strong>{pendingResetUser.name}</strong> ({pendingResetUser.role}). Because you authenticated using default institutional onboarding credentials, school security protocol requires you to update your direct contact details and create a strong personal password before access is granted.
                </p>
              </div>

              {/* Step 1: Profile & Contact Details */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>1. Verify Your Staff Profile & Contact Information</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Constance Mwaka Pole"
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
                        placeholder="e.g. 0718540922"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500">For SMS recovery & two-step login</span>
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

                  {/* Progress Bar */}
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

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingResetUser(null)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel & Switch Account
                </button>
                <button
                  type="submit"
                  disabled={isResetting || !isPasswordStrong}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isResetting ? 'Securing Account...' : 'Complete Security Setup & Enter Portal'}</span>
                </button>
              </div>
            </form>
          ) : (
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
                    placeholder="e.g. director, headteacher, or teacher_faith"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Secret Staff Password
                </label>
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
                className="w-full py-3 bg-[#0F1E36] hover:bg-amber-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{isLoading ? 'Verifying Authorized Credentials...' : 'Sign In to Portal Station'}</span>
              </button>
            </form>
          )}

          {/* Official Default Staff Onboarding Directory */}
          {!pendingResetUser && (
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <button
                type="button"
                onClick={() => setShowCredentialsGuide(!showCredentialsGuide)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:text-amber-700 transition"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-600" />
                  <span>Default Staff Onboarding Directory</span>
                </div>
                {showCredentialsGuide ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {showCredentialsGuide && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                  <div className="text-[11px] text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">Initial Onboarding Credentials:</span> Use the default assigned username below and initial password <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 font-mono font-bold">Amani@2026!</code>. Upon first sign-in, you will be intercepted by the mandatory security protocol to configure your personal email, phone, and unique password.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div
                      onClick={() => handleSelectStaff('director')}
                      className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition flex flex-col"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Director (Chief Admin)</span>
                        <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-mono">AMANI-DIR-001</span>
                      </div>
                      <span className="text-[11px] text-slate-600">Constance Mwaka Pole</span>
                      <span className="text-[10px] font-mono text-slate-400">Username: director</span>
                    </div>

                    <div
                      onClick={() => handleSelectStaff('headteacher')}
                      className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition flex flex-col"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Headteacher (Chief Admin)</span>
                        <span className="text-[10px] bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded font-mono">AMANI-HT-002</span>
                      </div>
                      <span className="text-[11px] text-slate-600">Nadhiri Chacha Salim</span>
                      <span className="text-[10px] font-mono text-slate-400">Username: headteacher</span>
                    </div>

                    <div
                      onClick={() => handleSelectStaff('vitalice')}
                      className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition flex flex-col"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Deputy / ICT Admin</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-mono">AMANI-ICT-003</span>
                      </div>
                      <span className="text-[11px] text-slate-600">Vitalice Odhiambo</span>
                      <span className="text-[10px] font-mono text-slate-400">Username: vitalice</span>
                    </div>

                    <div
                      onClick={() => handleSelectStaff('teacher_faith')}
                      className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition flex flex-col"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Teacher Faith (Languages)</span>
                        <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-mono">AMANI-TCH-004</span>
                      </div>
                      <span className="text-[11px] text-slate-600">Faith Mwende Kilonzo</span>
                      <span className="text-[10px] font-mono text-slate-400">Username: teacher_faith</span>
                    </div>

                    <div
                      onClick={() => handleSelectStaff('teacher_peter')}
                      className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition flex flex-col"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Teacher Peter (Science/Agri)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded font-mono">AMANI-TCH-005</span>
                      </div>
                      <span className="text-[11px] text-slate-600">Peter Juma Mwangi</span>
                      <span className="text-[10px] font-mono text-slate-400">Username: teacher_peter</span>
                    </div>

                    <div
                      onClick={() => handleSelectStaff('teacher_emmanuel')}
                      className="p-2.5 bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl cursor-pointer transition flex flex-col"
                    >
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>Teacher Emmanuel (Math/CRE)</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-900 px-1.5 py-0.2 rounded font-mono">AMANI-TCH-006</span>
                      </div>
                      <span className="text-[11px] text-slate-600">Emmanuel Mwachiro</span>
                      <span className="text-[10px] font-mono text-slate-400">Username: teacher_emmanuel</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
