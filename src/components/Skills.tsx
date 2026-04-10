import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { Brain, Code, Palette, Wrench } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useIsMobile } from '../hooks/useIsMobile';

/* ══ LOGO REGISTRY ══════════════════════════════════════════════════════ */
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
  const iconSize = Math.round(size * 0.45);
  if (!entry) return <span style={{ fontSize: size * 0.25, lineHeight: 1 }}>⚙️</span>;
  return (
    <img
      src={entry.src} alt={name} width={iconSize} height={iconSize} draggable={false}
      style={{ width: iconSize, height: iconSize, objectFit: 'contain', display: 'block', pointerEvents: 'none',
        filter: entry.invert ? 'brightness(0) invert(1)' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
};

/* ══ CATEGORY DATA ════════════════════════════════════════════════════ */
type SkillTier = 'xl' | 'lg' | 'md' | 'sm';
interface Skill { name: string; desc: string; tier: SkillTier; }

const CATEGORIES = [
  {
    id: 'ai', name: 'AI & Machine Learning', icon: Brain,
    accent: '#ef4444', shadow: 'rgba(239,68,68,',
    skills: [
      { name: 'Python',       desc: 'ML models & data pipelines',   tier: 'xl' },
      { name: 'TensorFlow',   desc: 'Deep learning model training', tier: 'lg' },
      { name: 'PyTorch',      desc: 'Neural networks & research',   tier: 'lg' },
      { name: 'Scikit-learn', desc: 'Classification & clustering',  tier: 'md' },
      { name: 'OpenCV',       desc: 'Computer vision & real-time',  tier: 'md' },
      { name: 'GCP (Vertex AI)', desc: 'Cloud-based AI development',tier: 'sm' },
      { name: 'Prompt Eng.',  desc: 'Production prompt design',     tier: 'lg' },
    ] as Skill[],
  },
  {
    id: 'web', name: 'Web Development', icon: Code,
    accent: '#8B5CF6', shadow: 'rgba(139,92,246,',
    skills: [
      { name: 'React',      desc: 'Interactive UI systems', tier: 'xl' },
      { name: 'JavaScript', desc: 'Core logic & APIs',      tier: 'xl' },
      { name: 'HTML/CSS',   desc: 'Semantic markup',        tier: 'lg' },
      { name: 'Node.js',    desc: 'Server-side APIs',       tier: 'md' },
      { name: 'Tailwind',   desc: 'Utility-first styling',  tier: 'lg' },
      { name: 'REST APIs',  desc: 'API integration',        tier: 'md' },
    ] as Skill[],
  },
  {
    id: 'design', name: 'Design & Creative', icon: Palette,
    accent: '#F59E0B', shadow: 'rgba(245,158,11,',
    skills: [
      { name: 'Figma',         desc: 'UI/UX & prototypes',        tier: 'xl' },
      { name: 'Blender',       desc: 'Cinematic 3D renders',      tier: 'xl' },
      { name: 'Photoshop',     desc: 'Photo manipulation',        tier: 'lg' },
      { name: 'Premiere Pro',  desc: 'Video editing',             tier: 'lg' },
      { name: 'After Effects', desc: 'Motion graphics',           tier: 'md' },
      { name: 'Illustrator',   desc: 'Vector graphics',           tier: 'md' },
    ] as Skill[],
  },
  {
    id: 'tools', name: 'Tools & Platforms', icon: Wrench,
    accent: '#06B6D4', shadow: 'rgba(6,182,212,',
    skills: [
      { name: 'Git/GitHub',     desc: 'Version control',          tier: 'xl' },
      { name: 'VS Code',        desc: 'Primary IDE',              tier: 'xl' },
      { name: 'Notion',         desc: 'Project planning',         tier: 'lg' },
      { name: 'MySQL',          desc: 'Database management',      tier: 'md' },
      { name: 'DaVinci Resolve',desc: 'Professional grading',     tier: 'lg' },
      { name: 'Postgresql',     desc: 'Advanced database',        tier: 'md' },
    ] as Skill[],
  },
];

// Flatten all skills and inject their category configuration
const ALL_SKILLS = CATEGORIES.flatMap(cat => 
  cat.skills.map(skill => ({ ...skill, cat }))
);

const TIER_RADII = { xl: 75, lg: 65, md: 55, sm: 45 };

/* ══ MAIN COMPONENT ══════════════════════════════════════════════════════ */
export const Skills = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const isMobile = useIsMobile(768);
  const scaleFactor = isMobile ? 0.65 : 1.0;

  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Runner | null>(null);
  const domRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    if (!sceneRef.current) return;
    const sceneElement = sceneRef.current;
    
    // Clear any previous engine on remount (i.e. resizing between desktop/mobile)
    if (engineRef.current) {
       Matter.Engine.clear(engineRef.current);
    }
    
    // Engine setup
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0.001 } // Starts with 0 gravity (floating)
    });
    engineRef.current = engine;
    
    const w = sceneElement.clientWidth;
    const h = sceneElement.clientHeight;

    // Boundaries - set high enough so floor catches blobs correctly
    const wallOptions = { 
        isStatic: true, 
        render: { visible: false }, 
        restitution: 0.4, 
        friction: 0.1 
    };
    // Floor top edge will sit strictly visible on screen
    const ground = Matter.Bodies.rectangle(w / 2, h + 10, w * 3, 100, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-50, h / 2, 100, h * 3, wallOptions);
    const rightWall = Matter.Bodies.rectangle(w + 50, h / 2, 100, h * 3, wallOptions);
    const ceiling = Matter.Bodies.rectangle(w / 2, -500, w * 3, 100, wallOptions);

    Matter.Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // Create blobs
    const bodyMap: Matter.Body[] = [];
    
    // Responsive Grid Configuration
    const rowCounts = isMobile ? [4, 5, 4, 5, 4, 4] : [9, 9, 8]; 
    let placed = 0;

    ALL_SKILLS.forEach((item, i) => {
      const radius = TIER_RADII[item.tier] * scaleFactor;
      
      // Determine which row this item falls into
      let rowIndex = 0;
      let countBeforeRow = 0;
      for (let r = 0; r < rowCounts.length; r++) {
         if (placed < countBeforeRow + rowCounts[r]) {
            rowIndex = r;
            break;
         }
         countBeforeRow += rowCounts[r];
      }
      const countInRow = rowCounts[rowIndex];
      const indexInRow = placed - countBeforeRow;
      
      // Calculate responsive grid coordinates
      const spacingX = isMobile ? 65 : (w > 1000 ? 110 : (w / 10));
      const spacingY = isMobile ? 75 : 125;
      const rowWidth = (countInRow - 1) * spacingX;
      
      const startX = (w / 2) - (rowWidth / 2) + (indexInRow * spacingX);
      const startY = (h * (isMobile ? 0.35 : 0.48)) + (rowIndex * spacingY);

      const body = Matter.Bodies.circle(startX, startY, radius, {
        restitution: 0.6,
        friction: 0.1,
        frictionAir: 0.03, // Extra drag so they don't fly off too hard
        density: radius * 0.0001,
        inertia: Infinity, // Prevents body from rotating physically
        angle: 0,
      });
      
      bodyMap.push(body);
      placed++;
    });

    Matter.Composite.add(engine.world, bodyMap);

    // Mouse Interaction setup
    const mouse = Matter.Mouse.create(sceneElement);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    // Since sceneRef will have pointerEvents='none', the empty space won't steal mouse events,
    // but the nested blobs (pointerEvents='auto') will bubble up to here.
    // We can confidently disable mousewheel blocking:
    if (mouse.element) {
      mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
      mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
      mouse.mousewheel = function() {}; 
    }

    Matter.Composite.add(engine.world, mouseConstraint);

    // DOM Sync loop
    Matter.Events.on(engine, 'afterUpdate', () => {
      bodyMap.forEach((body, index) => {
        const domElement = domRefs.current[index];
        if (domElement) {
          // Sync HTML transform with MatterJS body position using scaling for mobile fits
          domElement.style.transform = `translate(-50%, -50%) translate(${body.position.x}px, ${body.position.y}px) scale(${scaleFactor})`;
        }
      });
    });

    // Run engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    renderRef.current = runner;

    // Handle Resize
    const handleResize = () => {
      const newW = sceneElement.clientWidth;
      const newH = sceneElement.clientHeight;
      Matter.Body.setPosition(ground, { x: newW / 2, y: newH + 10 });
      Matter.Body.setPosition(rightWall, { x: newW + 50, y: newH / 2 });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [isMobile, scaleFactor]);

  // Gravity Toggle
  const toggleGravity = () => {
    if (engineRef.current) {
      const isDropped = !dropped;
      engineRef.current.world.gravity.y = isDropped ? 1 : 0;
      engineRef.current.world.gravity.x = 0;
      
      // Add a slight jitter when turning gravity off to wake up sleeping bodies
      if (!isDropped) {
        ALL_SKILLS.forEach((_, i) => {
          const body = engineRef.current?.world.bodies[i + 4]; // skip 4 walls
          if (body) {
            Matter.Body.setVelocity(body, {
              x: (Math.random() - 0.5) * 2,
              y: (Math.random() - 0.5) * 4
            });
          }
        });
      }
      
      setDropped(isDropped);
    }
  };

  return (
    <section
      id="skills"
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '800px',
        height: '100vh', // Exactly constraints to viewport so floor is always visible
        background: '#000000',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {/* ── BACKGROUND ── */}
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.06) 0%, transparent 60%)'
      }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:40px_40px]" />

      <div 
        className="relative z-30 pt-32 flex flex-col items-center justify-center pointer-events-none px-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <h2 style={{
          fontFamily: 'FuturaCyrillicBold, Impact, sans-serif',
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '0.02em',
          textShadow: '0 0 40px rgba(220,38,38,0.4)',
          textAlign: 'center'
        }}>SKILLS ARRAY</h2>
        
        <button
          onClick={toggleGravity}
          style={{
            marginTop: '2rem',
            padding: '14px 32px',
            borderRadius: '99px',
            background: dropped ? 'rgba(239,68,68,0.95)' : 'rgba(255,255,255,0.95)',
            border: `2px solid ${dropped ? '#dc2626' : '#ffffff'}`,
            color: dropped ? '#ffffff' : '#000000',
            fontFamily: 'FuturaCyrillicBold, Impact, sans-serif',
            fontSize: '1.2rem',
            fontWeight: 800,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            pointerEvents: 'auto',
            boxShadow: `0 8px 30px ${dropped ? 'rgba(239,68,68,0.6)' : 'rgba(255,255,255,0.3)'}`
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          {dropped ? 'DISABLE GRAVITY' : 'ACTIVATE GRAVITY'}
        </button>
      </div>

      {/* ── PHYSICS INTERACTION LAYER ── */}
      {/* 
        CRITICAL SCROLL FIX: The parent layer has pointerEvents='none'. 
        You can scroll directly through the empty space. 
        Only the individual blob divs have pointerEvents='auto', meaning they can be dragged 
        and those events bubble up to the Matter.js Mouse hook.
      */}
      <div 
        ref={sceneRef} 
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 20, pointerEvents: 'none' }}
      >
        
        {/* Render actual DOM Elements explicitly matching Physics coordinates */}
        {ALL_SKILLS.map((item, i) => {
          const r = TIER_RADII[item.tier];
          const shadow = item.cat.shadow;

          return (
            <div
              key={i}
              ref={el => { domRefs.current[i] = el; }}
              style={{
                position: 'absolute',
                top: 0, left: 0, // Top-left anchor, moved precisely by translate in requestAnimationFrame
                width: r * 2, height: r * 2,
                borderRadius: '50%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: `radial-gradient(circle at 35% 35%, ${shadow}0.35), ${shadow}0.05))`,
                border: `1px solid ${shadow}0.5)`,
                boxShadow: `0 0 30px ${shadow}0.15), inset 0 0 20px ${shadow}0.2)`,
                backdropFilter: 'blur(12px)',
                cursor: 'grab',
                pointerEvents: 'auto', // Re-enables interaction just for this specific physical object!
                touchAction: 'none',   // Prevents mobile scrolling *only* when dragging a blob
                userSelect: 'none',
                willChange: 'transform',
                zIndex: Math.round(r), // Larger items slightly above in rendering depth
              }}
            >
              <div style={{ transform: 'translateY(-6px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Logo name={item.name} size={r * 1.2} />
                <span style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: 600,
                  fontSize: Math.max(10, r * 0.18),
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                  marginTop: '6px',
                  textAlign: 'center',
                  padding: '2px 8px',
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: '10px'
                }}>
                  {item.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};