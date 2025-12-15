import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdTouchApp } from 'react-icons/md';

export const StartScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/loyalty');
  };

  return (
    <div 
      className="h-screen w-full bg-cover bg-center bg-no-repeat relative overflow-hidden cursor-pointer"
      style={{ backgroundImage: 'url(/images/StartScreen.png)' }}
      onClick={handleStart}
    >
      {/* Touch to Order Bar - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-8 flex items-center justify-center gap-4">
        <div className="bg-white rounded-2xl p-4">
          <MdTouchApp className="w-8 h-8 text-gray-900" />
        </div>
        <h1 className="text-3xl sm:text-3xl font-bold text-white">
          Touch to Order
        </h1>
      </div>
    </div>
  );
};
