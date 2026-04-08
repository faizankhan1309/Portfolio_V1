/**
 * WorkExperience.tsx — Image 2 Reference
 *
 * Desktop (≥1024px):
 *   LEFT: Full-height building column — one floor per experience, spans the entire section.
 *         The active floor glows with that experience's accent color.
 *         Floor numbers labelled on the right side of the building (05F, 04F, … 01F)
 *         Building has: antenna at top, multiple floor windows, concrete ground at bottom.
 *   RIGHT: Stacked experience cards that fill the whole right area.
 *          IntersectionObserver updates the active floor as cards enter viewport.
 *
 * Mobile (<1024px): Timeline line + stacked cards
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useIsMobile } from '../hooks/useIsMobile';

interface Experience {
  id: number; role: string; company: string; type: string | null;
  location: string; duration: string; initials: string;
  tags: string[]; points: string[];
  accent: string; glow: string; isPresent: boolean;
}

const experiences: Experience[] = [
  {
    id: 7, role: 'Company Representative', company: 'Trikaya', type: 'Internship',
    location: 'Remote', duration: 'Oct 2025 – Dec 2025', initials: 'TR',
    accent: '#f59e0b', glow: 'rgba(245,158,11,', isPresent: false,
    tags: ['Events', 'Business Dev', 'Networking'],
    points: ['Represented Trikaya at events, organized Hack2Hire Hackathon 2025, managed partnerships'],
  },
  {
    id: 1, role: 'Cloud Arcade Facilitator', company: 'Google Cloud', type: 'Program 2025',
    location: 'Remote', duration: 'Apr 2025 – Oct 2025', initials: 'GC',
    accent: '#4ade80', glow: 'rgba(74,222,128,', isPresent: false,
    tags: ['Cloud', 'AI', 'Education', 'GCP'],
    points: ['Facilitated GCP learning programs, guided 100+ students through Google Cloud certifications, organized AI Showcase events'],
  },
  {
    id: 5, role: 'Junior Manager', company: 'AIESEC', type: null,
    location: 'Bhopal', duration: 'Jan 2025 – Present', initials: 'AI',
    accent: '#818cf8', glow: 'rgba(129,140,248,', isPresent: true,
    tags: ['Leadership', 'International', 'NGO'],
    points: ['Managed international youth exchange projects, coordinated with global partners, led campus outreach'],
  },
  {
    id: 6, role: 'Co-founder', company: 'Pixel Room', type: 'LNCT Bhopal',
    location: 'Bhopal', duration: '2025 – Present', initials: 'PR',
    accent: '#2dd4bf', glow: 'rgba(45,212,191,', isPresent: true,
    tags: ['Community', 'Gaming', 'Events', 'Leadership'],
    points: ['First student gaming community at LNCT, organized tournaments & meetups, managed community growth'],
  },
  {
    id: 3, role: 'Asset Development Lead', company: 'REFFTO', type: null,
    location: 'Remote', duration: 'Apr 2024 – Jun 2024', initials: 'RF',
    accent: '#f87171', glow: 'rgba(248,113,113,', isPresent: false,
    tags: ['Blender', '3D Rendering', 'Pipeline', 'Team Lead'],
    points: ['End-to-end 3D rendering in Blender, pipeline standards reducing revision cycles, optimized render settings'],
  },
];

/* ══ BUILDING COLUMN ═════════════════════════════════════════════════════
   Renders as a tall flex column that matches the full card-list height.
   Each floor is a flex item that grows to fill its share of the height.
 ══════════════════════════════════════════════════════════════════════ */
