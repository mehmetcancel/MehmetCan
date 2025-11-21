import React from 'react';
import { Team } from '../types';

interface ResultViewProps {
  generatedImage: string;
  selectedTeam: Team | null;
  onReset: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ generatedImage, selectedTeam, onReset }) => {
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `futbolcu-sensin-${selectedTeam?.id}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 w-full max-w-4xl mx-auto animate-fade-in bg-neutral-900/40 p-6 md:p-8 rounded-3xl border border-white/5 backdrop-blur-sm">
      
      {/* Image Container */}
      <div className="w-full max-w-md lg:w-1/2 flex-shrink-0">
        <div className="bg-neutral-800 rounded-2xl p-2 border border-neutral-700 shadow-2xl shadow-black/50 rotate-1 hover:rotate-0 transition-transform duration-500">
            <img 
                src={generatedImage} 
                alt="Generated Jersey" 
                className="w-full h-auto rounded-xl aspect-[4/5] object-cover"
            />
        </div>
      </div>

      {/* Actions & Text */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
        <div className="inline-block mx-auto lg:mx-0 px-3 py-1 rounded-full bg-grass-500/20 text-grass-400 text-xs font-bold tracking-wider uppercase mb-4 border border-grass-500/30">
            Transfer Tamamlandı
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Yeni Yıldız <span className="text-grass-500">{selectedTeam?.name}</span> Formasıyla!
        </h2>
        
        <p className="text-neutral-400 mb-8 text-lg leading-relaxed">
            Bu efsanevi formayı gururla taşı. Görselini indirip sosyal medyada paylaşabilirsin.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <button 
                onClick={handleDownload}
                className="flex-1 py-4 px-6 bg-grass-600 hover:bg-grass-500 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 group"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:translate-y-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 12.75l-3-3m0 0 3-3m-3 3h7.5" transform="rotate(-90 12 12)" />
                </svg>
                Görseli İndir
            </button>
            <button 
                onClick={onReset}
                className="flex-1 py-4 px-6 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-medium transition-all border border-neutral-700 flex items-center justify-center gap-2"
            >
                <span>🔄</span>
                Yeni Takım Seç
            </button>
        </div>
      </div>
    </div>
  );
};
