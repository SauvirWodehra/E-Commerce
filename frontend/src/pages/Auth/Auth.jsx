/**
 * Auth Page — Sign In / Create Account with OTP Verification
 * 
 * 2-step flow:
 *   Step 1: Enter credentials (login) or registration details
 *   Step 2: Enter 6-digit OTP sent to email
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState(1); // 1 = credentials, 2 = OTP
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const otpRefs = useRef([]);

  const { login, register, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Form state
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    mobile: '', secondaryEmail: '',
    addressLine: '', city: '', state: '', pincode: '',
    saveInBrowser: true,
  });

  // Resend countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // OTP input handling
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only last digit
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = text[i] || '';
    }
    setOtp(newOtp);
    const lastFilled = Math.min(text.length, 5);
    otpRefs.current[lastFilled]?.focus();
  };

  // Step 1: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      setOtpEmail(form.email);
      setOtpPurpose('LOGIN');
      setPreviewUrl(res.previewUrl || '');
      setStep(2);
      setOtp(['', '', '', '', '', '']);
      setResendTimer(30);
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await register(form);
      setOtpEmail(form.email);
      setOtpPurpose('REGISTER');
      setPreviewUrl(res.previewUrl || '');
      setStep(2);
      setOtp(['', '', '', '', '', '']);
      setResendTimer(30);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter a 6-digit OTP.'); return; }

    setLoading(true);
    try {
      await verifyOTP(otpEmail, code, otpPurpose);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setError('');
    try {
      const res = await resendOTP(otpEmail, otpPurpose);
      setPreviewUrl(res.previewUrl || '');
      setResendTimer(30);
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP.');
    }
  };

  // OTP Verification Screen (Step 2)
  if (step === 2) {
    return (
      <div className="auth-page">
        <Link to="/" className="auth-page__logo">
          <span className="auth-page__logo-text">amazon</span>
          <span className="auth-page__logo-suffix">.clone</span>
        </Link>

        <div className="auth-card">
          <h1 className="auth-card__title">Verify OTP</h1>
          <p style={{ fontSize: '14px', marginBottom: '16px', color: '#555' }}>
            We've sent a 6-digit OTP to <strong>{otpEmail}</strong>
          </p>

          {error && <div className="auth-error">{error}</div>}

          {previewUrl && (
            <div style={{ background: '#f0f7ff', border: '1px solid #a0c4e8', borderRadius: '4px', padding: '8px 12px', marginBottom: '14px', fontSize: '12px' }}>
              📧 <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0066c0' }}>
                View email in Ethereal (test inbox)
              </a>
            </div>
          )}

          <form onSubmit={handleVerifyOTP}>
            <div className="otp-inputs" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="otp-input"
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
            {resendTimer > 0 ? (
              <span style={{ color: '#999' }}>Resend OTP in {resendTimer}s</span>
            ) : (
              <a onClick={handleResend} style={{ color: '#0066c0', cursor: 'pointer' }}>Resend OTP</a>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <a onClick={() => { setStep(1); setError(''); }} style={{ color: '#0066c0', cursor: 'pointer', fontSize: '13px' }}>
              ← Back to {mode === 'login' ? 'Sign In' : 'Create Account'}
            </a>
          </div>
        </div>

        <div className="auth-footer">
          <a href="#">Conditions of Use</a>
          <a href="#">Privacy Notice</a>
          <a href="#">Help</a>
          <p>© 2026, Amazon Clone, Inc. or its affiliates</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Logo */}
      <Link to="/" className="auth-page__logo">
        <span className="auth-page__logo-text">amazon</span>
        <span className="auth-page__logo-suffix">.clone</span>
      </Link>

      <div className="auth-card">
        {mode === 'login' ? (
          <>
            <h1 className="auth-card__title">Sign in</h1>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="auth-field">
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" name="email" value={form.email} onChange={handleChange} required autoFocus />
              </div>
              <div className="auth-field">
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" name="password" value={form.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Sign in'}
              </button>
            </form>

            <p style={{ fontSize: '13px', marginTop: '16px', color: '#555' }}>
              By continuing, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
            </p>

            <div className="auth-divider">
              <span className="auth-divider__line" />
              <span className="auth-divider__text">New to Amazon Clone?</span>
              <span className="auth-divider__line" />
            </div>

            <button
              className="auth-btn"
              style={{ background: 'linear-gradient(to bottom, #f7f8fa, #e7e9ec)', border: '1px solid #adb1b8' }}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Create your Amazon Clone account
            </button>
          </>
        ) : (
          <>
            <h1 className="auth-card__title">Create account</h1>
            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleRegister}>
              <div className="auth-field">
                <label htmlFor="reg-name">Your name</label>
                <input id="reg-name" name="name" value={form.name} onChange={handleChange} required autoFocus />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-mobile">Mobile number</label>
                <input id="reg-mobile" name="mobile" type="tel" value={form.mobile} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-email">Primary Email</label>
                <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-email2">Secondary Email (optional)</label>
                <input id="reg-email2" name="secondaryEmail" type="email" value={form.secondaryEmail} onChange={handleChange} />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-password">Password</label>
                <input id="reg-password" name="password" type="password" value={form.password} onChange={handleChange} required placeholder="At least 6 characters" />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-confirm">Re-enter password</label>
                <input id="reg-confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
              </div>

              {/* Address Section */}
              <div style={{ borderTop: '1px solid #ddd', paddingTop: '14px', marginTop: '14px' }}>
                <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px' }}>Shipping Address</p>
                <div className="auth-field">
                  <label htmlFor="reg-address">Address</label>
                  <input id="reg-address" name="addressLine" value={form.addressLine} onChange={handleChange} placeholder="Street, House No., Landmark" />
                </div>
                <div className="auth-row">
                  <div className="auth-field">
                    <label htmlFor="reg-city">City</label>
                    <input id="reg-city" name="city" value={form.city} onChange={handleChange} />
                  </div>
                  <div className="auth-field">
                    <label htmlFor="reg-state">State</label>
                    <input id="reg-state" name="state" value={form.state} onChange={handleChange} />
                  </div>
                </div>
                <div className="auth-field">
                  <label htmlFor="reg-pincode">Pincode</label>
                  <input id="reg-pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" />
                </div>
              </div>

              <div className="auth-checkbox">
                <input type="checkbox" id="save-browser" name="saveInBrowser" checked={form.saveInBrowser} onChange={handleChange} />
                <label htmlFor="save-browser">Keep me signed in on this browser</label>
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Create your Amazon Clone account'}
              </button>
            </form>

            <div className="auth-divider">
              <span className="auth-divider__line" />
              <span className="auth-divider__text">Already have an account?</span>
              <span className="auth-divider__line" />
            </div>

            <div className="auth-toggle">
              <a onClick={() => { setMode('login'); setError(''); }}>Sign in ›</a>
            </div>
          </>
        )}
      </div>

      <div className="auth-footer">
        <a href="#">Conditions of Use</a>
        <a href="#">Privacy Notice</a>
        <a href="#">Help</a>
        <p>© 2026, Amazon Clone, Inc. or its affiliates</p>
      </div>
    </div>
  );
};

export default Auth;
