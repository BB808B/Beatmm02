// frontend/src/app/forgot-password/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
// import { useTranslation } from 'react-i18next';
import DynamicBackground from '@/components/DynamicBackground';
import AuthContainer from '@/components/AuthContainer';

const ForgotPasswordPage = () => {
  // const { t } = useTranslation();
  const t = (key: string) => ({
    'forgot_password_title': 'Forgot Password',
    'forgot_password_desc': "Don't worry! It happens. Please enter the phone number or username associated with your account.",
    'identifier_placeholder': 'Phone Number or Username',
    'send_reset_link': 'Send Reset Instructions',
    'sending': 'Sending...',
    'back_to_login': 'Back to Login',
    'success_message': 'If an account with that identifier exists, reset instructions have been sent.',
  }[key] || key);

  // --- 核心逻辑 ---
  const [identifier, setIdentifier] = useState('');
  const [message, setMessage] = useState(''); // 用于显示成功或错误信息
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // 这里的 API 端点需要后端支持
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      
      // 注意：为了安全，无论用户是否存在，前端都应该显示一个类似的消息。
      // 这样可以防止攻击者通过响应来猜测哪些用户是注册过的。
      if (response.ok) {
        setIsSuccess(true);
        setMessage(t('success_message'));
      } else {
        const data = await response.json();
        // 同样显示通用消息，但可以在控制台记录真实错误
        setIsSuccess(true);
        setMessage(t('success_message'));
        console.error("Forgot password error (for admin):", data.error || "Request failed");
      }
    } catch (err) {
      // 网络错误等情况
      setError('An unexpected error occurred. Please try again later.');
      console.error('Forgot password submission error:', err);
    } finally {
      setLoading(false);
    }
  };
  // --- 逻辑部分结束 ---

  const inputClass = "input-field focus:ring-2 focus:ring-accent-color-1 focus:border-transparent transition-all duration-300";

  return (
    <>
      <DynamicBackground />
      <AuthContainer title={t('forgot_password_title')}>
        
        {isSuccess ? (
          <div className="text-center">
            <p className="text-green-400">{message}</p>
          </div>
        ) : (
          <>
            <p className="text-center text-text-secondary mb-6 text-sm">
              {t('forgot_password_desc')}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder={t('identifier_placeholder')}
                  className={inputClass}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}
              
              <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
                {loading ? t('sending') : t('send_reset_link')}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="font-semibold text-accent-color-1 hover:text-accent-color-2 transition-colors">
            {t('back_to_login')}
          </Link>
        </div>
      </AuthContainer>
    </>
  );
};

export default ForgotPasswordPage;
