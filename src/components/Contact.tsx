import { useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Send, Mail, Linkedin, Github, Instagram } from 'lucide-react';

const socials = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/in/faizan-khan-a7867121a/', // 🔗 Replace
    label: 'linkedin.com/in/faizan-khan',
    color: '#0A66C2',
  },
  {
    name: 'GitHub',
    icon: Github,
    url: 'https://github.com/YOUR_USERNAME', // 🔗 Replace
    label: 'github.com/you',
    color: '#e2e8f0',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/faizan.khan1309/?hl=en', // 🔗 Replace
    label: '@faizan.khan1309',
    color: '#E1306C',
  },
];

export const Contact = () => {
  const { ref, isVisible } = useScrollAnimation(0.15);
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
      className=" top-0 z-20 relative overflow-hidden flex flex-col"
      style={{ minHeight: '10vh' }}
    >
      {/* ── Background — identical to Gallery ── */}
      <div className="absolute inset-0 bg-[#D1117]" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none bg-cyan-400" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

      {/* ── MAIN CONTENT ── */}
      <div
        ref={ref}
        className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 pt-20 pb-12 flex flex-col"
      >
        {/* Header — full width, above both columns */}
        <div
          className={`text-center mb-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >

          <h2
            className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: 'FuturaCyrillicBold, sans-serif' }}
          >
            Let's Get in{' '}
            <span className="bg-red-500 bg-clip-text text-transparent">
              Contact.
            </span>
          </h2>
          <div className="w-32 h-1 bg-red-500 mx-auto rounded-full shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
        </div>

        {/* Two equal columns */}
        <div
          className={`grid md:grid-cols-2 gap-6 flex-1 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* ── LEFT — email + socials ── */}
          <div
            className="flex flex-col gap-4 rounded-2xl border border-white/10 p-8 backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p
              className="text-gray-400 text-base leading-relaxed mb-2"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Open to new projects, creative ideas, or opportunities to be part
              of your vision. Reach out , I'd love to connect.
            </p>

            {/* Email row */}
            <a
              href="mailto:khan.faizan1309@gmail.com"
              className="group flex items-center gap-4 p-4 rounded-xl border border-transparent bg-white/4 hover:border-red-400/40 hover:bg-white/8 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-400/10 border border-red-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-400/20 transition-colors">
                <Mail size={18} className="text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-mono mb-0.5 uppercase tracking-wider">Email</p>
                <p
                  className="text-white font-medium group-hover:text-red-400 transition-colors truncate"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  khan.faizan1309@gmail.com
                </p>
              </div>
              <svg className="ml-auto text-gray-600 group-hover:text-red-400 transition-colors flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>

            {/* Social rows */}
            {socials.map(({ name, icon: Icon, url, label, color }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-transparent bg-red/4 hover:bg-red/8 transition-all duration-300"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}18`, border: `1px solid ${color}35` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-red-500 font-mono mb-0.5 uppercase tracking-wider">{name}</p>
                  <p
                    className="text-white text-sm font-medium truncate"
                    style={{ fontFamily: 'FuturaCyrillicBold, sans-serif' }}
                  >
                    {label}
                  </p>
                </div>
                <svg className="text-gray-600 group-hover:text-gray-300 transition-colors flex-shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>

          {/* ── RIGHT — form, same card height as left ── */}
          <div
            className="rounded-2xl border border-white/10 p-8 backdrop-blur-xl flex flex-col"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/10 transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/10 transition-all"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                  required
                />
              </div>

              {/* Textarea grows to fill remaining space */}
              <div className="flex flex-col flex-1">
                <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  className="flex-1 w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-600 focus:border-red-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/10 transition-all resize-none"
                  style={{ fontFamily: 'Outfit, sans-serif', minHeight: '100px' }}
                  required
                />
              </div>

              <button
                type="submit"
                className="group w-full px-6 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(0,240,255,0.25)]"
                style={{
                  background: sent
                    ? 'linear-gradient(135deg, #b91010, #960505)'
                    : 'linear-gradient(135deg, #d40606, #ed3a3a)',
                  fontFamily: 'Outfit, sans-serif',
                }}
              >
                <Send size={18} className="group-hover:translate-x-0.5 transition-transform" />
                {sent ? 'Opening Mail App…' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      
    </section>
  );
};