/**
 * Research.tsx — Responsive
 * Changes (same pattern as Projects.tsx):
 *  - Bleed thumbnail hidden below xl (1280px) instead of md (768px)
 *  - Section padding uses clamp()
 *  - Heading uses clamp()
 *  - overflow:hidden on section to prevent horizontal scroll
 *  - No card visual changes
 */

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowUpRight, Microscope } from 'lucide-react';

const research = [
  {
    id: 1,
    title: 'Next-Gen Precision Rendering',
    description: 'A 3D automotive rendering study focused on achieving high realism, lighting accuracy, and material precision.',
    category: 'Research', type: 'research',
    tags: ['Blender', 'Rendering', 'Lighting', 'Automotive Visualization', 'commercial'],
    impact: [
      'Exploration of photorealistic rendering techniques',
      'Advanced lighting and material workflows',
      'High-detail automotive visualization',
    ],
    icon: Microscope, link: null, image: 'media/research1.png', badge: null,
  },
  {
    id: 2,
    title: '3D to 4D with Gaussian Splatting',
    description: 'Research on extending Gaussian Splatting from static 3D scenes to dynamic 4D representations.',
    category: 'Research', type: 'research',
    tags: ['Gaussian Splatting', 'NeRF', 'Computer Vision'],
    impact: [
      'Dynamic scene reconstruction research',
      'Real-time rendering exploration',
      'Ongoing experimentation and implementation',
    ],
    icon: Microscope, link: null, image: 'media/research2.png', badge: 'Ongoing',
  },
];

const typeConfig = {
  research: {
    borderColor: 'border-t-amber-400',
    badgeClass:  'bg-amber-400/10 text-amber-400 border-amber-400/20',
    iconClass:   'text-amber-400',
  },
};

export const Research = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="research" className="relative overflow-hidden" style={{
      padding: 'clamp(3rem, 5vw, 5rem) clamp(1rem, 4vw, 1.5rem)',
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1300] via-[#0D1117] to-[#1A1300]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontFamily: 'FuturaCyrillicBold, sans-serif', fontSize: 'clamp(2rem, 6vw, 3.75rem)' }}
          >
            RESEARCH
          </h2>
          <div className="w-28 h-1 bg-amber-400 mx-auto rounded-full" />
        </div>

        {/* Research Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          {research.map((item, index) => {
            const config = typeConfig[item.type as keyof typeof typeConfig];
            const Icon = item.icon;
            const isLeftCol = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={`group relative w-full transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/* CHANGE: hidden xl:block instead of hidden md:block */}
                <img
                  src={item.image} alt="" aria-hidden="true"
                  className="hidden xl:block absolute top-1/2 -translate-y-1/2 h-[90%] w-[350px] object-cover rounded-lg opacity-20 blur-sm z-0 pointer-events-none select-none drop-shadow-[0px_0px_10px_rgba(251,146,60,0.3)]"
                  style={{ [isLeftCol ? 'left' : 'right']: '-250px' }}
                />

                <div className={`relative z-10 h-full flex flex-col bg-[#0F172A] rounded-xl border-t-4 ${config.borderColor} border-x border-b border-gray-800 overflow-hidden hover:-translate-y-1 hover:border-gray-700 transition-all duration-300`}>
                  <div data-card-id={item.id} className="flex flex-col flex-1 p-6 gap-4">

                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <Icon className={`${config.iconClass} shrink-0`} size={24} />
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border uppercase tracking-wider ${config.badgeClass}`}>
                        {item.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-white leading-snug" style={{
                      fontFamily: 'FuturaCyrillicBold, sans-serif',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.875rem)',
                    }}>
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed line-clamp-2" style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                    }}>
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/5 border border-gray-700 rounded-md text-sm font-mono text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Impact */}
                    <div className="border-t border-gray-800 pt-3 mt-auto">
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Impact</p>
                      <ul className="space-y-1">
                        {item.impact.map((bullet) => (
                          <li key={bullet} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="mt-2 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {item.badge && (
                      <div className="pt-2 border-t border-gray-800">
                        <span className="inline-block px-3 py-1 bg-amber-400/10 border border-amber-400/30 rounded-md text-xs font-mono text-amber-300 uppercase tracking-wider">
                          {item.badge}
                        </span>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="pt-2">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
                          Visit Site <ArrowUpRight size={14} />
                        </a>
                      ) : (
                        <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-white transition-colors cursor-default">
                          View Project <ArrowUpRight size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};