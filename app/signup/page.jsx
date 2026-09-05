'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Check
} from 'lucide-react';

export default function Signup() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Live password strength calculation
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, text: '', color: '' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, text: 'Weak', color: '#e53e3e', width: '25%' };
      case 2:
        return { score: 2, text: 'Fair', color: '#dd6b20', width: '50%' };
      case 3:
        return { score: 3, text: 'Good', color: '#3182ce', width: '75%' };
      case 4:
      default:
        return { score: 4, text: 'Strong', color: '#38a169', width: '100%' };
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }
    setError('');
    setMessage('');
    setSubmitting(true);
    const { data, error } = await signUp(email, password, fullName);
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }
    if (data?.session) {
      router.push('/account');
    } else {
      setMessage('Account created successfully! Check your email to confirm your account.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Decorative Background Elements */}
      <div className="auth-bg-ambient auth-bg-ambient-1" />
      <div className="auth-bg-ambient auth-bg-ambient-2" />

      <motion.div 
        className="auth-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="auth-card">
          <div className="auth-badge-pill">
            <Sparkles size={14} />
            <span>Join Nutratein Members</span>
          </div>

          <div className="auth-tab-switch">
            <Link href="/login" className="auth-tab-btn">
              Log In
            </Link>
            <button type="button" className="auth-tab-btn active">
              Create Account
            </button>
          </div>

          <div className="auth-header-text">
            <h2>Create Your Account</h2>
            <p>Join thousands of athletes and researchers worldwide</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="auth-alert auth-alert-error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle size={17} className="shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
            {message && (
              <motion.div 
                className="auth-alert auth-alert-success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CheckCircle2 size={17} className="shrink-0" />
                <span>{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Full Name */}
            <div className="auth-field">
              <label htmlFor="signup-name">Full Name</label>
              <div className="auth-input-box">
                <User size={18} className="auth-input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="auth-field">
              <label htmlFor="signup-email">Email Address</label>
              <div className="auth-input-box">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-field">
              <label htmlFor="signup-password">Create Password</label>
              <div className="auth-input-box">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Dynamic Password Strength Indicator */}
              {password && (
                <div className="auth-pw-strength">
                  <div className="auth-pw-strength-bar">
                    <div 
                      className="auth-pw-strength-fill"
                      style={{ 
                        width: passwordStrength.width, 
                        backgroundColor: passwordStrength.color 
                      }}
                    />
                  </div>
                  <div className="auth-pw-strength-info">
                    <span>Strength: <strong style={{ color: passwordStrength.color }}>{passwordStrength.text}</strong></span>
                    <span className="auth-pw-hint">Min 6 chars + numbers/symbols</span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and conditions */}
            <div className="auth-options-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>
                  I agree to the <Link href="/faq" className="auth-inline-link">Terms</Link> &amp; <Link href="/faq" className="auth-inline-link">Privacy Policy</Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Creating your account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center helper-text" style={{ marginTop: 18, marginBottom: 0 }}>
            Already have an account? <Link href="/login" className="auth-inline-link">Log in</Link>
          </p>

          {/* Trust badges */}
          <div className="auth-trust-strip">
            <span>🛡️ 100% Data Confidential</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
