import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';


const navLinks = [
  { name: 'About', href: '#Hero' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' }
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl bg-[#080B12]/80 border-b border-cyan-400/20 shadow-[0_4px_30px_rgba(0,240,255,0.1)]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 py-12 flex items-center justify-center">

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-1.5xl uppercase tracking-wider text-gray-400 hover:text-cyan-400 transition-colors font-semibold"
                style={{ fontFamily: 'DM Mono, monospace' }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            className="md:hidden text-gray-400 hover:text-violet-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#080B12]/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-5xl font-bold text-gray-400 hover:text-violet-400 transition-all duration-300 hover:scale-110"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                {link.name}
              </a>
            ))}
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
