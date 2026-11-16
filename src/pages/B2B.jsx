import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const CONTACT = {
  phone: '+251 900 000 000',
  phoneHref: 'tel:+251900000000',
  telegram: '@arada_prints',
  telegramHref: 'https://t.me/arada_prints',
};

const PALETTE = [
  { id: 'black', label: 'Black', hex: '#111111' },
  { id: 'white', label: 'White', hex: '#F5F5F5', border: true },
  { id: 'blue', label: 'Blue', hex: '#2563EB' },
  { id: 'red', label: 'Red', hex: '#DC2626' },
  { id: 'beige', label: 'Beige', hex: '#D6C7A1' },
];

const PRODUCTS = [
  {
    id: 'tee',
    name: 'Plain T-Shirts',
    desc: 'Quality cotton blanks for teams, merch, and resale â€” consistent fit across bulk runs.',
    min: 20,
    unit: 'pcs',
    kind: 'Bulk garment',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeBased: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRgSRpv3nZGbwOkc8-N0_AA4fsAVIZsb4beRmXSUHQZxm2uNDlXIRGWUkWcgaf8tFXYD3rwSL1Z1YKaNWL0QCI7SY3cj_DkHS3Ol9oX7ndF-vxwPj9Pij-F43lqjAE_jhRuoS-lJ4CtDCo9mPgN5UULz6he5Gjj9kjhrjoZETwUv4mKN3wI8YvBVhKC5pCZ-EjH1R1AxWVA9t8qswsHlhsSAxMY_kB7CLBWaJ4GTUE0nIx6t63_y7iK8mS9poK5zXHf58IHVGEofY',
  },
  {
    id: 'hoodie',
    name: 'Plain Hoodies',
    desc: 'Heavy, comfortable hoodies supplied in volume for crews, drops, and company wear.',
    min: 15,
    unit: 'pcs',
    kind: 'Bulk garment',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeBased: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXiruRApy-kp3NYkTsxIarJ2QMvty_4m6jvUyb7NzoyJ7l7us_r2rsR_6e_VtSJ7PFyUBoZFhWGOHlrRdsyEsi066N2CtFW9tYNYH2XAlmvrXpSVQfBKdzLAcm_q765lxRbJd0tJkkDtf4Fier7EN6NZV4jBLYJE0RWh-FJo9NFqb5-KgrbedQt11IUW_pC11DogvE04qzKutKQQVDO-lo-41xrPm_4zEM53apwUJLXq6t1lJWOlMb6XSNmQ1GiLjnFoS9jOpSD6s',
  },
  {
    id: 'tote',
    name: 'Tote Bags',
    desc: 'Durable blank totes for brands, shops, and campaigns â€” practical and easy to brand.',
    min: 30,
    unit: 'pcs',
    kind: 'Bulk garment',
    sizes: ['One Size'],
    sizeBased: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqo2lg4dIkWdGWCAZoa1ZVjXJ5QEKsjvR6fstdRPSLBccDbziTg94TWmmJ74HwKD6JOd-Zqv9VbSp1MgyRReB9Vi9Fp1NxlrVrfAcqVRPkkQEbIjc8w0RWdSLjpQXuYLbDlgN2g2KuTF3TP1Q2DHpdd2pYidkuI50dvTG67euIZiDPM8sAn3AK166CPbv-CC5lc-DoocRhc2HS-oHmE2v-U2gLrXkDM0BNQxqzEOdByxjn1bpiex4xeupqQN31gQoPFiGnGZYK6bM',
  },
  {
    id: 'banner',
    name: 'Company Banners',
    desc: 'Event backdrops, roll-ups, and shop signage printed to size â€” made to be seen.',
    min: 1,
    unit: 'sets',
    kind: 'B2B print',
    sizes: ['1m Ã— 2m', '2m Ã— 3m', '3m Ã— 4m', 'Custom'],
    sizeBased: false,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIxgT1FMtN6gkr41jQ-StFkYrp11MinhBh4xpqw1MJ5cNQvieX3aTE2UgSfkcpuBCBCjLLinJ2A8SyY4HGgDGQge2lJnI2hdEVkA9FY-UIMEboMC771PlehQS50-71TbzK-SFFj7SdDEOKO0Ix3eMse4XyckGhivVvt94Pb3mjIGjx3kPdjiHx8ta3guE1zJXB0JgOvexuPqCwk82xpVow_l3W7hVgd3sZtgglSpyFskSjgkGOunH4ypwGp3P5wj3s-Kd7_5OjHe4',
  },
  {
    id: 'uniform',
    name: 'Printed Uniforms',
    desc: 'Consistent staff and crew uniforms with your logo and colors â€” a unified look, every run.',
    min: 10,
    unit: 'pcs',
    kind: 'B2B print',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    sizeBased: true,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyOTQ8p88aNwT9ogipBnoE5feIEprnasXzTN_wRcG9LZnd0_cQUUe9GVvWZNt4XCRwzlV7txt5FfeQCOpqGHLjb-Ub-YsNhsUhAf8T1Z-8JJ-cCXKA5GUP4EBUV9L_9z3N1UdmNV6C5xVQICEqZYq44h-mHRtMxfc-DCogiWx-MCm2AhWeu02TOAM66NY80ZaQ69HIg4dvwLOnOYM5HfZz5NyCVYo4eZ6WU91K444G7D6v0zjmuv7wtm2-JzVFrC_2eRF4JCNyks8',
  },
];

