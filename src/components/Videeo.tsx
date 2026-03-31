import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

const Videeo = () => {
  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    // Initial state - hidden off-screen
    gsap.set(title, {
      x: 100,
      opacity: 0,
      scale: 0.8,
    });

    // Cinematic entrance animation
    gsap.to(title, {
      x: 0,
      opacity: 1,
      scale: 1,
      duration: 1.5,
      ease: 'power2.out',
      delay: 0.5,
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-50 z-0"
      >
        <source src="/media/hero1.mp4" type="video/mp4" />
      </video>

      {/* Cinematic Title */}
      <div className="absolute bottom-0 left-0 right-0 h-[950px] bg-gradient-to-t from-transparent to-[#080B12] z-5"></div>
      <div
        ref={titleRef}
        className="absolute right-9 top-1/2 transform -translate-y-1/2 z-10 text-right"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 leading-tight">
          <span className="text-red-600"
          style={{ textShadow:'0 0 10px rgba(255,80,80,1.8)' }}>
            Next-Gen
          </span>
          <br />
          <span className="text-white">
            Precision Rendering
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light">
          A 3D Automotive Render Study
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[500px] bg-gradient-to-t from-[#080B12] to-transparent z-5"></div>
      

    </section>
  );
};

export { Videeo };