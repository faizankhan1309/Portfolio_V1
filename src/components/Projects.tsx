/**
 * Projects.tsx — Futuristic Featured Work
 *
 * Desktop (≥1024px):
 *   LEFT: Dark "app window" chrome frame:
 *     - Window title bar (traffic dots, project name, category badge, year)
 *     - Screenshot fills the frame with scanline + corner-bracket HUD overlay
 *     - Content overlay (title, full description, tags, Live Demo / GitHub)
 *     - prev/next arrows + red progress bar + counter
 *   RIGHT: Scrollable list with active red-border highlight
 *
 * Mobile: Card grid
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ExternalLink, Github, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';

interface Project {
  id: number; title: string; description: string;
  category: string; type: string; tags: string[];
  link: string | null; github: string | null;
  image: string; year: string;
}

const projects: Project[] = [
  { id: 1, title: 'Indoor Navigation System', year: '2024',
    description: 'Real-time indoor positioning for Indian Railways using A* and Dijkstra pathfinding on custom Mapbox/Leaflet layers. Sub-meter accuracy, multi-floor support.',
    category: 'AI', type: 'ai', tags: ['Python', 'Mapbox', 'A* Algorithm', 'Leaflet'],
    link: null, github: null, image: 'media/indoor.png' },
  { id: 8, title: 'FloatChat', year: '2024',
    description: 'LLM-powered oceanographic data explorer — query complex datasets in plain English, get charts, maps, and summaries. Centralizes siloed ocean data.',
    category: 'AI', type: 'ai', tags: ['LLM', 'NLP', 'Data Visualization', 'Python'],
    link: null, github: null, image: 'media/floatchat.jpg' },
  { id: 4, title: 'AI Sentiment Analyzer', year: '2024',
    description: 'TensorFlow + Flask pipeline classifying customer feedback into emotion categories in real time. BI dashboard surfaces actionable insights.',
    category: 'AI', type: 'ai', tags: ['Python', 'TensorFlow', 'Flask', 'NLP'],
    link: null, github: null, image: 'media/emotion.svg' },
  { id: 3, title: 'Local Events Platform', year: '2024',
    description: 'React app connecting communities with nearby events and volunteering. RSVP management, location-based filtering, volunteer matching.',
    category: 'Web', type: 'web', tags: ['React', 'Node.js', 'MongoDB', 'Community'],
    link: 'https://eventsphere-lemon.vercel.app', github: null, image: 'media/event.png' },
  { id: 2, title: 'Career Assistance Platform', year: '2024',
    description: 'Full-stack platform with AI-driven job matching, personalized career quizzes, and a structured interview prep workflow with tracked progress.',
    category: 'Web', type: 'web', tags: ['React', 'Node.js', 'MongoDB', 'AI Matching'],
    link: null, github: null,
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=70' },
  { id: 5, title: '3D Product Visualization', year: '2024',
    description: 'Photorealistic drone marketing assets for REFFTO using Blender Cycles — turntable animations, environment composites, social-ready stills.',
    category: '3D', type: 'design', tags: ['Blender', 'Cycles', '3D Modeling', 'Rendering'],
    link: null, github: null, image: 'media/3d.jpg' },
  { id: 6, title: 'Drone Flight Simulator', year: '2024',
    description: 'Blender + Unity real-time 3D sim for drone product demos. Realistic physics, first-person walkthrough, embeddable web export.',
    category: '3D', type: 'design', tags: ['Blender', 'Unity', 'C#', 'Physics'],
    link: null, github: null,
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=70' },
  { id: 7, title: 'Portfolio Website', year: '2025',
    description: 'React + Tailwind + GSAP scroll-driven portfolio. Pinned hero, parallax depth, glassmorphism cards, masonry gallery, cinematic animations.',
    category: 'Web', type: 'web', tags: ['React', 'TailwindCSS', 'GSAP', 'Three.js'],
    link: 'https://faizan-khan.vercel.app', github: null, image: 'media/port.png' },
];

const CFG: Record<string, { accent: string; glow: string; badge: React.CSSProperties }> = {
  ai:     { accent: '#f87171', glow: 'rgba(248,113,113,', badge: { background: 'rgba(248,113,113,0.15)', color: '#f87171', border: '1px solid rgba(248,113,113,0.35)' } },
  web:    { accent: '#818cf8', glow: 'rgba(129,140,248,', badge: { background: 'rgba(129,140,248,0.15)', color: '#818cf8', border: '1px solid rgba(129,140,248,0.35)' } },
  design: { accent: '#c084fc', glow: 'rgba(192,132,252,', badge: { background: 'rgba(192,132,252,0.15)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.35)' } },
};

/* Corner HUD brackets */
const Bracket = ({ pos }: { pos: 'tl'|'tr'|'bl'|'br' }) => {
  const s = 20; const t = 2; const c = 'rgba(239,68,68,0.5)';
  const style: React.CSSProperties = { position: 'absolute', width: s, height: s, pointerEvents: 'none', zIndex: 6 };
  if (pos === 'tl') { style.top = 6; style.left = 6; }
  if (pos === 'tr') { style.top = 6; style.right = 6; style.transform = 'scaleX(-1)'; }
  if (pos === 'bl') { style.bottom = 6; style.left = 6; style.transform = 'scaleY(-1)'; }
  if (pos === 'br') { style.bottom = 6; style.right = 6; style.transform = 'scale(-1)'; }
  return (
    <div style={style}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: s, height: t, background: c }} />
      <div style={{ position: 'absolute', top: 0, left: 0, width: t, height: s, background: c }} />
    </div>
  );
};

