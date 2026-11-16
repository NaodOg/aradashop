import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    q: 'Who are we?',
    a: 'Arada is an Addis Ababa–based apparel and print production house. We create premium urban clothing, custom merch, and branded pieces for individuals, teams, and businesses — blending bold design with careful, consistent production.',
  },
  {
    q: 'What do we do?',
    a: 'We design and produce high-quality garments and prints: t-shirts, hoodies, sweaters, totes, company uniforms, and banners. From one-off drops to bulk B2B runs, we handle artwork-to-wear production with DTG and heat-press printing, color checks, and clean finishing.',
  },
  {
    q: 'Why Arada?',
    a: 'We focus on the details that matter — sharp prints, consistent color, durable results, and reliable turnaround. Rooted in Addis, we work closely with our clients to bring ideas to life with clarity, craft, and a distinctive street-to-brand edge.',
  },
];

const process = [
  { step: '01', title: 'Design', text: 'We refine your artwork and placement so it’s print-ready and true to the idea.' },
  { step: '02', title: 'Prepare', text: 'Materials, colors, and sizes are lined up for a consistent, clean run.' },
  { step: '03', title: 'Print', text: 'DTG and heat-press techniques bring each piece to life with precision.' },
  { step: '04', title: 'Finish', text: 'Every item is checked, pressed, and finished for durability and detail.' },
  { step: '05', title: 'Pack & Deliver', text: 'Packed with care and delivered or ready for pickup across Addis.' },
];

export default function About() {
  const [open, setOpen] = useState(0);

  return (
    <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] font-body pt-28 pb-20 page-fade selection:bg-[#FAE500] selection:text-[#001B3D]">
      {/* Intro */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 mb-16 md:mb-24">
        <nav className="font-mono text-xs text-[#8e9099] tracking-wide mb-8">
          <Link to="/" className="text-[#FAE500] hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#C6C6C7]">About</span>
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FAE500] mb-4 block">About Arada</span>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] text-white mb-6">
              Made in Addis.<br />
              <span className="text-transparent text-outline-yellow">Built to Wear.</span>
            </h1>
            <p className="font-body text-sm md:text-base text-[#C6C6C7] leading-relaxed max-w-xl">
              Arada is your partner for high-quality apparel and custom prints. Based in Addis Ababa, we produce t-shirts, hoodies, uniforms, banners, and branded merchandise for individuals, teams, and businesses — combining creative design with reliable production, fast turnaround, and a commitment to detail.
            </p>
          </div>
          <div className="lg:col-span-6 flex items-center justify-center min-h-[220px] sm:min-h-[320px] lg:min-h-[420px] p-4 md:p-8">
            <img src="/aradalogo.png" alt="Arada logo" className="w-full max-w-[320px] md:max-w-[420px] h-auto object-contain" />
          </div>
        </div>
      </section>

      {/* Who / What / Why */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 mb-16 md:mb-24">
        <div className="mb-8 md:mb-10">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FAE500] mb-3 block">About Us</span>
          <h2 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Who We Are</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 border border-white/10 bg-[#000d1e]/50 p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8e9099] mb-5">Questions</p>
            <div className="space-y-2">
              {faqs.map((item, i) => (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => setOpen(i)}
                  className={`w-full text-left px-4 py-3 border transition-all duration-300 font-headline text-sm md:text-base font-bold uppercase tracking-tight ${
                    open === i ? 'bg-[#FAE500] text-[#001B3D] border-[#FAE500]' : 'bg-transparent text-white border-white/10 hover:border-white/30'
                  }`}
                >
                  {item.q}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 border border-white/10 bg-gradient-to-br from-[#00142D] to-[#000d1e] p-7 md:p-10 min-h-[220px] flex flex-col justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-3">{faqs[open].q}</p>
            <p className="font-body text-base md:text-lg text-[#C6C6C7] leading-relaxed">{faqs[open].a}</p>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10 mb-16 md:mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          <div className="border border-white/10 bg-[#000d1e]/50 p-7 md:p-8 premium-card">
            <div className="w-10 h-10 border border-[#FAE500]/40 flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[#FAE500]">flag</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-2">Mission</p>
            <h3 className="font-headline text-xl font-black uppercase tracking-tighter text-white mb-3">Create with Purpose</h3>
            <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">
              To design and produce high-quality apparel and prints that help people and brands express identity — with craft, consistency, and care in every piece.
            </p>
          </div>
          <div className="border border-white/10 bg-[#000d1e]/50 p-7 md:p-8 premium-card">
            <div className="w-10 h-10 border border-[#FAE500]/40 flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[#FAE500]">visibility</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-2">Vision</p>
            <h3 className="font-headline text-xl font-black uppercase tracking-tighter text-white mb-3">A Bold Local Standard</h3>
            <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">
              To be a leading creative production brand from Addis Ababa, known for distinctive design, reliable quality, and work that moves confidently across streets and industries.
            </p>
          </div>
          <div className="border border-white/10 bg-[#000d1e]/50 p-7 md:p-8 premium-card">
            <div className="w-10 h-10 border border-[#FAE500]/40 flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-[#FAE500]">diamond</span>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-2">Values</p>
            <h3 className="font-headline text-xl font-black uppercase tracking-tighter text-white mb-3">Craft & Character</h3>
            <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">
              We value creativity, precision, and honesty in our work — staying rooted in local culture while pushing for clean execution and lasting quality.
            </p>
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="bg-[#00142D]/60 border-y border-white/10 py-16 md:py-24 mb-16 md:mb-24">
        <div className="max-w-[1200px] mx-auto px-6 md:px-10">
          <div className="text-center mb-10 md:mb-14">
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FAE500] mb-3 block">How We Work</span>
            <h2 className="font-headline text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">Our Production Process</h2>
            <p className="mt-4 font-body text-sm md:text-base text-[#C6C6C7] max-w-2xl mx-auto leading-relaxed">
              From concept to delivery, each step is handled with care to bring you apparel and prints that look right and last.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            {process.map((p) => (
              <div key={p.step} className="border border-white/10 bg-[#000d1e]/50 p-5 md:p-6 relative overflow-hidden premium-card">
                <span className="absolute -top-2 -right-1 font-headline text-5xl font-black text-white/[0.04] select-none">{p.step}</span>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-3">{p.step}</p>
                <h3 className="font-headline text-lg font-black uppercase tracking-tighter text-white mb-2">{p.title}</h3>
                <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights + CTA */}
      <section className="max-w-[1200px] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { title: 'Quality First', text: 'Clean prints, consistent color, and careful finishing on every run.' },
            { title: 'Fast Turnaround', text: 'Reliable timelines for one-offs, drops, and bulk orders.' },
            { title: 'Made in Addis', text: 'Local production serving people, teams, and brands across the city.' },
          ].map((h) => (
            <div key={h.title} className="border border-white/10 p-5 md:p-6">
              <h3 className="font-headline text-lg font-black uppercase tracking-tighter text-white mb-2">{h.title}</h3>
              <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">{h.text}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-white/10 pt-10">
          <div>
            <p className="font-headline text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Let’s Create Together</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8e9099] mt-2">Shop the collection or start a B2B request</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/products" className="bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] px-6 py-3 text-[11px] hover:bg-white transition-colors">Shop Products</Link>
            <Link to="/b2b" className="border border-[#FAE500] text-[#FAE500] font-headline font-black uppercase tracking-[0.2em] px-6 py-3 text-[11px] hover:bg-[#FAE500] hover:text-[#001B3D] transition-colors">B2B Services</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
