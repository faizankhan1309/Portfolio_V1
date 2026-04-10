/**
 * Gallery.tsx — 3D Physics Draggable Carousel (Clean & Minimal Red Aesthetic)
 *
 * Desktop (≥1025px):  Full-bleed 3D coverflow carousel — drag, snap, autoplay, arrows, dots
 * Mobile/Tablet:       Responsive CSS grid with lightbox
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';

/* ─── GLOWING TITLE COMPONENT ────────────────────────────────────────────── */

const GlowTitle = ({ text, go }: { text: string; go: boolean }) => {
  const chars = text.split('');
  const dur = 0.18 + chars.length * 0.055 + 0.68;
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      {/* blurred red corona */}
      <motion.span aria-hidden
        initial={{ opacity: 0 }}
        animate={go ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
        transition={{ duration: dur + 0.6, times: [0, 0.12, 0.62, 1], delay: 0.1 }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          filter: 'blur(30px)', color: '#dc2626',
          font: 'inherit', fontWeight: 900,
          userSelect: 'none', zIndex: 0,
        }}
      >{text}</motion.span>

      {/* real chars — clip slide-up */}
      {chars.map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', position: 'relative', zIndex: 1, paddingBottom: 10 }}>
          <motion.span style={{ display: 'inline-block' }}
            initial={{ y: '108%' }}
            animate={{ y: go ? '0%' : '108%' }}
            transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1], delay: 0.16 + i * 0.055 }}
          >{ch === ' ' ? '\u00A0' : ch}</motion.span>
        </span>
      ))}
    </span>
  );
};

/* ══ DATA (Unified Red Accents) ══════════════════════════════════════════ */
interface GalleryItem {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  description: string;
  highlight: string;
  accentColor: string;
  image: string;
  colSpan?: boolean;
}

const items: GalleryItem[] = [
  {
    id: 1,
    title: 'TEDxLNCT 2025',
    subtitle: 'Design Lead',
    date: '2025',
    tags: ['Design', 'Branding', 'Leadership', 'Event'],
    highlight: '500+ attendees',
    description:
      'Served as Design Lead for TEDxLNCT 2025 — directing the complete visual identity from stage aesthetics to digital assets. Got up-close experience working alongside talent managers and speakers from top corporate backgrounds, gaining rare insight into professional event production at scale.',
    accentColor: '#dc2626',
    image: '/media/ted2.jpg',
    colSpan: true,
  },
  {
    id: 2,
    title: 'Hack2Hire Hackathon',
    subtitle: 'Organizer — Bhopal',
    date: '2025',
    tags: ['Hackathon', 'Trikaya', 'Organizer', 'Tech'],
    highlight: 'City-level event',
    description:
      'Organized and represented Trikaya at the Hack2Hire Hackathon held in Bhopal — a hiring-focused hackathon that brought developers and companies together. Managed logistics, communication, and on-ground execution on behalf of Trikaya as company representative.',
    accentColor: '#ef4444',
    image: '/media/hack.jpg',
  },
  {
    id: 3,
    title: 'Smart India Hackathon',
    subtitle: 'Participant 2024 & 2025',
    date: '2024 – 2025',
    tags: ['SIH', 'National', 'Problem Solving', 'Team'],
    highlight: 'National — 2 consecutive years',
    description:
      "Participated in Smart India Hackathon in both 2024 and 2025 — India's largest student hackathon. Competed at national level solving real-world government and industry problem statements.",
    accentColor: '#f87171',
    image: '/media/sih.jpeg',
  },
  {
    id: 4,
    title: 'Bansal Robo Race',
    subtitle: '1st Prize Winner',
    date: '2025',
    tags: ['Robotics', '1st Place', 'Competition', 'Winner'],
    highlight: '🏆 First Prize',
    description:
      'Won first prize at the Bansal Robo Race Challenge 2025 — a competitive robotics event testing engineering, speed, and precision.',
    accentColor: '#b91c1c',
    image: '/media/bansal1.jpg',
    colSpan: true,
  },
  {
    id: 5,
    title: 'Google Developer Group',
    subtitle: 'Facilitator 2025',
    date: '2025',
    tags: ['Google', 'GCP', 'Mentorship', 'Cloud'],
    highlight: 'Official GCP Facilitator',
    description:
      'Selected as a Google Cloud Arcade Facilitator — guiding students through hands-on GCP labs, skill badge completions, and cloud fundamentals.',
    accentColor: '#ef4444', 
    image: '/media/cloud.jpg',
  },
  {
    id: 6,
    title: 'Pixel Room',
    subtitle: 'Co-founder · LNCT Bhopal',
    date: '2025 – Present',
    tags: ['Gaming', 'Community', 'Co-founder', 'LNCT'],
    highlight: "LNCT's first gaming community",
    description:
      "Co-founded Pixel Room — LNCT Bhopal's first dedicated student gaming community, built from scratch.",
    accentColor: '#ef4444',
    image: '/media/pixel.jpeg',
  },
  {
    id: 7,
    title: 'Bhopal Film Festival',
    subtitle: 'Organiser · 2026',
    date: '2026',
    tags: ['Film', 'Culture', 'Visual Arts', 'Festival'],
    highlight: 'Bhopal Film Festival 2026',
    description:
      'Organized the Bhopal Film Festival 2026 — a vibrant intersection of art, storytelling, and visual culture.',
    accentColor: '#fca5a5',
    image: '/media/tnff.jpg',
    colSpan: true,
  },
];

