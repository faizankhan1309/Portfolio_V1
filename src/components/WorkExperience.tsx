/**
 * WorkExperience.tsx — Authentic Google Calendar MacBook UI with Side Panel
 */

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useInView } from 'framer-motion';
import { Menu, ChevronLeft, ChevronRight, X, MapPin, Briefcase } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

/* ══════════════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════════════ */
interface Experience {
  company: string;
  role: string;
  type: string | null;
  location: string;
  duration: string;
  points: string[];
  tags: string[];
  color: string;
  textColor: string;
  stream: string;
  startYear: number;
  startMonthName: string;
}

const EXPERIENCES: Experience[] = [
  {
    company: 'REFFTO',
    role: 'Asset Development Lead',
    type: null,
    location: 'Remote',
    duration: 'Apr 2024 – Jun 2024',
    points: [
      'Spearheaded end-to-end 3D rendering pipelines using Blender and Cycles.',
      'Established core pipeline standards that reduced client revision cycles by 40%.',
      'Optimized global render settings for maximum production efficiency without sacrificing photorealism.',
      'Managed a cross-functional team of artists to deliver high-fidelity assets on tight deadlines.'
    ],
    tags: ['Blender', '3D Rendering', 'Pipeline Architecture', 'Team Leadership'],
    color: '#d50000', // Tomato Red
    textColor: '#fff',
    stream: 'Leadership',
    startYear: 2024,
    startMonthName: 'Apr',
  },
  {
    company: 'Pixel Room',
    role: 'Co-founder (LNCT Bhopal)',
    type: 'LNCT Bhopal',
    location: 'Bhopal',
    duration: 'Jun 2024 – Present',
    points: [
      'Founded the very first recognized student gaming and e-sports community at LNCT.',
      'Organized large-scale LAN tournaments, workshops, and community meetups spanning hundreds of participants.',
      'Successfully managed community growth, scaling instantly to 200+ active members in the first quarter.',
      'Secured initial sponsorships and funding for local tournaments from regional tech partners.'
    ],
    tags: ['Community Building', 'E-Sports', 'Event Management', 'Founding'],
    color: '#8e24aa', // Grape Purple
    textColor: '#fff',
    stream: 'Leadership',
    startYear: 2024,
    startMonthName: 'Jun',
  },
  {
    company: 'AIESEC',
    role: 'Junior Manager',
    type: null,
    location: 'Bhopal',
    duration: 'Jan 2025 – Present',
    points: [
      'Managed complex international youth exchange projects, acting as the primary liaison.',
      'Coordinated exclusively with global partners and stakeholders across 6 different countries.',
      'Led extensive campus outreach, marketing strategies, and highly successful recruitment drives.',
      'Facilitated cross-cultural communications protocols to ensure smooth integration for arriving exchange members.'
    ],
    tags: ['International Relations', 'B2B Communication', 'NGO Management'],
    color: '#039be5', // Peacock Blue
    textColor: '#fff',
    stream: 'Consulting',
    startYear: 2025,
    startMonthName: 'Jan',
  },
  {
    company: 'Google Cloud',
    role: 'Cloud Arcade Facilitator',
    type: 'Program 2025',
    location: 'Remote',
    duration: 'Apr 2025 – Oct 2025',
    points: [
      'Facilitated highly technical GCP (Google Cloud Platform) learning programs for a cohort of 100+ students.',
      'Guided participants hands-on through complex Google Cloud certification pathways.',
      'Organized and hosted regional AI Showcase events demonstrating deployed student projects.',
      'Held regular office hours to debug complex cloud architecture issues for participating developers.'
    ],
    tags: ['GCP', 'Cloud Architecture', 'Mentorship', 'AI Integrations'],
    color: '#0b8043', // Basil Green
    textColor: '#fff',
    stream: 'Engineering',
    startYear: 2025,
    startMonthName: 'Apr',
  },
  {
    company: 'Trikaya',
    role: 'Company Representative',
    type: 'Internship',
    location: 'Remote',
    duration: 'Oct 2025 – Dec 2025',
    points: [
      'Acted as the primary Company Representative for Trikaya at heavily attended industry networking events.',
      'Took the lead in organizing the prestigious Hack2Hire Hackathon 2025 logistics and developer relations.',
      'Managed ongoing strategic partnerships and secured operational resources from tech vendors.',
      'Monitored event analytics to project expected attendee ROI.'
    ],
    tags: ['Business Development', 'Event Logistics', 'Strategic Partnerships'],
    color: '#f6bf26', // Sunflower
    textColor: '#000',
    stream: 'Administration',
    startYear: 2025,
    startMonthName: 'Oct',
  },
];

