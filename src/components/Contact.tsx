import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Send, Mail, Linkedin, Github, Instagram } from 'lucide-react';

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

/* ─── MAIN CONTACT COMPONENT ─────────────────────────────────────────────── */

const socials = [
  {
    name: 'LinkedIn', icon: Linkedin,
    url: 'https://www.linkedin.com/in/faizan-khan-a7867121a/',
    label: 'linkedin.com/in/faizan-khan',
  },
  {
    name: 'GitHub', icon: Github,
    url: 'https://github.com/YOUR_USERNAME',
    label: 'github.com/you',
  },
  {
    name: 'Instagram', icon: Instagram,
    url: 'https://www.instagram.com/faizan.khan1309/?hl=en',
    label: '@faizan.khan1309',
  },
];

export const Contact = () => {
  const { ref, isVisible } = useScrollAnimation(0.15);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleVisible = useInView(titleRef, { once: false, margin: "0px 0px -100px 0px" });

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, message } = formData;
    const mailtoLink = `mailto:khan.faizan1309@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(`From: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section
      id="contact"
      className="top-0 z-20 relative overflow-hidden flex flex-col"
      style={{ minHeight: 'auto', background: '#000000' }}
    >
      {/* ── BACKGROUND ELEMENTS (Cinematic Red) ── */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* Glowing Deep Red Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[400px] rounded-full opacity-[0.07] blur-[100px] pointer-events-none bg-red-600" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[120px] pointer-events-none bg-rose-600" />
      
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      <div
        ref={ref}
        className="relative z-10 flex-1 max-w-6xl mx-auto w-full flex flex-col"
        style={{ padding: 'clamp(6rem, 8vw, 8rem) clamp(1.5rem, 4vw, 2rem) clamp(4rem, 6vw, 6rem)' }}
      >
        {/* ── HEADER ── */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="font-bold text-white mb-6 leading-tight flex flex-col items-center justify-center"
            style={{
              fontFamily: 'FuturaCyrillicBold, sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              letterSpacing: '-0.01em'
            }}
          >
            <div><GlowTitle text="LET'S CONNECT." go={titleVisible} /></div>
          </h2>
        </div>

        {/* ── TWO CONTENT COLUMNS ── */}
        <div className={`grid md:grid-cols-2 gap-8 flex-1 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

          {/* LEFT — Philosophy + Socials */}
          <div
            className="flex flex-col gap-6 rounded-2xl border border-white/10 p-8 lg:p-12 backdrop-blur-md relative overflow-hidden group"
            style={{ background: 'rgba(255,255,255,0.02)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
          >
            {/* Hover ambient glow inside card */}
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors duration-700 pointer-events-none" />



            {/* Email Contact Box */}
            <a href="mailto:khan.faizan1309@gmail.com"
              className="relative z-10 group/mail flex items-center gap-5 p-5 rounded-xl border border-white/5 bg-black/40 hover:border-red-500/50 hover:bg-black/80 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover/mail:bg-red-500/20 group-hover/mail:border-red-500/50 transition-colors duration-300">
                <Mail size={20} className="text-gray-400 group-hover/mail:text-red-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-mono mb-1 uppercase tracking-wider">Direct Email</p>
                <p className="text-white text-base font-medium group-hover/mail:text-red-400 transition-colors truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  khan.faizan1309@gmail.com
                </p>
              </div>
            </a>

            <div className="w-full h-px bg-white/5 my-2" />

            {/* Social Grid */}
            <div className="grid gap-4 relative z-10">
              {socials.map(({ name, icon: Icon, url, label }) => (
                <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                  className="group/social flex items-center gap-5 p-4 rounded-xl border border-transparent hover:border-red-500/30 bg-transparent hover:bg-black/40 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 border border-white/10 group-hover/social:bg-red-500/20 group-hover/social:border-red-500/50 transition-colors duration-300">
                    <Icon size={18} className="text-gray-400 group-hover/social:text-red-400 transition-colors duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 group-hover/social:text-red-500/80 font-mono mb-0.5 uppercase tracking-wider transition-colors">{name}</p>
                    <p className="text-gray-300 group-hover/social:text-white text-sm font-medium truncate transition-colors" style={{ fontFamily: 'Outfit, sans-serif' }}>
                      {label}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — Cinematic Form */}
          <div
            className="flex flex-col rounded-2xl border border-white/10 p-8 lg:p-12 backdrop-blur-md relative overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1 relative z-10">
              
              {/* Name Input */}
              <div className="group/input">
                <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase group-focus-within/input:text-red-400 transition-colors">Identification</label>
                <input
                  type="text" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/40 text-white placeholder-gray-600 focus:border-red-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }} required
                />
              </div>

              {/* Email Input */}
              <div className="group/input">
                <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase group-focus-within/input:text-red-400 transition-colors">Return Beacon</label>
                <input
                  type="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@domain.com"
                  className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/40 text-white placeholder-gray-600 focus:border-red-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }} required
                />
              </div>

              {/* Textarea */}
              <div className="flex flex-col flex-1 group/input">
                <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase group-focus-within/input:text-red-400 transition-colors">Transmission</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="State your business..."
                  className="flex-1 w-full px-5 py-4 rounded-xl border border-white/10 bg-black/40 text-white placeholder-gray-600 focus:border-red-500 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-red-500/50 transition-all resize-none"
                  style={{ fontFamily: 'Outfit, sans-serif', minHeight: '140px' }} required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="group w-full px-6 py-5 mt-2 rounded-xl font-bold text-white flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  background: sent
                    ? 'linear-gradient(135deg, #7f1d1d, #991b1b)' /* darker red when sent */
                    : 'linear-gradient(135deg, #dc2626, #b91c1c)', /* intense red gradient */
                  boxShadow: sent ? 'none' : '0 10px 30px -10px rgba(220, 38, 38, 0.5)',
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}
              >
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                {sent ? 'Transmission Sent' : 'Initiate Sequence'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};