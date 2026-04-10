import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'About', href: '#Hero' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Gallery', href: '#gallery' }
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500"
        style={{
          transform: isScrolled ? 'translate(-50%, 0)' : 'translate(-50%, 10px)',
          opacity: 1
        }}
      >
        <nav 
          className="inline-flex items-center gap-6 p-2 lg:pl-8 rounded-full backdrop-blur-xl shadow-2xl transition-all duration-300"
          style={{
            background: 'rgba(16, 16, 18, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)'
          }}
        >
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6 px-8 py-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors tracking-wide"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Right Email/Contact Pill */}
          <a
            href="#contact"
            className="hidden lg:flex items-center justify-center px-8 h-12 bg-white text-black rounded-full hover:scale-105 transition-transform duration-300 flex-shrink-0 cursor-pointer shadow-[inset_0_-2px_6px_rgba(0,0,0,0.2)]"
            style={{ fontFamily: 'Outfit, sans-serif' }}
          >
            <span className="text-sm font-bold tracking-wide uppercase">Contact</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden w-12 h-12 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Fullscreen Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#000000]/95 backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-5xl font-bold text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
                style={{
                  fontFamily: 'FuturaCyrillicBold, sans-serif',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl mt-8 px-10 py-4 bg-white text-black rounded-full font-bold uppercase hover:scale-105 transition-transform"
              style={{ fontFamily: 'Outfit, sans-serif', animation: `fadeInUp 0.5s ease-out 0.6s both` }}
            >
              Contact
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};