const initialItems = () =>
  Object.fromEntries(
    PRODUCTS.map((p) => [
      p.id,
      {
        qty: p.min,
        selected: false,
        notes: '',
        color: 'black',
        size: p.sizes[0],
        sizeQtys: Object.fromEntries(p.sizes.map((s) => [s, 0])),
      },
    ])
  );

function totalQty(p, it) {
  if (p.sizeBased) return p.sizes.reduce((sum, s) => sum + (Number(it.sizeQtys?.[s]) || 0), 0);
  return Number(it.qty) || 0;
}

function breakdown(p, it) {
  return p.sizes.map((s) => ({ s, q: Number(it.sizeQtys?.[s]) || 0 })).filter((x) => x.q > 0);
}

export default function B2B() {
  const [items, setItems] = useState(initialItems);
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartActive, setCartActive] = useState(false);
  const cartTimer = React.useRef(null);
  const openCart = () => { if (cartTimer.current) clearTimeout(cartTimer.current); setCartOpen(true); requestAnimationFrame(() => requestAnimationFrame(() => setCartActive(true))); };
  const closeCart = () => { setCartActive(false); cartTimer.current = setTimeout(() => setCartOpen(false), 320); };
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const createB2BRequest = useMutation(api.orders.createB2BRequest);

  const selected = useMemo(
    () => PRODUCTS.filter((p) => items[p.id].selected && totalQty(p, items[p.id]) > 0),
    [items]
  );

  const update = (id, patch) => {
    setSubmitted(false);
    setItems((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  };

  const setSizeQty = (id, size, val) => {
    setSubmitted(false);
    setItems((prev) => {
      const cur = prev[id].sizeQtys || {};
      const n = Math.max(0, parseInt(val, 10) || 0);
      return { ...prev, [id]: { ...prev[id], sizeQtys: { ...cur, [size]: n } } };
    });
  };

  const colorLabel = (id) => PALETTE.find((c) => c.id === items[id].color)?.label || items[id].color;

  const summary = selected
    .map((p) => {
      const it = items[p.id];
      const n = it.notes?.trim();
      const detail = p.sizeBased
        ? breakdown(p, it).map((x) => `${x.s}:${x.q}`).join(', ')
        : `${it.size} x${it.qty}`;
      return `${p.name} [${colorLabel(p.id)} | ${detail}]${n ? ` (${n})` : ''}`;
    })
    .join(' â€¢ ');

  const message = encodeURIComponent(
    `B2B request${company ? ` â€” ${company}` : ''}${name ? ` (${name})` : ''}: ${summary || 'Details to discuss'}`
  );

  const hasMinIssue = selected.some((p) => p.sizeBased && totalQty(p, items[p.id]) < p.min);

  return (
    <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] pb-20 pt-28 font-body selection:bg-[#FAE500] selection:text-[#001B3D] page-fade">
      <div className="max-w-[1240px] mx-auto px-4 md:px-10">
        <nav className="font-mono text-xs text-[#8e9099] tracking-wide mb-8">
          <Link to="/" className="text-[#FAE500] hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-[#C6C6C7]">B2B Services</span>
        </nav>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 mb-12 md:mb-16">
          <div className="lg:col-span-7 border border-white/10 bg-[#000d1e]/40 p-6 sm:p-8 md:p-10 relative overflow-hidden flex flex-col justify-end min-h-[280px]">
            <div className="absolute -top-20 -right-16 w-64 h-64 bg-[#FAE500]/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
            <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FAE500] mb-4 block">For Brands, Teams &amp; Businesses</span>
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.85] text-white mb-4">
              Bulk Supply<br /><span className="text-transparent text-outline-yellow">&amp; Print.</span>
            </h1>
            <p className="text-sm md:text-base text-[#C6C6C7] leading-relaxed max-w-xl">
              Plain garments in volume, company banners, and printed uniforms â€” sourced and produced in Addis. Pick your items, set quantities per size and color, then reach us to confirm pricing and details.
            </p>
          </div>
          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-0 overflow-hidden border border-white/10 bg-[#00142D]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwxQmKQkpuW3pwVy_9s78kqDj6FEPlEpWSK3YZLCAtjyM3valHV1e3hZd7Re_Khb87i1q-tVVIeCzY9ukLp2XeJ9AEKJXeuJdXPgJ-jXPDkSdWA-kDKPe8NCmDi1vIWXft3Rqp1t9sORIgQLYLQ95Ht8TSJbw6PIcs0xhCPdnVzaxh5NGxKVtcOIn8tmcO7Gp4INoAOccF_3mXeR3UglR1s1tJlbQUJBdENwXteF17vNzJKPoV1De2a0F4RsLpYtSkgBiJOUoyZ4I"
              alt="Bulk apparel and branded pieces"
              className="absolute inset-0 w-full h-full object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000d1e] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-1">B2B orders</p>
                <p className="font-headline text-2xl font-black uppercase tracking-tighter text-white">Samples to runs</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <h2 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">Build Your Request</h2>
            <button type="button" onClick={openCart} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6C6C7] hover:text-[#FAE500] border border-white/15 hover:border-[#FAE500]/50 px-4 py-2.5 transition-colors">
              <span className="material-symbols-outlined text-base" aria-hidden="true">shopping_bag</span>
              Request {selected.length > 0 ? `(${selected.length})` : ''}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {PRODUCTS.map((p) => {
              const it = items[p.id];
              const active = it.selected;
              const tQty = totalQty(p, it);
              const bd = breakdown(p, it);
              const belowMin = active && p.sizeBased && tQty < p.min;
              return (
                <article key={p.id} className={`border transition-colors duration-200 ${active ? 'border-[#FAE500]/50 bg-[#000d1e]/70' : 'border-white/10 bg-[#000d1e]/30'}`}>
                  <div className="grid grid-cols-1">
                    <div className="relative h-56 sm:h-64 bg-[#00142D]">
                      <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover object-center" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000d1e]/30 to-transparent"></div>
                      <span className={`absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.2em] px-2 py-1 border ${active ? 'text-[#001B3D] bg-[#FAE500] border-[#FAE500] font-bold' : 'text-white/90 bg-[#001B3D]/70 border-white/15'}`}>{p.kind}</span>
                    </div>

                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="min-w-0">
                          <h3 className="font-headline text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-none mb-1.5">{p.name}</h3>
                          <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">{p.desc}</p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => { if (!active && tQty <= 0) return; update(p.id, { selected: !active }); }}
                            disabled={!active && tQty <= 0}
                            title={!active && tQty <= 0 ? 'Set a quantity to add' : undefined}
                            className={`h-11 px-6 font-mono text-[11px] uppercase tracking-[0.2em] border transition-colors ${active ? 'bg-[#FAE500] text-[#001B3D] border-[#FAE500] font-bold' : tQty <= 0 ? 'border-white/10 text-white/30 cursor-not-allowed' : 'border-white/20 text-white hover:border-[#FAE500]/60 hover:text-[#FAE500]'}`}
                          >
                            {active ? 'Added' : 'Add'}
                          </button>
                          {!active && tQty <= 0 && (
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#FAE500]/80">Set quantity first</p>
                          )}
                        </div>
                      </div>

                      {p.sizeBased ? (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099]">Size run <span className="normal-case tracking-normal text-[#6f7682]">(qty per size)</span></p>
                            <p className={`font-mono text-[10px] uppercase tracking-[0.15em] ${belowMin ? 'text-[#FAE500]' : 'text-[#C6C6C7]'}`}>
                              Total {tQty} / min {p.min}
                            </p>
                          </div>
                          <div className={`grid gap-2 ${p.sizes.length === 1 ? 'grid-cols-1 max-w-[140px]' : 'grid-cols-3 sm:grid-cols-5'}`}>
                            {p.sizes.map((s) => {
                              const v = Number(it.sizeQtys?.[s]) || 0;
                              const filled = v > 0;
                              return (
                                <div key={s} className={`border px-2 py-2.5 text-center transition-colors ${filled ? 'border-[#FAE500]/50 bg-[#FAE500]/[0.06]' : 'border-white/10 bg-[#001b3d]/50'}`}>
                                  <div className={`font-mono text-[10px] uppercase tracking-[0.2em] mb-1.5 ${filled ? 'text-[#FAE500]' : 'text-[#8e9099]'}`}>{s}</div>
                                  <input
                                    type="number"
                                    min={0}
                                    inputMode="numeric"
                                    value={v || ''}
                                    placeholder="0"
                                    onChange={(e) => setSizeQty(p.id, s, e.target.value)}
                                    aria-label={`${p.name} ${s} quantity`}
                                    className="w-full bg-transparent text-center font-headline text-lg font-bold text-white outline-none placeholder:text-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                          {belowMin && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#FAE500]/80">Add {p.min - tQty} more to meet minimum</p>}
                        </div>
                      ) : (
                        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] mb-2">Size / option</p>
                            <div className="flex flex-wrap gap-2">
                              {p.sizes.map((s) => (
                                <button key={s} type="button" onClick={() => update(p.id, { size: s })} className={`min-h-9 px-3 border font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${it.size === s ? 'bg-[#FAE500] text-[#001B3D] border-[#FAE500] font-bold' : 'border-white/15 text-[#C6C6C7] hover:border-white/40 hover:text-white'}`}>{s}</button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] mb-2">Quantity <span className="text-[#FAE500]/80">(min {p.min})</span></p>
                            <div className="flex items-center border border-white/15 w-fit bg-[#001b3d]/60">
                              <button type="button" onClick={() => update(p.id, { qty: Math.max(p.min, (Number(it.qty) || p.min) - 1) })} className="h-10 w-10 text-white hover:text-[#FAE500] transition-colors" aria-label={`Decrease ${p.name}`}>âˆ’</button>
                              <input type="number" min={p.min} value={it.qty} onChange={(e) => update(p.id, { qty: Math.max(p.min, parseInt(e.target.value, 10) || p.min) })} className="h-10 w-14 bg-transparent border-x border-white/15 text-center font-mono text-sm text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" aria-label={`${p.name} quantity`} />
                              <button type="button" onClick={() => update(p.id, { qty: (Number(it.qty) || p.min) + 1 })} className="h-10 w-10 text-white hover:text-[#FAE500] transition-colors" aria-label={`Increase ${p.name}`}>+</button>
                              <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-[#8e9099] border-l border-white/15 h-10 flex items-center">{p.unit}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-4 border-t border-white/10">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] mb-2">Color</p>
                          <div className="flex flex-wrap items-center gap-2.5">
                            {PALETTE.map((c) => {
                              const chosen = it.color === c.id;
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => update(p.id, { color: c.id })}
                                  title={c.label}
                                  aria-label={`${p.name} color ${c.label}`}
                                  className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${chosen ? 'ring-2 ring-[#FAE500] ring-offset-2 ring-offset-[#000d1e] scale-110' : 'ring-1 ring-white/20 hover:ring-white/50'}`}
                                  style={{ background: c.hex, border: c.border ? '1px solid rgba(255,255,255,0.35)' : undefined }}
                                >
                                  {chosen && <span className={`material-symbols-outlined text-[14px] ${c.border || c.id === 'beige' ? 'text-[#001B3D]' : 'text-white'}`} aria-hidden="true">check</span>}
                                </button>
                              );
                            })}
                            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#C6C6C7]">{colorLabel(p.id)}</span>
                          </div>
                        </div>
                        {active && (
                          <div className="text-right">
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099]">In request</p>
                            <p className="font-headline text-lg font-black text-[#FAE500] leading-none mt-1">
                              {p.sizeBased ? (bd.length ? bd.map((x) => `${x.q} ${x.s}`).join(' Â· ') : 'set sizes') : `${it.qty} ${p.unit}`}
                            </p>
                          </div>
                        )}
                      </div>

                      {active && (
                        <div className="mt-4">
                          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] mb-2" htmlFor={`notes-${p.id}`}>Notes (optional)</label>
                          <input
                            id={`notes-${p.id}`}
                            type="text"
                            value={it.notes}
                            onChange={(e) => update(p.id, { notes: e.target.value })}
                            placeholder="Logo placement, fabric, extra size notes..."
                            className="w-full bg-[#001b3d] border border-white/10 focus:border-[#FAE500] px-3 py-2.5 font-body text-sm text-white placeholder-white/25 outline-none transition-colors"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </section>

        {selected.length > 0 && !cartOpen && (
          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-[#000d1e]/95 backdrop-blur-md fade-up-in">
            <div className="max-w-[1240px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FAE500]">Request cart</p>
                <p className="font-headline text-sm sm:text-base font-bold uppercase tracking-tight text-white truncate">{selected.length} item{selected.length > 1 ? 's' : ''} added</p>
              </div>
              <button type="button" onClick={openCart} className="shrink-0 bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] px-5 sm:px-6 py-3 text-[11px] hover:bg-white transition-colors">
                View Request
              </button>
            </div>
          </div>
        )}

        {cartOpen && (
          <div className="fixed inset-0 z-50">
            <button type="button" aria-label="Close request" onClick={closeCart} className={`absolute inset-0 bg-[#001B3D]/70 transition-all duration-500 ease-[var(--ease-premium)] ${cartActive ? 'opacity-100 backdrop-blur-md' : 'opacity-0 backdrop-blur-none'}`} />
            <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#000d1e]/98 border-l border-white/10 shadow-[ -30px_0_80px_-20px_rgba(0,0,0,0.6)] flex flex-col transition-transform duration-500 ease-[var(--ease-premium)] ${cartActive ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-white/10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500]">B2B Request</p>
                  <h3 className="font-headline text-xl font-black uppercase tracking-tighter text-white">Your Request</h3>
                </div>
                <button type="button" onClick={closeCart} className="h-10 w-10 flex items-center justify-center border border-white/15 text-white hover:text-[#FAE500] hover:border-[#FAE500]/50 transition-colors" aria-label="Close">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8e9099]">Summary</p>
                    {selected.length > 0 && <span className="font-mono text-[10px] text-[#8e9099] uppercase tracking-widest">{selected.length} item{selected.length > 1 ? 's' : ''}</span>}
                  </div>
                  {selected.length === 0 ? (
                    <div className="py-8 border border-dashed border-white/10 px-4 text-center">
                      <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">shopping_bag</span>
                      <p className="font-body text-sm text-[#8e9099]">No items added yet. Set sizes, colors & quantities then press Add.</p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {selected.map((p) => {
                        const it = items[p.id];
                        const bd = breakdown(p, it);
                        return (
                          <li key={p.id} className="flex gap-3 pb-3 border-b border-white/10 last:border-b-0 last:pb-0">
                            <img src={p.image} alt="" className="w-14 h-14 object-cover border border-white/10 shrink-0 bg-[#00142D]" />
                            <div className="min-w-0 flex-1">
                              <p className="font-headline text-sm font-bold uppercase tracking-tight text-white leading-tight">{p.name}</p>
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#FAE500] mt-1">{colorLabel(p.id)}</p>
                              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#C6C6C7] mt-0.5">
                                {p.sizeBased ? (bd.length ? bd.map((x) => `${x.s} ${x.q}`).join(' Â· ') : 'no sizes set') : `${it.size} Â· ${it.qty} ${p.unit}`}
                              </p>
                              {p.sizeBased && bd.length > 0 && <p className="font-mono text-[10px] text-[#8e9099] mt-0.5">Total {totalQty(p, it)} {p.unit}</p>}
                              {it.notes?.trim() && <p className="font-body text-xs text-[#8e9099] mt-1 line-clamp-2">{it.notes}</p>}
                            </div>
                            <button type="button" onClick={() => update(p.id, { selected: false })} className="shrink-0 h-8 w-8 flex items-center justify-center border border-white/10 text-[#8e9099] hover:text-red-400 hover:border-red-400/40 transition-colors" aria-label={`Remove ${p.name}`}>
                              <span className="material-symbols-outlined text-[16px]">close</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <input value={company} onChange={(e) => { setCompany(e.target.value); setSubmitted(false); setSaveError(''); }} placeholder="Company / team (optional)" className="w-full bg-[#001b3d] border border-white/10 focus:border-[#FAE500] px-3 py-2.5 font-body text-sm text-white placeholder-white/30 outline-none transition-colors" />
                    <input value={name} onChange={(e) => { setName(e.target.value); setSubmitted(false); setSaveError(''); }} placeholder="Your name (optional)" className="w-full bg-[#001b3d] border border-white/10 focus:border-[#FAE500] px-3 py-2.5 font-body text-sm text-white placeholder-white/30 outline-none transition-colors" />
                    <input value={phone} onChange={(e) => { setPhone(e.target.value); setSubmitted(false); setSaveError(''); }} placeholder="Phone number (optional)" className="w-full bg-[#001b3d] border border-white/10 focus:border-[#FAE500] px-3 py-2.5 font-body text-sm text-white placeholder-white/30 outline-none transition-colors" />
                    {saveError && <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-400">{saveError}</p>}
                    <button
                      type="button"
                      onClick={handlePrepare}
                      disabled={selected.length === 0 || hasMinIssue || saving}
                      className="w-full bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] px-6 py-3.5 text-[11px] hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#FAE500]"
                    >
                      {saving ? 'Sendingâ€¦' : 'Prepare Request'}
                    </button>
                    {hasMinIssue && <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#FAE500]/80">Meet minimum totals for selected items.</p>}
                    {submitted && selected.length > 0 && !hasMinIssue && (
                      <div className="border border-[#FAE500]/30 bg-[#FAE500]/5 p-4">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FAE500] mb-1.5">Request sent</p>
                        <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">Your B2B request was saved. Contact us by phone or Telegram to confirm pricing, timeline, and details.</p>
                      </div>
                    )}
                  </div>

                <div className="border border-[#FAE500]/20 bg-[#00142D] p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-2">Custom preferences?</p>
                  <p className="font-body text-sm text-[#C6C6C7] leading-relaxed mb-4">Need different sizes, materials, logo placement, or anything not listed? Contact the owners â€” weâ€™ll tailor it with you.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <a href={CONTACT.phoneHref} className="flex items-center justify-center gap-2 border border-white/15 bg-white/[0.03] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:border-[#FAE500]/50 hover:text-[#FAE500] transition-colors">
                      <span className="material-symbols-outlined text-base" aria-hidden="true">call</span>Call
                    </a>
                    <a href={selected.length ? `${CONTACT.telegramHref}?text=${message}` : CONTACT.telegramHref} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-[#FAE500] text-[#001B3D] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors">
                      <span className="material-symbols-outlined text-base" aria-hidden="true">send</span>Telegram
                    </a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8e9099]">
                    <p>Phone <span className="text-[#C6C6C7] ml-2">{CONTACT.phone}</span></p>
                    <p>Telegram <span className="text-[#C6C6C7] ml-2">{CONTACT.telegram}</span></p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
