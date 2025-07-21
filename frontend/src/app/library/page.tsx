// file: frontend/src/app/library/page.tsx
'use client';
import React from 'react';
import Navbar from '@/components/Navbar';

const LibraryPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Your Library</h1>
          <p className="text-gray-400">User's saved playlists and liked songs will be here.</p>
        </div>
      </main>
    </div>
  );
};
export default LibraryPage;
