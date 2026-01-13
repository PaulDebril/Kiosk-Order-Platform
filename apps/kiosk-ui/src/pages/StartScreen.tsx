import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdTouchApp } from 'react-icons/md';
import startScreenBg from '/images/StartScreen.png';

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/loyalty');
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden cursor-pointer group"
      style={{ backgroundImage: `url(${startScreenBg})` }}
      onClick={handleStart}
    >
      <div className="absolute inset-0 bg-stone-900/40 group-hover:bg-stone-900/30 transition-all duration-700" />

      {/* Restaurant Title - Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center mb-32">
        <h1 className="text-9xl font-black text-white tracking-tighter drop-shadow-2xl font-serif">
          ZEN<span className="text-primary-500">ITO</span>
        </h1>
        <div className="h-1 w-32 bg-primary-500 my-6 rounded-full" />
        <p className="text-3xl text-stone-200 font-light tracking-[0.5em] uppercase text-shadow-lg">
          Art Culinaire Japonais
        </p>
      </div>

      {/* Touch to Order Bar - Fixed at bottom */}
      <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center">
        <div className="glass-panel px-12 py-6 rounded-full flex items-center gap-6 shadow-2xl transform group-hover:scale-105 transition-all duration-300">
          <div className="bg-primary-600 rounded-full p-4 animate-pulse">
            <MdTouchApp className="w-8 h-8 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white tracking-wide uppercase">
              Commander Ici
            </h1>
            <span className="text-stone-300 text-sm tracking-[0.2em] uppercase">Touchez l'écran</span>
          </div>
        </div>
      </div>
    </div>
  );
};
