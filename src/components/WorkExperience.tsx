/**
 * WorkExperience.tsx — Responsive
 * Changes:
 *  - Master-detail grid: 2-col on desktop, stacks to 1-col on mobile
 *    (already handled by md:grid-cols-[5fr_8fr]; verified and kept)
 *  - Section padding uses clamp()
 *  - Heading uses clamp()
 *  - Detail card has min-height:0 so it never forces overflow on small screens
 *  - No animation or visual changes
 */

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Briefcase, Calendar, Rocket, Trophy } from 'lucide-react';
import { useState } from 'react';

interface Experience {
  id: number; role: string; company: string; type: string | null;
  duration: string; initials: string; tags: string[];
  highlight: string; points: string[];
}

const experiences: Experience[] = [
  {
    id: 3, role: 'Asset Development Lead', company: 'REFFTO', type: null,
    duration: 'Apr 2024 - Jun 2024', initials: 'RF',
    tags: ['Blender', '3D Rendering', 'Pipeline', 'Team Lead'],
    highlight: 'Led Blender-based rendering workflows for the asset development pipeline.',
    points: [
      'Led end-to-end 3D rendering workflows in Blender, from initial modeling through final output for production use.',
      'Defined pipeline standards that improved consistency and reduced revision cycles across the team.',
      'Optimized render settings and workflow processes to significantly improve asset turnaround time.',
      'Reviewed and quality-checked team output before delivery, ensuring all assets met project requirements.',
    ],
  },
  {
    id: 1, role: 'Google Cloud Arcade Facilitator', company: 'Google', type: 'Program 2025',
    duration: '2025', initials: 'GC',
    tags: ['Cloud Computing', 'GCP', 'Community', 'Mentorship'],
    highlight: 'Guided students through Google Cloud skill badges and hands-on labs.',
    points: [
      'Facilitated the Google Cloud Arcade program, helping students earn skill badges and complete hands-on Google Cloud labs.',
      'Mentored participants through cloud fundamentals, including compute, storage, networking, and machine learning on GCP.',
      'Tracked milestone completions and provided support to ensure high completion rates across the cohort.',
      'Acted as the primary point of contact between program participants and Google Cloud resources.',
    ],
  },
  {
    id: 6, role: 'Co-founder', company: 'Pixel Room - LNCT Bhopal', type: null,
    duration: '2025 - Present', initials: 'PR',
    tags: ['Community Building', 'Gaming', 'Events', 'Leadership'],
    highlight: 'Co-founded the first gaming community at LNCT Bhopal.',
    points: [
      'Co-founded Pixel Room, the first dedicated student gaming community at LNCT Bhopal, building it from the ground up.',
      'Organized gaming events, tournaments, and community meetups that brought together students across departments.',
      'Managed community growth strategy, onboarding members and establishing community guidelines and culture.',
      'Built partnerships with student organizations and college administration to secure resources and event spaces.',
    ],
  },
  {
    id: 5, role: 'Junior Manager', company: 'AIESEC in India', type: null,
    duration: 'Feb 2025 - Apr 2025', initials: 'AI',
    tags: ['Business Development', 'Sponsorship', 'National Level', 'Strategy'],
    highlight: 'Drove national-level sponsorship and business development.',
    points: [
      'Drove business development and sponsorship acquisition efforts at the national level for AIESEC in India.',
      'Identified strategic partnership opportunities and prepared customized sponsorship proposals for corporate targets.',
      'Coordinated with regional teams to align outreach strategies and share leads across the national network.',
      'Contributed to growing the sponsorship portfolio by converting cold outreach into confirmed partnerships.',
    ],
  },
  {
    id: 7, role: 'Company Representative', company: 'Trikaya', type: 'Internship',
    duration: 'Oct 2025 - Present', initials: 'TK',
    tags: ['Remote', 'Brand Representation', 'Communication', 'Internship'],
    highlight: 'Remote brand representative managing external company communications.',
    points: [
      'Represented Trikaya in a remote capacity, acting as a primary external point of contact for clients and partners.',
      'Facilitated clear communication between internal teams and external stakeholders to maintain project alignment.',
      'Ensured brand voice and messaging consistency across all external-facing interactions and materials.',
      'Supported business operations remotely, contributing to client relationship management and follow-up processes.',
    ],
  },
];

