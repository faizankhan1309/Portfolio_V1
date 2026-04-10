import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Briefcase, Calendar, Rocket, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

const stats = [
  { icon: Briefcase, label: 'Roles', value: 4, suffix: '+' },
  { icon: Calendar, label: 'Years Experience', value: 3, suffix: '+' },
  { icon: Rocket, label: 'Projects', value: 10, suffix: '+' },
  { icon: Trophy, label: 'Leadership Positions', value: 2, suffix: '' },
];

const Counter = ({ end, suffix, isVisible }: { end: number; suffix: string; isVisible: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, isVisible]);

  return (
    <span className="text-4xl font-bold text-white">
      {count}{suffix}
    </span>
  );
};

export const About = () => {
  const { ref, isVisible } = useScrollAnimation(0.3);

  return (
    <section id="about" className="relative py-24 px-6 overflow-hidden">
      {/* Desktop/tablet gradient background — hidden on mobile */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-b from-[#080B16] via-[#0D1117] to-[#000000]" />
      {/* Mobile: plain solid background, no animation */}
      <div className="absolute inset-0 sm:hidden bg-[#000000]" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* ── DESKTOP / TABLET layout (sm and above) ── */}
        <div
          ref={ref}
          className={`hidden sm:grid md:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Profile image */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-red-600/40 rounded-full blur-2xl scale-105" />
              <div
                className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-cyan-400/30"
                style={{ clipPath: 'circle(50% at 50% 50%)' }}
              >
                <img
                  src="/media/profile.png"
                  alt="Profile"
                  className="w-full h-full object-cover scale-11 object-[center_10%] transition-transform duration-700"
                />
              </div>
            </div>
          </div>

          {/* Text content */}
          <div>
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              style={{ fontFamily: 'FuturaCyrillicBold' }}
            >
              Where logic ends,
              creativity finds a way
            </h2>

            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
              <p
                className="text-gray-300 text-lg leading-relaxed pl-6"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                I'm a B.Tech student in Computer Science Engineering with a specialization in Artificial Intelligence and Machine Learning. My core focus lies in building intelligent systems and exploring real-world applications of AI/ML through hands-on projects and continuous learning.

                I'm passionate about problem-solving, model development, and automation using Python and machine learning frameworks. Driven by curiosity and a growth mindset, I'm always eager to explore emerging technologies and collaborate on impactful AI-based solutions.
              </p>
            </div>
          </div>
        </div>

        {/* ── MOBILE layout (below sm) — static, centered ── */}
        <div className="sm:hidden flex flex-col items-center gap-8 text-center">
          {/* Profile image — centered circle */}
          <div className="relative w-52 h-52 flex-shrink-0">
            <div
              className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden border-2 border-cyan-400/30"
              style={{ clipPath: 'circle(50% at 50% 50%)' }}
            >
              <img
                src="/media/profile.png"
                alt="Profile"
                className="w-full h-full object-cover scale-110 object-[center_10%]"
              />
            </div>
          </div>

          {/* Heading */}
          <h2
            className="text-3xl font-bold text-white leading-tight px-2"
            style={{ fontFamily: 'FuturaCyrillicBold' }}
          >
            Where logic ends,<br />
            creativity finds a way
          </h2>

          {/* Bio text */}
          <div className="relative w-full px-2">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-red-600 rounded-full" />
            <p
              className="text-gray-300 text-base leading-relaxed pl-4 text-left"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              I'm a B.Tech student in Computer Science Engineering with a specialization in Artificial Intelligence and Machine Learning. My core focus lies in building intelligent systems and exploring real-world applications of AI/ML through hands-on projects and continuous learning.
            </p>
            <p
              className="text-gray-300 text-base leading-relaxed pl-4 text-left mt-3"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              I'm passionate about problem-solving, model development, and automation using Python and machine learning frameworks. Driven by curiosity and a growth mindset, I'm always eager to explore emerging technologies and collaborate on impactful AI-based solutions.
            </p>
          </div>
        </div>

        {/* Stats grid — shared across all breakpoints */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative backdrop-blur-xl bg-white/5 rounded-xl p-4 sm:p-6 border border-violet-400/20 hover:border-red-400/50 transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 to-violet-600/0 group-hover:from-violet-500/10 group-hover:to-violet-600/10 rounded-xl transition-all duration-500" />
              <div className="relative">
                <stat.icon className="text-red-400 mb-3" size={28} />
                <Counter end={stat.value} suffix={stat.suffix} isVisible={isVisible} />
                <p className="text-gray-400 text-sm mt-1 font-mono">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};