/* ══ CLEAN LIGHTBOX ══════════════════════════════════════════════════════ */
const Lightbox = ({ startIndex, onClose }: { startIndex: number; onClose: () => void }) => {
  const [current, setCurrent] = useState(startIndex);
  const item = items[current];
  const touchStartX = useRef<number>(0);

  const prev = useCallback(() => setCurrent(i => (i - 1 + items.length) % items.length), []);
  const next = useCallback(() => setCurrent(i => (i + 1) % items.length), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [onClose, prev, next]);

  return (
    <div
      role="dialog" aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(20px)',
        animation: 'lbBackdropIn 0.22s ease both',
      }}
      onClick={onClose}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
      }}
    >
      {/* Close */}
      <button onClick={onClose} aria-label="Close" style={{
        position: 'absolute', top: '1.25rem', right: '1.25rem',
        width: 42, height: 42, borderRadius: '50%',
        background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff', zIndex: 10, transition: 'background 0.3s'
      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}>
        <X size={18} />
      </button>

      {/* Prev */}
      <button onClick={e => { e.stopPropagation(); prev(); }} aria-label="Previous" style={{
        position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(0,0,0,0.50)', border: `1px solid rgba(255,255,255,0.15)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff', zIndex: 10, transition: 'background 0.3s'
      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.50)'}>
        <ChevronLeft size={20} />
      </button>

      {/* Next */}
      <button onClick={e => { e.stopPropagation(); next(); }} aria-label="Next" style={{
        position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(0,0,0,0.50)', border: `1px solid rgba(255,255,255,0.15)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: '#fff', zIndex: 10, transition: 'background 0.3s'
      }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.50)'}>
        <ChevronRight size={20} />
      </button>

      {/* Content panel */}
      <div
        style={{
          width: '100%', maxWidth: '860px',
          padding: 'clamp(0.5rem, 2vw, 1.5rem)',
          animation: 'lbContentIn 0.30s cubic-bezier(0.16,1,0.3,1) both',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{
          borderRadius: '1rem', overflow: 'hidden', maxHeight: '60svh',
          boxShadow: `0 0 60px ${item.accentColor}25, 0 30px 60px rgba(0,0,0,0.65)`,
          border: `1px solid rgba(255,255,255,0.1)`, position: 'relative',
        }}>
          <img key={current} src={item.image} alt={item.title} style={{
            width: '100%', maxHeight: '60svh', objectFit: 'cover', display: 'block',
            animation: 'lbImgIn 0.28s ease both',
          }} />
          {/* Accent Line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
            background: `linear-gradient(90deg, ${item.accentColor}, transparent 70%)`,
          }} />
        </div>

        <div style={{
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
          marginTop: '1rem', paddingLeft: '0.25rem',
          animation: 'lbContentIn 0.35s ease 0.05s both',
        }}>
          <h2 style={{ fontFamily: 'FuturaCyrillicBold, sans-serif', fontSize: '1.75rem', color: '#fff', margin: 0 }}>{item.title}</h2>
          <div style={{ color: item.accentColor, fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem', fontWeight: 500 }}>{item.subtitle} • {item.date}</div>
          <p style={{
            color: 'rgba(209,213,219,0.85)', fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', lineHeight: 1.6, margin: 0, fontWeight: 300, maxWidth: '800px'
          }}>{item.description}</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          {items.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }} style={{
              width: i === current ? '24px' : '8px', height: '8px', borderRadius: '9999px',
              background: i === current ? item.accentColor : 'rgba(255,255,255,0.25)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
              boxShadow: i === current ? `0 0 10px ${item.accentColor}` : 'none',
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes lbBackdropIn { from { opacity:0 } to { opacity:1 } }
        @keyframes lbContentIn  { from { opacity:0; transform:translateY(16px) scale(0.97) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes lbImgIn      { from { opacity:0; transform:scale(0.96) } to { opacity:1; transform:scale(1) } }
      `}</style>
    </div>
  );
};

/* ══ 3D DRAGGABLE CAROUSEL ════════════════════════════════════════════════ */

const PERSPECTIVE      = 1100;
const MAX_ROTATE_Y     = 36;
const DEPTH            = 110;
const ACTIVE_SCALE     = 1;
const INACTIVE_SCALE   = 0.80;
const INACTIVE_OPACITY = 0.42;
const SNAP_DURATION    = 0.62;
const SNAP_EASE        = 'power3.out';
const SLIDE_H          = 520;
const GAP              = 30;
const SLIDE_W_FRAC     = 0.50;

const DraggableGalleryCarousel = ({ onOpen }: { onOpen: (idx: number) => void }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const trackRef      = useRef<HTMLDivElement>(null);
  const slidesRef     = useRef<(HTMLDivElement | null)[]>([]);
  const autoRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef      = useRef(0);
  const trackX        = useRef(0);
  const isDragging    = useRef(false);
  const drag          = useRef({ active: false, startX: 0, startTrackX: 0, lastX: 0, lastTime: 0, velocity: 0 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIdx,  setHoveredIdx]  = useState<number | null>(null);
  const [slideW, setSlideW]           = useState(700);

  useEffect(() => {
    const calc = () => {
      const w = containerRef.current?.offsetWidth ?? window.innerWidth;
      setSlideW(Math.round(w * SLIDE_W_FRAC));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const step = slideW + GAP;

  const centerXFor = useCallback((i: number) => {
    const w = containerRef.current?.offsetWidth ?? window.innerWidth;
    return w / 2 - i * step - slideW / 2;
  }, [step, slideW]);

  const render = useCallback(() => {
    const track = trackRef.current;
    const el    = containerRef.current;
    if (!track || !el) return;
    track.style.transform = `translateX(${trackX.current}px)`;
    const center = el.offsetWidth / 2;

    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      const slideCenter = i * step + slideW / 2 + trackX.current;
      const norm = (slideCenter - center) / step;
      const abs  = Math.abs(norm);
      const ry   = norm * MAX_ROTATE_Y;
      const tz   = -abs * DEPTH;
      const sc   = Math.max(INACTIVE_SCALE, ACTIVE_SCALE - abs * (ACTIVE_SCALE - INACTIVE_SCALE));
      const op   = Math.max(INACTIVE_OPACITY, 1 - abs * (1 - INACTIVE_OPACITY));
      slide.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${ry}deg) translateZ(${tz}px) scale(${sc})`;
      slide.style.opacity   = `${op}`;
      slide.style.zIndex    = `${100 - Math.round(abs * 10)}`;
    });
  }, [step, slideW]);

  const snapTo = useCallback((i: number, instant = false) => {
    const target = ((i % items.length) + items.length) % items.length;
    const x = centerXFor(target);
    indexRef.current = target;
    setActiveIndex(target);
    if (instant) { trackX.current = x; render(); return; }
    gsap.killTweensOf(trackX);
    gsap.to(trackX, { current: x, duration: SNAP_DURATION, ease: SNAP_EASE, onUpdate: render });
  }, [centerXFor, render]);

  useEffect(() => {
    slidesRef.current = slidesRef.current.slice(0, items.length);
    snapTo(indexRef.current, true);
  }, [slideW, snapTo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onStart = (e: MouseEvent | TouchEvent) => {
      gsap.killTweensOf(trackX);
      isDragging.current = false;
      drag.current = {
        active: true,
        startX: 'touches' in e ? e.touches[0].clientX : e.clientX,
        startTrackX: trackX.current,
        lastX: 'touches' in e ? e.touches[0].clientX : e.clientX,
        lastTime: Date.now(),
        velocity: 0,
      };
      container.style.cursor = 'grabbing';
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!drag.current.active) return;
      if ('cancelable' in e && (e as TouchEvent).cancelable) e.preventDefault();
      const x   = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const now  = Date.now();
      const dt   = now - drag.current.lastTime;
      if (dt > 0) drag.current.velocity = (x - drag.current.lastX) / dt * 1000;
      drag.current.lastX    = x;
      drag.current.lastTime = now;
      const dx = x - drag.current.startX;
      if (Math.abs(dx) > 6) isDragging.current = true;
      trackX.current = drag.current.startTrackX + dx;
      render();
    };

    const onEnd = () => {
      if (!drag.current.active) return;
      drag.current.active    = false;
      container.style.cursor = 'grab';
      if (!isDragging.current) return;
      const projected = trackX.current + drag.current.velocity * 0.12;
      const center    = container.offsetWidth / 2;
      let best = 0, bestDist = Infinity;
      for (let i = 0; i < items.length; i++) {
        const sc = i * step + slideW / 2 + projected;
        const d  = Math.abs(sc - center);
        if (d < bestDist) { bestDist = d; best = i; }
      }
      snapTo(best);
    };

    container.addEventListener('mousedown',  onStart);
    window.addEventListener('mousemove',     onMove as EventListener);
    window.addEventListener('mouseup',       onEnd);
    container.addEventListener('touchstart', onStart as EventListener, { passive: true });
    window.addEventListener('touchmove',     onMove as EventListener, { passive: false });
    window.addEventListener('touchend',      onEnd);
    return () => {
      container.removeEventListener('mousedown',  onStart);
      window.removeEventListener('mousemove',     onMove as EventListener);
      window.removeEventListener('mouseup',       onEnd);
      container.removeEventListener('touchstart', onStart as EventListener);
      window.removeEventListener('touchmove',     onMove as EventListener);
      window.removeEventListener('touchend',      onEnd);
    };
  }, [step, slideW, render, snapTo]);

  useEffect(() => {
    const tick  = () => snapTo(indexRef.current + 1);
    const start = () => { if (autoRef.current) clearInterval(autoRef.current); autoRef.current = setInterval(tick, 4500); };
    const stop  = () => { if (autoRef.current) clearInterval(autoRef.current); };
    start();
    const el = containerRef.current;
    if (el) { el.addEventListener('mouseenter', stop); el.addEventListener('mouseleave', start); }
    return () => { stop(); if (el) { el.removeEventListener('mouseenter', stop); el.removeEventListener('mouseleave', start); } };
  }, [snapTo]);

  const activeItem = items[activeIndex];

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        ref={containerRef}
        style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          height: SLIDE_H + 64,
          overflow: 'hidden',
          cursor: 'grab',
          userSelect: 'none',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Side vignettes */}
        {(['left', 'right'] as const).map(side => (
          <div key={side} style={{
            position: 'absolute', [side]: 0, top: 0, bottom: 0, width: 200, zIndex: 20,
            pointerEvents: 'none',
            background: `linear-gradient(to ${side === 'left' ? 'right' : 'left'}, #000000 0%, transparent 100%)`,
          }} />
        ))}

        {/* Prev arrow */}
        <button
          onClick={() => snapTo(indexRef.current - 1)}
          aria-label="Previous slide"
          style={{
            position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%)', zIndex: 30,
            width: 48, height: 48, borderRadius: '50%',
            background: `${activeItem.accentColor}1A`,
            border: `1.5px solid ${activeItem.accentColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', backdropFilter: 'blur(10px)',
            transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background  = `${activeItem.accentColor}30`;
            b.style.boxShadow   = `0 0 18px ${activeItem.accentColor}40`;
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background  = `${activeItem.accentColor}1A`;
            b.style.boxShadow   = 'none';
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Next arrow */}
        <button
          onClick={() => snapTo(indexRef.current + 1)}
          aria-label="Next slide"
          style={{
            position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', zIndex: 30,
            width: 48, height: 48, borderRadius: '50%',
            background: `${activeItem.accentColor}1A`,
            border: `1.5px solid ${activeItem.accentColor}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#fff', backdropFilter: 'blur(10px)',
            transition: 'background 0.25s, border-color 0.25s, box-shadow 0.25s',
          }}
          onMouseEnter={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background  = `${activeItem.accentColor}30`;
            b.style.boxShadow   = `0 0 18px ${activeItem.accentColor}40`;
          }}
          onMouseLeave={e => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.background  = `${activeItem.accentColor}1A`;
            b.style.boxShadow   = 'none';
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Sliding track */}
        <div ref={trackRef} style={{ display: 'flex', gap: `${GAP}px`, alignItems: 'center', willChange: 'transform' }}>
          {items.map((it, i) => (
            <div
              key={it.id}
              ref={el => { slidesRef.current[i] = el; }}
              onClick={() => {
                if (isDragging.current) return;
                if (i !== indexRef.current) { snapTo(i); return; }
                onOpen(i);
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                width: slideW,
                height: SLIDE_H,
                borderRadius: 16, // Smoothed back to classic elegant look
                overflow: 'hidden',
                flexShrink: 0,
                willChange: 'transform, opacity',
                cursor: i === activeIndex ? 'pointer' : 'grab',
                position: 'relative',
                border: `1.5px solid ${i === activeIndex ? it.accentColor + '50' : 'rgba(255,255,255,0.07)'}`,
                transition: 'border-color 0.5s',
                boxShadow: i === activeIndex
                  ? `0 0 72px ${it.accentColor}1A, 0 28px 64px rgba(0,0,0,0.70)`
                  : '0 8px 32px rgba(0,0,0,0.45)',
              }}
            >
              {/* Image */}
              <img
                src={it.image}
                alt={it.title}
                draggable={false}
                style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                  pointerEvents: 'none',
                  transform: hoveredIdx === i ? 'scale(1.045)' : 'scale(1)',
                  transition: 'transform 0.65s ease',
                }}
              />

              {/* Dark gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(4,6,14,0.96) 0%, rgba(4,6,14,0.28) 50%, transparent 100%)',
              }} />

              {/* Accent tint */}
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${it.accentColor}44 0%, transparent 55%)`,
                opacity: hoveredIdx === i ? 1 : 0.4,
                transition: 'opacity 0.4s',
              }} />

              {/* Minimal Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${it.accentColor}, transparent 70%)`,
              }} />

              {/* Date Badge */}
              <span style={{
                position: 'absolute', top: '1rem', right: '1rem',
                padding: '4px 12px', borderRadius: '9999px',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.85)', fontSize: '0.7rem',
                fontFamily: 'Outfit, sans-serif', backdropFilter: 'blur(8px)',
              }}>{it.date}</span>

              {/* Bottom Info Blocks */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '1.6rem 2rem',
                transform: hoveredIdx === i ? 'translateY(0)' : 'translateY(5px)',
                transition: 'transform 0.35s ease',
              }}>
                <h3 style={{
                  fontFamily: 'FuturaCyrillicBold, Impact, sans-serif',
                  fontSize: 'clamp(1.4rem, 2vw, 1.8rem)',
                  fontWeight: 800, color: '#fff', lineHeight: 1.2, margin: '0 0 0.3rem',
                }}>{it.title}</h3>

                <div style={{
                  fontFamily: 'Outfit, sans-serif', fontSize: '0.9rem',
                  color: it.accentColor, fontWeight: 600, marginBottom: '0.6rem',
                }}>{it.subtitle}</div>

                {/* Description slide */}
                <p style={{
                  color: 'rgba(209,213,219,0.8)', fontFamily: 'Outfit, sans-serif',
                  fontSize: '0.85rem', lineHeight: 1.65, fontWeight: 300, margin: '0 0 0.8rem',
                  maxHeight: hoveredIdx === i ? '100px' : '0px',
                  overflow: 'hidden', opacity: hoveredIdx === i ? 1 : 0,
                  transition: 'opacity 0.38s ease, max-height 0.38s ease',
                }}>{it.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Slider */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: '0.5rem', marginTop: '1.5rem',
      }}>
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => snapTo(i)}
            aria-label={`Go to ${it.title}`}
            style={{
              width: i === activeIndex ? '26px' : '8px', height: '8px', borderRadius: '9999px',
              background: i === activeIndex ? activeItem.accentColor : 'rgba(255,255,255,0.18)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.35s ease',
              boxShadow: i === activeIndex ? `0 0 10px ${activeItem.accentColor}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ══ MAIN EXPORT ═════════════════════════════════════════════════════════ */
export const Gallery = () => {
  const { ref, isVisible }    = useScrollAnimation(0.08);
  const [lightboxIdx, setLB]  = useState<number | null>(null);
  const isMobileView          = useIsMobile(640);
  const isDesktop             = !useIsMobile(1024);
  const titleRef              = useRef<HTMLHeadingElement>(null);
  const titleVisible          = useInView(titleRef, { once: false, margin: "0px 0px -100px 0px" });

  return (
    <section
      id="gallery"
      style={{
        position: 'relative',
        paddingTop:    'clamp(15rem, 20vw, 25rem)',
        paddingBottom: 'clamp(6rem, 10vw, 8rem)',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* MASSIVE BACKGROUND WATERMARK */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0">
        <h1 style={{ 
          fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', 
          fontSize: 'clamp(8rem, 28vw, 36rem)', 
          color: 'rgba(255, 255, 255, 0.12)',
          lineHeight: 0.8,
          whiteSpace: 'nowrap',
          letterSpacing: '-0.02em',
          transform: 'translateY(-18vh)'
        }}>
          GALLERY
        </h1>
      </div>

      {/* Ambient Red Glows */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '70vw', height: '45vw', maxWidth: 800, maxHeight: 450,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(220,38,38,0.08) 0%, transparent 60%)',
        filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div ref={ref} style={{ position: 'relative', zIndex: 10, paddingTop: '2rem' }}>

        {/* ── DESKTOP: Full-bleed 3D drag carousel ── */}
        {isDesktop ? (
          <DraggableGalleryCarousel onOpen={i => setLB(i)} />
        ) : (
          /* ── MOBILE / TABLET: Grid ── */
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {isMobileView && (
              <h2 style={{
                fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
                fontSize: '3.5rem', fontWeight: 900, color: '#fff',
                lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase',
                margin: '0 0 2rem 0', textAlign: 'center', position: 'relative', zIndex: 10
              }}>
                GALLERY
              </h2>
            )}
            <div style={{
              padding: '0 clamp(1.5rem, 4vw, 2rem)',
              display: 'grid',
              gridTemplateColumns: isMobileView ? '1fr' : 'repeat(2, 1fr)',
              gap: 'clamp(1rem, 3vw, 1.5rem)',
              position: 'relative', zIndex: 10
            }}>
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setLB(index)}
                style={{
                  position: 'relative', borderRadius: '1rem',
                  overflow: 'hidden', cursor: 'pointer',
                  aspectRatio: item.colSpan ? '16/9' : '4/3',
                  gridColumn: (!isMobileView && item.colSpan) ? 'span 2' : undefined,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
                  transition: `opacity 0.55s ease ${index * 70}ms, transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94) ${index * 70}ms`,
                  border: `1px solid ${item.accentColor}25`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.35)`,
                  background: '#000'
                }}
              >
                <img src={item.image} alt={item.title} loading="lazy" style={{
                  width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.85
                }} />
                
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                  <div style={{
                    fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', fontWeight: 700, color: '#fff',
                    fontSize: isMobileView ? '1.1rem' : '1.3rem', lineHeight: 1.2, marginBottom: '0.2rem'
                  }}>{item.title}</div>
                  <div style={{
                    fontSize: isMobileView ? '0.75rem' : '0.85rem',
                    fontFamily: 'Outfit, sans-serif', color: item.accentColor, fontWeight: 600
                  }}>{item.subtitle}</div>
                </div>
                <span style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  padding: '4px 10px', background: `rgba(0,0,0,0.6)`, border: `1px solid rgba(255,255,255,0.15)`,
                  color: '#fff', fontSize: '0.65rem', fontFamily: 'Outfit, sans-serif', borderRadius: '999px', backdropFilter: 'blur(4px)'
                }}>{item.date}</span>
              </div>
            ))}
            </div>
          </div>
        )}
      </div>

      {lightboxIdx !== null && (
        <Lightbox startIndex={lightboxIdx} onClose={() => setLB(null)} />
      )}
    </section>
  );
};