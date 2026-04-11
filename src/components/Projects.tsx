/**
 * Projects.tsx  v5 — Reference-layout: title-left / image-right
 *
 * Desktop layout per project slide:
 *   LEFT  50%: category · index  →  Huge title (ScrambleText)
 *              accent separator  →  short description  →  Know More pill
 *   RIGHT 50%: rounded rectangle image (hover: scale + overlay)
 *
 * No watermark. No text-image overlap.
 * Left-edge index nav (like year-nav in reference).
 * Glassmorphic detail card: image + category + title + description + highlights + stack + CTA.
 * Fully responsive (stacked on < 768 px).
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, color } from 'framer-motion';
import { ExternalLink, X, ArrowRight, CheckCircle, Circle } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

/* ══════════════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════════════ */
interface Project {
  id: number;
  title: string;
  lines: string[];
  year: string;
  role: string;
  description: string;
  fullDescription: string;
  highlights: string[];
  category: string;
  tags: string[];
  link: string | null;
  image: string;
  accent: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'Indoor Navigation System',
    lines: ['INDOOR', 'NAV system'],
    year: '2024',
    role: 'AI / Backend Engineer',
    description: 'AI-powered navigation across complex Indian Railway stations.',
    fullDescription:
      'A real-time indoor positioning and navigation system built for Indian Railways. Combines Wi-Fi and BLE signals with graph-based pathfinding to guide passengers through multi-floor station layouts with sub-meter precision.',
    highlights: [
      'Sub-meter accuracy positioning using Wi-Fi + BLE sensor fusion',
      'Multi-floor pathfinding via A* and Dijkstra on dynamic graphs',
      'Custom Mapbox/Leaflet layers with real-time passenger routing',
    ],
    category: 'AI · Python',
    tags: ['Python', 'Mapbox', 'A* Algorithm', 'Leaflet', 'BLE', 'Flask'],
    link: null,
    image: '/media/indoor.png',
    accent: '#f87171',
  },
  {
    id: 8,
    title: 'FloatChat',
    lines: ['FLOAT', 'CHAT'],
    year: '2024',
    role: 'Full Stack / AI Engineer',
    description: 'LLM interface for querying oceanographic datasets in plain English.',
    fullDescription:
      'An LLM-powered research assistant that translates plain-English questions into structured oceanographic dataset queries. Outputs interactive charts, maps, and natural language summaries — bridging the gap between marine science data and accessible insights.',
    highlights: [
      'Natural language → structured dataset retrieval pipeline',
      'Auto-generates interactive charts, maps, and AI summaries',
      'Multi-turn conversation memory for deep research sessions',
    ],
    category: 'AI · LLM',
    tags: ['LLM', 'NLP', 'Python', 'Data Visualization', 'Streamlit'],
    link: null,
    image: '/media/floatchat.jpg',
    accent: '#fb923c',
  },
  {
    id: 3,
    title: 'EventSphere',
    lines: ['EVENT', 'SPHERE'],
    year: '2023',
    role: 'Full Stack Developer',
    description: 'Community platform connecting people to local events and causes.',
    fullDescription:
      'A React web app that helps communities discover nearby events and volunteering opportunities. Features include RSVP management, geolocation-based filtering, and an intelligent volunteer-matching algorithm that drives measurable civic engagement.',
    highlights: [
      'Location-based event discovery with radius filter and map view',
      'RSVP system with calendar sync and reminder notifications',
      'Volunteer-matching algorithm based on skills and availability',
    ],
    category: 'Web · React',
    tags: ['React', 'Node.js', 'MongoDB', 'Maps API', 'Express'],
    link: 'https://eventsphere-lemon.vercel.app',
    image: '/media/event.png',
    accent: '#818cf8',
  },
  {
    id: 4,
    title: 'AI Sentiment Analyzer',
    lines: ['SENTIMENT', 'Analyzer'],
    year: '2023',
    role: 'ML Engineer',
    description: 'Real-time emotion & sentiment classification for customer feedback.',
    fullDescription:
      'A TensorFlow + Flask pipeline that classifies customer feedback into fine-grained emotion categories — anger, joy, sadness, surprise, and more — in real time. Surfaces actionable business intelligence through a clean analytics dashboard.',
    highlights: [
      'Fine-grained emotion taxonomy across 6+ sentiment classes',
      'Real-time inference with < 200 ms response latency',
      'Business dashboard with trend visualisation and alerts',
    ],
    category: 'AI · NLP',
    tags: ['TensorFlow', 'Flask', 'NLP', 'Python', 'Scikit-learn'],
    link: null,
    image: '/media/emotion.svg',
    accent: '#a78bfa',
  },

 
  {
    id: 7,
    title: 'Portfolio',
    lines: ['MY', 'PORTFOLIO'],
    year: '2024',
    role: 'Creative Developer',
    description: 'Cinematic scroll-driven personal portfolio with 3D & motion design.',
    fullDescription:
      'Built from scratch with React, GSAP, and Three.js. Features a pinned parallax hero with GSAP ScrollTrigger, physics-based 3D gallery, glassmorphism project cards, interactive skill blobs, and the very scroll showcase you are exploring now.',
    highlights: [
      'GSAP ScrollTrigger pinned hero with depth parallax layers',
      'Three.js physics-based 3D image gallery with momentum',
      'Framer Motion scroll-jacked cinematic project showcase',
    ],
    category: 'Web · Creative',
    tags: ['React', 'GSAP', 'Three.js', 'Framer Motion', 'TypeScript'],
    link: 'https://faizan-khan.vercel.app',
    image: '/media/port.png',
    accent: '#f472b6',
  },
   {
    id: 2,
    title: 'Career Assistant',
    lines: ['CAREER', 'ASSIST'],
    year: '2022',
    role: 'Full Stack Developer',
    description: 'AI-driven career platform with job matching and interview prep.',
    fullDescription:
      'A full-stack career development platform built with React, Node.js, and MongoDB. Provides personalised AI-driven job matching, skill-gap quizzes, and a structured interview preparation workflow with tracked performance over time.',
    highlights: [
      'AI job-matching engine based on skills, location, and preference',
      'Adaptive skill-gap quizzes with personalised learning paths',
      'Interview prep tracker with mock sessions and analytics',
    ],
    category: 'Web · Full Stack',
    tags: ['React', 'Node.js', 'MongoDB', 'Express', 'OpenAI API'],
    link: null,
    image: '/media/WIP.png',
    accent: '#34d399',
  },
];

