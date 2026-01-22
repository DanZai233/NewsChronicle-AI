import React from 'react';
import { Newspaper } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 text-center bg-white border-b border-gray-100 mb-8 sticky top-0 z-30 bg-opacity-90 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-center space-x-3">
        <div className="bg-primary-600 p-2 rounded-lg text-white">
          <Newspaper size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-serif">
          NewsChronicle <span className="text-primary-600">AI</span>
        </h1>
      </div>
    </header>
  );
};