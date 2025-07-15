'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types/Translations';

export default function LoginPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${currentLang}/common.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // fallback translations fully match the Translations type
        setTranslations({
          title: 'BeatMM Pro',
          nav: {
            home: 'Home',
            music: 'Music',
            dj: 'DJ',
            live: 'Live',
            ranking: 'Ranking',
            profile: 'Profile',
            login: 'Login',
            register: 'Register',
            logout: 'Logout',
            rules: 'Rules',
          },
          home: {
            welcome: 'Welcome',
            subtitle: 'Discover amazing music',
            featured: 'Featured',
            trending: 'Trending',
            newReleases: 'New Releases',
          },
          auth: {
            loginTitle: 'Welcome to Login',
            phone: 'Phone Number',
            password: 'Password',
            confirmPassword: 'Confirm Password',
            loginButton: 'Login',
            forgotPassword: 'Forgot Password?',
            noAccount: 'No account?',
            hasAccount: 'Already have an account?',
            registerNow: 'Register Now',
            loginSuccess: 'Login successful!',
            loginError: 'Login failed. Please check your phone number or password.',
            phoneRequired: 'Phone number is required',
            passwordRequired: 'Password is required',
          },
          player: {
            play: 'Play',
            pause: 'Pause',
            next: 'Next',
            previous: 'Previous',
            volume: 'Volume',
            shuffle: 'Shuffle',
            repeat: 'Repeat',
          },
          profile: {
            myProfile: 'My Profile',
            myMusic: 'My Music',
            myWallet: 'My Wallet',
            settings: 'Settings',
            djApplication: 'DJ Application',
            balance: 'Balance',
            recharge: 'Recharge',
            withdraw: 'Withdraw',
          },
          common: {
            search: 'Search',
            submit: 'Submit',
            cancel: 'Cancel',
            confirm: 'Confirm',
            save: 'Save',
            edit: 'Edit',
            delete: 'Delete',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
          },
          rulesPage: {
            title: 'Platform Rules',
            subtitle: 'Read our rules.',
            section1Title: 'Terms',
            section1Item1: 'Item 1',
            section1Item2: 'Item 2',
            section1Item3: 'Item 3',
            section1Item4: 'Item 4',
            section1Item5: 'Item 5',
            section1Item6: 'Item 6',
            section1Item7: 'Item 7',
            section1Item8: 'Item 8',
            section2Title: 'Tipping',
            section2Item1: 'Item 1',
            section2Item2: 'Item 2',
            section2Item3: 'Item 3',
            section2Item4: 'Item 4',
            section2Item5: 'Item 5',
            section2Item6: 'Item 6',
            section2Item7: 'Item 7',
            section3Title: 'DJ Cert.',
            section3Item1: 'Item 1',
            section3Item2: 'Item 2',
            section3Item3: 'Item 3',
            section3Item4Title: 'Permissions:',
            section3Item4Perm1: 'Perm 1',
            section3Item4Perm2: 'Perm 2',
            section3Item4Perm3: 'Perm 3',
            section3Item4Perm4: 'Perm 4',
            section3Item5: 'Item 5',
            section3Item6: 'Item 6',
            section3Item7: 'Item 7',
            importantReminderTitle: 'Important',
            importantReminderText1: 'Text 1',
            importantReminderText2: 'Text 2',
            importantReminderText3: 'Text 3',
          },
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!phone) {
      setError(translations?.auth?.phoneRequired || 'Phone number is required');
      return;
    }
    if (!password) {
      setError(translations?.auth?.passwordRequired || 'Password is required');
      return;
    }

    setLoading(true);
    try {
      const response = await new Promise(resolve =>
        setTimeout(() => {
          if (phone === '123456789' && password === 'password123') {
            resolve({ success: true, message: translations?.auth?.loginSuccess || 'Login successful!' });
          } else {
            resolve({ success: false, message: translations?.auth?.loginError || 'Login failed.' });
          }
        }, 1500)
      );

      const data = response as { success: boolean; message: string };

      if (data.success) {
        console.log(data.message);
        router.push('/profile');
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(translations?.common?.error || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {'Loading...'}
      </div>
    );
  }

  // 你原来的 JSX UI 没动，所以省略，继续用你的 UI ✅
  return (
    <>
      {/* ... 你原来的 UI 内容保持一致 ... */}
    </>
  );
}
