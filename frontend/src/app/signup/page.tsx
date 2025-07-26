// src/app/signup/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import DynamicBackground from '@/components/DynamicBackground';
import AuthContainer from '@/components/AuthContainer';
import { Phone, Lock, UserPlus, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupPage = () => {
  const t = (key: string) => ({
    'create_your_account': 'Create Your Account',
    'join_the_revolution': 'Join the sound revolution.',
    'phone_number': 'Phone Number',
    'password': 'Password',
    'confirm_password': 'Confirm Password',
    'get_otp_code': 'Get OTP Code',
    'sending_code': 'Sending...',
    'creating_account': 'Creating Account...',
    'signup': 'Sign Up',
    'already_have_account': 'Already have an account?',
    'login_now': 'Login now',
    'terms_prefix': 'By signing up, you agree to our',
    'terms_of_service': 'Terms of Service',
    'passwords_do_not_match': 'Passwords do not match.',
    'mock_signup_error': 'This is a mock signup error.',
  }[key] || key);

  // --- 核心逻辑 (纯前端，为未来的多步注册做准备) ---
  const [step, setStep] = useState(1); // 步骤1: 输入信息, 步骤2: 输入OTP
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('passwords_do_not_match'));
      return;
    }
    setError('');
    setLoading(true);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Requesting OTP for phone:', phone);
    
    // 模拟成功，进入下一步
    setStep(2);
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // 模拟最终注册
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Signing up with phone:', phone, 'and OTP:', otp);
    
    // 模拟失败来展示UI
    setError(t('mock_signup_error'));
    setLoading(false);
  };
  
  return (
    <>
      <DynamicBackground />
      <AuthContainer title={t('create_your_account')} description={t('join_the_revolution')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {step === 1 && (
            <form onSubmit={handleGetOtp} className="space-y-6">
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input type="tel" placeholder={t('phone_number')} className="input-field pl-12" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input type="password" placeholder={t('password')} className="input-field pl-12" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                <input type="password" placeholder={t('confirm_password')} className="input-field pl-12" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              </div>
              {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}
              <button type="submit" className="btn-primary w-full !py-3 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? <><Loader2 className="animate-spin" size={20} />{t('sending_code')}</> : <>{t('get_otp_code')}<ArrowRight size={18} /></>}
              </button>
            </form>
          )}

          {step === 2 && (
             <form onSubmit={handleSignup} className="space-y-6">
                <p className="text-center text-text-secondary text-sm">Enter the 6-digit code sent to {phone}.</p>
                <div className="relative">
                  <input type="text" placeholder="OTP Code" className="input-field text-center tracking-[1em]" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>
                {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}
                <button type="submit" className="btn-primary w-full !py-3 flex items-center justify-center gap-2" disabled={loading}>
                  {loading ? <><Loader2 className="animate-spin" size={20} />{t('creating_account')}</> : <><UserPlus size={18} />{t('signup')}</>}
                </button>
             </form>
          )}

          <div className="mt-8 text-center text-sm">
            <p className="text-text-secondary">
              {t('already_have_account')}{' '}
              <Link href="/login" className="font-semibold text-accent-color-1 hover:text-accent-color-2 transition-colors">
                {t('login_now')}
              </Link>
            </p>
            <p className="mt-4 text-xs text-text-secondary">
              {t('terms_prefix')}{' '}
              <Link href="/rules" className="underline hover:text-accent-color-1 transition-colors">
                {t('terms_of_service')}
              </Link>
            </p>
          </div>
        </motion.div>
      </AuthContainer>
    </>
  );
};

export default SignupPage;
