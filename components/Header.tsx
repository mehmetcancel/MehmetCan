import React, { useState } from 'react';

interface HeaderProps {
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <header className="w-full bg-gradient-to-b from-pitch/90 to-transparent backdrop-blur-sm border-b border-white/5 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center md:justify-start">
        <button 
          onClick={onLogoClick} 
          className="flex items-center gap-3 group cursor-pointer focus:outline-none"
          title="Anasayfaya Dön"
        >
          {!imageError ? (
            <img 
              src="./logo.png" 
              alt="Logo" 
              className="h-12 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform" 
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 bg-grass-600 rounded-full flex items-center justify-center border-2 border-white/20">
              ⚽
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight drop-shadow-md group-hover:text-grass-400 transition-colors">
            {!imageError ? '' : 'Futbolcu Sensin'}
          </h1>
        </button>
      </div>
    </header>
  );
};
