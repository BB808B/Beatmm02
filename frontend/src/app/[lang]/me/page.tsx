'use client';

import React from 'react';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import { useUser } from '@supabase/auth-helpers-react';
import { Heart, Music, Settings, Upload, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';
import { initTranslations } from '@/lib/i18n';

interface MePageProps {
  params: {
    lang: string;
  };
}

const MePage: React.FC<MePageProps> = ({ params: { lang } }) => {
  const { t, i18n } = useTranslation();
  const user = useUser();

  React.useEffect(() => {
    initTranslations(lang);
  }, [lang]);

  const menuItems = [
    { label: 'my_favorites', icon: Heart, href: '/me/favorites' },
    { label: 'my_playlists', icon: Music, href: '/me/playlists' },
    { label: 'upload_music', icon: Upload, href: '/upload' },
    { label: 'settings', icon: Settings, href: '/settings' },
  ];

  return (
    <div>
      <PageHeader title={t('my_profile')} />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* --- 用户信息 --- */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-24 h-24 bg-background-secondary rounded-full flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="User Avatar" className="rounded-full w-full h-full object-cover" />
            ) : (
              <UserIcon size={48} className="text-text-secondary" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{user?.user_metadata?.full_name || t('guest_user')}</h2>
            <p className="text-text-secondary">{user?.email || t('login_to_enjoy_full_features')}</p>
          </div>
        </div>

        {/* --- 菜单列表 --- */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={`/${lang}${item.href}`} passHref>
              <Card className="hover:bg-background-tertiary cursor-pointer">
                <CardContent className="flex items-center p-4">
                  <item.icon size={22} className="text-accent-color-1" />
                  <span className="ml-4 text-lg text-text-primary">{t(item.label)}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* --- 登录/登出按钮 --- */}
        <div className="mt-12">
          {user ? (
            <Button variant="secondary" className="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20">
              {t('logout')}
            </Button>
          ) : (
            <Link href={`/${lang}/login`} passHref>
              <Button variant="primary" className="w-full">
                {t('login')}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MePage;
