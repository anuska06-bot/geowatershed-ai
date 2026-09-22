import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Phone, 
  KeyRound, 
  Compass, 
  ArrowRight, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  MapPin,
  UserCheck,
  UserPlus,
  LogIn,
  Eye,
  EyeOff,
  Building2
} from 'lucide-react';
import { api } from '../../services/api';
import { AuthUser, UserRole } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (user: AuthUser) => void;
}

const INDIAN_STATES = [
  'Maharashtra',
  'Madhya Pradesh',
  'Rajasthan',
  'Karnataka',
  'Odisha',
  'Himachal Pradesh',
  'Assam',
  'Andhra Pradesh',
  'Telangana',
  'Gujarat',
  'Uttar Pradesh',
  'Uttarakhand',
  'Jharkhand',
  'Chhattisgarh',
  'Tamil Nadu',
  'Kerala',
  'Punjab',
  'Haryana',
  'Jammu & Kashmir',
  'National Nodal Agency (All-India)',
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  // Navigation Tabs: 'signin' or 'register'
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [signInMethod, setSignInMethod] = useState<'password' | 'otp'>('password');

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpChannel, setOtpChannel] = useState<'email' | 'sms'>('email');
  const [otpIdentifier, setOtpIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [debugOtp, setDebugOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Registration State
  const [regName, setRegName] = useState('');
  const [regIdentifier, setRegIdentifier] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('ROLE_FIELD_OFFICER');
  const [regJurisdiction, setRegJurisdiction] = useState('Maharashtra');
  const [regOrganization, setRegOrganization] = useState('WDC-PMKSY / State Nodal Agency');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // General Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Password Sign-In Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError('Please enter both your registered identifier and password.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.loginWithPassword(loginIdentifier.trim(), loginPassword.trim());
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. If new, please register an account.');
    } finally {
      setLoading(false);
    }
  };

  // OTP Request Handler
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otpIdentifier.trim()) {
      setError(otpChannel === 'email' ? 'Please enter a valid email address' : 'Please enter a 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.requestOtp(otpIdentifier.trim(), otpChannel);
      setOtpSent(true);
      setCountdown(res.expires_in_seconds || 300);
      if (res.debug_otp) {
        setDebugOtp(res.debug_otp);
      }
      setSuccessMessage(`OTP sent via ${otpChannel.toUpperCase()} to ${otpIdentifier.trim()}`);
    } catch (err: any) {
      setError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  // OTP Verification Handler
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await api.verifyOtp(otpIdentifier.trim(), otpCode.trim());
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.message || 'Verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // User Registration Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || regName.trim().length < 2) {
      setError('Please provide your full legal or official name (minimum 2 characters).');
      return;
    }
    if (!regIdentifier.trim()) {
      setError('Please provide an official email or mobile number.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await api.register({
        name: regName.trim(),
        identifier: regIdentifier.trim(),
        password: regPassword,
        role: regRole,
        jurisdiction: regJurisdiction,
        organization: regOrganization.trim(),
      });
      if (res.success && res.user) {
        setSuccessMessage(`Registration successful! Welcome, ${res.user.name}.`);
        setTimeout(() => {
          onLoginSuccess(res.user);
        }, 600);
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details and retry.');
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Evaluation / Demo Login
  const handleQuickDemoLogin = async (role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.demoLogin(role);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121619] flex flex-col lg:flex-row text-[#f1f0eb] selection:bg-[#10b981] selection:text-[#121619]">
      {/* Left Pane: Geospatial Engine Branding & Institutional Context */}
      <div className="lg:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#242d32] relative overflow-hidden bg-gradient-to-br from-[#121619] via-[#161c20] to-[#121619]">
        {/* Subtle Topographic Contour SVG Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="contour-pattern-login" width="220" height="220" patternUnits="userSpaceOnUse">
                <path d="M0,55 Q55,20 110,65 T220,45" fill="none" stroke="#10b981" strokeWidth="0.6" />
                <path d="M0,110 Q65,140 130,95 T220,115" fill="none" stroke="#10b981" strokeWidth="0.6" />
                <path d="M0,165 Q45,120 110,175 T220,150" fill="none" stroke="#10b981" strokeWidth="0.6" />
                <circle cx="110" cy="110" r="75" fill="none" stroke="#2c373d" strokeWidth="0.5" strokeDasharray="4 4" />
                <circle cx="110" cy="110" r="45" fill="none" stroke="#10b981" strokeWidth="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contour-pattern-login)" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-lg bg-[#181f23] border border-[#10b981]/50 flex items-center justify-center text-[#10b981] shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#10b981] bg-[#10b981]/15 px-2 py-0.5 rounded border border-[#10b981]/30">
                  WDC-PMKSY 2.0
                </span>
                <span className="text-[10px] font-mono text-[#9ba3a7]">MoRD • DoLR • SLNA</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#f1f0eb] font-mono mt-0.5">
                GeoWatershed<span className="text-[#10b981]"> AI</span>
              </h1>
            </div>
          </div>

          <div className="mt-6 sm:mt-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#f1f0eb] leading-snug">
              Smart Geospatial Intelligence for Watershed Development
            </h2>
            <p className="text-xs sm:text-sm text-[#9ba3a7] leading-relaxed max-w-lg">
              Empowering field surveyors, GIS analysts, project directors, and citizens with real-time hydrological analytics,
              tamper-proof photo/video verification, Strahler stream conformance, and benefit-cost audit tracking.
            </p>
          </div>

          {/* Core Institutional Highlights */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl">
            <div className="bg-[#181f23]/90 border border-[#242d32] rounded-lg p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#10b981] mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Hydrologic Topology</span>
              </div>
              <p className="text-[11px] text-[#9ba3a7] leading-relaxed">
                Automated Strahler stream ordering, DEM flow paths &amp; sub-basin catchment drainage across all Indian states.
              </p>
            </div>

            <div className="bg-[#181f23]/90 border border-[#242d32] rounded-lg p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-[#f59e0b] mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider font-mono">Anti-Spoof Forensics</span>
              </div>
              <p className="text-[11px] text-[#9ba3a7] leading-relaxed">
                EXIF GPS timestamp verification, SHA-256 fingerprinting &amp; AI-assisted field video assessment.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-6 mt-6 border-t border-[#242d32] flex flex-wrap items-center justify-between text-[11px] text-[#9ba3a7] font-mono gap-2">
          <span>SECURE ACCESS GATEWAY</span>
          <span>COMPLIANCE: WDC-PMKSY / MoRD / DoLR</span>
        </div>
      </div>

      {/* Right Pane: Authentication Gateway & Registration */}
      <div className="lg:w-1/2 p-5 sm:p-8 lg:p-12 flex flex-col justify-center bg-[#121619] overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-5">
          
          {/* Main Mode Tab Switcher: Sign In vs Register Account */}
          <div className="flex bg-[#181f23] p-1 rounded-lg border border-[#242d32]">
            <button
              type="button"
              onClick={() => { setActiveTab('signin'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-semibold rounded-md transition-all ${
                activeTab === 'signin'
                  ? 'bg-[#10b981] text-[#121619] shadow-sm'
                  : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(null); setSuccessMessage(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-semibold rounded-md transition-all ${
                activeTab === 'register'
                  ? 'bg-[#10b981] text-[#121619] shadow-sm'
                  : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register Account</span>
            </button>
          </div>

          {/* Header Title */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-[#f1f0eb] tracking-tight font-mono">
              {activeTab === 'signin' ? 'Portal Authentication' : 'Create Official Account'}
            </h3>
            <p className="text-xs text-[#9ba3a7] mt-1">
              {activeTab === 'signin'
                ? 'Sign in using your password credentials or verified mobile/email OTP.'
                : 'Register your details to access the national watershed intelligence repository.'}
            </p>
          </div>

          {/* Status Banners */}
          {error && (
            <div className="p-3 bg-[#4c1d24]/60 border border-[#e11d48]/70 rounded-lg flex items-start gap-2.5 text-xs text-[#fca5a5] animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#f87171]" />
              <div>{error}</div>
            </div>
          )}

          {successMessage && !error && (
            <div className="p-3 bg-[#064e3b]/50 border border-[#10b981]/70 rounded-lg flex items-start gap-2.5 text-xs text-[#a7f3d0] animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#34d399]" />
              <div>{successMessage}</div>
            </div>
          )}

          {/* SIGN IN TAB */}
          {activeTab === 'signin' && (
            <div className="space-y-4">
              {/* Sign In Method Toggle */}
              <div className="flex gap-2 text-xs font-mono border-b border-[#242d32] pb-2">
                <button
                  type="button"
                  onClick={() => { setSignInMethod('password'); setError(null); }}
                  className={`pb-1 px-1 transition-colors ${
                    signInMethod === 'password'
                      ? 'text-[#10b981] border-b-2 border-[#10b981] font-semibold'
                      : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => { setSignInMethod('otp'); setError(null); }}
                  className={`pb-1 px-1 transition-colors ${
                    signInMethod === 'otp'
                      ? 'text-[#10b981] border-b-2 border-[#10b981] font-semibold'
                      : 'text-[#9ba3a7] hover:text-[#f1f0eb]'
                  }`}
                >
                  Instant OTP Verification
                </button>
              </div>

              {/* Password Login Form */}
              {signInMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1.5">
                      Email or Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9ba3a7]">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="officer.sharma@wdc-pmksy.gov.in"
                        className="w-full pl-9 pr-4 py-2.5 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs sm:text-sm text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] font-mono min-h-[44px]"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setSignInMethod('otp')}
                        className="text-[11px] font-mono text-[#10b981] hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9ba3a7]">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs sm:text-sm text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] font-mono min-h-[44px]"
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9ba3a7] hover:text-[#f1f0eb]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-[#121619] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In with Password</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* OTP Login Form */}
              {signInMethod === 'otp' && (
                <div className="space-y-3.5">
                  <div className="flex bg-[#181f23] p-1 rounded-lg border border-[#2c373d]">
                    <button
                      type="button"
                      onClick={() => { setOtpChannel('email'); setOtpSent(false); setDebugOtp(null); setError(null); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono rounded transition-all ${
                        otpChannel === 'email' ? 'bg-[#242d32] text-[#10b981] font-semibold' : 'text-[#9ba3a7]'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email OTP</span>
                      <span className="text-[9px] bg-[#10b981]/20 text-[#10b981] px-1 rounded border border-[#10b981]/40 font-mono">
                        Instant
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOtpChannel('sms'); setOtpSent(false); setDebugOtp(null); setError(null); }}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-mono rounded transition-all ${
                        otpChannel === 'sms' ? 'bg-[#242d32] text-[#10b981] font-semibold' : 'text-[#9ba3a7]'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>SMS Gateway</span>
                    </button>
                  </div>

                  {debugOtp && otpSent && (
                    <div className="p-2.5 bg-[#181f23] border border-[#10b981]/50 rounded-lg flex items-center justify-between text-xs text-[#10b981] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-[#10b981]/20 text-[#10b981] px-1.5 py-0.5 rounded border border-[#10b981]/40">
                          OTP CODE
                        </span>
                        <span className="font-bold tracking-widest">{debugOtp}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCode(debugOtp)}
                        className="text-[11px] underline text-[#10b981] hover:text-[#34d399]"
                      >
                        Auto-fill
                      </button>
                    </div>
                  )}

                  {!otpSent ? (
                    <form onSubmit={handleRequestOtp} className="space-y-3.5">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1.5">
                          {otpChannel === 'email' ? 'Registered Email Address' : '10-Digit Mobile Number'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9ba3a7]">
                            {otpChannel === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                          </div>
                          <input
                            type={otpChannel === 'email' ? 'email' : 'tel'}
                            value={otpIdentifier}
                            onChange={(e) => setOtpIdentifier(e.target.value)}
                            placeholder={otpChannel === 'email' ? 'officer.sharma@wdc-pmksy.gov.in' : '9876543210'}
                            className="w-full pl-9 pr-4 py-2.5 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs sm:text-sm text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] font-mono min-h-[44px]"
                            disabled={loading}
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-[#121619] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Dispatching OTP...</span>
                          </>
                        ) : (
                          <>
                            <span>Request One-Time Password</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono">
                            Enter 6-Digit Code
                          </label>
                          <button
                            type="button"
                            onClick={() => { setOtpSent(false); setOtpCode(''); }}
                            className="text-[11px] text-[#10b981] hover:underline font-mono"
                          >
                            Change {otpChannel === 'email' ? 'Email' : 'Mobile'}
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="w-full py-2.5 bg-[#181f23] border border-[#2c373d] rounded-lg text-lg font-mono tracking-widest text-center text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] min-h-[44px]"
                          disabled={loading}
                          autoFocus
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading || otpCode.length < 6}
                        className="w-full py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-[#121619] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Verifying Code...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Authorize &amp; Enter Dashboard</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-between text-xs text-[#9ba3a7] font-mono pt-1">
                        <span>
                          {countdown > 0 ? (
                            `Resend in ${countdown}s`
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleRequestOtp()}
                              className="text-[#10b981] hover:underline font-semibold"
                            >
                              Resend OTP Now
                            </button>
                          )}
                        </span>
                        <span>Master test code: 123456</span>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* REGISTER TAB */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1">
                  Full Legal / Official Name
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rajesh Sharma, IAS"
                  className="w-full px-3 py-2 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs sm:text-sm text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] font-mono min-h-[42px]"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1">
                  Official Email or 10-Digit Mobile
                </label>
                <input
                  type="text"
                  value={regIdentifier}
                  onChange={(e) => setRegIdentifier(e.target.value)}
                  placeholder="surveyor@mord.gov.in or 9876543210"
                  className="w-full px-3 py-2 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs sm:text-sm text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] font-mono min-h-[42px]"
                  disabled={loading}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1">
                    System Role
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs text-[#f1f0eb] focus:outline-none focus:border-[#10b981] font-mono min-h-[42px]"
                    disabled={loading}
                  >
                    <option value="ROLE_FIELD_OFFICER">Field Surveyor</option>
                    <option value="ROLE_ANALYST">GIS Remote Sensing Analyst</option>
                    <option value="ROLE_MANAGER">Project Director / Auditor</option>
                    <option value="ROLE_CITIZEN">Gram Panchayat Citizen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1">
                    State / Jurisdiction
                  </label>
                  <select
                    value={regJurisdiction}
                    onChange={(e) => setRegJurisdiction(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs text-[#f1f0eb] focus:outline-none focus:border-[#10b981] font-mono min-h-[42px]"
                    disabled={loading}
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1">
                  Department / Organization
                </label>
                <input
                  type="text"
                  value={regOrganization}
                  onChange={(e) => setRegOrganization(e.target.value)}
                  placeholder="e.g. State Watershed Cell, Dept. of Land Resources"
                  className="w-full px-3 py-2 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] font-mono min-h-[42px]"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1">
                    Password (min 6 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-8 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] font-mono min-h-[42px]"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#9ba3a7] hover:text-[#f1f0eb]"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#9ba3a7] uppercase tracking-wider font-mono mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-[#181f23] border border-[#2c373d] rounded-lg text-xs text-[#f1f0eb] placeholder-[#9ba3a7]/50 focus:outline-none focus:border-[#10b981] font-mono min-h-[42px]"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#10b981] hover:bg-[#059669] disabled:opacity-50 text-[#121619] text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 min-h-[44px] shadow-sm"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Complete Registration &amp; Enter</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Quick Evaluation / Demo Roles (For instantaneous feature testing) */}
          <div className="pt-5 border-t border-[#242d32] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#9ba3a7]">
                Instant Evaluator Access
              </span>
              <span className="text-[9px] text-[#10b981] font-mono bg-[#10b981]/15 px-1.5 py-0.5 rounded border border-[#10b981]/30">
                1-CLICK EXPLORER
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ROLE_FIELD_OFFICER')}
                disabled={loading}
                className="p-2 bg-[#181f23] hover:bg-[#20292e] border border-[#242d32] hover:border-[#10b981]/50 rounded-lg text-left transition-all group font-mono"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-[#f1f0eb] group-hover:text-[#10b981]">
                    Field Surveyor
                  </span>
                  <MapPin className="w-3.5 h-3.5 text-[#10b981]" />
                </div>
                <div className="text-[10px] text-[#9ba3a7]">Rajesh Sharma • DoLR</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ROLE_ANALYST')}
                disabled={loading}
                className="p-2 bg-[#181f23] hover:bg-[#20292e] border border-[#242d32] hover:border-[#10b981]/50 rounded-lg text-left transition-all group font-mono"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-[#f1f0eb] group-hover:text-[#10b981]">
                    GIS Analyst
                  </span>
                  <Layers className="w-3.5 h-3.5 text-[#10b981]" />
                </div>
                <div className="text-[10px] text-[#9ba3a7]">Anushka Sen • SLNA</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ROLE_MANAGER')}
                disabled={loading}
                className="p-2 bg-[#181f23] hover:bg-[#20292e] border border-[#242d32] hover:border-[#f59e0b]/50 rounded-lg text-left transition-all group font-mono"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-[#f1f0eb] group-hover:text-[#f59e0b]">
                    Project Director
                  </span>
                  <Building2 className="w-3.5 h-3.5 text-[#f59e0b]" />
                </div>
                <div className="text-[10px] text-[#9ba3a7]">Vikramaditya • MoRD</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('ROLE_CITIZEN')}
                disabled={loading}
                className="p-2 bg-[#181f23] hover:bg-[#20292e] border border-[#242d32] hover:border-[#9ba3a7]/70 rounded-lg text-left transition-all group font-mono"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-semibold text-[#f1f0eb] group-hover:text-white">
                    Citizen / Public
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-[#9ba3a7]" />
                </div>
                <div className="text-[10px] text-[#9ba3a7]">Pooja Patil • Gram Panchayat</div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
