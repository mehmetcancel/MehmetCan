import React, { useState } from 'react';
import { TEAMS } from '../constants';
import { Team } from '../types';

interface TeamSelectorProps {
  onTeamSelected: (team: Team) => void;
  userImagePreview: string;
  onBack: () => void;
}

const getColorHex = (colorName: string): string => {
  const map: Record<string, string> = {
    'Red': '#dc2626',
    'White': '#f5f5f5',
    'Yellow': '#facc15',
    'Navy Blue': '#0f172a',
    'Black': '#171717',
    'Burgundy': '#831843',
    'Blue': '#2563eb',
    'Green': '#16a34a',
    'Orange': '#ea580c',
    'Purple': '#7e22ce',
    'Light Blue': '#38bdf8'
  };

  // Basic manual fallbacks for common Turkish/English names if strict match fails
  const lower = colorName.toLowerCase();
  if (lower.includes('kırmız') || lower.includes('red')) return '#dc2626';
  if (lower.includes('beyaz') || lower.includes('white')) return '#f5f5f5';
  if (lower.includes('sarı') || lower.includes('yellow')) return '#facc15';
  if (lower.includes('lacivert') || lower.includes('navy')) return '#0f172a';
  if (lower.includes('siyah') || lower.includes('black')) return '#171717';
  if (lower.includes('bordo') || lower.includes('burgundy')) return '#831843';
  if (lower.includes('mavi') || lower.includes('blue')) return '#2563eb';
  if (lower.includes('yeşil') || lower.includes('green')) return '#16a34a';
  if (lower.includes('turuncu') || lower.includes('orange')) return '#ea580c';
  if (lower.includes('mor') || lower.includes('purple')) return '#7e22ce';

  return map[colorName] || '#888888';
};

const getTeamBadgeStyle = (colors: string[]) => {
  const hexColors = colors.map(getColorHex);
  
  if (hexColors.length === 1) {
    return { backgroundColor: hexColors[0] };
  } else if (hexColors.length === 2) {
    return { 
      background: `linear-gradient(90deg, ${hexColors[0]} 50%, ${hexColors[1]} 50%)` 
    };
  } else if (hexColors.length >= 3) {
    return {
      background: `linear-gradient(90deg, ${hexColors[0]} 33.3%, ${hexColors[1]} 33.3%, ${hexColors[1]} 66.6%, ${hexColors[2]} 66.6%)`
    };
  }
  return { backgroundColor: '#444' };
};

export const TeamSelector: React.FC<TeamSelectorProps> = ({ onTeamSelected, userImagePreview, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customColors, setCustomColors] = useState('');

  const filteredTeams = TEAMS.filter(team => 
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customColors.trim()) return;

    const newTeam: Team = {
        id: `custom-${Date.now()}`,
        name: customName,
        colors: customColors.split(/[\s,]+/).filter(Boolean)
    };
    onTeamSelected(newTeam);
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto bg-neutral-900/50 rounded-2xl border border-neutral-800 overflow-hidden shadow-2xl backdrop-blur-sm">
      {/* Header of the card */}
      <div className="p-6 border-b border-neutral-800 bg-neutral-900/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <img src={userImagePreview} alt="User" className="w-16 h-16 rounded-full object-cover border-4 border-grass-600 shadow-lg" />
            <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Hangi Takım?</h2>
                <button onClick={onBack} className="text-sm text-grass-400 hover:text-grass-300 underline decoration-dotted">
                    Fotoğrafı Değiştir
                </button>
            </div>
        </div>
        
        <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-neutral-400">🔍</span>
            </div>
            <input 
                type="text" 
                placeholder="Takım ara..." 
                className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-grass-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            
            {/* Existing Teams */}
            {filteredTeams.map((team) => (
                <button 
                    key={team.id} 
                    onClick={() => onTeamSelected(team)}
                    className="group relative overflow-hidden rounded-2xl p-4 h-48 flex flex-col items-center justify-center gap-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-grass-500/10 bg-neutral-800 border border-neutral-700 hover:border-grass-500/50"
                >
                    {/* Background Gradient specific to team color */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-${team.colors[0].toLowerCase()} to-transparent`} />
                    
                    {/* Team Badge Simulation */}
                    <div 
                      className="w-20 h-20 rounded-full shadow-lg border-4 border-white/10 group-hover:border-white/30 transition-colors relative overflow-hidden flex-shrink-0"
                      style={getTeamBadgeStyle(team.colors)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20 pointer-events-none"></div>
                    </div>
                    
                    <div className="flex flex-col items-center z-10 w-full">
                        <span className="text-white font-bold text-center text-sm md:text-base leading-tight line-clamp-2 px-1 group-hover:text-grass-400 transition-colors">
                            {team.name}
                        </span>
                    </div>
                </button>
            ))}

            {/* Custom Team Option at the End */}
            <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative overflow-hidden rounded-2xl p-4 h-48 flex flex-col items-center justify-center gap-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-grass-500/10 bg-neutral-800/50 border-2 border-dashed border-neutral-600 hover:border-grass-400 hover:bg-neutral-800"
            >
                <div className="w-16 h-16 rounded-full bg-neutral-700/50 flex items-center justify-center group-hover:bg-grass-600 transition-colors shadow-inner">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-neutral-300 group-hover:text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-neutral-200 font-bold text-center group-hover:text-white">
                        Başka Takım Yaz
                    </span>
                    <span className="text-xs text-neutral-500 mt-1 group-hover:text-neutral-300">
                        Listede yoksa ekle
                    </span>
                </div>
            </button>

        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 w-full max-w-md relative shadow-2xl">
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <h3 className="text-2xl font-bold text-white mb-1">Özel Takım Oluştur</h3>
                <p className="text-neutral-400 text-sm mb-6">İstediğin takımın adını ve renklerini yaz.</p>
                
                <form onSubmit={handleCustomSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Takım Adı</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Örn: Real Madrid" 
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-grass-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-300 mb-1">Renkler</label>
                        <input 
                            type="text" 
                            required
                            placeholder="Örn: Mor, Beyaz" 
                            value={customColors}
                            onChange={(e) => setCustomColors(e.target.value)}
                            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white outline-none focus:ring-2 focus:ring-grass-500"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="mt-4 w-full py-3.5 bg-grass-600 hover:bg-grass-500 text-white font-bold rounded-xl shadow-lg transition-all"
                    >
                        Formayı Tasarla
                    </button>
                </form>
            </div>
        </div>
      )}

    </div>
  );
};