const DesktopFeatured = ({ isVisible }: { isVisible: boolean }) => {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  const [shown, setShown] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const total = projects.length;

  const goTo = useCallback((i: number) => {
    if (i === idx || fading) return;
    setFading(true);
    setTimeout(() => { setIdx(i); setShown(i); setFading(false); }, 250);
  }, [idx, fading]);

  const prev = () => goTo(Math.max(0, idx - 1));
  const next = () => goTo(Math.min(total - 1, idx + 1));

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'ArrowUp') { e.preventDefault(); prev(); } if (e.key === 'ArrowDown') { e.preventDefault(); next(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [idx]);

  useEffect(() => {
    (listRef.current?.querySelector(`[data-i="${idx}"]`) as HTMLElement)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [idx]);

  const p = projects[shown];
  const cfg = CFG[p.type] ?? CFG['ai'];
  const progress = ((idx + 1) / total) * 100;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 540px', gap: 0, borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0px 0px 60px rgba(56, 3, 202, 0.65)' }}>

      {/* LEFT PANEL */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#06080f', minHeight: '600px' }}>

        {/* Window chrome bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.65rem 1.2rem', background: 'rgba(255,255,255,0.025)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
          {['#ff5f57','#ffbd2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.75 }} />
          ))}
          <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.08)', margin: '0 0.3rem' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.05em', opacity: fading ? 0 : 1, transition: 'opacity 0.25s', flex: 1 }}>
            {p.title}
          </span>
          <span style={{ ...cfg.badge, padding: '2px 9px', borderRadius: '9999px', fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
            {p.category}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>{p.year}</span>
        </div>

        {/* Screenshot area */}
        <div style={{ position: 'relative', flex: '1 1 0', minHeight: 0, overflow: 'hidden' }}>
          <img
            key={p.id}
            src={p.image}
            alt={p.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: fading ? 0 : 1, transform: fading ? 'scale(1.04)' : 'scale(1)', transition: 'opacity 0.28s, transform 0.28s' }}
          />
          {/* Scanline */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.07) 3px,rgba(0,0,0,0.07) 4px)', pointerEvents: 'none', zIndex: 4 }} />
          {/* Bottom dark fade */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #06080f 0%, rgba(6,8,15,0.72) 42%, rgba(6,8,15,0.1) 70%, transparent 100%)', pointerEvents: 'none', zIndex: 5 }} />
          {/* Corners */}
          {(['tl','tr','bl','br'] as const).map(pos => <Bracket key={pos} pos={pos} />)}
          {/* HUD labels */}
          <div style={{ position: 'absolute', top: '0.65rem', left: '0.65rem', zIndex: 7, fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(239,68,68,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase' as const }}>Preview</div>
          <div style={{ position: 'absolute', top: '0.65rem', right: '0.65rem', zIndex: 7, fontFamily: 'monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em' }}>
            {String(idx+1).padStart(2,'0')}/{String(total).padStart(2,'0')}
          </div>

          {/* Content overlay — sits above the gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 8, padding: '1.4rem 1.75rem 1.2rem', opacity: fading ? 0 : 1, transform: fading ? 'translateY(10px)' : 'translateY(0)', transition: 'opacity 0.25s ease 0.06s, transform 0.25s ease 0.06s' }}>
            <h3 style={{ fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', fontSize: 'clamp(1.45rem, 2.6vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '0 0 0.55rem', letterSpacing: '-0.02em', textShadow: '0 2px 24px rgba(0,0,0,0.9)' }}>
              {p.title}
            </h3>
            <p style={{ color: 'rgba(209,213,219,0.80)', fontSize: 'clamp(0.82rem, 1.3vw, 0.95rem)', lineHeight: 1.65, fontFamily: 'Outfit, sans-serif', fontWeight: 300, margin: '0 0 0.9rem', maxWidth: '560px' }}>
              {p.description}
            </p>
            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem', marginBottom: '1rem' }}>
              {p.tags.map(tag => (
                <span key={tag} style={{ padding: '3px 11px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.62)', fontSize: '0.73rem', fontFamily: 'monospace', letterSpacing: '0.05em', backdropFilter: 'blur(6px)' }}>
                  {tag}
                </span>
              ))}
            </div>
            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {p.link ? (
                <a href={p.link} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.58rem 1.3rem', borderRadius: '9999px', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '0.83rem', fontFamily: 'FuturaCyrillicBold, sans-serif', textDecoration: 'none', boxShadow: '0 0 18px rgba(239,68,68,0.38)', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity='0.82')}
                  onMouseLeave={e => (e.currentTarget.style.opacity='1')}>
                  <ExternalLink size={13} /> Live Demo
                </a>
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.58rem 1.3rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.11)', color: 'rgba(255,255,255,0.28)', fontSize: '0.83rem', fontFamily: 'monospace' }}>
                  <ExternalLink size={13} /> No Live Demo
                </span>
              )}
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.58rem 1.3rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontSize: '0.83rem', fontFamily: 'monospace', textDecoration: 'none', transition: 'background 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='rgba(255,255,255,0.13)')}
                  onMouseLeave={e => (e.currentTarget.style.background='rgba(255,255,255,0.07)')}>
                  <Github size={13} /> GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Controls bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', background: 'rgba(3,4,10,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          {[{fn: prev, disabled: idx===0, icon: <ChevronLeft size={16}/>}, {fn: next, disabled: idx===total-1, icon: <ChevronRight size={16}/>}].map(({fn,disabled,icon},i) => (
            <button key={i} onClick={fn} disabled={disabled}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled?'not-allowed':'pointer', color: disabled?'rgba(255,255,255,0.15)':'#fff', transition: 'all 0.2s', flexShrink: 0 }}>
              {icon}
            </button>
          ))}
          <div style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: '#ef4444', borderRadius: '9999px', transition: 'width 0.4s ease' }} />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: '0.73rem', color: 'rgba(255,255,255,0.32)', letterSpacing: '0.1em', flexShrink: 0 }}>
            {String(idx+1).padStart(2,'0')} / {String(total).padStart(2,'0')}
          </span>
        </div>
      </div>

      {/* RIGHT: List */}
      <div style={{ background: 'rgba(7,9,17,0.98)', borderLeft: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '0.8rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.27)', letterSpacing: '0.16em', textTransform: 'uppercase' as const }}>All Projects</span>
          <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.18)' }}>{total}</span>
        </div>
        <div ref={listRef} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' as const, scrollbarColor: 'rgba(255,255,255,0.07) transparent' }}>
          {projects.map((proj, i) => {
            const c = CFG[proj.type] ?? CFG['ai'];
            const active = i === idx;
            return (
              <div key={proj.id} data-i={i} onClick={() => goTo(i)}
                style={{ padding: '0.9rem 1.2rem', borderBottom: '1px solid rgba(255,255,255,0.042)', borderLeft: `3px solid ${active ? c.accent : 'transparent'}`, background: active ? 'rgba(255,255,255,0.04)' : 'transparent', cursor: 'pointer', transition: 'all 0.18s', position: 'relative' as const }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background='rgba(255,255,255,0.022)'; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background='transparent'; }}
              >
                {active && <div style={{ position: 'absolute', top: 0, left: 3, right: 0, height: '1.5px', background: `linear-gradient(90deg,${c.accent}55,transparent)` }} />}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div>
                    <p style={{ fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', fontSize: '1.43rem', fontWeight: 800, color: active ? '#ffffff' : 'rgba(109, 105, 105, 0.4)', margin: '0 0 0.22rem', lineHeight: 1.2, transition: 'color 0.18s' }}>{proj.title}</p>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.66rem', color: active ? c.accent : 'rgba(255,255,255,0.22)', letterSpacing: '0.06em', transition: 'color 0.18s' }}>{proj.category}</span>
                  </div>
                  {active && <ArrowUpRight size={13} style={{ color: c.accent, flexShrink: 0, marginTop: 3 }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MobileCard = ({ project, index, isVisible }: { project: Project; index: number; isVisible: boolean }) => {
  const cfg = CFG[project.type] ?? CFG['ai'];
  const [hov, setHov] = useState(false);
  return (
    <article onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: '0.85rem', overflow: 'hidden', background: hov?'rgba(255,255,255,0.07)':'rgba(255,255,255,0.03)', border: `1px solid ${hov?cfg.glow+'0.28)':'rgba(255,255,255,0.09)'}`, opacity: isVisible?1:0, transform: isVisible?(hov?'translateY(-5px)':'translateY(0)'):'translateY(26px)', transition: `opacity 0.6s ease ${index*60}ms, transform 0.32s ease, border-color 0.22s`, display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hov?'scale(1.05)':'scale(1)', transition: 'transform 0.5s' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 35%, rgba(6,8,15,0.82) 100%)' }} />
        <span style={{ ...cfg.badge, position: 'absolute', top: '0.65rem', right: '0.65rem', padding: '2px 9px', borderRadius: '9999px', fontSize: '0.6rem', fontFamily: 'monospace', letterSpacing: '0.1em', textTransform: 'uppercase' as const, backdropFilter: 'blur(8px)' }}>{project.category}</span>
      </div>
      <div style={{ padding: '1rem 1.15rem 1.15rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <h3 style={{ fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', fontSize: 'clamp(0.95rem, 2vw, 1.1rem)', fontWeight: 800, color: hov?cfg.accent:'#fff', lineHeight: 1.2, margin: 0, transition: 'color 0.2s' }}>{project.title}</h3>
        <p style={{ color: 'rgba(156,163,175,0.82)', fontSize: '0.82rem', lineHeight: 1.6, fontFamily: 'Outfit, sans-serif', fontWeight: 300, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' } as React.CSSProperties}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.32rem', marginTop: 'auto', paddingTop: '0.3rem' }}>
          {project.tags.slice(0,3).map(tag => <span key={tag} style={{ padding: '2px 9px', borderRadius: '9999px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)', color: 'rgba(255,255,255,0.52)', fontSize: '0.67rem', fontFamily: 'monospace', letterSpacing: '0.04em' }}>{tag}</span>)}
        </div>
        {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: cfg.accent, fontSize: '0.73rem', fontFamily: 'monospace', textDecoration: 'none' }}>Live Demo <ExternalLink size={11}/></a>}
      </div>
    </article>
  );
};

export const Projects = () => {
  const { ref, isVisible } = useScrollAnimation(0.05);
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => { const c = () => setIsDesktop(window.innerWidth >= 1024); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, []);
  return (
    <section id="projects" style={{ padding: 'clamp(3rem,5vw,5rem) clamp(1rem,3vw,2rem)', background: '#080B12' }}>
      <div ref={ref} style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem,4vw,3rem)', opacity: isVisible?1:0, transform: isVisible?'translateY(0)':'translateY(20px)', transition: 'opacity 0.7s, transform 0.7s' }}>
          <h2 style={{ fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', margin: '0 0 0.75rem', letterSpacing: '0.05em' }}>FEATURED WORK</h2>
          <div style={{ width: '5rem', height: '3px', background: '#ef4444', borderRadius: '9999px', margin: '0 auto' }} />
        </div>
        {isDesktop ? (
          <div style={{ opacity: isVisible?1:0, transform: isVisible?'translateY(0)':'translateY(24px)', transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s' }}>
            <DesktopFeatured isVisible={isVisible} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 'clamp(0.85rem,2vw,1.25rem)' }}>
            {projects.map((p,i) => <MobileCard key={p.id} project={p} index={i} isVisible={isVisible} />)}
          </div>
        )}
      </div>
    </section>
  );
};