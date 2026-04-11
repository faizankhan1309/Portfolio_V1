/**
 * Research.tsx — complete rewrite from scratch
 *
 * Updates:
 * 1. Golden/Amber theme changed to Red theme.
 * 2. Card design flattened (removed box shadows, background hover state, radial gradient hover).
 * 3. Text size inside cards increased for enhanced readability.
 */

import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

/* ─── DATA ────────────────────────────────────────────────────────────── */

const ITEMS = [
  {
    id: 1,
    label: 'Research',
    status: null as string | null,
    title: 'Next-Gen Precision Rendering',
    desc: 'A deep-dive into photorealistic 3D automotive rendering using Blender Cycles — exploring physically-accurate lighting, advanced material workflows, and high-fidelity asset pipelines for commercial use.',
    areas: [
      'HDRI-based environment lighting for physical accuracy',
      'Advanced paint, glass, and chrome material shaders',
      'Commercial-grade asset pipeline and delivery',
    ],
    tools: ['Blender', 'Cycles', 'HDRI Lighting', 'Automotive Viz'],
    link: null as string | null,
  },
  {
    id: 2,
    label: 'Research',
    status: 'Ongoing',
    title: '3D → 4D: Gaussian Splatting',
    desc: 'Extending Gaussian Splatting beyond static 3D reconstructions into dynamic 4D scene representations — enabling real-time neural rendering of objects and environments that change over time.',
    areas: [
      'Dynamic scene reconstruction from multi-view video',
      'Bridging NeRF and temporal 4D representations',
      'Real-time neural rendering with Gaussian primitives',
    ],
    tools: ['Gaussian Splatting', 'NeRF', 'Computer Vision', 'Python'],
    link: null as string | null,
  },
];

/* ─── FILM GRAIN ──────────────────────────────────────────────────────── */

const Grain = () => (
  <div aria-hidden style={{
    position: 'absolute', inset: '-55%', width: '210%', height: '210%',
    zIndex: 90, pointerEvents: 'none', opacity: 0.036,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
    backgroundSize: '175px 175px', animation: 'rGrain 0.9s steps(1) infinite',
  }} />
);

/* ─── GLOWING CHAR REVEAL ─────────────────────────────────────────────── */

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
          filter: 'blur(28px)', color: '#dc2626', // Updated to Red
          font: 'inherit', fontWeight: 900,
          userSelect: 'none', zIndex: 0,
        }}
      >{text}</motion.span>

      {/* real chars — clip slide-up */}
      {chars.map((ch, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', position: 'relative', zIndex: 1 }}>
          <motion.span style={{ display: 'inline-block' }}
            initial={{ y: '108%' }}
            animate={{ y: go ? '0%' : '108%' }}
            transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1], delay: 0.16 + i * 0.055 }}
          >{ch}</motion.span>
        </span>
      ))}
    </span>
  );
};

/* ─── CARD ────────────────────────────────────────────────────────────── */