const STREAMS = [
  { label: 'Leadership', color: '#d50000' },
  { label: 'Engineering', color: '#0b8043' },
  { label: 'Consulting', color: '#039be5' },
  { label: 'Administration', color: '#f6bf26' },
];

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════════════════════════════════ */

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
          filter: 'blur(28px)', color: '#dc2626',
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

export const WorkExperience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const visible = useInView(titleRef, { once: false, margin: "0px 0px -100px 0px" });
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const windowY = useTransform(scrollYProgress, [0, 0.4], ['100vh', '12vh']);
  const titleOpacity = useTransform(scrollYProgress, [0.6, 0.9], [1, 0]);

  // Group experiences by Year
  const groupedExperiences = EXPERIENCES.reduce((acc, exp) => {
    if (!acc[exp.startYear]) acc[exp.startYear] = [];
    acc[exp.startYear].push(exp);
    return acc;
  }, {} as Record<number, Experience[]>);

  const years = Object.keys(groupedExperiences).map(Number).sort((a,b) => a - b);
  const isMobile = useIsMobile(1024);

  if (isMobile) {
    return (
      <div id="work-experience" style={{ padding: '6rem 1.5rem', background: '#000000', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <h2 style={{ fontFamily: 'FuturaCyrillicBold, sans-serif', fontSize: '3.5rem', color: '#fff', marginBottom: '3rem', lineHeight: 1 }}>
          WORK <br/> <span style={{color: '#dc2626'}}>EXPERIENCE</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative', zIndex: 10 }}>
          {/* Timeline line */}
          <div style={{ position: 'absolute', left: '15px', top: 0, bottom: 0, width: '2px', background: 'rgba(255,255,255,0.1)' }} />
          {EXPERIENCES.map((exp, i) => (
             <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
               <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: exp.color, flexShrink: 0, border: '4px solid #000', zIndex: 2 }} />
               <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '1.5rem', flex: 1 }}>
                 <p style={{ color: exp.color, fontFamily: 'monospace', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{exp.duration}</p>
                 <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.2rem', fontFamily: 'Outfit, sans-serif' }}>{exp.role}</h3>
                 <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1rem', fontFamily: 'Outfit, sans-serif' }}>{exp.company} • {exp.location}</p>
                 <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1rem', margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontFamily: 'Outfit, sans-serif' }}>
                   {exp.points.map((pt, idx) => <li key={idx} style={{ listStyleType: 'disc' }}>{pt}</li>)}
                 </ul>
               </div>
             </div>
          ))}
        </div>
        {/* Glow ambient */}
        <div style={{ position: 'absolute', top: '10%', right: '-30%', width: '300px', height: '300px', background: 'rgba(220,38,38,0.15)', filter: 'blur(80px)', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div ref={containerRef} id="work-experience" style={{ position: 'relative', height: '250vh', background: '#000000' }}>
      
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        
        {/* Background TITLE (STATIC) */}
        <motion.div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        
        }}>
          <h2 ref={titleRef} style={{
            fontFamily: 'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
            fontSize: 'clamp(6rem,9vw, 15rem)', fontWeight: 900, color: 'rgba(255,255,255,0.08)',
            lineHeight: 0.85, margin: 0, display: 'flex', flexDirection: 'column', letterSpacing: '-0.02em'
          }}>
            <div style={{ color: '#fff' }}><GlowTitle text="WORK" go={visible} /></div>
            <div style={{ color: '#fff', marginTop: '1rem' }}><GlowTitle text="EXPERIENCE" go={visible} /></div>
          </h2>
        </motion.div>

        {/* MACBOOK WINDOW */}
        <motion.div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', zIndex: 10,
          y: windowY
        }}>
          <div style={{
            width: '96vw', maxWidth: 1600, height: '80vh',
            background: '#ffffff', borderRadius: 12,
            boxShadow: '0 0 80px 25px rgba(255, 5, 5, 0.23), 0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(241, 23, 23, 0.1)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            fontFamily: '"Roboto", Arial, sans-serif'
          }}>
            
            {/* ── MAC OS TOP BAR ── */}
            <div style={{
              height: 40, background: '#f1f3f4', borderBottom: '1px solid #dadce0',
              display: 'flex', alignItems: 'center', padding: '0 16px', position: 'relative'
            }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f56' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#27c93f' }} />
              </div>
              <div style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                background: '#ffffff', border: '1px solid #dadce0', borderRadius: 6,
                padding: '4px 16px', fontSize: 12, color: '#5f6368', fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 6, width: 300, justifyContent: 'center'
              }}>
                calendar.google.com
              </div>
            </div>

            {/* ── GOOGLE CALENDAR HEADER ── */}
            <div style={{
              height: 64, borderBottom: '1px solid #dadce0', display: 'flex',
              alignItems: 'center', justifyContent: 'space-between', padding: '0 16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Menu size={24} color="#5f6368" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32, height: 32, background: '#fff', border: '1px solid #dadce0',
                    borderRadius: 4, display: 'flex', flexDirection: 'column', overflow: 'hidden'
                  }}>
                    <div style={{ height: 10, background: '#4285f4', width: '100%' }} />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#3c4043' }}>31</div>
                  </div>
                  <span style={{ fontSize: 20, color: '#3c4043', fontWeight: 400 }}>Calendar</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 24 }}>
                  <div style={{ border: '1px solid #dadce0', borderRadius: 4, padding: '8px 16px', fontSize: 14, color: '#3c4043', cursor: 'pointer', fontWeight: 500 }}>
                    Today
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <ChevronLeft size={20} color="#5f6368" />
                    <ChevronRight size={20} color="#5f6368" />
                  </div>
                  <span style={{ fontSize: 18, color: '#3c4043', fontWeight: 400, marginLeft: 4 }}>
                    Experience Schedule
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ border: '1px solid #dadce0', borderRadius: 4, padding: '8px 12px', fontSize: 14, color: '#3c4043', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  Schedule
                </div>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#1a73e8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  F
                </div>
              </div>
            </div>

            {/* ── MAIN BODY (Split Pane Layout) ── */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#f8f9fa' }}>
              
              {/* LEFT NAV SIDEBAR */}
              <div style={{ width: 220, borderRight: '1px solid #dadce0', background: '#fff', display: 'flex', flexDirection: 'column', padding: '24px 20px', overflowY: 'auto' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#3c4043', marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  My calendars
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {STREAMS.map(stream => (
                    <div key={stream.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 2, background: stream.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <div style={{ width: 8, height: 4, borderBottom: '2px solid #fff', borderLeft: '2px solid #fff', transform: 'rotate(-45deg)', marginBottom: 2 }}/>
                      </div>
                      <span style={{ fontSize: 14, color: '#3c4043' }}>{stream.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIMELINE LIST (LEFT-ALIGNED) */}
              <div style={{ flex: 1, overflowY: 'auto', background: '#fff', padding: '24px 40px', borderRight: '1px solid #dadce0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: '100%', maxWidth: 800 }}>
                  
                  {years.map((year) => (
                    <div key={year} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      
                      {/* Year Header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ fontSize: 28, color: '#3c4043', fontWeight: 400 }}>{year}</div>
                        <div style={{ height: 1, background: '#dadce0', flex: 1 }} />
                      </div>

                      {/* Event Stack */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {groupedExperiences[year].map((exp, i) => {
                          const isSelected = selectedExp?.company === exp.company;
                          return (
                            <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                              
                              {/* Left Date Column */}
                              <div style={{ width: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8 }}>
                                <div style={{ fontSize: 14, color: '#70757a', fontWeight: 500, textTransform: 'uppercase' }}>
                                  {exp.startMonthName}
                                </div>
                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: exp.color, marginTop: 8 }} />
                              </div>

                              {/* Horizontal Event Block (LEFT ALIGNED) */}
                              <div 
                                onClick={() => setSelectedExp(exp)}
                                style={{
                                  flex: 1, background: isSelected ? exp.color : `${exp.color}E6`, 
                                  borderRadius: 8, padding: '20px 24px',
                                  color: exp.textColor, cursor: 'pointer',
                                  boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.12)', 
                                  transition: 'filter 0.2s, background 0.2s, box-shadow 0.2s',
                                  display: 'flex', flexDirection: 'column', gap: 10,
                                  borderLeft: isSelected ? `8px solid rgba(0,0,0,0.3)` : '8px solid transparent'
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.filter = 'brightness(1.05)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.filter = 'brightness(1)';
                                }}
                              >
                                <div style={{ fontSize: 24, fontWeight: 500, lineHeight: 1.2 }}>
                                  {exp.role}
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: 0.9 }}>
                                  <span style={{ fontSize: 16, fontWeight: 500 }}>{exp.company}</span>
                                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: exp.textColor, opacity: 0.5 }} />
                                  <span style={{ fontSize: 14 }}>{exp.duration}</span>
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>

                    </div>
                  ))}

                </div>
              </div>

              {/* RIGHT SIDE PANEL (EXPANDED DETAILS) */}
              <AnimatePresence>
                {selectedExp && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 480, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ 
                      background: '#fff', 
                      display: 'flex', flexDirection: 'column', 
                      overflowY: 'auto',
                      borderLeft: '1px solid #dadce0',
                      flexShrink: 0 // Prevent it from getting squished
                    }}
                  >
                    <div style={{ minWidth: 480, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Side Panel Header */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px 16px 0' }}>
                        <button onClick={() => setSelectedExp(null)} style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          padding: 8, borderRadius: '50%', display: 'flex',
                          alignItems: 'center', justifyContent: 'center'
                        }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f3f4'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <X size={20} color="#5f6368" />
                        </button>
                      </div>

                      {/* Side Panel Content */}
                      <div style={{ padding: '0 32px 32px', flex: 1 }}>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                          <div style={{ width: 20, height: 20, borderRadius: 4, background: selectedExp.color, marginTop: 8, flexShrink: 0 }} />
                          <div>
                            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 500, color: '#3c4043', lineHeight: 1.3 }}>
                              {selectedExp.role}
                            </h2>
                            <div style={{ fontSize: 15, color: '#3c4043', marginTop: 8 }}>
                              {selectedExp.duration}
                            </div>
                            
                            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
                              <Briefcase size={22} color="#5f6368" />
                              <span style={{ fontSize: 16, color: '#3c4043', fontWeight: 500 }}>
                                {selectedExp.company} {selectedExp.type ? `(${selectedExp.type})` : ''}
                              </span>
                            </div>
                            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                              <MapPin size={22} color="#5f6368" />
                              <span style={{ fontSize: 16, color: '#3c4043' }}>{selectedExp.location}</span>
                            </div>

                            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #dadce0', fontSize: 15, color: '#3c4043', lineHeight: 1.7 }}>
                              <ul style={{ margin: 0, paddingLeft: 20 }}>
                                {selectedExp.points.map((pt, i) => <li key={i} style={{ marginBottom: 10 }}>{pt}</li>)}
                              </ul>
                            </div>

                            <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              {selectedExp.tags.map(t => (
                                <span key={t} style={{
                                  padding: '6px 12px', background: '#f1f3f4', borderRadius: 4,
                                  fontSize: 13, color: '#5f6368', fontWeight: 500
                                }}>
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        #work-experience *::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        #work-experience *::-webkit-scrollbar-track {
          background: transparent;
        }
        #work-experience *::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.15);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        #work-experience *::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};