const Building = ({ activeIdx, totalHeight }: { activeIdx: number; totalHeight: number }) => {
  const BUILDING_W = 150;
  const LABEL_W = 66
  const total = experiences.length;

  // Each floor height = totalHeight / total (minus a gap)
  const GAP = 8;
  const floorH = totalHeight > 0 ? Math.max(60, (totalHeight - (total - 1) * GAP) / total) : 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: BUILDING_W + LABEL_W + 8 }}>

      {/* Antenna */}
      

      {/* Floors top-to-bottom (index 0 = newest = top floor) */}
      {experiences.map((exp, i) => {
        const isActive = i === activeIdx;
        const floorNum = total - i; // 05, 04, 03 … label
        return (
          <div key={exp.id} style={{ display: 'flex', alignItems: 'center', marginBottom: i < total - 1 ? GAP : 0 }}>
            {/* Floor block */}
            <div style={{
              width: BUILDING_W,
              height: floorH,
              borderRadius: 4,
              background: isActive
                ? `linear-gradient(135deg, ${exp.accent}28, ${exp.accent}10)`
                : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isActive ? exp.accent + '66' : 'rgba(255,255,255,0.09)'}`,
              boxShadow: isActive ? `0 0 22px ${exp.glow}0.22), inset 0 0 14px ${exp.glow}0.06)` : 'none',
              transition: 'all 0.45s ease',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 6,
              padding: '0 10px',
            }}>
              {/* Top accent bar */}
              {isActive && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${exp.accent}, transparent)`, borderRadius: '4px 4px 0 0' }} />
              )}
              {/* 2 rows of 3 windows */}
              {[0, 1].map(row => (
                <div key={row} style={{ display: 'flex', gap: 7, justifyContent: 'center' }}>
                  {[0, 1, 2].map(col => (
                    <div key={col} style={{
                      width: 18, height: row === 0 ? 12 : 9,
                      borderRadius: 2,
                      background: isActive ? exp.accent + 'cc' : 'rgba(255,255,255,0.08)',
                      boxShadow: isActive ? `0 0 6px ${exp.glow}0.6)` : 'none',
                      transition: 'all 0.4s ease',
                    }} />
                  ))}
                </div>
              ))}
              {/* Initials on active */}
              {isActive && (
                <div style={{
                  position: 'absolute', bottom: 4, right: 6,
                  fontFamily: 'monospace', fontSize: '0.52rem',
                  color: exp.accent, letterSpacing: '0.06em', opacity: 0.75,
                }}>
                  {exp.initials}
                </div>
              )}
            </div>

            {/* Floor label */}
            <div style={{
              width: LABEL_W, paddingLeft: 6,
              fontFamily: 'monospace', fontSize: '0.62rem',
              color: isActive ? exp.accent : 'rgba(255,255,255,0.22)',
              letterSpacing: '0.06em',
              transition: 'color 0.35s',
              whiteSpace: 'nowrap' as const,
            }}>
              {String(floorNum).padStart(2,'0')}F
            </div>
          </div>
        );
      })}

      {/* Ground slab */}
      <div style={{ width: BUILDING_W, height: 8, background: 'rgba(255,255,255,0.10)', borderRadius: 3, marginTop: 4 }} />
    </div>
  );
};

