// file: frontend/src/app/login/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const LoginPage = () => {
  const { t } = useTranslation();
  const [loginType, setLoginType] = useState<'phone' | 'username'>('phone');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = loginType === 'phone' ? { phone: identifier, password } : { username: identifier, password };
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // 登录成功，可以保存 token 并重定向
        console.log('Login successful:', data);
        // 例如：localStorage.setItem('token', data.token);
        // window.location.href = '/'; // 重定向到首页
      } else {
        setError(data.error || '登录失败');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('网络错误或服务器无响应');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <div className="card p-8 w-full max-w-md text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-text-primary mb-6">{t('login_to_beatmm_pro')}</h1>
        
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg ${loginType === 'phone' ? 'bg-accent-color-1 text-white' : 'bg-background-secondary text-text-secondary'}`}
            onClick={() => setLoginType('phone')}
          >
            {t('phone_login')}
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${loginType === 'username' ? 'bg-accent-color-1 text-white' : 'bg-background-secondary text-text-secondary'}`}
            onClick={() => setLoginType('username')}
          >
            {t('username_login')}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={loginType === 'phone' ? t('phone_number') : t('username')}
              className="input-field"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder={t('password')}
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? t('logging_in') : t('login')}
          </button>
        </form>

        <p className="mt-6 text-text-secondary">
          {t('no_account_yet')}{' '}
          <Link href="/signup" className="text-accent-color-1 hover:underline">
            {t('sign_up_now')}
          </Link>
        </p>
        <p className="mt-2 text-text-secondary">
          <Link href="/forgot-password" className="text-accent-color-1 hover:underline">
            {t('forgot_password')}?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;


