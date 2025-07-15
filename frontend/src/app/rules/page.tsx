'use client';

import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaFileContract, FaMoneyBillWave, FaMicrophone } from 'react-icons/fa';
import NavbarComponent from '@/components/Navbar';
import { Translations } from '@/types'; // 确保 Translations 类型正确导入
import { motion } from 'framer-motion';

// 定义 Translation 类型以匹配 common.json 的结构
// 注意：这应该在您的 `@/types` 文件中定义，这里是为了演示完整性而重复
// 请确保您的 `@/types` 文件中有此定义
// 例如：
// export interface Translations {
//   title: string;
//   nav: {
//     home: string;
//     music: string;
//     dj: string;
//     live: string;
//     ranking: string;
//     profile: string;
//     login: string;
//     register: string;
//     logout: string;
//     rules: string; // 新增
//   };
//   home: {
//     welcome: string;
//     subtitle: string;
//     featured: string;
//     trending: string;
//     newReleases: string;
//   };
//   auth: {
//     phone: string;
//     password: string;
//     confirmPassword: string;
//     login: string;
//     register: string;
//     forgotPassword: string;
//     noAccount: string;
//     hasAccount: string;
//     registerNow: string;
//     loginNow: string;
//   };
//   player: {
//     play: string;
//     pause: string;
//     next: string;
//     previous: string;
//     volume: string;
//     shuffle: string;
//     repeat: string;
//   };
//   profile: {
//     myProfile: string;
//     myMusic: string;
//     myWallet: string;
//     settings: string;
//     djApplication: string;
//     balance: string;
//     recharge: string;
//     withdraw: string;
//   };
//   common: {
//     search: string;
//     submit: string;
//     cancel: string;
//     confirm: string;
//     save: string;
//     edit: string;
//     delete: string;
//     loading: string;
//     error: string;
//     success: string;
//   };
//   rulesPage: { // 新增 rulesPage 字段
//     title: string;
//     subtitle: string;
//     section1Title: string;
//     section1Item1: string;
//     section1Item2: string;
//     section1Item3: string;
//     section1Item4: string;
//     section1Item5: string;
//     section1Item6: string;
//     section1Item7: string;
//     section1Item8: string;
//     section2Title: string;
//     section2Item1: string;
//     section2Item2: string;
//     section2Item3: string;
//     section2Item4: string;
//     section2Item5: string;
//     section2Item6: string;
//     section2Item7: string;
//     section3Title: string;
//     section3Item1: string;
//     section3Item2: string;
//     section3Item3: string;
//     section3Item4Title: string;
//     section3Item4Perm1: string;
//     section3Item4Perm2: string;
//     section3Item4Perm3: string;
//     section3Item4Perm4: string;
//     section3Item5: string;
//     section3Item6: string;
//     section3Item7: string;
//     importantReminderTitle: string;
//     importantReminderText1: string;
//     importantReminderText2: string;
//     importantReminderText3: string;
//   };
// }


