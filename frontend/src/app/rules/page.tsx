// file: frontend/src/app/rules/page.tsx
'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

const RulesPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background-primary">
      <Navbar />
      <main className="flex-grow py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8 animate-fade-in">{t('platform_rules')}</h1>

          <section className="bg-background-secondary rounded-lg shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('terms_of_service')}</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              {t('terms_of_service_content_p1')}
            </p>
            <p className="text-text-secondary leading-relaxed">
              {t('terms_of_service_content_p2')}
            </p>
          </section>

          <section className="bg-background-secondary rounded-lg shadow-xl p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('privacy_policy')}</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              {t('privacy_policy_content_p1')}
            </p>
            <p className="text-text-secondary leading-relaxed">
              {t('privacy_policy_content_p2')}
            </p>
          </section>

          <section className="bg-background-secondary rounded-lg shadow-xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4">{t('community_guidelines')}</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              {t('community_guidelines_content_p1')}
            </p>
            <p className="text-text-secondary leading-relaxed">
              {t('community_guidelines_content_p2')}
            </p>
          </section>

        </div>
      </main>
    </div>
  );
};

export default RulesPage;


