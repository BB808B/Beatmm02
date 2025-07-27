'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background-secondary/50 py-6 px-4 sm:px-6 lg:px-8 border-b border-border-color"
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-text-secondary mt-1">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default PageHeader;
