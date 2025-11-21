import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { TeamSelector } from './components/TeamSelector';
import { ResultView } from './components/ResultView';
import { AppStep, Team } from './types';
import { generateJerseyImage } from './services/geminiService';

function App() {
  const [step, setStep] = useState<AppStep>('UPLOAD');
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Counter for social proof
  const [totalCount, setTotalCount] = useState(24593);

  useEffect(() => {
    // Simulate dynamic counter update on mount
    setTotalCount(prev => prev + Math.floor(Math.random() * 500));
  }, []);

  const handleImageSelected = (base64: string) => {
    setUserImage(base64);
    setStep('SELECT_TEAM');
  };

  const handleTeamSelected = async (team: Team) => {
    if (!userImage) return;
    setSelectedTeam(team);
    setStep('GENERATING');
    setError(null);

    try {
      // Try to fetch the logo if url exists, otherwise pass undefined
      let logoBase64 = undefined;
      if (team.logoUrl) {
        try {
            const response = await fetch(team.logoUrl);
            if (response.ok) {
                const blob = await response.blob();
                logoBase64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
            }
        } catch (e) {
            console.warn("Logo could not be loaded, proceeding without it.", e);
        }
      }

      const result = await generateJerseyImage(userImage, team.name, team.colors, logoBase64);
      setGeneratedImage(result);
      setStep('RESULT');
      // Increment counter
      setTotalCount(prev => prev + 1);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
      setStep('SELECT_TEAM');
    }
  };

  const handleReset = () => {
    setStep('UPLOAD');
    setUserImage(null);
    setSelectedTeam(null);
    setGeneratedImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col text-white font-sans relative overflow-hidden">
      {/* Background Image - Green Pitch focus */}
      <div className="fixed inset-0 z-0">
         <img 
           src="https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2564&auto=format&fit=crop" 
           alt="Stadium Pitch Background" 
           className="absolute w-full h-full object-cover"
         />
         {/* Overlays for readability */}
         <div className="absolute inset-0 bg-pitch/80 backdrop-blur-[2px]"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
      </div>
      
      <Header onLogoClick={handleReset} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
        
        {error && (
            <div className="w-full max-w-md mb-6 p-4 bg-red-900/80 border border-red-700 text-red-100 rounded-xl text-center animate-pulse shadow-lg backdrop-blur-md">
                {error}
            </div>
        )}

        <div className="w-full transition-all duration-500 ease-in-out">
            {step === 'UPLOAD' && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 text-white drop-shadow-xl tracking-tight leading-tight">
                        Sahaya Çıkmaya <br className="hidden md:block"/>Hazır Mısın?
                    </h2>
                    <ImageUpload onImageSelected={handleImageSelected} />
                </div>
            )}

            {step === 'SELECT_TEAM' && userImage && (
                <div className="h-[75vh] md:h-auto">
                    <TeamSelector 
                        onTeamSelected={handleTeamSelected} 
                        userImagePreview={userImage}
                        onBack={() => setStep('UPLOAD')}
                    />
                </div>
            )}

            {step === 'GENERATING' && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-fade-in bg-black/40 rounded-3xl backdrop-blur-md border border-white/10 max-w-2xl mx-auto shadow-2xl">
                    <div className="w-32 h-32 relative mb-8">
                        <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-grass-500 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">
                            ⚽
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Transfer Görüşmeleri Başladı...</h2>
                    <p className="text-neutral-300 text-lg">Yapay zeka, seni <strong>{selectedTeam?.name}</strong> renklerine bağlıyor.</p>
                </div>
            )}

            {step === 'RESULT' && generatedImage && (
                <div className="w-full flex justify-center">
                    <ResultView 
                        generatedImage={generatedImage} 
                        selectedTeam={selectedTeam} 
                        onReset={handleReset}
                    />
                </div>
            )}
        </div>
      </main>

      <footer className="w-full p-6 mt-auto border-t border-white/5 bg-black/40 backdrop-blur-md z-10 flex flex-col items-center justify-center gap-4">
        {/* Counter Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md shadow-lg hover:bg-black/60 transition-colors cursor-default group">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-grass-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-grass-500 group-hover:bg-grass-400 transition-colors"></span>
            </span>
            <span className="text-neutral-300 text-sm md:text-base font-medium">
                Şu ana kadar <span className="text-white font-bold text-lg mx-1">{totalCount.toLocaleString('tr-TR')}</span> forma tasarlandı
            </span>
        </div>

        {/* Email Link */}
        <div className="flex flex-col items-center gap-1">
            <a href="mailto:futbolcusensin@gmail.com" className="text-neutral-400 hover:text-grass-400 transition-colors text-sm font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                futbolcusensin@gmail.com
            </a>
            <p className="text-center text-neutral-500 text-xs">© {new Date().getFullYear()} Futbolcu Sensin - Yapay Zeka Destekli Forma Uygulaması</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
