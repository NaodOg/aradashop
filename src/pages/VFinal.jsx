import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || "/owner-dashboard";

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { el.classList.add("is-visible"); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ as: Tag = "div", className = "", children, delay = 0, ...props }) {
  const ref = useReveal();
  return (
    <Tag ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }} {...props}>
      {children}
    </Tag>
  );
}

export default function VFinal() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSurface, setActiveSurface] = useState(0);
  const modalContentRef = useRef(null);
  const closeTimer = useRef(null);

  const openProject = (item) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSelectedProject(item);
    requestAnimationFrame(() => requestAnimationFrame(() => setModalOpen(true)));
  };

  const closeProject = () => {
    setModalOpen(false);
    closeTimer.current = setTimeout(() => setSelectedProject(null), 320);
  };

  useEffect(() => {
    if (!selectedProject) return;
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      htmlOverflow: html.style.overflow,
      htmlOverscroll: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscroll: body.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
    };

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';

    const preventScroll = (e) => {
      if (modalContentRef.current && modalContentRef.current.contains(e.target)) return;
      e.preventDefault();
    };
    const preventKeys = (e) => {
      if (modalContentRef.current && modalContentRef.current.contains(e.target)) return;
      if ([' ', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) e.preventDefault();
    };
    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeys);

    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventKeys);
      html.style.overflow = prev.htmlOverflow;
      html.style.overscrollBehavior = prev.htmlOverscroll;
      body.style.overflow = prev.bodyOverflow;
      body.style.overscrollBehavior = prev.bodyOverscroll;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.left = prev.bodyLeft;
      body.style.right = prev.bodyRight;
      body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [selectedProject]);

  const projects = [
    {
      title: "Addis Jazz Fest",
      sub: "Official Merch",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4N0D775zpo8p8rkR2afPFtARLuWoYmpzLSdVqw89niUgIezgnYazhMHbk0rLb6Yo53T3U2fA5NFrkE0h1z366qStqeSgH54d_X7VEVM6LjZS1hsx1iYN2HVFNBeH5CXWGYaT-7GKR-Ab0dghb0BSf0F4uo20sHjx3OmlA3EfnA_rvoHrrTcddZUn0lz6Vz-qsND6T1UroxSwovdcEOPQLwJ7XXUlcww3adfL0n1I6ITvK2xmV8AaXWkwXit1DCtIirSRUtQQ2wug",
      description: "Full merchandise production for Addis Jazz Fest â€” custom t-shirts, staff tees, and on-site event branding delivered on a tight timeline.",
      services: ["Custom T-Shirts", "Staff Uniforms", "Event Branding"],
      gallery: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA4N0D775zpo8p8rkR2afPFtARLuWoYmpzLSdVqw89niUgIezgnYazhMHbk0rLb6Yo53T3U2fA5NFrkE0h1z366qStqeSgH54d_X7VEVM6LjZS1hsx1iYN2HVFNBeH5CXWGYaT-7GKR-Ab0dghb0BSf0F4uo20sHjx3OmlA3EfnA_rvoHrrTcddZUn0lz6Vz-qsND6T1UroxSwovdcEOPQLwJ7XXUlcww3adfL0n1I6ITvK2xmV8AaXWkwXit1DCtIirSRUtQQ2wug",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBRgSRpv3nZGbwOkc8-N0_AA4fsAVIZsb4beRmXSUHQZxm2uNDlXIRGWUkWcgaf8tFXYD3rwSL1Z1YKaNWL0QCI7SY3cj_DkHS3Ol9oX7ndF-vxwPj9Pij-F43lqjAE_jhRuoS-lJ4CtDCo9mPgN5UULz6he5Gjj9kjhrjoZETwUv4mKN3wI8YvBVhKC5pCZ-EjH1R1AxWVA9t8qswsHlhsSAxMY_kB7CLBWaJ4GTUE0nIx6t63_y7iK8mS9poK5zXHf58IHVGEofY",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCyOTQ8p88aNwT9ogipBnoE5feIEprnasXzTN_wRcG9LZnd0_cQUUe9GVvWZNt4XCRwzlV7txt5FfeQCOpqGHLjb-Ub-YsNhsUhAf8T1Z-8JJ-cCXKA5GUP4EBUV9L_9z3N1UdmNV6C5xVQICEqZYq44h-mHRtMxfc-DCogiWx-MCm2AhWeu02TOAM66NY80ZaQ69HIg4dvwLOnOYM5HfZz5NyCVYo4eZ6WU91K444G7D6v0zjmuv7wtm2-JzVFrC_2eRF4JCNyks8"
      ]
    },
    {
      title: "Kinetic Series",
      sub: "Urban Lookbook",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAwxQmKQkpuW3pwVy_9s78kqDj6FEPlEpWSK3YZLCAtjyM3valHV1e3hZd7Re_Khb87i1q-tVVIeCzY9ukLp2XeJ9AEKJXeuJdXPgJ-jXPDkSdWA-kDKPe8NCmDi1vIWXft3Rqp1t9sORIgQLYLQ95Ht8TSJbw6PIcs0xhCPdnVzaxh5NGxKVtcOIn8tmcO7Gp4INoAOccF_3mXeR3UglR1s1tJlbQUJBdENwXteF17vNzJKPoV1De2a0F4RsLpYtSkgBiJOUoyZ4I",
      description: "Branded apparel collection for Kinetic Series â€” hoodies, tees, and lookbook pieces produced for their launch campaign.",
      services: ["Hoodies & Tees", "Lookbook Pieces", "Campaign Merch"],
      gallery: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAwxQmKQkpuW3pwVy_9s78kqDj6FEPlEpWSK3YZLCAtjyM3valHV1e3hZd7Re_Khb87i1q-tVVIeCzY9ukLp2XeJ9AEKJXeuJdXPgJ-jXPDkSdWA-kDKPe8NCmDi1vIWXft3Rqp1t9sORIgQLYLQ95Ht8TSJbw6PIcs0xhCPdnVzaxh5NGxKVtcOIn8tmcO7Gp4INoAOccF_3mXeR3UglR1s1tJlbQUJBdENwXteF17vNzJKPoV1De2a0F4RsLpYtSkgBiJOUoyZ4I",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDXiruRApy-kp3NYkTsxIarJ2QMvty_4m6jvUyb7NzoyJ7l7us_r2rsR_6e_VtSJ7PFyUBoZFhWGOHlrRdsyEsi066N2CtFW9tYNYH2XAlmvrXpSVQfBKdzLAcm_q765lxRbJd0tJkkDtf4Fier7EN6NZV4jBLYJE0RWh-FJo9NFqb5-KgrbedQt11IUW_pC11DogvE04qzKutKQQVDO-lo-41xrPm_4zEM53apwUJLXq6t1lJWOlMb6XSNmQ1GiLjnFoS9jOpSD6s",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA_bQ3zrbi-oSXZUzHnqQfxGGuSsU0MPa8I0vxu_n5N2O_DZWvLwguIipF-2asTEPdx5rHxBRnfa4c8K46_uoIYLhdqioQR42JFGTjFKxta60BMuWNNmGxsK64rTSrJtTjtIjI3YJNLFTjuOkrQG5bymueHAEX0ekk_bWr_YT3Hx9GJoeLd_SLaZVCxDpHrRFY3W4CtBUCcORwr1L11u8rbvrrNZ-y2cD4DgEMiZEoxlFEnRfnLGqZfPnvx_GnWAwXqrHTazlVPmwo"
      ]
    },
    {
      title: "The Lab",
      sub: "Custom Dye Project",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZcPFgQLHmHWJk0C7BHSfba8b3fjPNMk-LFbgFqmGfdbPMQcJuHxknNowtVzPuQ4_XBynVI0lZNlbYWbPyFbtdX4HWgBj4xLetR89YBxU3KAfx6Qzt0DQ2AzsbbTyWtk5TicxdmKlCYyVS3JS1avMYhR0ASbwU8T54gnou1ZkBvxOp2CTkTJHRGir-1rKHWGJcFBQMxj_KXAHUNuMHVKPx0qoy1i8B0_YdhcQKERwHqcTs6pfpvgE0z-DZ0pv0npoEzjXD0WPDZLw",
      description: "Custom dye and print project for The Lab â€” banners, tote bags, and limited-run garments with bespoke finishes.",
      services: ["Banners & Signage", "Tote Bags", "Custom Dye Prints"],
      gallery: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAZcPFgQLHmHWJk0C7BHSfba8b3fjPNMk-LFbgFqmGfdbPMQcJuHxknNowtVzPuQ4_XBynVI0lZNlbYWbPyFbtdX4HWgBj4xLetR89YBxU3KAfx6Qzt0DQ2AzsbbTyWtk5TicxdmKlCYyVS3JS1avMYhR0ASbwU8T54gnou1ZkBvxOp2CTkTJHRGir-1rKHWGJcFBQMxj_KXAHUNuMHVKPx0qoy1i8B0_YdhcQKERwHqcTs6pfpvgE0z-DZ0pv0npoEzjXD0WPDZLw",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBqo2lg4dIkWdGWCAZoa1ZVjXJ5QEKsjvR6fstdRPSLBccDbziTg94TWmmJ74HwKD6JOd-Zqv9VbSp1MgyRReB9Vi9Fp1NxlrVrfAcqVRPkkQEbIjc8w0RWdSLjpQXuYLbDlgN2g2KuTF3TP1Q2DHpdd2pYidkuI50dvTG67euIZiDPM8sAn3AK166CPbv-CC5lc-DoocRhc2HS-oHmE2v-U2gLrXkDM0BNQxqzEOdByxjn1bpiex4xeupqQN31gQoPFiGnGZYK6bM",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAIxgT1FMtN6gkr41jQ-StFkYrp11MinhBh4xpqw1MJ5cNQvieX3aTE2UgSfkcpuBCBCjLLinJ2A8SyY4HGgDGQge2lJnI2hdEVkA9FY-UIMEboMC771PlehQS50-71TbzK-SFFj7SdDEOKO0Ix3eMse4XyckGhivVvt94Pb3mjIGjx3kPdjiHx8ta3guE1zJXB0JgOvexuPqCwk82xpVow_l3W7hVgd3sZtgglSpyFskSjgkGOunH4ypwGp3P5wj3s-Kd7_5OjHe4"
      ]
    }
  ];

  const surfaces = [
    {
      label: "Apparel",
      title: "Wear the Brand",
      desc: "T-shirts and hoodies for drops, teams, and everyday wear â€” crisp, durable prints made to move through Addis.",
      details: ["T-Shirts & Hoodies", "Single & bulk runs", "DTG + heat press"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRgSRpv3nZGbwOkc8-N0_AA4fsAVIZsb4beRmXSUHQZxm2uNDlXIRGWUkWcgaf8tFXYD3rwSL1Z1YKaNWL0QCI7SY3cj_DkHS3Ol9oX7ndF-vxwPj9Pij-F43lqjAE_jhRuoS-lJ4CtDCo9mPgN5UULz6he5Gjj9kjhrjoZETwUv4mKN3wI8YvBVhKC5pCZ-EjH1R1AxWVA9t8qswsHlhsSAxMY_kB7CLBWaJ4GTUE0nIx6t63_y7iK8mS9poK5zXHf58IHVGEofY",
      note: "Most requested"
    },
    {
      label: "Banners",
      title: "Make It Seen",
      desc: "Event backdrops, shop signage, and roll-ups that carry your brand loud and clear â€” indoors or out.",
      details: ["Event branding", "Shop signage", "Fast turnaround"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIxgT1FMtN6gkr41jQ-StFkYrp11MinhBh4xpqw1MJ5cNQvieX3aTE2UgSfkcpuBCBCjLLinJ2A8SyY4HGgDGQge2lJnI2hdEVkA9FY-UIMEboMC771PlehQS50-71TbzK-SFFj7SdDEOKO0Ix3eMse4XyckGhivVvt94Pb3mjIGjx3kPdjiHx8ta3guE1zJXB0JgOvexuPqCwk82xpVow_l3W7hVgd3sZtgglSpyFskSjgkGOunH4ypwGp3P5wj3s-Kd7_5OjHe4",
      note: "Big format"
    },
    {
      label: "Company Uniforms",
      title: "Dress the Team",
      desc: "Consistent, branded uniforms for companies, crews, and events â€” printed in Addis with attention to detail.",
      details: ["Teams & staff", "Consistent branding", "Bulk orders"],
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyOTQ8p88aNwT9ogipBnoE5feIEprnasXzTN_wRcG9LZnd0_cQUUe9GVvWZNt4XCRwzlV7txt5FfeQCOpqGHLjb-Ub-YsNhsUhAf8T1Z-8JJ-cCXKA5GUP4EBUV9L_9z3N1UdmNV6C5xVQICEqZYq44h-mHRtMxfc-DCogiWx-MCm2AhWeu02TOAM66NY80ZaQ69HIg4dvwLOnOYM5HfZz5NyCVYo4eZ6WU91K444G7D6v0zjmuv7wtm2-JzVFrC_2eRF4JCNyks8",
      note: "For companies"
    }
  ];

  return (
    <div className="bg-[#000d1e] text-[#e2e2e2] font-body selection:bg-[#FAE500] selection:text-[#001B3D] min-h-screen page-fade">

      <main>
        {/* 2. HERO SECTION + SCROLL TO EXPLORE (from V0) */}
        <section className="relative min-h-[100svh] w-full flex items-center justify-center overflow-hidden bg-[#001B3D] pt-24 pb-8 sm:pb-12 md:pb-24">
          <div className="absolute inset-0">
            <img className="w-full h-full object-cover opacity-40 mix-blend-luminosity" alt="Cinematic shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_bQ3zrbi-oSXZUzHnqQfxGGuSsU0MPa8I0vxu_n5N2O_DZWvLwguIipF-2asTEPdx5rHxBRnfa4c8K46_uoIYLhdqioQR42JFGTjFKxta60BMuWNNmGxsK64rTSrJtTjtIjI3YJNLFTjuOkrQG5bymueHAEX0ekk_bWr_YT3Hx9GJoeLd_SLaZVCxDpHrRFY3W4CtBUCcORwr1L11u8rbvrrNZ-y2cD4DgEMiZEoxlFEnRfnLGqZfPnvx_GnWAwXqrHTazlVPmwo"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#001B3D] via-[#001B3D]/30 to-[#001B3D]/50"></div>
          </div>
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
            <p className="font-headline text-[#FAE500] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-xs sm:text-sm mb-5 md:mb-6 font-bold hero-enter" style={{ animationDelay: '80ms' }}>New Arrival — A/W 24</p>
            <h1 className="font-headline text-4xl sm:text-6xl md:text-7xl lg:text-[9rem] font-black tracking-tighter leading-[0.95] mb-8 md:mb-12 text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] hero-enter" style={{ animationDelay: '200ms' }}>
              MADE TO MOVE.<br/>
              <span className="text-transparent text-outline-yellow">BUILT IN ADDIS.</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center max-w-xl mx-auto hero-enter" style={{ animationDelay: '360ms' }}>
              <a href="/products" className="bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-widest px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg hover:bg-white transition-colors w-full sm:w-auto text-center scale-100 active:scale-95 duration-200 shadow-[0_0_30px_rgba(250,229,0,0.3)]">
                Shop Products
              </a>
              <a href="/b2b" className="bg-transparent border-2 border-[#FAE500] text-[#FAE500] font-headline font-black uppercase tracking-widest px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg hover:bg-[#FAE500] hover:text-[#001B3D] transition-colors w-full sm:w-auto text-center scale-100 active:scale-95 duration-200">
                Start a Project
              </a>
            </div>
          </div>
          <div className="absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-70 text-[#FAE500]">Scroll to Explore</span>
            <div className="w-[1px] h-12 bg-[#FAE500]/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-[#FAE500] animate-bounce"></div>
            </div>
          </div>
        </section>

        {/* 3. SHOP ARADA & B2B SERVICES */}
        <Reveal as="section" className="bg-[#001B3D] pt-6 sm:pt-10 md:pt-16 pb-8">
          <div className="flex flex-col gap-4 px-4 md:px-12 max-w-[100rem] mx-auto">
            <a href="/products" className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/6] bg-[#001B3D] overflow-hidden group cursor-pointer border border-[#FAE500]/30 hover:border-[#FAE500]/50 block premium-card">
              <img className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-all duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.03]" alt="Apparel" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyOTQ8p88aNwT9ogipBnoE5feIEprnasXzTN_wRcG9LZnd0_cQUUe9GVvWZNt4XCRwzlV7txt5FfeQCOpqGHLjb-Ub-YsNhsUhAf8T1Z-8JJ-cCXKA5GUP4EBUV9L_9z3N1UdmNV6C5xVQICEqZYq44h-mHRtMxfc-DCogiWx-MCm2AhWeu02TOAM66NY80ZaQ69HIg4dvwLOnOYM5HfZz5NyCVYo4eZ6WU91K444G7D6v0zjmuv7wtm2-JzVFrC_2eRF4JCNyks8"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#001B3D] via-[#001B3D]/40 to-transparent md:bg-gradient-to-r md:from-[#001B3D] md:via-[#001B3D]/60 md:to-transparent flex flex-col justify-end md:justify-center p-6 sm:p-8 md:p-12 lg:p-24">
                <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-2 md:mb-4">Shop<br className="hidden sm:block"/> Arada</h2>
                <p className="font-mono text-[10px] sm:text-xs text-[#FAE500] tracking-[0.2em] uppercase mb-4 md:mb-8">Premium Urban Silhouettes</p>
                <div className="font-headline text-[10px] sm:text-xs font-bold tracking-widest uppercase flex items-center gap-4 text-white">
                  Explore Apparel <div className="w-10 md:w-12 h-[1px] bg-white group-hover:w-24 group-hover:bg-[#FAE500] transition-all duration-500"></div>
                </div>
              </div>
            </a>

            <a href="/b2b" className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/6] bg-[#001B3D] overflow-hidden group cursor-pointer border border-[#FAE500]/30 hover:border-[#FAE500]/50 block premium-card">
              <img className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover:opacity-60 transition-all duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.03]" alt="Print" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIxgT1FMtN6gkr41jQ-StFkYrp11MinhBh4xpqw1MJ5cNQvieX3aTE2UgSfkcpuBCBCjLLinJ2A8SyY4HGgDGQge2lJnI2hdEVkA9FY-UIMEboMC771PlehQS50-71TbzK-SFFj7SdDEOKO0Ix3eMse4XyckGhivVvt94Pb3mjIGjx3kPdjiHx8ta3guE1zJXB0JgOvexuPqCwk82xpVow_l3W7hVgd3sZtgglSpyFskSjgkGOunH4ypwGp3P5wj3s-Kd7_5OjHe4"/>
              <div className="absolute inset-0 bg-gradient-to-t from-[#001B3D] via-[#001B3D]/40 to-transparent md:bg-gradient-to-l md:from-[#001B3D] md:via-[#001B3D]/60 md:to-transparent flex flex-col justify-end md:justify-center items-start md:items-end text-left md:text-right p-6 sm:p-8 md:p-12 lg:p-24">
                <h2 className="font-headline text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white mb-2 md:mb-4">B2B<br className="hidden sm:block"/> Services</h2>
                <p className="font-mono text-[10px] sm:text-xs text-[#FAE500] tracking-[0.2em] uppercase mb-4 md:mb-8">For Brands, Teams & Businesses</p>
                <div className="font-headline text-[10px] sm:text-xs font-bold tracking-widest uppercase flex items-center gap-4 text-white md:flex-row-reverse">
                  Explore B2B <div className="w-10 md:w-12 h-[1px] bg-white group-hover:w-24 group-hover:bg-[#FAE500] transition-all duration-500"></div>
                </div>
              </div>
            </a>
          </div>
        </Reveal>

        {/* 4. NEW DESIGNS (Trending) */}
        <section id="shop" className="py-16 md:py-24 bg-[#001B3D] relative overflow-hidden">
          <div className="absolute -top-24 -left-16 w-72 h-72 bg-[#FAE500]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 md:px-12 relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 border-b border-white/10 pb-6 md:pb-8">
              <div>
                <span className="font-mono text-[#FAE500] tracking-[0.3em] uppercase text-[10px] bg-[#FAE500]/10 border border-[#FAE500]/20 px-3 py-1 rounded-full inline-block mb-4">New Designs</span>
                <h2 className="font-headline text-4xl md:text-6xl font-black tracking-tighter uppercase text-white">Trending Now</h2>
              </div>
              <a className="font-mono text-xs text-[#C6C6C7] hover:text-[#FAE500] transition-colors uppercase tracking-[0.2em] mt-4 md:mt-0" href="/products">View Products</a>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8 items-stretch">
              {[
                { title: "Arada Core Tee", mat: "Heavyweight 300GSM Cotton", price: "1200 ETB", tag: "SOLD OUT", tagColor: "bg-red-500/90 text-white", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRgSRpv3nZGbwOkc8-N0_AA4fsAVIZsb4beRmXSUHQZxm2uNDlXIRGWUkWcgaf8tFXYD3rwSL1Z1YKaNWL0QCI7SY3cj_DkHS3Ol9oX7ndF-vxwPj9Pij-F43lqjAE_jhRuoS-lJ4CtDCo9mPgN5UULz6he5Gjj9kjhrjoZETwUv4mKN3wI8YvBVhKC5pCZ-EjH1R1AxWVA9t8qswsHlhsSAxMY_kB7CLBWaJ4GTUE0nIx6t63_y7iK8mS9poK5zXHf58IHVGEofY" },
                { title: "Kinetic Hoodie", mat: "Brushed Fleece Lining", price: "2500 ETB", tag: "IN STOCK", tagColor: "bg-[#FAE500] text-[#001B3D]", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDXiruRApy-kp3NYkTsxIarJ2QMvty_4m6jvUyb7NzoyJ7l7us_r2rsR_6e_VtSJ7PFyUBoZFhWGOHlrRdsyEsi066N2CtFW9tYNYH2XAlmvrXpSVQfBKdzLAcm_q765lxRbJd0tJkkDtf4Fier7EN6NZV4jBLYJE0RWh-FJo9NFqb5-KgrbedQt11IUW_pC11DogvE04qzKutKQQVDO-lo-41xrPm_4zEM53apwUJLXq6t1lJWOlMb6XSNmQ1GiLjnFoS9jOpSD6s" },
                { title: "Utility Tote", mat: "Industrial Grade Canvas", price: "850 ETB", tag: "LIMITED", tagColor: "bg-white/90 text-[#001B3D]", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBqo2lg4dIkWdGWCAZoa1ZVjXJ5QEKsjvR6fstdRPSLBccDbziTg94TWmmJ74HwKD6JOd-Zqv9VbSp1MgyRReB9Vi9Fp1NxlrVrfAcqVRPkkQEbIjc8w0RWdSLjpQXuYLbDlgN2g2KuTF3TP1Q2DHpdd2pYidkuI50dvTG67euIZiDPM8sAn3AK166CPbv-CC5lc-DoocRhc2HS-oHmE2v-U2gLrXkDM0BNQxqzEOdByxjn1bpiex4xeupqQN31gQoPFiGnGZYK6bM" },
                { title: "Signature Cap", mat: "Structured Cotton Twill", price: "700 ETB", tag: "NEW", tagColor: "bg-[#FAE500] text-[#001B3D]", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyOTQ8p88aNwT9ogipBnoE5feIEprnasXzTN_wRcG9LZnd0_cQUUe9GVvWZNt4XCRwzlV7txt5FfeQCOpqGHLjb-Ub-YsNhsUhAf8T1Z-8JJ-cCXKA5GUP4EBUV9L_9z3N1UdmNV6C5xVQICEqZYq44h-mHRtMxfc-DCogiWx-MCm2AhWeu02TOAM66NY80ZaQ69HIg4dvwLOnOYM5HfZz5NyCVYo4eZ6WU91K444G7D6v0zjmuv7wtm2-JzVFrC_2eRF4JCNyks8" }
              ].map((item, i) => (
                <div key={i} className="group flex h-full flex-col rounded-xl sm:rounded-2xl p-2.5 sm:p-4 bg-white/[0.06] backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:bg-white/[0.1] hover:border-[#FAE500]/35 hover:shadow-[0_12px_40px_rgba(250,229,0,0.12)] transition-all duration-300">
                  <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-[#00142D]/50 border border-white/10">
                    <img className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={item.title} src={item.img}/>
                    <div className={`absolute top-2 left-2 sm:top-4 sm:left-4 font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 sm:px-3 sm:py-1 rounded-sm backdrop-blur-md ${item.tagColor}`}>
                      {item.tag}
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-5 flex flex-1 justify-between items-end gap-2 sm:gap-4 px-0.5 sm:px-1">
                    <div className="min-w-0">
                      <h3 className="font-headline font-black text-xs sm:text-base lg:text-lg xl:text-xl uppercase text-white tracking-tight leading-tight line-clamp-2">{item.title}</h3>
                      <p className="font-mono text-[9px] sm:text-[10px] text-[#C6C6C7]/80 mt-1 sm:mt-2 leading-relaxed line-clamp-1 sm:line-clamp-2">{item.mat}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="hidden sm:flex h-4 mb-2 justify-end opacity-40">
                         {[1, 2, 1, 1, 3, 1, 2, 1].map((w, j) => <div key={j} className="bg-white h-full ml-[2px]" style={{ width: `${w}px` }}></div>)}
                      </div>
                      <span className="font-headline font-bold text-[#FAE500] text-[11px] sm:text-sm whitespace-nowrap">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ARTWORK TO WEAR */}
        <Reveal as="section" id="services" className="py-16 md:py-24 border-t border-white/10 px-4 md:px-12 max-w-[100rem] mx-auto">
          <div className="mb-10 md:mb-14">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FAE500] mb-3 block">B2B Services</span>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
              <h2 className="md:col-span-8 font-headline text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.85] text-white">
                Artwork<br/><span className="text-transparent text-outline-yellow">to Wear.</span>
              </h2>
              <p className="md:col-span-4 font-body text-sm md:text-base text-[#C6C6C7] leading-relaxed max-w-md md:justify-self-end">
                A simple path from your file to finished pieces â€” one-off samples or full runs, printed in Addis.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            <article className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[520px] overflow-hidden border border-white/10 bg-[#00142D] group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_bQ3zrbi-oSXZUzHnqQfxGGuSsU0MPa8I0vxu_n5N2O_DZWvLwguIipF-2asTEPdx5rHxBRnfa4c8K46_uoIYLhdqioQR42JFGTjFKxta60BMuWNNmGxsK64rTSrJtTjtIjI3YJNLFTjuOkrQG5bymueHAEX0ekk_bWr_YT3Hx9GJoeLd_SLaZVCxDpHrRFY3W4CtBUCcORwr1L11u8rbvrrNZ-y2cD4DgEMiZEoxlFEnRfnLGqZfPnvx_GnWAwXqrHTazlVPmwo" alt="" className="absolute inset-0 w-full h-full object-cover opacity-55 grayscale-[15%] group-hover:opacity-70 transition-opacity duration-700 motion-reduce:transition-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000d1e] via-[#000d1e]/45 to-transparent"></div>
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] border border-[#FAE500]/40 bg-[#000d1e]/60 px-3 py-1.5">01 / Files & prep</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-7">
                <p className="font-headline text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] font-black leading-[0.8] text-white/10 -mb-2 sm:-mb-3 select-none" aria-hidden="true">01</p>
                <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">Share Artwork</h3>
                <p className="font-body text-sm text-[#C6C6C7] leading-relaxed mb-4">Send your design, logo, or idea. We check scale, color, and placement for the piece.</p>
                <ul className="space-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6C6C7]">
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>AI, PSD, PNG or sketch</li>
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>Scale & placement check</li>
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>One-off or bulk brief</li>
                </ul>
              </div>
            </article>

            <article className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[520px] overflow-hidden border border-white/10 bg-[#00142D] group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIxgT1FMtN6gkr41jQ-StFkYrp11MinhBh4xpqw1MJ5cNQvieX3aTE2UgSfkcpuBCBCjLLinJ2A8SyY4HGgDGQge2lJnI2hdEVkA9FY-UIMEboMC771PlehQS50-71TbzK-SFFj7SdDEOKO0Ix3eMse4XyckGhivVvt94Pb3mjIGjx3kPdjiHx8ta3guE1zJXB0JgOvexuPqCwk82xpVow_l3W7hVgd3sZtgglSpyFskSjgkGOunH4ypwGp3P5wj3s-Kd7_5OjHe4" alt="" className="absolute inset-0 w-full h-full object-cover opacity-55 grayscale-[15%] group-hover:opacity-70 transition-opacity duration-700 motion-reduce:transition-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000d1e] via-[#000d1e]/45 to-transparent"></div>
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#001B3D] bg-[#FAE500] px-3 py-1.5 font-bold">02 / Method & make</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-7">
                <p className="font-headline text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] font-black leading-[0.8] text-[#FAE500]/10 -mb-2 sm:-mb-3 select-none" aria-hidden="true">02</p>
                <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">We Print</h3>
                <p className="font-body text-sm text-[#C6C6C7] leading-relaxed mb-4">DTG or heat-press, chosen to fit fabric, detail, and quantity â€” color-matched for a clean finish.</p>
                <ul className="space-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6C6C7]">
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>DTG or heat-press fit</li>
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>Color-matched finish</li>
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>Apparel, banners & more</li>
                </ul>
              </div>
            </article>

            <article className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[520px] overflow-hidden border border-white/10 bg-[#00142D] group">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwxQmKQkpuW3pwVy_9s78kqDj6FEPlEpWSK3YZLCAtjyM3valHV1e3hZd7Re_Khb87i1q-tVVIeCzY9ukLp2XeJ9AEKJXeuJdXPgJ-jXPDkSdWA-kDKPe8NCmDi1vIWXft3Rqp1t9sORIgQLYLQ95Ht8TSJbw6PIcs0xhCPdnVzaxh5NGxKVtcOIn8tmcO7Gp4INoAOccF_3mXeR3UglR1s1tJlbQUJBdENwXteF17vNzJKPoV1De2a0F4RsLpYtSkgBiJOUoyZ4I" alt="" className="absolute inset-0 w-full h-full object-cover opacity-55 grayscale-[15%] group-hover:opacity-70 transition-opacity duration-700 motion-reduce:transition-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000d1e] via-[#000d1e]/45 to-transparent"></div>
              <div className="absolute top-5 left-5 sm:top-6 sm:left-6">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] border border-[#FAE500]/40 bg-[#000d1e]/60 px-3 py-1.5">03 / Sample to bulk</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 md:p-7">
                <p className="font-headline text-[4.5rem] sm:text-[5.5rem] md:text-[6.5rem] font-black leading-[0.8] text-white/10 -mb-2 sm:-mb-3 select-none" aria-hidden="true">03</p>
                <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tighter text-white mb-2">Ready to Move</h3>
                <p className="font-body text-sm text-[#C6C6C7] leading-relaxed mb-4">From a single sample to a full run â€” checked, packed, and ready for pickup or delivery across Addis.</p>
                <ul className="space-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6C6C7]">
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>Sample to full run</li>
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>Checked and packed</li>
                  <li className="flex items-center gap-3"><span className="w-4 h-px bg-[#FAE500]"></span>Pickup or delivery in Addis</li>
                </ul>
              </div>
            </article>
          </div>

          <div className="mt-4 md:mt-5 border border-white/10 bg-[#000d1e]/60 px-5 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C6C6C7]">DTG & heat-press · Consistent color · Fast turnaround</p>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FAE500]">Printed in Addis</span>
          </div>
        </Reveal>

        {/* 6. FOR COMPANIES & TEAMS */}
        <section id="portfolio" className="py-20 md:py-32 bg-[#001B3D]">
          <div className="max-w-[100rem] mx-auto px-4 md:px-12">
            <Reveal className="text-center mb-10 md:mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">We Work With Companies</h2>
              <p className="mt-4 font-mono text-xs md:text-sm text-[#C6C6C7] uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
                Custom t-shirts, banners, uniforms, and branded merch for businesses, events, and teams.
              </p>
            </Reveal>
            <div className="space-y-4">
              {projects.map((item, i) => (
                <Reveal key={i} delay={i * 80}>
                  <button type="button" onClick={() => openProject(item)} className="w-full h-[28vh] min-h-[180px] md:h-[30vh] relative group overflow-hidden border border-white/5 hover:border-[#FAE500]/20 cursor-pointer text-left premium-card">
                    <img className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-50 md:opacity-40 md:group-hover:opacity-100 md:group-hover:scale-[1.04] transition-all duration-[1200ms] ease-[var(--ease-premium)]" src={item.img} alt={item.title}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001B3D]/80 via-[#001B3D]/20 to-transparent md:bg-[#001B3D]/30 md:mix-blend-multiply"></div>
                    <div className="absolute inset-0 flex flex-col md:flex-row md:items-center justify-end md:justify-between p-5 sm:p-8 md:px-12 z-10">
                      <h3 className="font-headline font-black text-2xl sm:text-3xl md:text-5xl uppercase tracking-tighter text-white md:translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:opacity-0 transition-all duration-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">{item.title}</h3>
                      <div className="mt-2 md:mt-0 flex items-center gap-2 md:-translate-y-4 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:opacity-0 transition-all duration-500">
                        <span className="font-mono text-[10px] text-[#FAE500] uppercase tracking-[0.3em] bg-[#000d1e]/80 px-3 py-1.5 md:px-4 md:py-2 border border-white/10 w-fit">{item.sub}</span>
                        <span className="font-mono text-[10px] text-white uppercase tracking-widest bg-white/10 px-3 py-1.5 md:px-4 md:py-2 border border-white/10">View Project</span>
                      </div>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7. ABOUT TEASER */}
        <Reveal as="section" id="about" className="py-16 md:py-24 px-4 md:px-12 bg-[#00142D] relative overflow-hidden border-t border-white/10">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-[-10%] w-[30rem] h-[30rem] bg-[#FAE500]/[0.04] rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-[100rem] mx-auto relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FAE500] mb-4 block">About Arada</span>
              <h2 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-5">
                Built in Addis.<br/><span className="text-transparent text-outline-yellow">Made with Intent.</span>
              </h2>
              <p className="font-body text-sm md:text-base text-[#C6C6C7] leading-relaxed max-w-2xl">
                Arada is a kinetic editorial and production house creating apparel, prints, and branded pieces for people, teams, and businesses — precise, durable, and rooted in Addis Ababa.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 lg:items-start">
              <a href="/about" className="inline-flex items-center justify-center bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] px-8 py-4 text-[11px] hover:bg-white transition-colors w-full sm:w-auto text-center">
                Learn About Us
              </a>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099]">Our story, craft, and what we stand for</p>
            </div>
          </div>
        </Reveal>

        {selectedProject && (
          <div className="fixed inset-0 z-[70] bg-[#001B3D]/80 flex items-center justify-center p-4 md:p-8 overflow-hidden overscroll-none modal-overlay" data-open={modalOpen} onClick={closeProject}>
            <div ref={modalContentRef} className="bg-[#000d1e]/95 border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto overscroll-contain rounded-2xl modal-panel shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)]" data-open={modalOpen} onClick={(e) => e.stopPropagation()}>
              <div className="relative overflow-hidden">
                <img src={selectedProject.img} alt={selectedProject.title} className="w-full h-52 sm:h-64 md:h-72 object-cover" />
                <button
                  type="button"
                  onClick={closeProject}
                  className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center bg-[#001B3D]/80 border border-white/20 text-white hover:text-[#FAE500] hover:border-[#FAE500]/50 transition-colors"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="p-6 md:p-8">
                <span className="font-mono text-[10px] text-[#FAE500] uppercase tracking-[0.3em]">{selectedProject.sub}</span>
                <h3 className="mt-2 font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">{selectedProject.title}</h3>
                <p className="mt-4 font-body text-sm md:text-base text-[#C6C6C7] leading-relaxed max-w-3xl">{selectedProject.description}</p>

                <div className="mt-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#FAE500] mb-3">What We Did</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.services.map((service) => (
                      <span key={service} className="font-mono text-[10px] uppercase tracking-widest text-white bg-white/5 border border-white/10 px-3 py-2">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#FAE500] mb-3">Project Images</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedProject.gallery.map((img, idx) => (
                      <div key={idx} className="aspect-square bg-[#00142D] border border-white/10 overflow-hidden">
                        <img src={img} alt={`${selectedProject.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href="/b2b" onClick={closeProject} className="inline-flex items-center justify-center bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] px-6 py-3 text-[11px] hover:bg-white transition-colors">
                    Start a Similar Project
                  </a>
                  <button type="button" onClick={closeProject} className="inline-flex items-center justify-center border border-white/20 text-white font-headline font-black uppercase tracking-[0.2em] px-6 py-3 text-[11px] hover:border-[#FAE500]/50 hover:text-[#FAE500] transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 8. FOOTER (from V0) */}
      <footer className="bg-[#000d1e] w-full border-t border-white/5 grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 px-6 py-12 md:px-12 md:py-20">
        <div className="space-y-4 md:space-y-6">
          <button type="button" onClick={() => navigate(ADMIN_PATH)} className="w-fit cursor-pointer" aria-label="Arada">
            <img src="/aradalogo.png" alt="Arada" className="h-10 md:h-12 w-auto object-contain" />
          </button>
          <p className="font-body text-[#C6C6C7] text-xs leading-loose">Kinetic editorial and technical production house based in Addis Ababa. Redefining urban silhouettes through precision and movement.</p>
        </div>
        <div>
          <h5 className="font-headline text-white font-bold text-xs uppercase tracking-widest mb-4 md:mb-8">Navigation</h5>
          <ul className="space-y-3 md:space-y-4 font-body text-xs uppercase tracking-[0.2em]">
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">Shop</a></li>
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">Services</a></li>
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">Portfolio</a></li>
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">Care Guide</a></li>
          </ul>
        </div>
        <div>
          <h5 className="font-headline text-white font-bold text-xs uppercase tracking-widest mb-4 md:mb-8">Connect</h5>
          <ul className="space-y-3 md:space-y-4 font-body text-xs uppercase tracking-[0.2em]">
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">Instagram</a></li>
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">WhatsApp</a></li>
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">LinkedIn</a></li>
            <li><a className="text-[#8E9099] hover:text-[#FAE500] transition-colors" href="#">Spotify</a></li>
          </ul>
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h5 className="font-headline text-white font-bold text-xs uppercase tracking-widest mb-4 md:mb-8">Location</h5>
            <p className="font-body text-[#8E9099] text-xs uppercase tracking-widest leading-loose">Bole Road, Next to Mega Building<br/>Addis Ababa, Ethiopia</p>
          </div>
          <div className="mt-8 pt-6 md:pt-8 border-t border-white/5">
            <p className="font-body text-[10px] text-[#8E9099] uppercase tracking-[0.2em]">Â© 2024 ARADA KINETIC EDITORIAL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
