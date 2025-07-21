// file: frontend/src/app/browse/page.tsx
'use client';
import React from 'react';
import Navbar from '@/components/Navbar';

const BrowsePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Browse</h1>
          <p className="text-gray-400">Music categories and genres will be displayed here.</p>
        </div>
      </main>
    </div>
  );
};
export default BrowsePage;