export default function RulesPage() {
  const [currentLang, setCurrentLang] = useState('zh');
  const [translations, setTranslations] = useState<Translations | null>(null);

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
        // 提供一个最小的备用翻译，或者显示错误消息
        setTranslations({
          title: 'BeatMM Pro',
          nav: {
            home: 'Home', music: 'Music', dj: 'DJ', live: 'Live', ranking: 'Ranking',
            profile: 'Profile', login: 'Login', register: 'Register', logout: 'Logout', rules: 'Rules'
          },
          home: {
            welcome: 'Welcome', subtitle: 'Discover amazing music', featured: 'Featured', trending: 'Trending', newReleases: 'New Releases'
          },
          auth: {
            phone: 'Phone', password: 'Password', confirmPassword: 'Confirm Password',
            login: 'Login', register: 'Register', forgotPassword: 'Forgot Password?',
            noAccount: 'No account?', hasAccount: 'Already have an account?',
            registerNow: 'Register Now', loginNow: 'Login Now'
          },
          player: {
            play: 'Play', pause: 'Pause', next: 'Next', previous: 'Previous',
            volume: 'Volume', shuffle: 'Shuffle', repeat: 'Repeat'
          },
          profile: {
            myProfile: 'My Profile', myMusic: 'My Music', myWallet: 'My Wallet',
            settings: 'Settings', djApplication: 'DJ Application', balance: 'Balance',
            recharge: 'Recharge', withdraw: 'Withdraw'
          },
          common: {
            search: 'Search', submit: 'Submit', cancel: 'Cancel', confirm: 'Confirm',
            save: 'Save', edit: 'Edit', delete: 'Delete', loading: 'Loading...',
            error: 'Error', success: 'Success'
          },
          // 最小的 rulesPage 备用翻译
          rulesPage: {
            title: 'Platform Rules & Terms',
            subtitle: 'Please read the following rules and terms carefully to maintain platform order and protect user rights.',
            section1Title: 'I. Terms of Use',
            section1Item1: 'BeatMM Pro is a music sharing & DJ community platform for Myanmar users, limited to legal, peaceful purposes.',
            section1Item2: 'User-uploaded content must be original or authorized. Piracy of others\' music, covers, or introductions is prohibited.',
            section1Item3: 'All tipping is voluntary and non-refundable. The platform provides technical services and charges a service fee.',
            section1Item4: 'By registering on the platform, users agree to abide by platform rules. The platform reserves the right to delete content or ban accounts for violations.',
            section1Item5: 'Uploading or publishing any illegal, pornographic, violent, hateful, or politically sensitive content is prohibited.',
            section1Item6: 'This platform prohibits private messaging between users, only allowing interaction with system customer service to ensure information security and compliance.',
            section1Item7: 'Real payment information must be provided before withdrawal. If the withdrawal account does not match the registered identity, the platform reserves the right to refuse processing.',
            section1Item8: 'BeatMM Pro reserves the right of final interpretation and may modify terms at any time to comply with local regulations or operational strategies.',
            section2Title: 'II. Tipping & Withdrawal Rules',
            section2Item1: 'Users can top up their accounts via KPay, KBZ Banking, etc., and use it to tip their favorite DJs.',
            section2Item2: 'Tipping amounts are freely chosen by the user; once confirmed, tips are non-cancellable and non-refundable.',
            section2Item3: 'Tipping income will go into the DJ\'s account, and the platform will automatically deduct a 10% technical service fee.',
            section2Item4: 'DJs can apply for withdrawal once their balance reaches 3,000 MMK. Withdrawal amounts will be disbursed via KPay/KBZ Banking.',
            section2Item5: 'All withdrawal applications will be manually reviewed by administrators within 24 hours, requiring the upload of a real payment QR code.',
            section2Item6: 'The withdrawal account must match the DJ account\'s bound phone number. Using others\' accounts or false information is strictly prohibited.',
            section2Item7: 'If any acts such as fraudulent tipping, forging screenshots, or false transactions are discovered, the account will be immediately banned and the balance frozen.',
            section3Title: 'III. DJ Certification Rules',
            section3Item1: 'Any BeatMM user can apply on the "Apply to be a DJ" page, filling in personal information and uploading music works.',
            // ...以此类推，补全所有缺失的字段
            section3Item2: 'Application requires: artist name, avatar, and at least one original music work.',
            section3Item3: 'The platform will manually review applications within 1-2 working days, mainly checking for originality, sound quality, and compliance.',
            section3Item4Title: 'Upon successful certification, DJs gain the following permissions:',
            section3Item4Perm1: 'Upload music',
            section3Item4Perm2: 'View play/like/tip data',
            section3Item4Perm3: 'Withdraw tip income',
            section3Item4Perm4: 'Enter the DJ ranking system',
            section3Item5: 'If a DJ uploads non-compliant content (infringing music, false information, illegal statements), certification will be revoked and the account permanently banned.',
            section3Item6: 'Each DJ is fully responsible for their uploaded content; the platform bears no infringement liability.',
            section3Item7: 'Encourage the creation of Vietnamese drum, Myanmar style, and local original music works.',
            importantReminderTitle: '⚠️ Important Reminder',
            importantReminderText1: 'By using this platform, you acknowledge that you have read, understood, and agreed to abide by all the above rules and terms.',
            importantReminderText2: 'The platform is committed to providing a safe and compliant music sharing environment for users, working together to maintain a good community atmosphere.',
            importantReminderText3: 'If you have any questions, please contact customer service or refer to the help documentation.'
          }
        });
      }
    };

    loadTranslations();
  }, [currentLang]);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
  };

  const goBack = () => {
    window.history.back();
  };

  if (!translations) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        {translations?.common?.loading || 'Loading...'}
      </div>
    );
  }

  // Common motion variants for cards and items
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <>
      <NavbarComponent
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        translations={translations}
      />

      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white pt-24 pb-10">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <button
                className="neon-icon-btn p-2 mr-3"
                onClick={goBack}
              >
                <FaArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent leading-tight">
                <FaFileContract className="inline-block mr-2 text-primary" />
                {translations.rulesPage.title}
              </h1>
            </div>
            <p className="text-gray-400 text-lg md:text-right md:max-w-md">
              {translations.rulesPage.subtitle}
            </p>
          </motion.div>

          {/* Section 1: Usage Terms */}
          <motion.div
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-primary text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <FaFileContract className="mr-3" />
                {translations.rulesPage.section1Title}
              </h3>
            </div>
            <ul className="list-none p-0 space-y-4">
              {[
                translations.rulesPage.section1Item1,
                translations.rulesPage.section1Item2,
                translations.rulesPage.section1Item3,
                translations.rulesPage.section1Item4,
                translations.rulesPage.section1Item5,
                translations.rulesPage.section1Item6,
                translations.rulesPage.section1Item7,
                translations.rulesPage.section1Item8,
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Section 2: Tipping & Withdrawal Rules */}
          <motion.div
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-secondary text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <FaMoneyBillWave className="mr-3" />
                {translations.rulesPage.section2Title}
              </h3>
            </div>
            <ul className="list-none p-0 space-y-4">
              {[
                translations.rulesPage.section2Item1,
                translations.rulesPage.section2Item2,
                translations.rulesPage.section2Item3,
                translations.rulesPage.section2Item4,
                translations.rulesPage.section2Item5,
                translations.rulesPage.section2Item6,
                translations.rulesPage.section2Item7,
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-secondary text-white rounded-full font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Section 3: DJ Certification Rules */}
          <motion.div
            className="glass-panel neon-border p-6 rounded-xl shadow-lg mb-8"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="bg-accent text-black p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
              <h3 className="text-2xl font-bold flex items-center">
                <FaMicrophone className="mr-3" />
                {translations.rulesPage.section3Title}
              </h3>
            </div>
            <ul className="list-none p-0 space-y-4">
              {[
                translations.rulesPage.section3Item1,
                translations.rulesPage.section3Item2,
                translations.rulesPage.section3Item3,
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-accent text-black rounded-full font-bold text-sm mr-3">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
              <motion.li className="mb-3 flex items-start" variants={listItemVariants}>
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-accent text-black rounded-full font-bold text-sm mr-3">
                  4
                </span>
                <div>
                  <span>{translations.rulesPage.section3Item4Title}</span>
                  <ul className="mt-2 ml-3 list-disc list-inside">
                    <li>{translations.rulesPage.section3Item4Perm1}</li>
                    <li>{translations.rulesPage.section3Item4Perm2}</li>
                    <li>{translations.rulesPage.section3Item4Perm3}</li>
                    <li>{translations.rulesPage.section3Item4Perm4}</li>
                  </ul>
                </div>
              </motion.li>
              {[
                translations.rulesPage.section3Item5,
                translations.rulesPage.section3Item6,
                translations.rulesPage.section3Item7,
              ].map((item, index) => (
                <motion.li
                  key={index + 4} // Adjust key for uniqueness
                  className="flex items-start"
                  variants={listItemVariants}
                >
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-accent text-black rounded-full font-bold text-sm mr-3">
                    {index + 5}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Important Reminder */}
          <motion.div
            className="glass-panel neon-border border-warning p-6 rounded-xl text-center shadow-lg"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h4 className="text-warning text-2xl font-bold mb-3">
              {translations.rulesPage.importantReminderTitle}
            </h4>
            <p className="mb-3 text-lg">
              {translations.rulesPage.importantReminderText1}
            </p>
            <p className="mb-3 text-lg">
              {translations.rulesPage.importantReminderText2}
            </p>
            <p className="mb-0 text-gray-400">
              {translations.rulesPage.importantReminderText3}
            </p>
          </motion.div>
        </div>
      </main>
    </>
  );
}
