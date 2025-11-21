import React, { useRef, useState } from 'react';

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContainerClick = () => {
    if (!isAgreed) {
      setShowAgreementError(true);
      setTimeout(() => setShowAgreementError(false), 800); // Reset after animation
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto px-4 animate-fade-in-up">
      <div 
        onClick={handleContainerClick}
        className={`w-full aspect-[4/3] md:aspect-video bg-neutral-800/30 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-300 group backdrop-blur-sm shadow-2xl
        ${isAgreed ? 'border-neutral-600 hover:border-grass-500' : 'border-neutral-700 opacity-80 hover:opacity-100'}`}
      >
        <div className="relative">
            <div className={`absolute -inset-4 bg-grass-500/20 rounded-full blur-xl transition-all ${isAgreed ? 'group-hover:bg-grass-500/30' : 'hidden'}`}></div>
            <div className={`w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center transition-colors relative z-10 shadow-lg border ${isAgreed ? 'border-neutral-700 group-hover:border-grass-400 group-hover:bg-grass-600' : 'border-neutral-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-12 h-12 transition-colors ${isAgreed ? 'text-neutral-300 group-hover:text-white' : 'text-neutral-500'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
            </div>
        </div>
        
        <div className="text-center p-4 z-10">
            <h3 className={`text-2xl font-semibold mb-2 transition-colors ${isAgreed ? 'text-white group-hover:text-grass-400' : 'text-neutral-400'}`}>Fotoğrafını Yükle</h3>
            <p className="text-neutral-400 max-w-xs mx-auto">
              Bilgisayarından veya telefonundan net bir portre fotoğrafı seç.
            </p>
        </div>
      </div>

      {/* Agreement Checkbox */}
      <div 
        className={`mt-6 flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 cursor-pointer bg-black/20 backdrop-blur-sm max-w-md
        ${showAgreementError ? 'border-red-500 bg-red-900/20 animate-pulse' : 'border-white/10 hover:bg-black/40'}`}
        onClick={() => {
            setIsAgreed(!isAgreed);
            setShowAgreementError(false);
        }}
      >
        <div className="relative flex items-center mt-0.5">
            <input 
                type="checkbox" 
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-neutral-500 bg-neutral-800 transition-all checked:border-grass-500 checked:bg-grass-500 focus:outline-none"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        </div>
        <label className={`text-xs md:text-sm cursor-pointer select-none leading-relaxed ${showAgreementError ? 'text-red-200' : 'text-neutral-300'}`}>
            Fotoğraflarımın sunucularda kaydedilmediğini biliyor, işlem tamamlandığında silineceğini kabul ediyorum.
        </label>
      </div>

      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};
