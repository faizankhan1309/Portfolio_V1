/**
 * Skills.tsx — Responsive (3-tier layout)
 *   Desktop (≥1024px):  original interactive blob arena — UNCHANGED
 *   Tablet (768–1023px): 2-column grid of skill category panels
 *   Mobile (<768px):    vertical accordion — tap to expand/collapse with smooth CSS transition
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { Brain, Code, Palette, Wrench, ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useIsMobile } from '../hooks/useIsMobile';

/* ══ LOGO REGISTRY (unchanged) ══════════════════════════════════════════ */
const LOGO_URL: Record<string, { src: string; invert?: boolean }> = {
  Python:            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  TensorFlow:        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
  PyTorch:           { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
  'GCP (Vertex AI)': { src: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Vertex_AI_Logo.svg' },
  'Scikit-learn':    { src: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg' },
  OpenCV:            { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
  NLP:               { src: 'https://cdn.simpleicons.org/openai/00F0FF' },
  'Prompt Eng.':     { src: 'https://cdn.simpleicons.org/anthropic/00F0FF' },
  React:             { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  JavaScript:        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  'HTML/CSS':        { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  'Node.js':         { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  Tailwind:          { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  'REST APIs':       { src: 'https://cdn.simpleicons.org/fastapi/009688' },
  Figma:             { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  'Blender':         { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
  Photoshop:         { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
  'Premiere Pro':    { src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg' },
  'After Effects':   { src: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg' },
  Illustrator:       { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
  'Git/GitHub':      { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', invert: true },
  'VS Code':         { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  'Notion':          { src: 'https://cdn.simpleicons.org/notion/ffffff' },
  'MySQL':           { src: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/MySQL_textlogo.svg' },
  'DaVinci Resolve': { src: 'https://cdn.simpleicons.org/davinciresolve/ffffff' },
  'Postgresql':      { src: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Postgresql_elephant.svg' },
};

const Logo = ({ name, size }: { name: string; size: number }) => {
  const entry = LOGO_URL[name];
  const iconSize = Math.round(size * 0.50);
  if (!entry) return <span style={{ fontSize: size * 0.26, lineHeight: 1 }}>⚙️</span>;
  return (
    <img
      src={entry.src} alt={name} width={iconSize} height={iconSize}
      style={{ width: iconSize, height: iconSize, objectFit: 'contain', display: 'block',
        filter: entry.invert ? 'brightness(0) invert(1)' : 'none' }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
};

/* ══ TYPES & SIZING CONSTANTS (unchanged) ══════════════════════════════ */
type SkillTier = 'xl' | 'lg' | 'md' | 'sm';
interface Skill { name: string; desc: string; tier: SkillTier; }

const POSITION_SIZE    = [230, 192, 130, 62] as const;
const POSITION_OPACITY = [1.0, 0.90, 0.76, 0.60] as const;
const POSITION_ZINDEX  = [20,  16,   12,   8] as const;
const OVERLAP_PX       = 24;
const ARENA_HEIGHT     = 340;
const FLOAT_DELAYS     = [0, -1.2, -2.4, -0.6, -1.8, -3.0, -0.9];

interface PositionedSkill {
  skill: Skill; side: 'left'|'right'; posIndex: number;
  size: number; opacity: number; zIndex: number; floatDelay: number;
}

function buildSymmetricLayout(skills: Skill[]) {
  const leftBlobs: PositionedSkill[]  = [];
  const rightBlobs: PositionedSkill[] = [];
  skills.forEach((skill, i) => {
    const side: 'left'|'right' = i % 2 === 0 ? 'left' : 'right';
    const posIndex = Math.floor(i / 2);
    const safe = Math.min(posIndex, POSITION_SIZE.length - 1);
    const entry: PositionedSkill = {
      skill, side, posIndex,
      size: POSITION_SIZE[safe], opacity: POSITION_OPACITY[safe],
      zIndex: POSITION_ZINDEX[safe], floatDelay: FLOAT_DELAYS[i % FLOAT_DELAYS.length],
    };
    side === 'left' ? leftBlobs.push(entry) : rightBlobs.push(entry);
  });
  return { leftBlobs, rightBlobs };
}

/* ══ SKILL BLOB (unchanged) ════════════════════════════════════════════ */
interface BlobProps {
  positioned: PositionedSkill; shadow: string; entering: boolean;
  isVisible: boolean; animIndex: number; onHover: (s: Skill | null) => void;
}

const SkillBlob = ({ positioned, shadow, entering, isVisible, animIndex, onHover }: BlobProps) => {
  const [hov, setHov] = useState(false);
  const { skill, size, opacity, zIndex, floatDelay } = positioned;
  return (
    <div
      style={{
        position: 'relative', width: size, height: size, flexShrink: 0,
        zIndex: hov ? 30 : zIndex,
        opacity: (entering || !isVisible) ? 0 : opacity,
        transition: entering ? 'opacity 0.2s' : `opacity 0.55s ${animIndex * 55}ms cubic-bezier(0.34,1.2,0.64,1)`,
        cursor: 'pointer',
      }}
      onMouseEnter={() => { setHov(true);  onHover(skill); }}
      onMouseLeave={() => { setHov(false); onHover(null);  }}
    >
      <div style={{
        animation: `orbFloat ${3.4 + animIndex * 0.22}s ease-in-out infinite`,
        animationDelay: `${floatDelay}s`, width: '100%', height: '100%',
      }}>
        <div style={{
          position: 'absolute', inset: -(size * 0.16), borderRadius: '50%',
          background: `radial-gradient(circle, ${shadow}${hov ? '0.44' : '0.16'}) 0%, transparent 65%)`,
          filter: `blur(${hov ? 26 : 15}px)`,
          transition: 'all 0.35s', pointerEvents: 'none',
        }}/>
        <div style={{
          width: '100%', height: '100%', borderRadius: '50%', position: 'relative',
          transform: hov ? 'scale(1.10)' : 'scale(1)',
          transition: 'transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            border: `${hov ? 2.5 : 1.5}px solid ${shadow}${hov ? '0.78' : '0.32'})`,
            boxShadow: hov
              ? `0 0 52px ${shadow}0.60), 0 0 95px ${shadow}0.25), inset 0 0 28px ${shadow}0.13)`
              : `0 0 28px ${shadow}0.38), 0 0 56px ${shadow}0.15), inset 0 0 18px ${shadow}0.07)`,
            transition: 'all 0.32s',
          }}/>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `radial-gradient(circle at 33% 28%, ${shadow}0.26), ${shadow}0.07))`,
            backdropFilter: 'blur(18px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              filter: `drop-shadow(0 0 ${hov ? 14 : 6}px ${shadow}0.85))`,
              transition: 'filter 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Logo name={skill.name} size={size} />
            </div>
          </div>
        </div>
        <div style={{
          position: 'absolute', bottom: size + 10, left: '50%',
          transform: `translateX(-50%) translateY(${hov ? 0 : 6}px)`,
          opacity: hov ? 1 : 0, transition: 'all 0.24s', whiteSpace: 'nowrap',
          fontSize: Math.max(10, size * 0.09), fontWeight: 600, color: '#fff',
          fontFamily: 'monospace', letterSpacing: '0.07em',
          textShadow: `0 0 10px ${shadow}0.9)`, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.65)', padding: '3px 9px', borderRadius: 6, zIndex: 40,
        } as React.CSSProperties}>
          {skill.name}
        </div>
      </div>
    </div>
  );
};

/* ══ BLOB GROUP (unchanged) ════════════════════════════════════════════ */
interface BlobGroupProps {
  blobs: PositionedSkill[]; leftSide: boolean; shadow: string;
  entering: boolean; isVisible: boolean; onHover: (s: Skill|null) => void; baseAnimIndex: number;
}

const BlobGroup = ({ blobs, leftSide, shadow, entering, isVisible, onHover, baseAnimIndex }: BlobGroupProps) => {
  const ordered = leftSide ? [...blobs].reverse() : [...blobs];
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      {ordered.map((pos, i) => {
        const isLast = i === ordered.length - 1;
        return (
          <div key={pos.skill.name} style={{
            marginRight: leftSide && !isLast ? -OVERLAP_PX : 0,
            marginLeft:  !leftSide && i > 0  ? -OVERLAP_PX : 0,
            zIndex: leftSide ? (i + 1) * 2 : (ordered.length - i) * 2,
          }}>
            <SkillBlob
              positioned={pos} shadow={shadow} entering={entering}
              isVisible={isVisible} animIndex={baseAnimIndex + i} onHover={onHover}
            />
          </div>
        );
      })}
    </div>
  );
};

/* ══ CENTER CARD (unchanged) ════════════════════════════════════════════ */
const CenterCard = ({ name, shadow, accent, entering }: {
  name: string; shadow: string; accent: string; entering: boolean;
}) => (
  <div style={{
    flexShrink: 0, zIndex: 25,
    opacity: entering ? 0 : 1, transition: 'opacity 0.3s, border-color 0.6s, box-shadow 0.6s',
    pointerEvents: 'none', display: 'inline-flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '1.8rem 3rem', borderRadius: 20,
    border: `2px solid ${shadow}0.52)`, background: 'rgba(8,11,18,0.92)',
    backdropFilter: 'blur(22px)',
    boxShadow: `0 0 60px ${shadow}0.22), inset 0 0 32px ${shadow}0.06), 0 0 0 1px ${shadow}0.32)`,
    minWidth: 215, maxWidth: 275, textAlign: 'center',
  }}>
    <h3 style={{
      color: '#fff', fontWeight: 800,
      fontSize: 'clamp(0.75rem, 1.7vw, 1.15rem)',
      letterSpacing: '0.13em', textTransform: 'uppercase',
      fontFamily: 'FuturaCyrillicBold, Impact, sans-serif',
      textShadow: `0 0 26px ${shadow}0.52)`, margin: 0, lineHeight: 1.45,
    }}>{name}</h3>
    <div style={{
      width: 34, height: 2, borderRadius: 99,
      background: accent, boxShadow: `0 0 12px ${shadow}0.90)`,
      marginTop: '0.75rem', transition: 'background 0.6s, box-shadow 0.6s',
    }}/>
  </div>
);

/* ══ BOTTOM INFO BAR (unchanged) ════════════════════════════════════════ */
const SkillInfoBar = ({ skill, accent, shadow }: {
  skill: Skill | null; accent: string; shadow: string;
}) => (
  <div style={{
    width: '100%',
    opacity: skill ? 1 : 0,
    transform: `translateY(${skill ? '0px' : '10px'})`,
    transition: 'opacity 0.32s ease, transform 0.32s ease',
    pointerEvents: 'none', marginTop: 28,
  }}>
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.4rem',
      background: 'rgba(6,9,18,0.88)',
      border: `1px solid ${shadow}0.32)`,
      borderRadius: 16, padding: '1rem 1.6rem',
      backdropFilter: 'blur(24px)',
      boxShadow: `0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px ${shadow}0.08)`,
      maxWidth: 'min(680px, 100%)', margin: '0 auto',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        background: `${shadow}0.12)`, border: `1.5px solid ${shadow}0.30)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 18px ${shadow}0.22)`,
      }}>
        {skill && <Logo name={skill.name} size={48} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
          <h3 style={{
            color: '#fff', fontWeight: 700, fontSize: '1rem', margin: 0,
            letterSpacing: '0.03em', fontFamily: 'FuturaCyrillicBold, sans-serif', whiteSpace: 'nowrap',
          }}>{skill?.name}</h3>
          {skill && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
              background: `${shadow}0.10)`, border: `1px solid ${shadow}0.22)`,
              borderRadius: 99, padding: '2px 10px', color: accent, fontSize: 10,
              fontFamily: 'monospace', letterSpacing: '0.09em', flexShrink: 0,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, display: 'inline-block' }}/>
              {skill.tier === 'xl' ? 'EXPERT' : skill.tier === 'lg' ? 'ADVANCED' : skill.tier === 'md' ? 'PROFICIENT' : 'FAMILIAR'}
            </span>
          )}
        </div>
        <p style={{
          color: 'rgba(255,255,255,0.50)', fontSize: '0.80rem', lineHeight: 1.5, margin: 0,
          fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{skill?.desc}</p>
      </div>
      <div style={{
        width: 3, height: 48, borderRadius: 99, flexShrink: 0,
        background: `linear-gradient(180deg, transparent, ${accent}, transparent)`,
        boxShadow: `0 0 12px ${shadow}0.80)`, transition: 'background 0.6s, box-shadow 0.6s',
      }}/>
    </div>
  </div>
);

/* ══ CATEGORY DATA (unchanged) ══════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: 'ai', name: 'AI & Machine Learning', icon: Brain,
    accent: '#ff3333', shadow: 'rgba(255,0,0,',
    skills: [
      { name: 'Python',       desc: 'ML models, automation & data pipelines',   tier: 'xl' },
      { name: 'TensorFlow',   desc: 'Deep learning model training & deployment', tier: 'lg' },
      { name: 'PyTorch',      desc: 'Neural networks & research experiments',    tier: 'lg' },
      { name: 'Scikit-learn', desc: 'Classification, regression & clustering',   tier: 'md' },
      { name: 'OpenCV',       desc: 'Computer vision & real-time image ops',     tier: 'md' },
      { name: 'GCP (Vertex AI)', desc: 'Cloud-based AI development platform',   tier: 'sm' },
      { name: 'Prompt Eng.',  desc: 'Production prompt design for LLMs',         tier: 'lg' },
    ] as Skill[],
  },
  {
    id: 'web', name: 'Web Development', icon: Code,
    accent: '#8B5CF6', shadow: 'rgba(139,92,246,',
    skills: [
      { name: 'React',      desc: 'Interactive UI systems & single-page apps', tier: 'xl' },
      { name: 'JavaScript', desc: 'Core logic, APIs & browser interactions',   tier: 'xl' },
      { name: 'HTML/CSS',   desc: 'Semantic markup & responsive layouts',      tier: 'lg' },
      { name: 'Node.js',    desc: 'Server-side APIs & backend services',       tier: 'md' },
      { name: 'Tailwind',   desc: 'Utility-first styling across all projects', tier: 'lg' },
      { name: 'REST APIs',  desc: 'API integration & data-fetching layers',    tier: 'md' },
    ] as Skill[],
  },
  {
    id: 'design', name: 'Design & Creative', icon: Palette,
    accent: '#F59E0B', shadow: 'rgba(245,158,11,',
    skills: [
      { name: 'Figma',         desc: 'UI/UX design, wireframes & prototypes', tier: 'xl' },
      { name: 'Blender',       desc: 'Cinematic 3D renders & commercials',    tier: 'xl' },
      { name: 'Photoshop',     desc: 'Photo manipulation & digital artwork',  tier: 'lg' },
      { name: 'Premiere Pro',  desc: 'Video editing for brands & events',     tier: 'lg' },
      { name: 'After Effects', desc: 'Motion graphics & kinetic typography',  tier: 'md' },
      { name: 'Illustrator',   desc: 'Vector graphics & brand identity',      tier: 'md' },
    ] as Skill[],
  },
  {
    id: 'tools', name: 'Tools & Platforms', icon: Wrench,
    accent: '#06B6D4', shadow: 'rgba(6,182,212,',
    skills: [
      { name: 'Git/GitHub',     desc: 'Version control & team collaboration', tier: 'xl' },
      { name: 'VS Code',        desc: 'Primary IDE for all development',      tier: 'xl' },
      { name: 'Notion',         desc: 'Project planning & documentation',     tier: 'lg' },
      { name: 'MySQL',          desc: 'Database management & queries',        tier: 'md' },
      { name: 'DaVinci Resolve',desc: 'Professional color grading & editing', tier: 'lg' },
      { name: 'Postgresql',     desc: 'Advanced database management',         tier: 'md' },
    ] as Skill[],
  },
];

/* ══ TIER LABEL ════════════════════════════════════════════════════════ */
const tierLabel = (t: SkillTier) =>
  t === 'xl' ? 'EXPERT' : t === 'lg' ? 'ADVANCED' : t === 'md' ? 'PROFICIENT' : 'FAMILIAR';

/* ══ MOBILE ACCORDION ══════════════════════════════════════════════════
   Matches the design in the screenshot:
   - Dark card with colored border when open
   - Icon badge + category title in header
   - Skill chips: logo icon (left) + name + tier label (stacked right)
   - 2-3 column auto-fill grid inside
 ══════════════════════════════════════════════════════════════════════ */
const MobileAccordion = ({ visible }: { visible: boolean }) => {
  const [openId, setOpenId] = useState<string | null>('ai');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {CATEGORIES.map((cat, ci) => {
        const Icon = cat.icon;
        const isOpen = openId === cat.id;
        const bodyRef = useRef<HTMLDivElement>(null);

        // Smooth height animation
        useEffect(() => {
          const el = bodyRef.current;
          if (!el) return;
          el.style.maxHeight = isOpen ? el.scrollHeight + 'px' : '0px';
        }, [isOpen]);

        return (
          <div
            key={cat.id}
            style={{
              borderRadius: '0.85rem',
              border: `1.5px solid ${isOpen ? cat.shadow + '0.55)' : 'rgba(255,255,255,0.09)'}`,
              background: isOpen
                ? `linear-gradient(135deg, ${cat.shadow}0.08), rgba(10,12,20,0.95))`
                : 'rgba(255,255,255,0.03)',
              overflow: 'hidden',
              transition: 'border-color 0.3s, background 0.3s, opacity 0.6s, transform 0.6s',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(16px)',
              transitionDelay: `${ci * 70}ms`,
              boxShadow: isOpen
                ? `0 4px 32px ${cat.shadow}0.18), 0 0 0 1px ${cat.shadow}0.10)`
                : 'none',
            }}
          >
            {/* ── Header button ── */}
            <button
              onClick={() => setOpenId(prev => prev === cat.id ? null : cat.id)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.9rem 1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                {/* Icon badge */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${cat.shadow}0.15)`,
                  border: `1.5px solid ${cat.shadow}0.35)`,
                  boxShadow: isOpen ? `0 0 14px ${cat.shadow}0.30)` : 'none',
                  transition: 'box-shadow 0.3s',
                  flexShrink: 0,
                }}>
                  <Icon size={19} style={{ color: cat.accent }} />
                </div>

                {/* Category name */}
                <span style={{
                  fontFamily: 'FuturaCyrillicBold, Impact, sans-serif',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: isOpen ? '#ffffff' : 'rgba(255,255,255,0.72)',
                  letterSpacing: '0.03em',
                  textAlign: 'left',
                  transition: 'color 0.25s',
                }}>
                  {cat.name}
                </span>
              </div>

              {/* Chevron */}
              <div style={{
                color: isOpen ? cat.accent : 'rgba(255,255,255,0.35)',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), color 0.25s',
                flexShrink: 0,
              }}>
                <ChevronDown size={18} />
              </div>
            </button>

            {/* ── Collapsible skill grid ── */}
            <div
              ref={bodyRef}
              style={{
                maxHeight: '0px',
                overflow: 'hidden',
                transition: 'max-height 0.42s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <div style={{
                padding: '0.25rem 0.9rem 1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '0.5rem',
              }}>
                {cat.skills.map((skill, si) => (
                  <div
                    key={skill.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.65rem',
                      borderRadius: '0.5rem',
                      background: 'rgba(255,255,255,0.04)',
                      border: `1px solid ${cat.shadow}0.20)`,
                      // Staggered fade-in when expanded
                      animation: isOpen ? `skillFadeIn 0.35s ease both` : 'none',
                      animationDelay: `${si * 45}ms`,
                    }}
                  >
                    {/* Logo */}
                    <div style={{
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Logo name={skill.name} size={32} />
                    </div>

                    {/* Name + tier */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: 1.3,
                      }}>
                        {skill.name}
                      </div>
                      <div style={{
                        fontSize: '0.58rem',
                        color: cat.accent,
                        fontFamily: 'monospace',
                        letterSpacing: '0.05em',
                        marginTop: '2px',
                        lineHeight: 1,
                      }}>
                        {tierLabel(skill.tier)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ══ TABLET GRID (768–1023px) ══════════════════════════════════════════ */
const TabletGrid = ({ visible }: { visible: boolean }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1.25rem',
  }}>
    {CATEGORIES.map((cat, ci) => {
      const Icon = cat.icon;
      return (
        <div
          key={cat.id}
          style={{
            borderRadius: '1rem',
            border: `1px solid ${cat.shadow}0.25)`,
            background: `${cat.shadow}0.05)`,
            backdropFilter: 'blur(14px)',
            padding: '1.4rem',
            transition: 'opacity 0.7s, transform 0.7s',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: `${ci * 100}ms`,
            boxShadow: `0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px ${cat.shadow}0.08)`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `${cat.shadow}0.12)`,
              border: `1px solid ${cat.shadow}0.28)`,
            }}>
              <Icon size={18} style={{ color: cat.accent }} />
            </div>
            <h3 style={{
              fontFamily: 'FuturaCyrillicBold, Impact, sans-serif',
              fontSize: '0.85rem', fontWeight: 700, color: '#ffffff',
              letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0,
            }}>
              {cat.name}
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {cat.skills.map((skill, si) => (
              <div
                key={skill.name}
                title={`${skill.name} — ${tierLabel(skill.tier)}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: '0.3rem', padding: '0.55rem 0.35rem',
                  borderRadius: '0.45rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${cat.shadow}0.12)`,
                  cursor: 'default', transition: 'background 0.2s, border-color 0.2s',
                  animation: `skillFadeIn 0.45s ease both`,
                  animationDelay: visible ? `${ci * 80 + si * 40}ms` : '0ms',
                }}
              >
                <Logo name={skill.name} size={36} />
                <span style={{
                  fontSize: '0.6rem', color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'monospace', textAlign: 'center', lineHeight: 1.2,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%',
                }}>
                  {skill.name}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '1rem', height: '2px', borderRadius: 99,
            background: `linear-gradient(90deg, ${cat.accent}, transparent)`, opacity: 0.5,
          }} />
        </div>
      );
    })}
  </div>
);

/* ══ MAIN EXPORT ════════════════════════════════════════════════════════ */
export const Skills = () => {
  const [activeId,     setActiveId]     = useState('ai');
  const [entering,     setEntering]     = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const { ref, isVisible } = useScrollAnimation(0.1);

  const isMobileOrTablet = useIsMobile(1023);
  const isMobile = useIsMobile(767);

  const category = CATEGORIES.find(c => c.id === activeId)!;
  const { leftBlobs, rightBlobs } = buildSymmetricLayout(category.skills);

  const switchTab = useCallback((id: string) => {
    if (id === activeId) return;
    setHoveredSkill(null);
    setEntering(true);
    setTimeout(() => { setActiveId(id); setEntering(false); }, 280);
  }, [activeId]);

  return (
    <section id="skills" className="relative overflow-hidden bg-[#080B12]" style={{
      padding: 'clamp(3rem, 6vw, 6rem) clamp(1rem, 4vw, 1.5rem)',
    }}>
      {/* Ambient glow — desktop only */}
      {!isMobileOrTablet && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse 70% 65% at 50% 50%, ${category.shadow}0.08) 0%, transparent 72%)`,
          transition: 'background 1s ease',
        }}/>
      )}

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto">

        {/* Title */}
        <div className={`text-center mb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2
            className="font-bold text-white mb-4 tracking-widest"
            style={{ fontFamily: 'FuturaCyrillicBold, Impact, sans-serif', fontSize: 'clamp(2rem, 6vw, 3.75rem)' }}
          >
            MY SKILLS
          </h2>
          <div className="w-28 h-1 bg-red-600 mx-auto rounded-full" />
        </div>

        {/* ── MOBILE: Accordion ── */}
        {isMobile && (
          <MobileAccordion visible={isVisible} />
        )}

        {/* ── TABLET: 2-column grid ── */}
        {!isMobile && isMobileOrTablet && (
          <TabletGrid visible={isVisible} />
        )}

        {/* ── DESKTOP: Original blob arena ── */}
        {!isMobileOrTablet && (
          <>
            <div className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const active = cat.id === activeId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => switchTab(cat.id)}
                    style={{
                      padding: 'clamp(0.5rem, 1.2vw, 0.75rem) clamp(0.75rem, 2vw, 1.7rem)',
                      borderRadius: '0.55rem',
                      border: `1.5px solid ${active ? cat.accent : 'rgba(255,255,255,0.12)'}`,
                      background: active ? `${cat.shadow}0.13)` : 'transparent',
                      color: active ? cat.accent : 'rgba(255,255,255,0.38)',
                      fontWeight: 600, fontSize: 'clamp(0.75rem, 1.5vw, 0.95rem)',
                      letterSpacing: '0.03em', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '0.55rem',
                      boxShadow: active ? `0 0 20px ${cat.shadow}0.28)` : 'none',
                      transition: 'all 0.25s', position: 'relative', zIndex: 100,
                    }}
                  >
                    <Icon size={18}/>{cat.name}
                  </button>
                );
              })}
            </div>

            <div
              className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div style={{
                position: 'relative', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                width: '100%', height: ARENA_HEIGHT,
              }}>
                <div style={{
                  position: 'absolute', left: '50%', top: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 900, height: 280, borderRadius: '50%',
                  background: `radial-gradient(ellipse, ${category.shadow}0.11) 0%, transparent 60%)`,
                  filter: 'blur(65px)', pointerEvents: 'none',
                  animation: 'centerPulse 5s ease-in-out infinite', transition: 'background 0.9s',
                }}/>

                <div style={{
                  display: 'flex', flexDirection: 'row',
                  alignItems: 'center', justifyContent: 'center',
                  position: 'relative', zIndex: 10,
                }}>
                  <BlobGroup
                    blobs={leftBlobs} leftSide={true} shadow={category.shadow}
                    entering={entering} isVisible={isVisible}
                    onHover={setHoveredSkill} baseAnimIndex={0}
                  />
                  <div style={{ marginLeft: -OVERLAP_PX / 2, marginRight: -OVERLAP_PX / 2, zIndex: 25 }}>
                    <CenterCard
                      name={category.name} shadow={category.shadow}
                      accent={category.accent} entering={entering}
                    />
                  </div>
                  <BlobGroup
                    blobs={rightBlobs} leftSide={false} shadow={category.shadow}
                    entering={entering} isVisible={isVisible}
                    onHover={setHoveredSkill} baseAnimIndex={leftBlobs.length}
                  />
                </div>

                <p style={{
                  position: 'absolute', bottom: 4, left: '52%',
                  transform: 'translateX(-50%)',
                  color: hoveredSkill ? 'transparent' : 'rgba(255,255,255,0.22)',
                  fontSize: 13.5, fontFamily: 'monospace',
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  whiteSpace: 'nowrap', pointerEvents: 'none', transition: 'color 0.2s',
                }}>
                  hover a skill to explore
                </p>
              </div>

              <SkillInfoBar skill={hoveredSkill} accent={category.accent} shadow={category.shadow} />
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes orbFloat {
          0%,100% { transform: translateY(0px)  scale(1);    }
          42%     { transform: translateY(-12px) scale(1.02); }
          72%     { transform: translateY(-5px)  scale(0.99); }
        }
        @keyframes centerPulse {
          0%,100% { opacity:0.75; transform:translate(-50%,-50%) scale(1);    }
          50%     { opacity:1;    transform:translate(-50%,-50%) scale(1.07); }
        }
        @keyframes skillFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
      `}</style>
    </section>
  );
};

export default Skills;