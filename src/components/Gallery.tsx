import { useState, useCallback } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

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
  initials: string;
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
    accentColor: '#ef4444',
    image: '/media/ted2.jpg',
    initials: 'TX',
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
    accentColor: '#8a5cf6',
    image: '/media/hack.jpg',
    initials: 'H2',
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
    accentColor: '#f59e0b',
    image: '/media/sih.jpeg',
    initials: 'SI',
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
    accentColor: '#84cc16',
    image: '/media/bansal1.jpg',
    initials: 'BR',
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
    accentColor: '#38bdf8',
    image: '/media/cloud.jpg',
    initials: 'GC',
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
    accentColor: '#2dd4bf',
    image: '/media/pixel.jpeg',
    initials: 'PR',
  },
  {
    id: 7,
    title: 'Bhopal Film Festival',
    subtitle: 'Attendee · 2026',
    date: '2026',
    tags: ['Film', 'Culture', 'Visual Arts', 'Festival'],
    highlight: 'Bhopal Film Festival 2026',
    description:
      'Attended the Bhopal Film Festival 2026 — a vibrant intersection of art, storytelling, and visual culture.',
    accentColor: '#e879f9',
    image: '/media/tnff.jpg',
    initials: 'BF',
  },
];

export const Gallery = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + items.length) % items.length);
  }, []);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % items.length);
  }, []);

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > items.length / 2) offset -= items.length;
    if (offset < -items.length / 2) offset += items.length;
    return offset;
  };

  const getCardStyle = (offset: number): React.CSSProperties => {
    const abs = Math.abs(offset);
    if (abs > 2) return { opacity: 0, pointerEvents: 'none', transform: 'scale(0.4) translateX(0)', zIndex: 0 };

    const translateX = offset * 340;
    const scale = offset === 0 ? 1 : abs === 1 ? 0.75 : 0.58;
    const opacity = offset === 0 ? 1 : abs === 1 ? 0.65 : 0.35;
    const zIndex = offset === 0 ? 10 : abs === 1 ? 6 : 3;
    const blur = abs === 0 ? 0 : abs === 1 ? 1 : 3;

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      opacity,
      zIndex,
      filter: blur > 0 ? `blur(${blur}px)` : 'none',
      transition: 'all 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
    };
  };

  return (
    <section id="gallery" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[#0D1117]" />

      {/* Ambient glow that shifts with active card */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: items[activeIndex].accentColor, transition: 'background 0.6s ease' }}
      />

      <div ref={ref} className="relative z-10">

        {/* Header */}
        <div
          className={`text-center mb-16 px-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          
          <h2
            className="text-5xl md:text-6xl font-bold text-white mb-4 gallery-heading"
            style={{ fontFamily: 'FuturaCyrillicBold, sans-serif' }}
          >
            GALLERY
          </h2>
          <div className="w-32 h-1 bg-red-500 mx-auto rounded-full shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
        </div>

        {/* Carousel */}
        <div
          className={`relative flex items-center justify-center transition-all duration-1000 delay-200 gallery-carousel-wrap ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ height: '560px' }}
        >
          {items.map((item, index) => {
            const offset = getOffset(index);
            const abs = Math.abs(offset);
            if (abs > 2) return null;

            return (
              <div
                key={item.id}
                className="absolute"
                style={getCardStyle(offset)}
                onClick={() => {
                  if (offset === 0) setSelected(item);
                  else if (offset > 0) next();
                  else prev();
                }}
              >
                {/* Card — full bleed image */}
                <div
                  className="relative overflow-hidden rounded-3xl border border-white/10"
                  style={{
                    width: '400px',
                    height: '520px',
                    boxShadow:
                      offset === 0
                        ? `0 40px 100px rgba(0,0,0,0.7), 0 0 60px ${item.accentColor}35`
                        : '0 20px 50px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Full-bleed image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ transition: 'transform 0.6s ease' }}
                    onMouseEnter={(e) => {
                      if (offset === 0) (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)';
                    }}
                  />

                  {/* Dark gradient overlay — bottom-heavy for text legibility */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 45%, rgba(0,0,0,0.05) 75%, transparent 100%)',
                    }}
                  />

                  {/* Subtle colored tint at bottom matching accent */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${item.accentColor}22 0%, transparent 50%)`,
                    }}
                  />

                  {/* Top-right date badge */}
                  <div className="absolute top-5 right-5">
                    <span
                      className="px-3 py-1.5 rounded-xl text-xs font-mono backdrop-blur-md border border-white/20"
                      style={{
                        background: 'rgba(0,0,0,0.5)',
                        color: 'rgba(255,255,255,0.8)',
                        fontFamily: 'FuturaCyrillicBold, sans-serif',
                      }}
                    >
                      {item.date}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    {/* Title */}
                    <h3
                      className="text-3xl font-bold text-white mb-1 leading-tight"
                      style={{ fontFamily: 'FuturaCyrillicBold, sans-serif' }}
                    >
                      {item.title}
                    </h3>

                    {/* Subtitle */}
                    <p
                      className="text-sm mb-4 font-medium"
                      style={{ color: item.accentColor, fontFamily: 'FuturaCyrillicBold, sans-serif' }}
                    >
                      {item.subtitle}
                    </p>


                  </div>

                  {/* Accent border glow on active */}
                  {offset === 0 && (
                    <div
                      className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 0 1.5px ${item.accentColor}50`,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Title + subtitle below carousel */}
        <div className="text-center mt-10 px-6" style={{ transition: 'all 0.4s ease' }}>
          <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'FuturaCyrillicBold, sans-serif' }}>
            {items[activeIndex].title}
          </h3>
          <p
            className="text-base font-medium"
            style={{
              color: items[activeIndex].accentColor,
              fontFamily: 'FuturaCyrillicBold, sans-serif',
              transition: 'color 0.4s ease',
            }}
          >
            {items[activeIndex].subtitle}
          </p>
        </div>

        {/* Navigation arrows + dots */}
        <div className="flex items-center justify-center gap-8 mt-8 px-6">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 text-white"
          >
            <ChevronLeft size={22} />
          </button>

          <div className="flex items-center gap-2">
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === activeIndex ? '28px' : '8px',
                  height: '8px',
                  background: i === activeIndex ? item.accentColor : 'rgba(255,255,255,0.2)',
                  boxShadow: i === activeIndex ? `0 0 10px ${item.accentColor}` : 'none',
                }}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full flex items-center justify-center border border-white/20 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 transition-all duration-300 text-white"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-white/10 gallery-modal-inner"
            style={{
              background: '#0D1117',
              animation: 'modalIn 0.28s cubic-bezier(0.16,1,0.3,1) both',
              boxShadow: `0 0 100px ${selected.accentColor}25, 0 40px 80px rgba(0,0,0,0.6)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image header — tall banner */}
            <div className="relative h-96 overflow-hidden gallery-modal-img-wrap">
              <img
                src={selected.image}
                alt={selected.title}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(13,17,23,0.95) 100%)',
                }}
              />
              {/* Accent line at very top */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{ background: selected.accentColor }}
              />
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 border border-white/15 flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
              >
                <X size={16} className="text-white" />
              </button>
              {/* Title overlay on image */}
              <div className="absolute bottom-4 left-6 right-14">
                <h3 className="text-2xl font-bold text-white leading-tight" style={{ fontFamily: 'FuturaCyrillicBold, sans-serif' }}>
                  {selected.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: selected.accentColor, fontFamily: 'FuturaCyrillicBold, sans-serif' }}>
                    {selected.subtitle}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-mono border border-white/15"
                    style={{ background: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.65)' }}
                  >
                    {selected.date}
                  </span>
                </div>
              </div>
            </div>


          </div>
        </div>
      )}


      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.93) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }

        /* ── Mobile/Tablet carousel scaling ─────────────────────────────── */
        @media (max-width: 1024px) {
          .gallery-carousel-wrap {
            height: 400px !important;
            overflow: hidden;
          }
          .gallery-carousel-wrap > div {
            transform: scale(0.72);
            transform-origin: center center;
          }
        }
        @media (max-width: 640px) {
          .gallery-carousel-wrap {
            height: 300px !important;
          }
          .gallery-carousel-wrap > div {
            transform: scale(0.54);
            transform-origin: center center;
          }
        }

        /* ── Gallery heading responsive ──────────────────────────────────── */
        .gallery-heading {
          font-size: clamp(2.5rem, 8vw, 3.75rem) !important;
        }

        /* ── Modal on mobile: scrollable, shorter image ───────────────────── */
        @media (max-width: 640px) {
          .gallery-modal-inner {
            max-height: 90svh;
            overflow-y: auto;
          }
          .gallery-modal-img-wrap {
            height: 220px !important;
          }
        }
      `}</style>
    </section>
  );
};