const Card = ({ item }: { item: typeof ITEMS[0] }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        /* fill the full grid cell — this is what makes both cards equal height */
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        // Update: Flat background, removed background state change
        background: '#090c1a',
        // Update: Red accent border on hover, lighter transparent border normal
        border: `1px solid ${hov ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '0.85rem',
        // Update: Removed box shadows entirely for flat design
        boxShadow: 'none',
        overflow: 'hidden',
        transition: 'border 0.3s',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      {/* Update: Removed hover radial gradient div block entirely */}

      {/* ── content ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', flex: 1,
        padding: '2.2rem 2.4rem 2rem', // Updated: Increased padding
        gap: 0,
        overflow: 'hidden',
      }}>

        {/* badges */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <span style={{ padding: '4px 12px', borderRadius: 999, fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.28)', color: '#f87171' }}>
            {/* Update: Golden badges to Red, Font size increased */}
            {item.label}
          </span>
          {item.status && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '4px 11px', borderRadius: 999, fontSize: '0.75rem', fontFamily: 'monospace', letterSpacing: '0.10em', textTransform: 'uppercase', background: 'rgba(220,38,38,0.10)', border: '1px solid rgba(220,38,38,0.26)', color: '#fca5a5' }}>
               {/* Update: Golden badges to Red, Font size increased */}
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fca5a5', display: 'inline-block', animation: 'pulse_red 2s ease-in-out infinite' }} />
               {/* Update: Pulse animation name updated to match red theme */}
              {item.status}
            </span>
          )}
        </div>

        {/* title */}
        <h3 style={{ margin: '0 0 0.8rem', fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', fontSize: 'clamp(1.3rem, 2.2vw, 1.8rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          {/* Update: Font size clamp range increased significantly */}
          {item.title}
        </h3>

        {/* description */}
        <p style={{ margin: '0 0 1.4rem', color: 'rgba(210,216,235,0.82)', fontSize: 'clamp(1.0rem, 1.25vw, 1.2rem)', lineHeight: 1.65, fontFamily: 'Outfit, sans-serif', fontWeight: 300 }}>
          {/* Update: Font size clamp range increased, opacity increased for better contrast */}
          {item.desc}
        </p>

        {/* focus areas */}
        <p style={{ margin: '0 0 0.6rem', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.6)' }}>
          {/* Update: Golden to Red accent color, Font size increased */}
          Key Focus Areas
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {item.areas.map((a, i) => (
            <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <span style={{ flexShrink: 0, marginTop: 9, width: 5, height: 5, borderRadius: '50%', background: hov ? '#f87171' : 'rgba(239,68,68,0.5)', display: 'inline-block', transition: 'background 0.28s' }} />
              {/* Update: Bullet point color golden to Red variants, bullet size slightly increased */}
              <span style={{ color: 'rgba(210,216,235,0.85)', fontSize: '1.0rem', lineHeight: 1.55, fontFamily: 'Outfit, sans-serif' }}>{a}</span>
              {/* Update: Font size increased from 0.81rem to 1.0rem */}
            </li>
          ))}
        </ul>

        {/* tools */}
        <p style={{ margin: '0 0 0.5rem', fontFamily: 'monospace', fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.6)' }}>
           {/* Update: Golden to Red accent color, Font size increased */}
          Tools
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {item.tools.map(t => (
            <span key={t} style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.04em', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}>
               {/* Update: Font size increased from 0.67rem to 0.8rem */}
              {t}
            </span>
          ))}
        </div>

        {/* cta — pinned to bottom via marginTop:auto */}
        <div style={{ marginTop: 'auto', paddingTop: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.95rem', fontWeight: 500, color: 'rgba(255,255,255,0.4)', cursor: 'default' }}>
             {/* Update: Font size increased from 0.8rem to 0.95rem */}
            View Project <ArrowUpRight size={14} /> {/* Updated icon size */}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN ────────────────────────────────────────────────────────────── */

export const Research = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  
  // A dedicated ref just for the title element
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // FIXED: once is now set to false, allowing the animation to trigger every time it enters the viewport
  const visible  = useInView(titleRef, { once: false, margin: "0px 0px -100px 0px" });

  /*
   * outerRef is 300 vh tall.
   * Sticky panel is 100 vh.
   * scrollYProgress travels 0 → 1 over (300-100) = 200 vh of scroll.
   */
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  /* title dims and shrinks */
  const tScale = useTransform(scrollYProgress, [0.10, 0.46], [1, 0.84]);
  // Text remains fully visible; removing the tOpac use below to keep title opacity consistent.
  const tOpac  = useTransform(scrollYProgress, [0.10, 0.46], [1, 1]); // Keeping fully opaque

  /*
   * Cards use PIXEL x-translation, not percentage.
   * 700px is safely off-screen for any monitor.
   * Stagger: card 2 starts 0.08 later.
   */
  const c1x = useTransform(scrollYProgress, [0.28, 0.58], [-720, 0]);
  const isMobile = useIsMobile(768);
 
  const c2x = useTransform(scrollYProgress, [0.28, 0.58], [720, 0]);


  if (isMobile) {
    return (
      <div id="research" style={{ position: 'relative', background: '#000000', minHeight: '100vh', padding: '6rem 1rem', display: 'flex', flexDirection: 'column', gap: '3rem', overflow: 'hidden' }}>
        <Grain />
        <h2 style={{
          fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
          fontSize: '3.5rem', fontWeight: 900, color: '#fff',
          lineHeight: 1, letterSpacing: '-0.02em', textTransform: 'uppercase',
          margin: '0', textAlign: 'center', zIndex: 10
        }}>
          RESEARCH
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10 }}>
          <Card item={ITEMS[0]} />
          <Card item={ITEMS[1]} />
        </div>

        {/* mobile ambient blob */}
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: 350, height: 350, background: 'rgba(239,68,68,0.15)',
          filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
        }} />
      </div>
    );
  }

  return (
    <div ref={outerRef} id="research" style={{ position: 'relative', height: '300vh' }}>

      {/* ── sticky canvas ── */}
      <div style={{
        position: 'sticky', top: 0,
        height: '100vh', overflow: 'hidden',
        background: '#000000',          /* exact match with Projects → seamless */
      }}>
        <Grain />

        {/* amber ambient blob */}
        <div style={{
          position: 'absolute', top: '42%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 700, height: 400,
          background: 'radial-gradient(ellipse, rgba(239,68,68,0.06) 0%, transparent 68%)', // Updated: Golden to Red ambient color
          filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0,
        }} />

        {/* ══ LAYER 1 — big title ══════════════════════════════════════════ */}
        <motion.div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          scale: tScale,
          opacity: tOpac, // Using constant opaque tOpac value
          pointerEvents: 'none',
        }}>
          

          {/* huge word - Attached titleRef here */}
          <h2 ref={titleRef} style={{
            fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
            fontSize: 'clamp(4.5rem, 16vw, 18rem)',
            fontWeight: 900, color: '#ffffffff',
            lineHeight: 0.88, letterSpacing: '-0.04em', textTransform: 'uppercase',
            margin: '0 0 1.4rem',
          }}>
            <GlowTitle text="RESEARCH" go={visible} />
          </h2>
        </motion.div>

        {/* ══ LAYER 2 — equal-height cards over the dimmed title ═══════════ */}
        <div style={{
          position: 'absolute',
          top: '50%', left: 0, right: 0,
          transform: 'translateY(-50%)',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gridTemplateRows: isMobile ? '1fr 1fr' : '1fr',
          alignItems: 'stretch',
          gap: isMobile ? '1rem' : 'clamp(1rem, 1.8vw, 1.5rem)',
          padding: isMobile ? '0 1rem' : '0 clamp(2rem, 5vw, 5rem)',
          height: isMobile ? '80vh' : 'clamp(380px, 60vh, 550px)', 
          pointerEvents: 'none',
        }}>

          {/* card 1 — from LEFT */}
          <motion.div style={{
            height: '100%',          /* fill grid cell */
            x: c1x,
            
            pointerEvents: 'auto',
          }}>
            <Card item={ITEMS[0]} />
          </motion.div>

          {/* card 2 — from RIGHT */}
          <motion.div style={{
            height: '100%',
            x: c2x,
            
            pointerEvents: 'auto',
          }}>
            <Card item={ITEMS[1]} />
          </motion.div>
        </div>



        {/* top + bottom blend fades */}
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, #000000, transparent)', zIndex: 70, pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #000000, transparent)', zIndex: 70, pointerEvents: 'none' }} />
      </div>

      <style>{`
        @keyframes rGrain {
          0%  { transform:translate(0,0) }       14% { transform:translate(-1.4%,-1.8%) }
          28% { transform:translate(1.8%,1.2%) }  43% { transform:translate(-0.9%,1.7%) }
          57% { transform:translate(1.8%,-0.9%) } 71% { transform:translate(-1.5%,1.6%) }
          86% { transform:translate(1.1%,-1.6%) } 100%{ transform:translate(0,0) }
        }
        @keyframes pulse_red {
          0%,100% { opacity:1; transform:scale(1) }
          50%     { opacity:.5; transform:scale(1.4) }
        }
      `}</style>
    </div>
  );
};