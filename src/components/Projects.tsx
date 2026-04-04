/**
 * Projects.tsx — Responsive
 * Changes:
 *  - Floating side thumbnail (-250px absolute) hidden below 1280px (was only md:block ~768px
 *    but at tablet widths it still caused overflow). Hidden at <1280px via media-class swap.
 *  - Section padding uses clamp()
 *  - Heading uses clamp()
 *  - Grid stays 2-col on tablet, 1-col on mobile (existing behavior unchanged)
 *  - overflow:hidden added to section so the bleed images can't cause horizontal scroll
 *  - No card visual changes
 */

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ArrowUpRight, Brain, Map, Briefcase, CalendarDays, Box, Plane } from 'lucide-react';

const projects = [
  {
    id: 1,
    title: 'Indoor Navigation System',
    description: 'AI-powered indoor navigation for Indian Railways using A* and Dijkstra pathfinding algorithms.',
    category: 'AI', type: 'ai',
    tags: ['Python', 'Mapbox', 'Leaflet', 'AI', 'Pathfinding'],
    impact: ['Real-time positioning inside complex stations', 'Improved route accuracy', 'Scalable indoor mapping'],
    icon: Map, link: null, image: 'media/indoor.png',
  },
  {
    id: 8,
    title: 'FloatChat',
    description: 'AI-powered conversational platform to query and visualize complex oceanographic datasets using natural language.',
    category: 'AI', type: 'ai',
    tags: ['LLM', 'NLP', 'Data Visualization', 'AI'],
    impact: ['Simplified access to complex ocean data', 'Enabled natural language querying', 'Centralized data exploration platform'],
    icon: Brain, link: null, image: 'media/floatchat.jpg',
  },
  {
    id: 4,
    title: 'AI Sentiment Analyzer',
    description: 'NLP model for real-time emotion detection and classification in customer feedback.',
    category: 'AI', type: 'ai',
    tags: ['Python', 'TensorFlow', 'NLP', 'Flask'],
    impact: ['Real-time sentiment classification', 'Business intelligence insights'],
    icon: Brain, link: null, image: 'media/emotion.svg',
  },
  {
    id: 3,
    title: 'Local Events & Volunteering',
    description: 'Community platform connecting users with local events, RSVPs, and volunteering opportunities.',
    category: 'Web', type: 'web',
    tags: ['React', 'Web App', 'Community'],
    impact: ['Increased community engagement', 'Simplified event discovery'],
    icon: CalendarDays, link: 'https://eventsphere-lemon.vercel.app', image: 'media/event.png',
  },
  {
    id: 2,
    title: 'Career Assistance Platform',
    description: 'Web platform for career assessment, job matching, and structured interview preparation.',
    category: 'Web', type: 'web',
    tags: ['React', 'Node.js', 'MongoDB'],
    impact: ['Personalized career insights', 'Structured job prep workflow'],
    icon: Briefcase, link: null,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&q=60',
  },
  {
    id: 5,
    title: '3D Product Visualization',
    description: 'Photorealistic drone renders for REFFTO marketing campaigns using Blender Cycles.',
    category: '3D', type: 'design',
    tags: ['Blender', 'Cycles', '3D Modeling'],
    impact: ['High-quality marketing visuals', 'Improved product presentation'],
    icon: Box, link: null, image: 'media/3d.jpg',
  },
  {
    id: 6,
    title: 'Drone Flight Simulator',
    description: 'Interactive 3D environment for realistic drone product demos and walkthroughs.',
    category: '3D', type: 'design',
    tags: ['Blender', 'Unity', 'C#'],
    impact: ['Realistic simulation experience', 'Product demonstration tool'],
    icon: Plane, link: null,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&q=60',
  },
  {
    id: 7,
    title: 'Portfolio Website',
    description: 'Personal portfolio website showcasing projects, 3D work, and development skills with a modern UI and interactive design.',
    category: 'Web', type: 'web',
    tags: ['React', 'TailwindCSS', 'Framer Motion'],
    impact: ['Showcases technical and creative work in one place', 'Optimized UI for clarity and engagement', 'Responsive and performance-focused design'],
    icon: Briefcase, link: null, image: 'media/port.png',
  },
  {
    id: 9,
    title: 'More Projects Coming...',
    description: 'Some projects are currently in progress and will be added soon. Stay tuned for updates.',
    category: 'wip', type: 'wip',
    tags: ['Work in Progress'],
    impact: ['Ongoing development', 'New features being built', 'Will be updated soon'],
    icon: Briefcase, link: null, image: 'media/coming.png',
  },
];