export const WorkExperience = () => {
  const { ref, isVisible } = useScrollAnimation(0.2);
  const [selectedId, setSelectedId] = useState(1);
  const [animKey,    setAnimKey]    = useState(1);

  const selected = experiences.find((e) => e.id === selectedId);

  function handleSelect(id: number) {
    if (id === selectedId) return;
    setSelectedId(id);
    setAnimKey((k) => k + 1);
  }

  return (
    <section id="work-experience" className="relative overflow-hidden" style={{
      padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 4vw, 1.5rem)',
    }}>
      <div className="absolute inset-0 bg-[#0D1117]" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto">

        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-sm font-medium tracking-widest uppercase text-red-600/70 mb-4"
            style={{ fontFamily: 'Outfit, sans-serif' }}>
            My Professional Journey
          </p>
          <h2 className="font-bold text-white mb-4" style={{
            fontFamily: 'FuturaCyrillicBold, sans-serif',
            fontSize: 'clamp(2rem, 6vw, 3.75rem)',
          }}>
            Work Experience
          </h2>
          <div className="w-32 h-1 bg-red-600 mx-auto rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
        </div>

        {/* Master-Detail Layout */}
        <div className={`grid grid-cols-1 md:grid-cols-[5fr_8fr] gap-5 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

          {/* LEFT — Job List */}
          <div className="flex flex-col gap-2">
            {experiences.map((exp, index) => {
              const isActive = exp.id === selectedId;
              return (
                <button
                  key={exp.id}
                  onClick={() => handleSelect(exp.id)}
                  className={`w-full text-left flex items-center gap-4 px-4 py-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'backdrop-blur-xl bg-white/[0.07] border-blue-400/40 opacity-100 shadow-[0_0_20px_rgba(255,0,0,0.07)]'
                      : 'bg-white/[0.02] border-white/[0.06] opacity-70 hover:opacity-100 hover:bg-white/[0.05] hover:border-white/20'
                  }`}
                  style={{ transitionDelay: isVisible ? `${index * 50}ms` : '0ms' }}
                >
                  <span className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-[0_0_14px_rgba(0,240,255,0.45)]' : 'bg-white/10'
                  }`}>
                    {exp.initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-base font-semibold truncate transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-300'}`}
                      style={{ fontFamily: 'FuturaCyrillicBold, sans-serif' }}>
                      {exp.role}
                    </p>
                    <p className={`text-sm truncate mt-0.5 transition-colors duration-300 ${isActive ? 'text-red-400' : 'text-gray-500'}`}
                      style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {exp.company}
                    </p>
                  </div>
                  {isActive && <span className="flex-shrink-0 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(255,0,0,0.9)]" />}
                </button>
              );
            })}
          </div>

          {/* RIGHT — Detail Card */}
          {/* CHANGE: added min-h-0 overflow-hidden so card doesn't blow out on mobile */}
          <div className="min-h-0">
            {selected && (
              <div
                key={animKey}
                className="backdrop-blur-xl bg-white/[0.05] rounded-2xl border border-red-400/20 p-8 hover:border-red-400/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,0,0,0.08)]"
                style={{ animation: 'weSlideIn 0.3s cubic-bezier(0.16,1,0.3,1) both' }}
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-start gap-4 mb-2">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-base font-bold text-white shadow-[0_0_24px_rgba(255,0,0,0.4)]">
                    {selected.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white leading-tight" style={{
                      fontFamily: 'FuturaCyrillicBold, sans-serif',
                      fontSize: 'clamp(1.2rem, 2.5vw, 1.875rem)',
                    }}>
                      {selected.role}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-red-400 font-semibold text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {selected.company}
                      </span>
                      {selected.type && (
                        <span className="px-3 py-1 bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 font-mono text-xs">
                          {selected.type}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="hidden sm:block flex-shrink-0 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 font-mono text-sm whitespace-nowrap">
                    {selected.duration}
                  </span>
                </div>

                {/* Duration — mobile */}
                <div className="sm:hidden mb-4 mt-2">
                  <span className="px-3 py-1.5 bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-300 font-mono text-xs inline-block">
                    {selected.duration}
                  </span>
                </div>

                {/* Highlight */}
                <p className="text-base text-gray-400 italic mt-4 mb-5 pl-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {selected.highlight}
                </p>

                <div className="w-full h-px bg-gradient-to-r from-cyan-400/25 via-violet-500/25 to-transparent mb-6" />

                {/* Points */}
                <ul className="space-y-4 mb-7">
                  {selected.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-[10px] w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
                      <p className="text-gray-300 leading-relaxed text-base" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {point}
                      </p>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-5 border-t border-white/[0.07]">
                  {selected.tags.map((tag) => (
                    <span key={tag}
                      className="px-3 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300/80 text-sm font-medium"
                      style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes weSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </section>
  );
};