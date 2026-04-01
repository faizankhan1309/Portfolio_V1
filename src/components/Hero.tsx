/**
 * Hero.tsx — Fixed Layout + Marquee on scroll only
 * About section redesigned: editorial split-layout with cutout portrait,
 * large background typography, and asymmetric composition.
 */

import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, Download, Eye, Briefcase, Calendar, Rocket, Trophy } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TITLES  = ['AI/ML Engineer', '3D Artist & Creative Director', 'Design Lead & Storyteller'];
const MQ_TEXT = 'BUILDING INTELLIGENT SYSTEMS , DESIGNING DIGITAL EXPERIENCES ';
const REPEATS = 100;

const STATS = [
  { icon: Briefcase, value: '4+',  label: 'Roles'               },
  { icon: Calendar,  value: '3+',  label: 'Years Experience'     },
  { icon: Rocket,    value: '10+', label: 'Projects'             },
  { icon: Trophy,    value: '2',   label: 'Leadership Positions' },
];

export const Hero = () => {

  /* ── typewriter ─────────────────────────────────────────────────────── */
  const [titleIdx, setTitleIdx] = useState(0);
  const [display,  setDisplay]  = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const cur   = TITLES[titleIdx];
    const speed = deleting ? 42 : 88;
    const id = setTimeout(() => {
      if (!deleting) {
        if (display.length < cur.length) setDisplay(cur.slice(0, display.length + 1));
        else setTimeout(() => setDeleting(true), 2000);
      } else {
        if (display.length === 0) { setDeleting(false); setTitleIdx(p => (p + 1) % TITLES.length); }
        else setDisplay(display.slice(0, -1));
      }
    }, speed);
    return () => clearTimeout(id);
  }, [display, deleting, titleIdx]);

  /* ── refs ───────────────────────────────────────────────────────────── */
  const sectionRef  = useRef<HTMLDivElement>(null);
  const depthRef    = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const nameRef     = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const chevRef     = useRef<HTMLDivElement>(null);
  const sigContRef  = useRef<HTMLDivElement>(null);
  const sigPathRef  = useRef<SVGPathElement>(null);
  const mq1Ref      = useRef<HTMLDivElement>(null);
  const mq2Ref      = useRef<HTMLDivElement>(null);
  const mq1WrapRef  = useRef<HTMLDivElement>(null);
  const mq2WrapRef  = useRef<HTMLDivElement>(null);
  const aboutRef    = useRef<HTMLDivElement>(null);

  /* ── About section animation refs ────────────────────────────────────── */
  const aboutStatsRef = useRef<HTMLDivElement>(null);
  const aboutImgRef   = useRef<HTMLDivElement>(null);
  const aboutTextRef  = useRef<HTMLDivElement>(null);

  /* ── GSAP ───────────────────────────────────────────────────────────── */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const depth   = depthRef.current;
    const content = contentRef.current;
    const name    = nameRef.current;
    const sub     = subRef.current;
    const cta     = ctaRef.current;
    const chev    = chevRef.current;
    const sigCont = sigContRef.current;
    const sigPath = sigPathRef.current;
    const mq1     = mq1Ref.current;
    const mq2     = mq2Ref.current;
    const mq1Wrap = mq1WrapRef.current;
    const mq2Wrap = mq2WrapRef.current;
    const about   = aboutRef.current;

    if (!section||!depth||!content||!name||!sub||!cta||!chev||
        !sigCont||!sigPath||!mq1||!mq2||!mq1Wrap||!mq2Wrap||!about) return;

    /* initial states */
    gsap.set(about, { y: '100vh' });
    gsap.set(sigCont, { opacity: 0 });
    gsap.set([mq1Wrap, mq2Wrap], { opacity: 0 });

    const pathLen = sigPath.getTotalLength();
    gsap.set(sigPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });

    /* ── marquee infinite loops ───────────────────────────────────────── */
    const startMarquee = () => {
      if (!mq1 || !mq2) return;
      const setupLoop = (el: HTMLDivElement, direction: 1 | -1, speed = 0.5) => {
        let x = 0;
        const width = el.scrollWidth / 2;
        gsap.killTweensOf(el);
        gsap.ticker.add(() => {
          x += direction * speed;
          if (direction === -1 && x <= -width) x = 0;
          if (direction === 1 && x >= 0) x = -width;
          gsap.set(el, { x, force3D: true });
        });
      };
      setupLoop(mq1, 1, 1.4);
      setupLoop(mq2, -1, 1.4);
    };
    startMarquee();

    /* ── pinned scroll timeline ──────────────────────────────────────── */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          end:     '+=200%',
          pin:     true,
          scrub:   1.5,
        },
      });

      tl.to([sub, cta, chev], {
        opacity: 0, y: -22,
        duration: 0.20, ease: 'power2.in', stagger: 0.03,
      }, 0);

      tl.to([mq1Wrap, mq2Wrap], {
        opacity: 1, duration: 0.6, ease: 'power1.inOut',
      }, 0.06);

      tl.to(depth, {
        scale: 0.6, opacity: 1.0,
        duration: 0.45, ease: 'power2.inOut',
      }, 0);

      tl.to(mq1Wrap, { y: -60, duration: 0.1, ease: 'power1.inOut' }, 0);
      tl.to(mq2Wrap, { y: -40, duration: 0.1, ease: 'power1.inOut' }, 0);

      tl.to(name, {
        opacity: 0.18, duration: 0.25, ease: 'power1.inOut',
      }, 0.15);

      tl.to(sigCont, { opacity: 1, duration: 0.02 }, 0.20);

      tl.to(sigPath, {
        strokeDashoffset: 0,
        duration: 1.9, ease: 'power1.inOut',
      }, 0.20);

      tl.to(about, {
        y: '0vh', duration: 1.30, ease: 'power3.inOut',
      }, 0.70);

    }, section);

    return () => ctx.revert();
  }, []);

  /* ── About panel — entrance animations when it slides into view ──────── */
  useEffect(() => {
    const stats = aboutStatsRef.current;
    const img   = aboutImgRef.current;
    const text  = aboutTextRef.current;
    if (!stats || !img || !text) return;

    /* set initial hidden states */
    gsap.set(stats.children, { opacity: 0, x: -40 });
    gsap.set(img,            { opacity: 0, scale: 0.92 });
    gsap.set(text.children,  { opacity: 0, y: 28 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(stats.children, {
            opacity: 1, x: 0,
            duration: 0.8, ease: 'power3.out',
            stagger: 0.12, delay: 0.1,
          });
          gsap.to(img, {
            opacity: 1, scale: 1,
            duration: 1.1, ease: 'power3.out', delay: 0.2,
          });
          gsap.to(text.children, {
            opacity: 1, y: 0,
            duration: 0.9, ease: 'power3.out',
            stagger: 0.14, delay: 0.35,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(aboutStatsRef.current!);
    return () => observer.disconnect();
  }, []);

  /* ── marquee units ──────────────────────────────────────────────────── */
  const createMqUnits = (prefix: string) => Array.from({ length: REPEATS }, (_, i) => (
    <span key={`${prefix}-${i}`} className="mq-unit" style={{
      fontFamily:       'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
      fontSize:         '200px',
      fontWeight:       900,
      color:            '#ff0b0b',
      WebkitTextStroke: '1px rgba(255, 0, 0, 0.45)',
      letterSpacing:    '0.08em',
      paddingRight:     '2.5rem',
      whiteSpace:       'nowrap',
      userSelect:       'none',
      pointerEvents:    'none',
      opacity:          0.22,
      filter:           'drop-shadow(0 0 12px rgba(0, 0, 0, 0))',
    }}>
      {MQ_TEXT}
    </span>
  ));

  return (
    <div id="Hero" ref={sectionRef} style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── MARQUEE ROWS ─────────────────────────────────────────────────── */}
      <div ref={mq1WrapRef} style={{
        position: 'absolute', top: '50%', left: 0, width: '100vw',
        height: 'auto', overflow: 'hidden', zIndex: -1,
        pointerEvents: 'none', willChange: 'transform',
        transform: 'translateY(-50%)',
      }}>
        <div ref={mq1Ref} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform', transform: 'translate3d(0,0,0)' }}>
          {createMqUnits('a')}
          {createMqUnits('a-dup')}
        </div>
      </div>

      <div ref={mq2WrapRef} style={{
        position: 'absolute', top: '65%', left: 0, width: '100vw',
        height: 'auto', overflow: 'hidden', zIndex: -1,
        pointerEvents: 'none', willChange: 'transform',
        transform: 'translateY(-50%)',
      }}>
        <div ref={mq2Ref} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform', transform: 'translate3d(0,0,0)' }}>
          {createMqUnits('b')}
          {createMqUnits('b-dup')}
        </div>
      </div>

      {/* ── DEPTH CONTAINER ─────────────────────────────────────────────── */}
      <div
        ref={depthRef}
        style={{
          position:        'relative',
          height:          '100vh',
          width:           '100%',
          overflow:        'hidden',
          willChange:      'transform',
          transformOrigin: '50% 50%',
          borderRadius:    '50px',
          boxShadow:       '0 0 100px rgba(255, 0, 0, 0.6), 0 0 200px rgba(255, 0, 0, 0.3)',
          backgroundImage:    "url('/media/backdrop2.jpg')",
          backgroundSize:     '150% auto',
          backgroundPosition: '55% 85%',
          backgroundRepeat:   'no-repeat',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,11,18,0.35)', zIndex: 0 }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(8,11,18,0.75) 100%)',
          zIndex: 1, pointerEvents: 'none', filter: 'blur(100px)',
        }} />

        {/* ── MAIN CONTENT ────────────────────────────────────────────────── */}
        <div ref={contentRef} style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center', padding: '0 1rem', gap: 0,
          pointerEvents: 'none',
        }}>
          <h1 ref={nameRef} style={{
            fontFamily:    'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
            fontSize:      'clamp(52px, 9.5vw, 130px)',
            fontWeight:    900,
            color:         '#ffffff',
            letterSpacing: '0.12em',
            lineHeight:    1,
            margin:        0,
            userSelect:    'none',
            willChange:    'transform, opacity',
            textShadow:    '0 0 120px rgba(0,240,255,0.18), 0 2px 40px rgba(0,0,0,0.6)',
            whiteSpace:    'nowrap',
          }}>
            FAIZAN KHAN
          </h1>

          <div style={{
            marginTop: '0.5rem', marginBottom: '1.4rem',
            width: 'clamp(120px, 20vw, 300px)', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.5), transparent)',
          }} />

          <div ref={subRef} style={{ pointerEvents: 'auto', marginBottom: '1.4rem' }}>
            <div style={{ height: '1.8rem', marginBottom: '0.35rem' }}>
              <p style={{
                fontFamily: 'monospace', fontSize: 'clamp(0.85rem, 1.7vw, 1.15rem)',
                color: '#00F0FF', margin: 0, letterSpacing: '0.02em',
              }}>
                {display}
                <span style={{ animation: 'hb 1s step-end infinite' }}>|</span>
              </p>
            </div>
          </div>

          <div ref={ctaRef} style={{
            display: 'flex', gap: '1rem', flexWrap: 'wrap',
            justifyContent: 'center', pointerEvents: 'auto',
          }}>
            <button
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '0.8rem 1.7rem',
                background: 'linear-gradient(135deg,#ef4444,#991b1b)',
                border: 'none', borderRadius: '0.45rem',
                color: '#fff', fontWeight: 600, fontSize: '0.85rem',
                letterSpacing: '0.05em', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                transition: 'transform .2s, box-shadow .2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px rgba(239,68,68,0.5)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              <Eye size={15} /> View My Work
            </button>

            <button
              style={{
                padding: '0.8rem 1.7rem', background: 'transparent',
                border: '1.5px solid #f87171', borderRadius: '0.45rem',
                color: '#f87171', fontWeight: 600, fontSize: '0.85rem',
                letterSpacing: '0.05em', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.45rem',
                transition: 'background .2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
              onClick={() => window.open('/media/resume.pdf')}
            >
              <Download size={15} /> Download Resume
            </button>
          </div>
        </div>

        {/* ── SIGNATURE ─────────────────────────────────────────────────── */}
        <div ref={sigContRef} style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 5, pointerEvents: 'none',
        }}>
          <svg viewBox="0 0 1408 937" preserveAspectRatio="xMidYMid meet"
            className="absolute top-0 left-20 w-full h-full"
            xmlns="http://www.w3.org/2000/svg">
            <path
              ref={sigPathRef}
              d="M 832 737 C 554.699 737 277.898 737 1.04834 737 C 1.04834 491.727 1.04834 246.455 1.04834 1.09118 C 470.218 1.09118 939.436 1.09118 1408.83 1.09118 C 1408.83 246.333 1408.83 491.667 1408.83 737 C 1216.79 737 1024.64 737 832 737 M 492.882 392.198 C 497.5 389.646 502.048 386.955 506.75 384.566 C 522.327 376.652 539.201 374.704 556.343 373.666 C 582.701 372.07 609.023 369.847 635.387 368.39 C 664.633 366.773 693.906 365.646 723.172 364.446 C 740.93 363.717 758.695 363.136 776.462 362.696 C 808.306 361.909 840.151 361.039 872.001 360.649 C 905.158 360.242 938.323 360.148 971.483 360.294 C 1053.4 360.656 1135.33 361.285 1217.25 361.692 C 1243.24 361.821 1269.24 361.72 1295.23 361.396 C 1299.9 361.338 1304.72 360.171 1309.16 358.612 C 1313.81 356.972 1314.58 353.313 1311.17 349.857 C 1308.83 347.496 1305.81 345.564 1302.76 344.219 C 1297.32 341.821 1291.73 341.437 1285.98 344.06 C 1282.64 345.586 1278.88 346.969 1275.28 347.021 C 1239.15 347.549 1203.03 347.931 1166.9 348.08 C 1072.12 348.469 977.337 348.727 882.557 349.023 C 836.271 349.168 790.007 349.262 743.755 352.081 C 701.934 354.629 660.017 355.579 618.151 357.431 C 604.401 358.039 590.672 359.187 576.945 360.236 C 570.435 360.734 563.951 361.58 557.455 362.269 C 565.773 358.046 574.095 354.245 582.662 351.113 C 610.755 340.842 638.784 330.359 667.141 320.864 C 684.333 315.108 702.066 310.955 719.591 306.211 C 749.084 298.225 778.513 289.973 808.14 282.516 C 840.535 274.363 873.304 267.657 905.571 259.051 C 929.949 252.549 953.863 244.256 977.841 236.331 C 986.69 233.407 987.546 227.188 981.388 220.427 C 974.197 212.532 965.368 209.057 954.946 209.566 C 946.347 209.985 937.771 210.872 929.185 211.55 C 919.955 212.278 910.68 212.642 901.505 213.802 C 878.157 216.755 854.851 220.049 831.532 223.235 C 806.399 226.668 781.205 229.716 756.157 233.69 C 725.539 238.547 694.964 243.762 664.521 249.609 C 630.511 256.141 596.519 262.912 562.796 270.767 C 529.755 278.462 497.008 287.457 464.228 296.238 C 428.867 305.711 393.509 315.224 358.349 325.409 C 322.515 335.788 286.749 346.469 251.277 358.01 C 216.898 369.195 182.914 381.595 148.808 393.609 C 145.447 394.793 142.04 396.538 139.382 398.857 C 135.825 401.958 136.389 405.979 140.391 408.422 C 142.283 409.577 144.689 410.234 146.923 410.431 C 172.252 412.664 197.477 410.594 222.63 407.921 C 246.26 405.409 269.808 402.143 293.407 399.33 C 308.684 397.509 323.99 395.924 339.279 394.2 C 359.887 391.876 380.473 389.33 401.104 387.231 C 421.408 385.165 441.758 383.548 462.086 381.714 C 471.027 380.908 479.963 380.052 490.152 379.102 C 488.494 380.269 487.879 380.745 487.225 381.157 C 474.384 389.246 461.431 397.163 448.716 405.445 C 424.59 421.161 400.756 437.331 376.495 452.833 C 361.188 462.614 345.263 471.423 329.76 480.905 C 326.004 483.202 322.726 486.328 319.407 489.276 C 316.847 491.55 314.593 494.166 312.154 496.582 C 310.269 498.449 308.157 500.107 306.417 502.096 C 303.44 505.501 304.577 508.99 308.778 510.477 C 313.674 512.211 317.255 509.969 320.768 507.019 C 329.249 499.899 337.364 492.241 346.408 485.92 C 356.678 478.742 367.979 473.062 378.514 466.239 C 403.26 450.211 427.758 433.799 452.475 417.724 C 465.622 409.173 479.015 401 492.882 392.198 M 464.949 515.129 C 466.575 514.799 468.201 514.468 469.827 514.137 C 493.342 509.348 516.756 503.965 540.398 499.913 C 573.488 494.242 606.727 489.412 639.948 484.534 C 652.428 482.701 665.018 481.545 677.589 480.42 C 701.7 478.263 725.833 476.344 749.957 474.334 C 756.738 473.768 763.512 472.97 770.305 472.729 C 784.547 472.224 798.758 468.972 813.008 474.477 C 818.521 476.606 825.276 475.722 831.469 475.782 C 833.617 475.803 835.773 473.956 837.935 473.935 C 853.429 473.785 868.927 473.823 884.422 473.973 C 886.797 473.995 889.164 474.897 891.535 475.392 C 891.456 475.858 891.378 476.324 891.3 476.79 C 881.191 477.913 871.011 478.613 860.993 480.28 C 851.412 481.875 841.962 484.33 832.53 486.709 C 828.812 487.646 825.899 490.165 826.466 494.443 C 827.02 498.619 831.81 501.464 836.528 500.933 C 848.805 499.551 861.046 497.636 873.36 496.825 C 898.792 495.151 924.251 493.8 949.718 492.802 C 970.463 491.989 991.234 491.806 1012 491.48 C 1052.03 490.852 1092.07 490.572 1132.1 489.645 C 1152.67 489.169 1173.24 487.868 1193.77 486.381 C 1199.86 485.941 1206 484.119 1211.75 481.965 C 1216.27 480.274 1216.77 475.717 1213.08 472.494 C 1210.54 470.276 1207.41 468.037 1204.22 467.407 C 1196.3 465.842 1188.22 464.778 1180.15 464.271 C 1168.23 463.521 1156.24 463.768 1144.31 462.977 C 1125.82 461.75 1107.39 459.577 1088.89 458.596 C 1067.01 457.435 1045.08 457.077 1023.17 456.438 C 998.913 455.731 974.654 454.805 950.388 454.527 C 930.771 454.303 911.143 454.781 891.524 455.167 C 873.086 455.529 854.654 456.209 836.217 456.655 C 834.453 456.698 832.65 456.171 830.905 455.743 C 827.785 454.978 824.717 453.503 821.589 453.386 C 816.802 453.208 811.871 453.41 807.207 454.41 C 802.019 455.522 801.445 453.411 801.588 449.109 C 801.757 444.009 799.162 441.501 794.113 441.194 C 791.291 441.023 788.439 440.957 785.621 441.151 C 779.045 441.603 772.921 440.593 767.121 437.154 C 762.552 434.445 757.286 433.29 752.339 435.681 C 748.452 437.559 745.128 440.601 741.552 443.123 C 735.596 434.982 734.51 434.466 724.765 435.73 C 722.141 436.071 719.489 436.493 716.971 437.27 C 712.188 438.745 707.493 440.504 702.187 442.345 C 703.911 438.078 705.602 434.589 706.733 430.927 C 708.43 425.431 705.616 419.766 700.459 419.514 C 691.74 419.086 682.512 417.923 674.316 420.12 C 652.913 425.857 631.928 433.17 610.834 440.031 C 605.77 441.678 600.928 444.013 594.777 446.524 C 598.003 440.878 600.808 436.568 602.973 431.958 C 604.31 429.111 605.623 425.668 605.2 422.745 C 604.794 419.934 602.14 417.447 600.284 414.519 C 601.445 414.047 603.331 413.031 605.344 412.513 C 608.976 411.578 610.741 409.526 610.207 405.727 C 609.642 401.713 607.531 399.487 603.273 399.394 C 597.484 399.268 592.071 399.937 587.579 404.208 C 584.235 407.388 580.626 410.298 577.046 413.218 C 573.647 415.991 572.591 419.9 574.429 423.304 C 575.741 425.732 579.096 427.431 581.899 428.563 C 584.165 429.479 586.97 429.063 590.632 429.312 C 586.328 436.28 582.6 442.418 578.739 448.47 C 578.049 449.551 576.901 450.426 575.8 451.144 C 563.379 459.246 550.962 467.356 538.466 475.342 C 531.235 479.964 530.92 482.719 538.39 488.583 C 533.348 489.297 529.106 489.65 524.974 490.523 C 495.192 496.813 465.179 502.23 435.729 509.822 C 399.883 519.063 364.456 529.96 328.984 540.592 C 319.228 543.515 309.893 547.902 300.488 551.906 C 296.176 553.743 292.5 560.728 294.709 562.858 C 297.259 565.317 300.936 567.475 304.36 567.913 C 307.784 568.35 312.151 567.546 313.56 562.973 C 314.885 558.671 318.101 556.836 322.109 555.611 C 341.543 549.673 360.827 543.206 380.389 537.732 C 408.216 529.945 436.24 522.86 464.949 515.129 Z"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{ filter: 'drop-shadow(0 0 10px rgba(0, 238, 255, 0.7)) drop-shadow(0 0 20px rgba(0,240,255,0.3))' }}
              transform="scale(1.5) translate(-300,-100)"
            />
          </svg>
        </div>

        {/* ── CHEVRON ─────────────────────────────────────────────────── */}
        <div ref={chevRef} style={{
          position: 'absolute', bottom: '1.8rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 6,
          animation: 'hbounce 1.6s ease-in-out infinite', pointerEvents: 'none',
        }}>
          <ChevronDown color="#00F0FF" size={26} />
        </div>

      </div>{/* /depthRef */}

      {/* ════════════════════════════════════════════════════════════════════
          ABOUT PANEL — Editorial Split Layout
      ════════════════════════════════════════════════════════════════════ */}
      <div ref={aboutRef} style={{
        position:        'absolute',
        top:             0,
        left:            0,
        width:           '100%',
        height:          '100vh',
        zIndex:          10,
        backgroundColor: '#080B12',
        overflow: 'visible',
        borderTop:       '1px solid rgba(0,240,255,0.08)',
        boxShadow:       '0 -40px 100px rgba(0,0,0,0.95)',
      }}>
         <div
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '220px',

      zIndex: 3,
      pointerEvents: 'none',

      background: `
        linear-gradient(
          to bottom,
          rgba(8,11,18,0) 0%,
          rgba(8,11,18,0.5) 40%,
          rgba(8,11,18,0.9) 75%,
          #080B12 100%
        )
      `,
    }}
  />
        

        {/* Subtle noise texture overlay */}
        

        {/* ── 3-COLUMN EDITORIAL GRID ─────────────────────────────────── */}
        <div style={{
          position:      'relative',
          zIndex:        1,
          height:        '100%',
          display:       'grid',
          gridTemplateColumns: '1fr 1.1fr 1fr',
          gridTemplateRows:    '1fr',
          maxWidth:      1400,
          margin:        '0 auto',
          padding:       '0 2.5rem',
          gap:           '0',
          alignItems:    'center',
        }}
        className="about-grid"
        >

          {/* ── LEFT: STATS ──────────────────────────────────────────── */}
          <div ref={aboutStatsRef} style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '2.8rem',
            paddingRight:  '4rem',
            paddingLeft:   '0.1rem',
            transform: 'translate(-90px, 60px)',
          }}>
            {STATS.map(({ icon: Icon, value, label }, i) => (
              <div key={label} style={{
                display:    'flex',
                flexDirection: 'column',
                gap:        '0.2rem',
                borderLeft: i === 0 ? '2px solid rgba(239,68,68,0.6)' : '2px solid rgba(239,68,68,0.15)',
                paddingLeft: '1.4rem',
                transition: 'border-color 0.4s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(239,68,68,0.8)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = i === 0 ? 'rgba(239,68,68,0.6)' : 'rgba(239,68,68,0.15)'; }}
              >
                <span style={{
                  fontFamily:    'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
                  fontSize:      'clamp(52px, 5.5vw, 78px)',
                  fontWeight:    900,
                  color:         '#ffffff',
                  lineHeight:    0.9,
                  letterSpacing: '-0.02em',
                }}>
                  {value}
                </span>
                <span style={{
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '0.4rem',
                  fontFamily:    'FuturaCyrillicBold',
                  fontSize:      '1.4rem',
                  letterSpacing: '0.15em',
                  color:         'rgba(156,163,175,0.7)',
                  textTransform: 'uppercase',
                  marginTop:     '0.2rem',
                }}>
                 
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* ── CENTER: PORTRAIT + BACKGROUND TEXT ─────────────────────── */}
          
          <div ref={aboutImgRef} style={{
            position:  'relative',
            minHeight: '88vh',
            height: 'auto',
            display:   'flex',
            overflow: 'visible',
            alignItems: 'flex-end',
            justifyContent: 'center',
            alignSelf: 'end',
            
            
          }}
          >
            

            {/* Ambient glow behind figure */}
            <div style={{
              position: 'absolute',
              bottom:   '-5%',
              left:     '50%',
              transform: 'translateX(-50%)',
              width:    '80%',
              height:   '60%',
              background: 'radial-gradient(ellipse at 50% 100%, rgba(239,68,68,0.22) 0%, rgba(25,0,255,0.12) 50%, transparent 75%)',
              filter:   'blur(40px)',
              zIndex:   1,
              pointerEvents: 'none',

            
            }} />
            

            <div
  style={{
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '520px',
    height: 'auto',
    zIndex: 3,
    display: 'flex',
    justifyContent: 'center',
    pointerEvents: 'auto',
  }}

           
            >
              <img
  src="/media/profilebg.png"
  alt="Faizan Khan"
  style={{
    width: '130%',
    height: 'auto',

    transform: 'scale(1.42)',   // 🔥 CONTROL SIZE HERE
    transformOrigin: 'bottom center',

    objectFit: 'contain',
    objectPosition: 'bottom',
    display: 'block',

    filter: 'drop-shadow(0 20px 40px rgba(239,68,68,0.2))',

    transition: 'none',
  }}
/>
            </div>
          </div>
          {/* ── RIGHT: TEXT CONTENT ──────────────────────────────────────── */}
          <div ref={aboutTextRef} style={{
            display:       'flex',
            flexDirection: 'column',
            gap:           '2rem',
            paddingLeft:   '3rem',
            paddingRight:  '0.5rem',
            position: 'relative', 
          
          }}>
            {/* Main heading */}
            <div>
              <h2 style={{
                fontFamily:    'FuturaCyrillicBold, Impact, Arial Black, sans-serif',
                fontSize:      'clamp(1.6rem, 2.8vw, 2.6rem)',
                fontWeight:    700,
                color:         '#f70000',
                lineHeight:    1.15,
                margin:        0,
                letterSpacing: '0.01em',
                display: 'inline-block',
                width: 'fit-content',
                transform: 'translate(30px, -20px) scale(1.56)',
              }}>
                <span style={{

                 color: '#f70000',
                 display: 'block',
                 whiteSpace: 'nowrap', 
                 }}>
                  Where Logic ends,
                </span>
                
                <span style={{ color: '#ffffff' ,
                  whiteSpace: 'nowrap',
                }}>
                  Creativity finds a way
                  </span>
              </h2>
            </div>

            {/* Accent line + paragraph */}
            <div style={{
            position:   'relative',
            left: '150px',  
            top:  '150px',
            scale: '1.24',

             }}>
              {/* Vertical accent line */}
              <div style={{
                position:     'absolute',
                left:         '-1.5rem',
                top:          '0.2rem',
                bottom:       '0.2rem',
                width:        '2px',
                background:   'linear-gradient(to bottom, #ef4444, rgba(239,68,68,0.2))',
                borderRadius: '9999px',
              }} />
              <p style={{
                color:        'rgba(209,213,219,0.72)',
                fontSize:     'clamp(0.875rem, 1.05vw, 1.02rem)',
                lineHeight:   1.85,
                margin:       0,
                fontFamily:   '"Outfit", system-ui, sans-serif',
                fontWeight:   300,
              }}>
                A software engineer specializing in AI and machine learning,
                focused on building intelligent, real-world systems.
                Passionate about the intersection of art, design, and technology
                to create meaningful digital experiences.
              </p>
            </div>

            {/* Divider */}
          

            {/* Availability badge */}
          

          </div>
        </div>
      </div>

      <style>{`
        @keyframes hb      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes hbounce {
          0%,100%{ transform:translateX(-50%) translateY(0);  }
          50%    { transform:translateX(-50%) translateY(7px); }
        }
        @keyframes pulse-green {
          0%,100% { box-shadow: 0 0 6px rgba(34,197,94,0.7); }
          50%     { box-shadow: 0 0 14px rgba(34,197,94,1);   }
        }

        /* ── Responsive: tablet ───────────────────────── */
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows:    auto auto auto !important;
            padding: 2rem 1.5rem !important;
            gap: 2rem !important;
            align-items: start !important;
            overflow-y: auto !important;
          }
          .about-grid > *:nth-child(1) { order: 3; padding-right: 0 !important; padding-left: 0 !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 1.5rem !important; justify-content: space-between !important; }
          .about-grid > *:nth-child(2) { order: 1; height: 60vw !important; max-height: 360px !important; }
          .about-grid > *:nth-child(3) { order: 2; padding-left: 0 !important; padding-right: 0 !important; }
        }

        @media (max-width: 600px) {
          .about-grid > *:nth-child(1) { justify-content: space-around !important; }
          .about-grid > *:nth-child(2) { height: 75vw !important; }
        }
      `}</style>
    </div>
  );
};

export default Hero;