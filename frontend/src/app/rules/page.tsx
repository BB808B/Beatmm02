// src/app/rules/page.tsx
'use client';
import React from 'react';

// 为了演示，这里使用临时的占位符文本
const placeholders = {
  terms_of_service_content_p1: 'Welcome to BeatMM Pro. By using our service, you agree to these terms. Please read them carefully. We provide a platform for DJs to share their music and for users to enjoy it. You must not misuse our services.',
  terms_of_service_content_p2: 'We may suspend or stop providing our services to you if you do not comply with our terms or policies or if we are investigating suspected misconduct. All content provided on the platform is the property of BeatMM Pro or its content suppliers.',
  privacy_policy_content_p1: 'Our Privacy Policy explains how we treat your personal data and protect your privacy when you use our services. By using our services, you agree that BeatMM Pro can use such data in accordance with our privacy policies.',
  privacy_policy_content_p2: 'We collect information to provide better services to all our users — from figuring out basic stuff like which language you speak, to more complex things like which tracks you’ll find most useful. We do not share your personal information with companies, organizations, or individuals outside of BeatMM Pro.',
  community_guidelines_content_p1: 'We want to foster a positive and inclusive community. Respect each other. Do not upload content that is hateful, threatening, or pornographic; incites violence; or contains nudity or graphic or gratuitous violence.',
  community_guidelines_content_p2: 'Do not use our service to do anything unlawful, misleading, malicious, or discriminatory. Failure to comply with these guidelines may result in the termination of your account.',
};

const RulesPage = () => {
  // 临时的多语言占位符
  const t = (key: string) => {
    // @ts-ignore
    return placeholders[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-text-primary mb-10 text-center animate-fade-in">{t('platform_rules')}</h1>

      <div className="max-w-4xl mx-auto space-y-12">
        <section className="bg-background-secondary rounded-xl shadow-xl p-6 md:p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-accent-color-1 mb-4 border-b border-border-color pb-2">{t('terms_of_service')}</h2>
          <div className="prose prose-invert prose-p:text-text-secondary prose-p:leading-relaxed space-y-4">
            <p>{t('terms_of_service_content_p1')}</p>
            <p>{t('terms_of_service_content_p2')}</p>
          </div>
        </section>

        <section className="bg-background-secondary rounded-xl shadow-xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
          <h2 className="text-2xl font-bold text-accent-color-1 mb-4 border-b border-border-color pb-2">{t('privacy_policy')}</h2>
          <div className="prose prose-invert prose-p:text-text-secondary prose-p:leading-relaxed space-y-4">
            <p>{t('privacy_policy_content_p1')}</p>
            <p>{t('privacy_policy_content_p2')}</p>
          </div>
        </section>

        <section className="bg-background-secondary rounded-xl shadow-xl p-6 md:p-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold text-accent-color-1 mb-4 border-b border-border-color pb-2">{t('community_guidelines')}</h2>
          <div className="prose prose-invert prose-p:text-text-secondary prose-p:leading-relaxed space-y-4">
            <p>{t('community_guidelines_content_p1')}</p>
            <p>{t('community_guidelines_content_p2')}</p>
          </div>
        </section>
      </div>

    </div>
  );
};

export default RulesPage;