const TOTAL_SLIDES = 1 + PROJECTS.length; // 8: intro + 7

/* ══════════════════════════════════════════════════════════════════════════
   TEXT SCRAMBLER
══════════════════════════════════════════════════════════════════════════ */
const SC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*?';
const ScrambleText: React.FC<{ text: string; trigger: number }> = ({ text, trigger }) => {
  const [chars, setChars] = useState<{ ch: string; settled: boolean }[]>(
    text.split('').map(ch => ({ ch, settled: true }))
  );
  const raf = useRef<number | null>(null);
  useEffect(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    let f = 0; const T = 55;
    const ns = text.replace(/ /g, '').length || 1;
    const tick = () => {
      f++;
      let nsi = 0;
      setChars(text.split('').map(ch => {
        if (ch === ' ') return { ch: ' ', settled: true };
        nsi++;
        const settled = nsi / ns <= f / T;
        return { ch: settled ? ch : SC[Math.floor(Math.random() * SC.length)], settled };
      }));
      if (f < T) raf.current = requestAnimationFrame(tick);
      else setChars(text.split('').map(ch => ({ ch, settled: true })));
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);
  return (
    <>
      {chars.map((c, i) => (
        <span key={i} style={{ color: c.settled ? 'inherit' : '#fa0404ff', transition: 'color 0.08s' }}>
          {c.ch}
        </span>
      ))}
    </>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   TEXT REVEAL  (mirrors Framer TextReveal-xT4dbn)
══════════════════════════════════════════════════════════════════════════ */
const LineReveal: React.FC<{
  children: React.ReactNode; isActive: boolean; delay?: number;
  wrapStyle?: React.CSSProperties;
}> = ({ children, isActive, delay = 0, wrapStyle }) => (
  <div style={{ overflow: 'hidden', ...wrapStyle }}>
    <motion.div
      initial={{ y: '110%' }}
      animate={{ y: isActive ? '0%' : '110%' }}
      transition={{ duration: 0.72, ease: [0.76, 0, 0.24, 1], delay }}
    >{children}</motion.div>
  </div>
);

const CharReveal: React.FC<{ text: string; isActive: boolean; baseDelay?: number }> = ({ text, isActive, baseDelay = 0 }) => (
  <>{text.split('').map((ch, i) => (
    <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
      <motion.span style={{ display: 'inline-block' }}
        initial={{ y: '108%' }}
        animate={{ y: isActive ? '0%' : '108%' }}
        transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1], delay: baseDelay + i * 0.03 }}
      >{ch === ' ' ? '\u00A0' : ch}</motion.span>
    </span>
  ))}</>
);

