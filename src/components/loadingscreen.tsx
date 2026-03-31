import { useEffect, useState } from 'react';

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate near the end
        const increment = prev < 70 ? Math.random() * 8 + 3 : Math.random() * 3 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(onComplete, 700);
      }, 300);
    }
  }, [progress, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: '#060810',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Deep background radial */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, #0d1117 0%, #060810 70%)',
        }}
      />

      {/* Outer slow rotating ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: '0px',
          height: '0px',
          border: '1px solid rgba(220,38,38,0.12)',
          animation: 'spin-slow 8s linear infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: '0px',
          height: '0px',
          border: '1px solid rgba(59,130,246,0.1)',
          animation: 'spin-slow 6s linear infinite reverse',
        }}
      />

      {/* Main glowing blob */}
      <div className="relative flex items-center justify-center" style={{ width: '0px', height: '0px' }}>

        {/* Outer glow — red */}
        <div
          className="absolute rounded-full"
          style={{
            width: '0px',
            height: '0px',
            background: 'radial-gradient(ellipse, rgba(220,38,38,0.25) 0%, transparent 70%)',
            animation: 'pulse-blob 2.4s ease-in-out infinite',
          }}
        />

        {/* Mid glow — blue */}
        <div
          className="absolute rounded-full"
          style={{
            width: '0px',
            height: '0px',
            background: 'radial-gradient(ellipse, rgba(37,99,235,0.3) 0%, transparent 70%)',
            animation: 'pulse-blob 2.4s ease-in-out infinite 0.4s',
          }}
        />


 

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 2 === 0 ? '0px' : '0px',
              height: i % 2 === 0 ? '0px' : '0px',
              background: i % 3 === 0 ? 'rgba(239,68,68,0.8)' : i % 3 === 1 ? 'rgba(96,165,250,0.8)' : 'rgba(255,255,255,0.5)',
              borderRadius: '50%',
              animation: `orbit-${i} ${3 + i * 0.5}s linear infinite`,
              boxShadow: i % 3 === 0 ? '0 0 6px rgba(239,68,68,0.8)' : '0 0 6px rgba(96,165,250,0.8)',
            }}
          />
        ))}
      </div>

      {/* Name */}
      <div className="relative mt-10 text-center">
        
        <p
          className="text-xs tracking-[0.35em] uppercase mt-2"
          style={{ color: 'rgb(255, 255, 255)', fontFamily: 'FuturaCyrillicBold, sans-serif' }}
        >
          Loading.......
        </p>
      </div>

      {/* Progress bar */}
      <div className="relative mt-10 w-48">
        {/* Track */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: '2px', background: 'rgba(255,255,255,0.07)' }}
        >
          {/* Fill */}
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #1d4ed8, #dc2626)',
              boxShadow: '0 0 10px rgba(220,38,38,0.6)',
            }}
          />
        </div>
        {/* Percentage */}
        <p
          className="text-center mt-3 text-xs font-mono"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          {Math.floor(progress)}%
        </p>
      </div>

      <style>{`
        @keyframes pulse-blob {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 60px rgba(220,38,38,0.4), 0 0 120px rgba(37,99,235,0.2); }
          50%       { transform: scale(1.08); box-shadow: 0 0 80px rgba(220,38,38,0.6), 0 0 150px rgba(37,99,235,0.3); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        /* Particle orbits */
        @keyframes orbit-0 {
          from { transform: rotate(0deg)   translateX(90px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
        @keyframes orbit-1 {
          from { transform: rotate(60deg)  translateX(75px) rotate(-60deg); }
          to   { transform: rotate(420deg) translateX(75px) rotate(-420deg); }
        }
        @keyframes orbit-2 {
          from { transform: rotate(120deg) translateX(100px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(100px) rotate(-480deg); }
        }
        @keyframes orbit-3 {
          from { transform: rotate(180deg) translateX(80px) rotate(-180deg); }
          to   { transform: rotate(540deg) translateX(80px) rotate(-540deg); }
        }
        @keyframes orbit-4 {
          from { transform: rotate(240deg) translateX(95px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(95px) rotate(-600deg); }
        }
        @keyframes orbit-5 {
          from { transform: rotate(300deg) translateX(70px) rotate(-300deg); }
          to   { transform: rotate(660deg) translateX(70px) rotate(-660deg); }
        }
      `}</style>
    </div>
  );
};