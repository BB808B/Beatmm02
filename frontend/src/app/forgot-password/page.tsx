// src/app/forgot-password/page.tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import DynamicBackground from '@/components/DynamicBackground';
import AuthContainer from '@/components/AuthContainer';
import { Mail, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPasswordPage = () => {
  // 临时的多语言占位符
  const t = (key: string) => ({
    'forgot_password': 'Forgot Password',
    'forgot_password_desc': "Enter the email associated with your account and we'll send you a link to reset your password.",
    'email_address': 'Email Address',
    'send_reset_link': 'Send Reset Link',
    'sending': 'Sending...',
    'back_to_login': 'Back to Login',
    'check_your_email': 'Check Your Email',
    'success_message': 'If an account with that email exists, we have sent password reset instructions.',
    'an_error_occurred': 'An unexpected error occurred. Please try again.',
  }[key] || key);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 为了安全，无论邮箱是否存在，我们都显示成功信息
    setIsSuccess(true);
    setLoading(false);
  };

  return (
    <>
      <DynamicBackground />
      <AuthContainer title={isSuccess ? t('check_your_email') : t('forgot_password')}>
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <p className="text-text-secondary">{t('success_message')}</p>
              <Link href="/login" className="btn-secondary w-full inline-flex items-center justify-center gap-2">
                <ArrowLeft size={16} />
                {t('back_to_login')}
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-center text-text-secondary mb-8 text-sm">
                {t('forgot_password_desc')}
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={20} />
                  <input
                    type="email"
                    placeholder={t('email_address')}
                    className="input-field pl-12"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                
                <button type="submit" className="btn-primary w-full !py-3 flex items-center justify-center gap-2" disabled={loading}>
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  {loading ? t('sending') : t('send_reset_link')}
                </button>
              </form>
              <div className="mt-8 text-center text-sm">
                <Link href="/login" className="font-semibold text-accent-color-1 hover:text-accent-color-2 transition-colors inline-flex items-center gap-2">
                  <ArrowLeft size={16} />
                  {t('back_to_login')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </AuthContainer>
    </>
  );
};

export default ForgotPasswordPage;