/* ══════════════════════════════════════════════════════════════════════════
   FILM GRAIN
══════════════════════════════════════════════════════════════════════════ */
const FilmGrain: React.FC = () => (
  <div aria-hidden="true" style={{
    position: 'absolute', inset: '-55%', width: '210%', height: '210%',
    zIndex: 90, pointerEvents: 'none', opacity: 0.04,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: '175px 175px', animation: 'prjGrain 0.9s steps(1) infinite',
  }} />
);

/* ══════════════════════════════════════════════════════════════════════════
   KNOW MORE BUTTON
══════════════════════════════════════════════════════════════════════════ */
const KnowMoreBtn: React.FC<{ accent: string; onClick: () => void }> = ({ accent, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        padding: '1rem 2.4rem',
        background: hov ? accent : 'transparent',
        border: `1.5px solid ${hov ? accent : `${accent}55`}`,
        borderRadius: '9999px',
        color: hov ? '#000' : '#fff',
        fontFamily: 'monospace', fontSize: '0.82rem',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        outline: 'none',
      }}
    >
      Know More <ArrowRight size={16} strokeWidth={2.2} />
    </button>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   DETAIL CARD  — glassmorphic overlay
══════════════════════════════════════════════════════════════════════════ */
const DetailCard: React.FC<{
  project: Project; index: number; isMobile: boolean; onClose: () => void;
}> = ({ project, index, isMobile, onClose }) => {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.26 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '1rem' : '2rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 28 }}
        transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: isMobile ? '100%' : '960px',
          maxHeight: isMobile ? '92vh' : '86vh',
          background: 'linear-gradient(145deg, rgba(5,7,18,0.85) 0%, rgba(8,11,24,0.92) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(48px)', WebkitBackdropFilter: 'blur(48px)',
          borderRadius: '0.4rem', overflow: 'hidden',
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          boxShadow: `0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 0 1px rgba(255,255,255,0.04)`,
          position: 'relative',
        }}
      >
    
  

        {/* IMAGE PANEL — height auto so image never crops */}
        <div style={{
          ...(isMobile
            ? { width: '100%', flexShrink: 0 }
            : { width: '42%', flexShrink: 0 }
          ),
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <img
            src={project.image}
            alt={project.title}
            style={{
              width: '100%',
              height: 'auto',          /* natural height — no crop */
              maxHeight: isMobile ? '50vw' : '80vh',
              objectFit: 'contain',   /* show full image */
              display: 'block',
            }}
          />
          {/* Left accent bar */}
          
        </div>

        {/* DETAILS PANEL */}
        <div style={{
          flex: 1, overflowY: 'auto', minWidth: 0,
          display: 'flex', flexDirection: 'column', gap: '0',
          padding: isMobile ? '1.6rem 1.4rem 2rem' : '2.4rem 2.2rem 2.4rem 2rem',
        }}>
          {/* Close */}
          <button onClick={onClose} aria-label="Close"
            style={{
              position: 'absolute', top: '1.1rem', right: '1.1rem',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '50%', width: 34, height: 34,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s', zIndex: 20,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <X size={14} strokeWidth={2} />
          </button>

          {/* Meta row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.85rem', marginTop: '0.2rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', letterSpacing: '0.24em', color: project.accent, textTransform: 'uppercase' }}>
              {project.category}
            </span>
            
            
          </div>

          {/* Title */}
          <h2 style={{
            fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
            fontSize: 'clamp(1.6rem, 2.6vw, 2.2rem)', fontWeight: 900, color: '#fff',
            textTransform: 'uppercase', lineHeight: 1.06, letterSpacing: '-0.015em',
            margin: '0 0 1rem 0',
          }}>
            {project.title}
          </h2>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: '1rem' }} />

          {/* Description */}
          <p style={{
            color: 'rgba(200, 204, 224, 0.84)', fontFamily: 'Outfit, system-ui, sans-serif',
            fontSize: '0.97rem', lineHeight: 1.82, fontWeight: 300, margin: '0 0 1.3rem 0',
          }}>
            {project.fullDescription}
          </p>

          {/* Key highlights */}
          <div style={{ marginBottom: '1.3rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', letterSpacing: '0.22em', color: 'rgba(255, 255, 255, 0.64)', textTransform: 'uppercase', margin: '0 0 0.65rem 0' }}>
              Key Highlights
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {project.highlights.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Circle size={14} strokeWidth={20} style={{ color: project.accent, flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontFamily: 'Outfit, system-ui, sans-serif', fontSize: '0.88rem', lineHeight: 1.55, fontWeight: 300, color: 'rgba(196, 202, 220, 0.78)' }}>
                    {h}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: '1.1rem' }} />

          {/* Tech stack */}
          <div style={{ marginBottom: '1.4rem' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '0.58rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', margin: '0 0 0.6rem 0' }}>
              Tech Stack
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.38rem' }}>
              {project.tags.map(tag => (
                <span key={tag} style={{
                  padding: '4px 13px', borderRadius: 9999,
                  background: `${project.accent}15`, border: `1px solid ${project.accent}35`,
                  color: project.accent, fontSize: '0.72rem',
                  fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          {project.link ? (
            <a href={project.link} target="_blank" rel="noopener noreferrer"
              style={{
                alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.48rem',
                padding: '0.75rem 1.5rem', background: project.accent, borderRadius: '0.5rem',
                color: '#000', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em',
                textDecoration: 'none', fontFamily: 'monospace', textTransform: 'uppercase',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.82'; (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1'; (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)'; }}
            >
              <ExternalLink size={14} strokeWidth={2.2} /> View Live Demo
            </a>
          ) : (
            <span style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.48rem',
              padding: '0.75rem 1.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '0.5rem', color: 'rgba(255,255,255,0.26)', fontSize: '0.78rem',
              fontFamily: 'monospace', textTransform: 'uppercase',
            }}>
              <ExternalLink size={14} strokeWidth={1.5} /> View Project
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   INTRO SLIDE
══════════════════════════════════════════════════════════════════════════ */
const IntroSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
  <div style={{
    height: '100vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '1.1rem', padding: '0 6vw', textAlign: 'center', position: 'relative',
  }}>
    <div aria-hidden="true" style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: 'linear-gradient(rgba(146, 2, 2, 0.81) 1px, transparent 1px), linear-gradient(90deg, rgba(248, 7, 7, 0.03) 1px, transparent 1px)',
      backgroundSize: '65px 65px',
      maskImage: 'radial-gradient(ellipse 60% 60% at center, black 20%, transparent 78%)',
    }} />
    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1rem' }}>
      <div style={{ fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif', fontSize: 'clamp(5rem, 17vw, 20rem)', fontWeight: 900, color: '#fff', lineHeight: 0.85, letterSpacing: '-0.04em', textTransform: 'uppercase' }}>
        <CharReveal text="PROJECTS" isActive={isActive} baseDelay={0.18} />
      </div>
      <LineReveal isActive={isActive} delay={0.72}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '1.31rem', letterSpacing: '0.26em', color: 'rgba(247, 0, 0, 0.36)', textTransform: 'uppercase' }}>
            Scroll Down ↓
          </span>
        </div>
      </LineReveal>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   PROJECT SLIDE  — title LEFT, image RIGHT, no overlap
══════════════════════════════════════════════════════════════════════════ */
const ProjectSlide: React.FC<{
  project: Project; index: number; isActive: boolean;
  isMobile: boolean; onKnowMore: () => void;
}> = ({ project, index, isActive, isMobile, onKnowMore }) => {
  const [trig, setTrig] = useState(0);
  const [imgHov, setImgHov] = useState(false);
  const prev = useRef(false);
  useEffect(() => {
    if (isActive && !prev.current) setTrig(t => t + 1);
    prev.current = isActive;
  }, [isActive]);

  /* MOBILE: image top, content bottom */
  if (isMobile) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: '45%', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img src={project.image} alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 55%, #000000 100%)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${project.accent}, transparent)` }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '1.2rem 5vw 5rem', gap: '0.85rem' }}>
          <span style={{ fontFamily: 'monospace', fontSize: '0.57rem', letterSpacing: '0.24em', color: project.accent, textTransform: 'uppercase' }}>
            {project.category}
          </span>
          <div style={{ fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif', fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontWeight: 900, color: '#fff', lineHeight: 0.88, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
            {project.lines.map((line, li) => <div key={li}><ScrambleText text={line} trigger={trig} /></div>)}
          </div>
          <p style={{ color: 'rgba(175,180,205,0.65)', fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', lineHeight: 1.65, fontWeight: 300, margin: 0 }}>
            {project.description}
          </p>
          <div><KnowMoreBtn accent={project.accent} onClick={onKnowMore} /></div>
        </div>
      </div>
    );
  }

  /* DESKTOP: 2-column grid */
  return (
    <div style={{
      height: '100vh', width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      padding: '0 4vw',
      columnGap: '3vw',
      alignItems: 'center',
      boxSizing: 'border-box',
      position: 'relative',
    }}>
      {/* LEFT: text */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0, paddingRight: '1vw' }}>
        {/* Category + index */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.38, delay: 0.05 }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.1rem' }}
        >
          <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.28em', color: project.accent, textTransform: 'uppercase' }}>
            {project.category}
          </span>         
        </motion.div>

        {/* Giant title */}
        <div style={{
          fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
          fontSize: 'clamp(2.8rem, 7vw, 10rem)',
          fontWeight: 900, color: '#ffffff', lineHeight: 0.87,
          letterSpacing: '-0.03em', textTransform: 'uppercase',
          marginBottom: '1.4rem', overflow: 'hidden',
        }}>
          {project.lines.map((line, li) => (
            <div key={li} style={{ whiteSpace: 'nowrap' }}>
              <ScrambleText text={line} trigger={trig} />
            </div>
          ))}
        </div>

        {/* Accent separator (like reference) */}
       

        {/* Short description */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.38, delay: 0.22 }}
          style={{
            color: 'rgba(175, 182, 208, 0.68)', fontFamily: 'Outfit, system-ui, sans-serif',
            fontSize: 'clamp(1.4rem, 1.2vw, 1.05rem)', lineHeight: 1.7, fontWeight: 300,
            margin: '0 0 2rem 0', maxWidth: '44ch',
          }}
        >
          {project.description}
        </motion.p>

        {/* Know More */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 8 }}
          transition={{ duration: 0.38, delay: 0.3 }}
        >
          <KnowMoreBtn accent={project.accent} onClick={onKnowMore} />
        </motion.div>
      </div>

      {/* RIGHT: image */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: '1vw', height: '100%' }}>
        <div
          style={{ position: 'relative', width: '100%', cursor: 'pointer' }}
          onClick={onKnowMore}
          onMouseEnter={() => setImgHov(true)}
          onMouseLeave={() => setImgHov(false)}
        >
          <div style={{
            width: '100%', height: 'clamp(240px, 54vh, 520px)',
            borderRadius: '1.2rem', overflow: 'hidden',
            border: `11.5px solid ${project.accent}38`,
            boxShadow: imgHov
              ? `0 0 0 1px ${project.accent}40, 0 0 28px 4px ${project.accent}28, 0 16px 72px ${project.accent}22, 0 40px 80px rgba(0,0,0,0.65)`
              : `0 0 0 1px ${project.accent}20, 0 0 18px 2px ${project.accent}14, 0 8px 48px rgba(0,0,0,0.5)`,
            transition: 'box-shadow 0.45s ease',
            position: 'relative',
          }}>
            <img src={project.image} alt={project.title} draggable={false}
              style={{
                width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                transform: imgHov ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
            />
            {/* Hover overlay */}
            <motion.div
              animate={{ opacity: imgHov ? 1 : 0 }}
              transition={{ duration: 0.28 }}
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${project.accent}18, rgba(0,0,0,0.45))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(6,8,20,0.72)', backdropFilter: 'blur(8px)',
                border: '1.5px solid rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <ArrowRight size={22} color="#fff" strokeWidth={2} />
              </div>
            </motion.div>
          </div>
          {/* Left accent bar */}
          
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   LEFT INDEX NAV  (year-nav style from reference)
══════════════════════════════════════════════════════════════════════════ */
const IndexNav: React.FC<{ activeProject: number; accent: string }> = ({ activeProject, accent }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {PROJECTS.map((_, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.42rem' }}>
        {i === activeProject && <span style={{ color: accent, fontSize: '0.45rem', lineHeight: 1 }}>▶</span>}
        <span style={{
          fontFamily: 'monospace', fontSize: '0.58rem',
          color: i === activeProject ? '#fff' : 'rgba(255,255,255,0.2)',
          fontWeight: i === activeProject ? 700 : 400,
          letterSpacing: '0.06em',
          transition: 'all 0.32s ease',
          marginLeft: i === activeProject ? 0 : '0.85rem',
        }}>
          {String(i + 1).padStart(2, '0')}
        </span>
      </div>
    ))}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════════════════ */
export const Projects: React.FC = () => {
  const outerRef    = useRef<HTMLDivElement>(null);
  const outerTopRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef   = useRef(0);
  const [showCard, setShowCard]       = useState<number | null>(null);
  const showCardRef = useRef<number | null>(null);
  const isMobile    = useIsMobile(768);

  useEffect(() => { showCardRef.current = showCard; }, [showCard]);
  useEffect(() => {
    document.body.style.overflow = showCard !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showCard]);

  useEffect(() => {
    const calc = () => {
      const el = outerRef.current; if (!el) return;
      outerTopRef.current = el.getBoundingClientRect().top + window.scrollY;
    };
    calc();
    const t1 = setTimeout(calc, 300); const t2 = setTimeout(calc, 1200);
    window.addEventListener('resize', calc);
    return () => { window.removeEventListener('resize', calc); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (showCardRef.current !== null) return;
      const scrolled = window.scrollY - outerTopRef.current;
      const idx = Math.min(TOTAL_SLIDES - 1, Math.max(0, Math.floor(scrolled / window.innerHeight)));
      if (idx !== activeRef.current) { activeRef.current = idx; setActiveIndex(idx); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isIntro    = activeIndex === 0;
  const projIdx    = Math.max(0, activeIndex - 1);
  const activeProj = PROJECTS[Math.min(projIdx, PROJECTS.length - 1)];

  if (isMobile) {
    return (
      <div id="projects" style={{ position: 'relative', background: '#000000', width: '100%' }}>
        <FilmGrain />
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <IntroSlide isActive={true} />
          {PROJECTS.map((p, i) => (
            <ProjectSlide key={p.id} project={p} index={i}
              isActive={true} isMobile={isMobile}
              onKnowMore={() => setShowCard(i)}
            />
          ))}
        </div>
        <AnimatePresence>
          {showCard !== null && (
            <DetailCard key={`card-${showCard}`} project={PROJECTS[showCard]} index={showCard} isMobile={true} onClose={() => setShowCard(null)} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={outerRef} id="projects"
      style={{ position: 'relative', height: `${(TOTAL_SLIDES + 1) * 100}vh` }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', background: '#000000' }}>
        <FilmGrain />

        {!isIntro && (
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: `radial-gradient(ellipse at 72% 50%, ${activeProj.accent}0D 0%, transparent 55%)`,
            transition: 'background 0.9s ease',
          }} />
        )}

        {/* SLIDE COLUMN */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%',
          height: `${TOTAL_SLIDES * 100}vh`,
          transform: `translateY(-${activeIndex * 100}vh)`,
          transition: 'transform 0.86s cubic-bezier(0.76, 0, 0.24, 1)',
          willChange: 'transform', zIndex: 2,
        }}>
          <IntroSlide isActive={isIntro} />
          {PROJECTS.map((p, i) => (
            <ProjectSlide key={p.id} project={p} index={i}
              isActive={activeIndex === i + 1} isMobile={isMobile}
              onKnowMore={() => setShowCard(i)}
            />
          ))}
        </div>

        {/* Blend fades */}
        <div aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, zIndex: 70, pointerEvents: 'none', background: 'linear-gradient(to bottom, #000000, transparent)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, zIndex: 70, pointerEvents: 'none', background: 'linear-gradient(to top, #000000, transparent)' }} />



        {/* Chrome: top-right */}
        {!isIntro && (
          <div style={{ position: 'absolute', top: '1.8rem', right: '2.5rem', zIndex: 80, pointerEvents: 'none' }}>
            <AnimatePresence mode="wait">
              <motion.span key={activeIndex}
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.24 }}
                style={{ fontFamily: 'monospace', fontSize: '0.54rem', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.24)', textTransform: 'uppercase' }}
              >
                {activeProj.year} · {activeProj.category.split('·')[0].trim()}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        {/* Chrome: left index nav */}
        {!isIntro && !isMobile && (
          <div style={{ position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)', zIndex: 80 }}>
            <IndexNav activeProject={projIdx} accent={activeProj.accent} />
          </div>
        )}

        {/* Mobile dots */}
        {!isIntro && isMobile && (
          <div style={{ position: 'absolute', bottom: '3.5vh', left: '50%', transform: 'translateX(-50%)', zIndex: 80, display: 'flex', gap: '0.35rem' }}>
            {PROJECTS.map((_, i) => (
              <div key={i} style={{ width: i === projIdx ? 18 : 5, height: 5, borderRadius: 9999, background: i === projIdx ? activeProj.accent : 'rgba(255,255,255,0.22)', transition: 'all 0.4s ease' }} />
            ))}
          </div>
        )}

        {/* Detail card */}
        <AnimatePresence>
          {showCard !== null && (
            <DetailCard key={`card-${showCard}`} project={PROJECTS[showCard]} index={showCard} isMobile={isMobile} onClose={() => setShowCard(null)} />
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes prjGrain {
          0%   { transform: translate(  0%,   0%); }
          14%  { transform: translate(-1.5%, -1.8%); }
          28%  { transform: translate( 1.8%,  1.2%); }
          42%  { transform: translate(-0.8%,  1.9%); }
          57%  { transform: translate( 1.9%, -0.9%); }
          71%  { transform: translate(-1.7%,  1.7%); }
          85%  { transform: translate( 1.2%, -1.7%); }
          100% { transform: translate(  0%,   0%  ); }
        }
        @keyframes prjScroll {
          0%,100% { opacity: 0.2; transform: scaleY(1); }
          50%      { opacity: 0.7; transform: scaleY(1.35); }
        }
        #projects * { -webkit-user-select: none; user-select: none; }
      `}</style>
    </div>
  );
};