const typeConfig: Record<string, { borderColor: string; badgeClass: string; iconClass: string }> = {
  ai:     { borderColor: 'border-t-red-400',    badgeClass: 'bg-red-400/10 text-red-400 border-red-400/20',         iconClass: 'text-cyan-400'   },
  web:    { borderColor: 'border-t-blue-400',   badgeClass: 'bg-blue-400/10 text-blue-400 border-blue-400/20',      iconClass: 'text-amber-400'  },
  design: { borderColor: 'border-t-violet-500', badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/20',iconClass: 'text-violet-400' },
  wip:    { borderColor: 'border-t-green-500',  badgeClass: 'bg-green-500/10 text-green-400 border-green-500/20',   iconClass: 'text-green-400'  },
};

export const Projects = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section id="projects" className="relative overflow-hidden" style={{
      padding: 'clamp(3rem, 5vw, 5rem) clamp(1rem, 4vw, 1.5rem)',
    }}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#080B12] via-[#0D1117] to-[#080B12]" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto">

        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2
            className="font-bold text-white mb-4"
            style={{ fontFamily: 'FuturaCyrillicBold, sans-serif', fontSize: 'clamp(2rem, 6vw, 3.75rem)' }}
          >
            SELECTED PROJECTS
          </h2>
          <div className="w-28 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-9">
          {projects.map((project, index) => {
            const config = typeConfig[project.type];
            const Icon = project.icon;
            const isLeftCol = index % 2 === 0;

            return (
              <div
                key={project.id}
                className={`group relative w-full transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                {/*
                  CHANGE: was `hidden md:block` (shows at 768px) → `hidden xl:block` (shows at 1280px).
                  At tablet widths the bleed thumbnail caused horizontal overflow;
                  only reveal it on wide desktop where there's room.
                */}
                <img
                  src={project.image} alt="" aria-hidden="true"
                  className="hidden xl:block absolute top-1/2 -translate-y-1/2 h-[90%] w-[350px] object-cover rounded-lg opacity-60 z-0 pointer-events-none select-none drop-shadow-[0px_0px_10px_rgba(255,0,0,0.6)]"
                  style={{ [isLeftCol ? 'left' : 'right']: '-250px' }}
                />

                <div className={`relative z-10 h-full flex flex-col bg-[#0F172A] rounded-xl border-t-4 ${config.borderColor} border-x border-b border-gray-800 overflow-hidden hover:-translate-y-1 hover:border-gray-700 transition-all duration-300`}>
                  <div data-card-id={project.id} className="flex flex-col flex-1 p-6 gap-4">

                    {/* Top row */}
                    <div className="flex items-center justify-between">
                      <Icon className={`${config.iconClass} shrink-0`} size={0} />
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono border uppercase tracking-wider ${config.badgeClass}`}>
                        {project.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-white leading-snug" style={{
                      fontFamily: 'FuturaCyrillicBold, sans-serif',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.875rem)',
                    }}>
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed line-clamp-2" style={{
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
                    }}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-3 py-1 bg-white/5 border border-gray-700 rounded-md text-sm font-mono text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Impact */}
                    <div className="border-t border-gray-800 pt-3 mt-auto">
                      <p className="text-xm font-mono text-gray-400 uppercase tracking-wider mb-2">Impact</p>
                      <ul className="space-y-1">
                        {project.impact.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sl text-gray-300">
                            <span className="mt-2 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA */}
                    <div className="pt-2">
                      {project.link ? (
                        <a href={project.link} target="_blank" rel="noopener noreferrer"
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