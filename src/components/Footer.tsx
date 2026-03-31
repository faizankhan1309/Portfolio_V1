import { Linkedin, Github, Instagram, Dribbble, Heart } from 'lucide-react';



export const Footer = () => {
  return (
    <footer className="relative py-12 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#080B12]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center">
          <h3
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-violet-600 bg-clip-text text-transparent mb-2"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Faizan Khan
          </h3>

          <p className="text-gray-400 mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Where code meets craft. Where logic meets cinema.
          </p>


          <p className="text-gray-500 text-sm font-mono flex items-center justify-center gap-2">
            Designed & Built by Faizan Khan · 2025
          </p>
        </div>
      </div>
    </footer>
  );
};
