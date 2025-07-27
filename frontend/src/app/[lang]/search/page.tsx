'use client';

import React from 'react';
import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search as SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { initTranslations } from '@/lib/i18n';

interface SearchPageProps {
  params: {
    lang: string;
  };
}

const recentSearches = ['Synthwave', 'Vietnamese Drum', '80s Pop', 'Lo-fi Beats'];
const popularTags = ['Remix', 'Chill', 'Workout', 'Party', 'Focus'];

const SearchPage: React.FC<SearchPageProps> = ({ params: { lang } }) => {
  const { t, i18n } = useTranslation();

  React.useEffect(() => {
    initTranslations(lang);
  }, [lang]);

  return (
    <div>
      <PageHeader title={t('search')} subtitle={t('find_your_favorite_tracks')} />
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* --- 搜索框 --- */}
        <div className="relative mb-12">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={22} />
          <Input
            type="text"
            placeholder={t('search_for_music')}
            className="pl-12 text-lg"
          />
        </div>

        {/* --- 最近搜索 --- */}
        <section className="mb-12">
          <h3 className="text-xl font-bold text-white mb-4">{t('recent_searches')}</h3>
          <div className="flex flex-wrap gap-3">
            {recentSearches.map((term) => (
              <Button key={term} variant="secondary" size="sm">
                {term}
              </Button>
            ))}
          </div>
        </section>

        {/* --- 热门标签 --- */}
        <section>
          <h3 className="text-xl font-bold text-white mb-4">{t('popular_tags')}</h3>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <Button key={tag} variant="ghost" size="sm">
                #{tag}
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchPage;
