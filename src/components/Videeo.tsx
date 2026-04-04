/**
 * Videeo.tsx — Responsive
 * Changes:
 *  - Title text uses clamp() — was fixed 6xl/8xl
 *  - Subtitle font uses clamp()
 *  - right-9 positioning replaced with responsive padding so text
 *    doesn't hug the edge on small screens
 *  - max-width added so long lines don't bleed on wide screens
 *  - No animation or visual changes
 */

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const Videeo = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    gsap.set(title, { x: 100, opacity: 0, scale: 0.8 });
    gsap.to(title, { x: 0, opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out', delay: 0.5 });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover opacity-50 z-0">
        <source src="/media/hero1.mp4" type="video/mp4" />
      </video>

      {/* CHANGE: was absolute right-9 with fixed font sizes → fluid responsive positioning */}
      <div
        ref={titleRef}
        className="absolute z-10 text-right"
        style={{
          right: 'clamp(1rem, 5vw, 2.25rem)',
          top: '50%',
          transform: 'translateY(-50%)',
          maxWidth: 'min(700px, 90vw)',
        }}
      >
        <h1 className="font-bold text-white mb-4 leading-tight" style={{
          fontSize: 'clamp(2.5rem, 7vw, 5rem)',
        }}>
          <span className="text-red-600" style={{ textShadow: '0 0 10px rgba(255,80,80,1.8)' }}>
            Next-Gen
          </span>
          <br />
          <span className="text-white">Precision Rendering</span>
        </h1>
        {/* CHANGE: fluid subtitle */}
        <p className="text-gray-300 font-light" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
          A 3D Automotive Render Study
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#080B12] to-transparent z-5" />
    </section>
  );
};

export { Videeo };