/* ══ EXPERIENCE CARD ═════════════════════════════════════════════════════ */
const ExperienceCard = ({
  exp, index, cardRef,
}: {
  exp: Experience; index: number; cardRef: (el: HTMLDivElement | null) => void;
}) => {
  const innerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    cardRef(el);
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [cardRef]);

  return (
    <div
      ref={innerRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '0.85rem',
        background: hovered ? 'rgba(255,255,255,0.055)' : 'rgba(255,255,255,0.028)',
        border: `1px solid ${hovered ? exp.glow + '0.35)' : 'rgba(240, 3, 3, 0.08)'}`,
        borderLeft: `3px solid ${hovered ? exp.accent : exp.accent + '55'}`,
        boxShadow: hovered ? `0 8px 40px rgba(0,0,0,0.5), 0 0 1px ${exp.glow}0.12)` : '0 4px 16px rgba(0,0,0,0.25)',
        padding: 'clamp(1.1rem,2.2vw,1.6rem)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.55s ease ${index * 90}ms, transform 0.55s ease ${index * 90}ms, border-color 0.25s, box-shadow 0.25s`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.9rem', marginBottom: '1.75rem' }}>
        {/* Avatar */}
        <div style={{
          flexShrink: 0, width:56, height: 56, borderRadius: '0.55rem',
          background: `linear-gradient(135deg, ${exp.accent}30, ${exp.accent}14)`,
          border: `1.5px solid ${exp.accent}50`,
          boxShadow: `0 0 16px ${exp.glow}0.25)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'FuturaCyrillicBold, sans-serif',
          fontSize: '0.82rem', fontWeight: 700, color: exp.accent,
        }}>
          {exp.initials}
        </div>

        {/* Role + Company */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'FuturaCyrillicBold, Impact, sans-serif',
            fontSize: 'clamp(2.2rem, 1.7vw, 1.18rem)',
            fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 0.28rem',
          }}>
            {exp.role}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span style={{ color: exp.accent, fontWeight: 600, fontSize: '0.88rem', fontFamily: 'Outfit, sans-serif' }}>
              {exp.company}
            </span>
            {exp.type && (
              <span style={{ padding: '1px 7px', borderRadius: '9999px', background: 'rgba(139,92,246,0.14)', border: '1px solid rgba(139,92,246,0.26)', color: '#c084fc', fontSize: '0.67rem', fontFamily: 'monospace' }}>
                {exp.type}
              </span>
            )}
          </div>
        </div>

        {/* Date + Location */}
        <div style={{ flexShrink: 0, textAlign: 'right' }}>
          <div style={{ padding: '3px 9px', borderRadius: '0.38rem', background: 'rgba(255,255,255,0.045)', border: '1px solid rgba(255,255,255,0.09)', color: exp.isPresent ? '#4ade80' : 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontFamily: 'monospace', whiteSpace: 'nowrap' as const, marginBottom: '0.22rem' }}>
            {exp.duration}
          </div>
          <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.28)', textAlign: 'right' }}>
            {exp.location}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${exp.accent}44, transparent)`, marginBottom: '0.75rem' }} />

      {/* Bullet points */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {exp.points.map((pt, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem' }}>
            <span style={{ flexShrink: 0, marginTop: 8, width: 5, height: 5, borderRadius: '50%', background: exp.accent, boxShadow: `0 0 6px ${exp.glow}0.7)`, display: 'inline-block' }} />
            <p style={{ color: 'rgba(203,213,225,0.80)', fontSize: 'clamp(0.82rem,1.3vw,0.9rem)', lineHeight: 1.65, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              {pt}
            </p>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
        {exp.tags.map(tag => (
          <span key={tag} style={{ padding: '3px 10px', borderRadius: '9999px', background: `${exp.glow}0.10)`, border: `1px solid ${exp.glow}0.24)`, color: exp.accent, fontSize: '0.68rem', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ══ MAIN EXPORT ═════════════════════════════════════════════════════════ */
export const WorkExperience = () => {
  const { ref, isVisible } = useScrollAnimation(0.04);
  const isDesktop = !useIsMobile(1024);
  const [activeIdx, setActiveIdx] = useState(0);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerH, setContainerH] = useState(0);

  // Measure card-list container height for building sizing
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerH(el.offsetHeight));
    ro.observe(el);
    setContainerH(el.offsetHeight);
    return () => ro.disconnect();
  }, []);

  // Which card is most visible → update active floor
  useEffect(() => {
    if (!isDesktop) return;
    const observers: IntersectionObserver[] = [];
    const ratios = new Array(experiences.length).fill(0);

    cardEls.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(([entry]) => {
        ratios[i] = entry.intersectionRatio;
        const best = ratios.indexOf(Math.max(...ratios));
        setActiveIdx(best);
      }, { threshold: Array.from({ length: 11 }, (_, k) => k / 10) });
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [isDesktop]);

  const registerCard = useCallback((i: number) => (el: HTMLDivElement | null) => {
    cardEls.current[i] = el;
  }, []);

  return (
    <section id="work-experience" style={{ background: '#0a0c18', padding: 'clamp(3rem,5vw,5rem) clamp(1rem,3vw,2rem)', overflow: 'visible' }}>
      <div ref={ref} style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem', opacity: isVisible?1:0, transform: isVisible?'translateY(0)':'translateY(20px)', transition: 'opacity 0.7s, transform 0.7s' }}>
          <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#ef4444', margin: '0 0 0.5rem' }}>
            Career
          </p>
          <h2 style={{ fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif', fontSize: 'clamp(2rem,5vw,3.25rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em' }}>
            Work Experience
          </h2>
        </div>

        {/* DESKTOP: building + cards side by side */}
        {isDesktop ? (
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>

            {/* Building — sticky, sized to match card-list height */}
            <div style={{
              flexShrink: 0,
              position: 'sticky',
              top: '100px',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-18px)',
              transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
            }}>
              <Building activeIdx={activeIdx} totalHeight={containerH} />
            </div>

            {/* Cards column */}
            <div ref={containerRef} style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {experiences.map((exp, i) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  index={i}
                  cardRef={registerCard(i)}
                />
              ))}
            </div>
          </div>
        ) : (
          /* MOBILE: timeline line + cards */
          <div style={{ paddingLeft: '1.75rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: 7, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, rgba(239,68,68,0.1), rgba(239,68,68,0.45) 20%, rgba(239,68,68,0.35) 80%, rgba(139,92,246,0.1))' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {experiences.map((exp, i) => (
                <div key={exp.id} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 'calc(-1.75rem + 0.5px)', top: '1.4rem', transform: 'translateX(-50%)', width: 13, height: 13, borderRadius: '50%', background: exp.accent, border: '2.5px solid #0a0c18', boxShadow: `0 0 10px ${exp.glow}0.7)`, zIndex: 5 }} />
                  <ExperienceCard exp={exp} index={i} cardRef={registerCard(i)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes antennaPulse {
          0%,100% { box-shadow: 0 0 6px rgba(239,68,68,0.7); opacity: 1; }
          50%      { box-shadow: 0 0 16px rgba(239,68,68,1.0); opacity: 0.75; }
        }
      `}</style>
    </section>
  );
};