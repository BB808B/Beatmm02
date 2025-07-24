// frontend/src/app/signup/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
// import { useTranslation } from 'react-i18next';
import DynamicBackground from '@/components/DynamicBackground';
import AuthContainer from '@/components/AuthContainer';

const SignupPage = () => {
  // const { t } = useTranslation();
  const t = (key: string) => ({
    'signup_title': 'Create Your Account',
    'username': 'Username',
    'phone_number': 'Phone Number (Optional)',
    'password': 'Password',
    'confirm_password': 'Confirm Password',
    'creating_account': 'Creating...',
    'signup': 'Sign Up',
    'already_have_account': 'Already have an account?',
    'login_now': 'Login now',
    'terms_prefix': 'By signing up, you agree to our',
    'terms_of_service': 'Terms of Service',
  }[key] || key);

  // --- 注册表单的核心逻辑 ---
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const payload = { username, password, phone };
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Signup successful:', data);
        // 注册成功，可以重定向到登录页或直接登录
        // window.location.href = '/login';
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error or server is down');
    } finally {
      setLoading(false);
    }
  };
  // --- 逻辑部分结束 ---

  const inputClass = "input-field focus:ring-2 focus:ring-accent-color-1 focus:border-transparent transition-all duration-300";

  return (
    <>
      <DynamicBackground />
      <AuthContainer title={t('signup_title')}>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder={t('username')}
              className={inputClass}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="tel" // 使用 tel 类型以优化移动端输入
              placeholder={t('phone_number')}
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder={t('password')}
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder={t('confirm_password')}
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}
          
          <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
            {loading ? t('creating_account') : t('signup')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
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
      </AuthContainer>
    </>
  );
};

export default SignupPage;
