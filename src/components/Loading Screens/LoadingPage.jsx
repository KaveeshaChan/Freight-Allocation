import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css';

const LoadingPage = () => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing system...');
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/login'), 500);
          return 100;
        }
        
        // Update status text based on progress
        if(prev >= 75) setStatusText('Finalizing setup...');
        else if(prev >= 50) setStatusText('Loading modules...');
        else if(prev >= 25) setStatusText('Verifying credentials...');
        
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0534F0] to-[#98009E] flex flex-col items-center justify-center space-y-8 p-4">
      {/* Animated Logo Container */}
      <div className="animate-float">
        <div className="bg-[#F4F4F4] p-6 rounded-2xl shadow-2xl">
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-[#0534F0] to-[#98009E] text-5xl font-bold tracking-tighter">
            CARGO CONNECT
          </h1>
        </div>
      </div>

      {/* Progress Container */}
      <div className="w-full max-w-2xl space-y-6">
        {/* Status Text */}
        <p className="text-center text-[#F4F4F4] font-medium text-lg animate-pulse">
          {statusText}
        </p>

        {/* Progress Bar */}
        <div className="h-4 bg-[#2C2C2C]/20 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full relative transition-all duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #0534F0 0%, #98009E 100%)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#5F72F3] to-[#C057CB] opacity-50 animate-shine" />
          </div>
        </div>

        {/* Progress Info */}
        <div className="flex justify-between px-2">
          <span className="text-[#00B8D9] text-sm font-semibold">
            Secure Connection Established
          </span>
          <span className="text-[#F4F4F4] font-bold text-lg">
            {progress}%
          </span>
        </div>
      </div>

      {/* Branding Footnote */}
      <p className="absolute bottom-8 text-[#F4F4F4]/80 text-sm">
        Optimizing Your Logistics Experience
      </p>
    </div>
  );
};

export default LoadingPage;