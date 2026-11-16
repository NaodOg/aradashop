import React, { useMemo, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const tabs = [
  { id: 'analytics', label: 'Analytics', icon: 'bar_chart' },
  { id: 'upload', label: 'Add / Edit', icon: 'add_box' },
  { id: 'manage', label: 'Products', icon: 'inventory_2' },
  { id: 'orders', label: 'Orders', icon: 'receipt_long' },
  { id: 'b2b', label: 'B2B Requests', icon: 'business_center' },
];

export default function OwnerDashboard() {
  const [adminKey, setAdminKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [authError, setAuthError] = useState('');

  const authed = Boolean(adminKey);
  const products = useQuery(api.products.list, { category: 'all' }) || [];
  const orders = useQuery(api.orders.listAll, authed ? { adminKey } : 'skip');
  const b2bRequests = useQuery(api.orders.listB2BRequests, authed ? { adminKey } : 'skip');
  const createProduct = useMutation(api.products.create);
  const updateProduct = useMutation(api.products.update);
  const removeProduct = useMutation(api.products.remove);
  const generateUploadUrl = useMutation(api.products.generateUploadUrl);

  const [activeTab, setActiveTab] = useState('analytics');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({ name: '', slug: '', category: 'tshirt', price: '' });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const ordersList = Array.isArray(orders) ? orders : [];
  const b2bList = Array.isArray(b2bRequests) ? b2bRequests : [];
  const ordersLoading = authed && orders === undefined;
  const b2bLoading = authed && b2bRequests === undefined;

  const stats = useMemo(() => {
    const revenue = ordersList.reduce((sum, o) => sum + (o.items || []).reduce((s, i) => s + Number(i.unit_price) * i.quantity, 0), 0);
    const b2bUnits = b2bList.reduce((sum, r) => sum + (r.items || []).reduce((s, i) => s + (Number(i.quantity) || 0), 0), 0);
    const pending = ordersList.filter((o) => o.status === 'pending').length;
    return { products: products.length, orders: ordersList.length, b2b: b2bList.length, revenue, b2bUnits, pending };
  }, [products.length, ordersList, b2bList]);

  const analytics = useMemo(() => {
    let revenue = 0, units = 0;
    const byProduct = new Map();
    const byStatus = {};
    for (const o of ordersList) {
      byStatus[o.status] = (byStatus[o.status] || 0) + 1;
      for (const it of (o.items || [])) {
        const qty = Number(it.quantity) || 0;
        const line = Number(it.unit_price) * qty;
        revenue += line;
        units += qty;
        const key = it.product || it.product_name || 'Unknown';
        const cur = byProduct.get(key) || { name: it.product_name || 'Unknown', units: 0, revenue: 0, orders: 0 };
        cur.units += qty;
        cur.revenue += line;
        cur.orders += 1;
        byProduct.set(key, cur);
      }
    }
    const topProducts = [...byProduct.values()].sort((a, b) => b.revenue - a.revenue || b.units - a.units);
    const aov = ordersList.length ? revenue / ordersList.length : 0;
    return { revenue, units, orders: ordersList.length, aov, byStatus, topProducts };
  }, [ordersList]);

  const handleUnlock = (e) => {
    e.preventDefault();
    const key = inputKey.trim();
    if (!key) return;
    setAdminKey(key);
    setInputKey('');
    setAuthError('');
  };

  const handleLock = () => {
    setAdminKey('');
    setAuthError('');
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] font-body relative overflow-hidden flex items-center justify-center px-4 pt-20 pb-10">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-16 w-[28rem] h-[28rem] bg-[#FAE500]/[0.07] rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#002b5c] rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(250,229,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(250,229,0,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>
        <div className="relative w-full max-w-md">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-10 w-10 border border-[#FAE500]/40 bg-[#FAE500]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#FAE500]">shield_lock</span>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500]">Arada Admin</p>
              <p className="font-body text-xs text-[#8e9099]">Restricted access</p>
            </div>
          </div>
          <div className="bg-[#000d1e]/90 backdrop-blur-xl border border-white/10 p-7 sm:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
            <h1 className="font-headline text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-none mb-2">Owner<br /><span className="text-transparent text-outline-yellow">Dashboard.</span></h1>
            <p className="font-mono text-[10px] sm:text-xs text-[#8e9099] uppercase tracking-[0.2em] mb-8">Enter shared password to continue</p>
            {authError && <div className="bg-red-500/10 border border-red-500/40 text-red-300 p-3 mb-5 font-mono text-xs uppercase tracking-wider">{authError}</div>}
            <form onSubmit={handleUnlock} className="space-y-5">
              <div className="space-y-2">
                <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FAE500] font-bold">Password</label>
                <input type="password" value={inputKey} onChange={(e) => setInputKey(e.target.value)} required className="w-full bg-[#00142D] border border-white/10 focus:border-[#FAE500] p-3.5 text-sm font-body text-white placeholder-white/25 outline-none transition-colors" placeholder="Enter admin password" />
              </div>
              <button type="submit" className="w-full bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] py-4 text-[11px] hover:bg-white transition-colors shadow-[0_8px_30px_rgba(250,229,0,0.18)]">Unlock Dashboard</button>
            </form>
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#5f6b7a] text-center">Access via secret URL only</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name: n, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [n]: value,
      ...(n === 'name' && { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') }),
    }));
  };

  const uploadImage = async (file) => {
    const uploadUrl = await generateUploadUrl({ adminKey });
    const res = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.storageId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setSaving(true);
    try {
      let imageStorageId;
      if (imageFile) imageStorageId = await uploadImage(imageFile);
      const payload = {
        adminKey,
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        price: Number(formData.price),
        isAvailable: true,
        ...(imageStorageId ? { imageStorageId } : {}),
      };
      if (editingId) {
        await updateProduct({ ...payload, id: editingId });
        setMessage({ type: 'success', text: 'Product updated successfully.' });
        setActiveTab('manage');
      } else {
        await createProduct(payload);
        setMessage({ type: 'success', text: 'Product uploaded successfully.' });
      }
      setFormData({ name: '', slug: '', category: 'tshirt', price: '' });
      setImageFile(null);
      setEditingId(null);
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      if (String(err?.message || '').includes('Unauthorized')) { handleLock(); setAuthError('Incorrect or expired password.'); return; }
      setMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, slug: product.slug, category: product.category, price: product.price });
    setEditingId(product._id);
    setImageFile(null);
    setActiveTab('upload');
    setMessage({ type: '', text: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await removeProduct({ adminKey, id });
    } catch (err) {
      if (String(err?.message || '').includes('Unauthorized')) { handleLock(); setAuthError('Incorrect or expired password.'); return; }
      alert(err.message || 'Failed to delete product');
    }
  };

  const Stat = ({ icon, label, value, sub }) => (
    <div className="bg-[#000d1e]/70 border border-white/10 p-4 sm:p-5 relative overflow-hidden">
      <div className="absolute -right-3 -top-3 text-white/[0.04]"><span className="material-symbols-outlined text-7xl">{icon}</span></div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#FAE500] text-[18px]">{icon}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8e9099]">{label}</span>
        </div>
        <p className="font-headline text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">{value}</p>
        {sub ? <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-[#C6C6C7]">{sub}</p> : null}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] font-body selection:bg-[#FAE500] selection:text-[#001B3D]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-10 pt-28 pb-16">
        <header className="relative mb-8 md:mb-10">
          <div className="absolute -top-10 right-0 w-72 h-72 bg-[#FAE500]/[0.05] rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 border-b border-white/10 pb-6">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#FAE500] mb-2 block">Arada / Admin</span>
              <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white">Owner<br /><span className="text-transparent text-outline-yellow">Dashboard.</span></h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 border border-white/10 bg-[#000d1e]/60 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-[#FAE500] animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6C6C7]">Session active</span>
              </div>
              <button onClick={handleLock} className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6C6C7] hover:text-white border border-white/15 hover:border-white/40 px-4 py-2.5 transition-colors">
                <span className="material-symbols-outlined text-base">lock</span>Lock
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <Stat icon="inventory_2" label="Products" value={stats.products} sub="In catalog" />
          <Stat icon="receipt_long" label="Orders" value={ordersLoading ? '…' : stats.orders} sub={ordersLoading ? 'Loading' : `${stats.pending} pending · ${stats.revenue.toFixed(0)} ETB`} />
          <Stat icon="business_center" label="B2B Requests" value={b2bLoading ? '…' : stats.b2b} sub={b2bLoading ? 'Loading' : `${stats.b2bUnits} total units`} />
          <Stat icon="payments" label="Revenue" value={ordersLoading ? '…' : `${analytics.revenue.toFixed(0)} ETB`} sub={ordersLoading ? 'Loading' : `${analytics.units} units sold`} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8 items-start">
          <aside className="lg:sticky lg:top-28">
            <div className="bg-[#000d1e]/70 border border-white/10 p-3 sm:p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] px-2 mb-3">Workspace</p>
              <nav className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {tabs.map((t) => {
                  const active = activeTab === t.id;
                  const badge = t.id === 'orders' ? ordersList.length : t.id === 'b2b' ? b2bList.length : t.id === 'manage' ? products.length : null;
                  return (
                    <button key={t.id} onClick={() => { setActiveTab(t.id); if (t.id !== 'upload') { setEditingId(null); setMessage({ type: '', text: '' }); } }} className={`flex items-center justify-between gap-3 px-3 sm:px-4 py-3 border text-left transition-colors ${active ? 'bg-[#FAE500] border-[#FAE500] text-[#001B3D]' : 'bg-transparent border-white/10 text-[#C6C6C7] hover:border-white/25 hover:text-white'}`}>
                      <span className="flex items-center gap-2.5 min-w-0">
                        <span className={`material-symbols-outlined text-[18px] ${active ? 'text-[#001B3D]' : 'text-[#FAE500]'}`}>{t.icon}</span>
                        <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold truncate">{t.label}</span>
                      </span>
                      {badge !== null && <span className={`font-mono text-[10px] px-2 py-0.5 border ${active ? 'border-[#001B3D]/30 text-[#001B3D]' : 'border-white/10 text-[#8e9099]'}`}>{badge}</span>}
                    </button>
                  );
                })}
              </nav>
            </div>
            <div className="hidden lg:block mt-4 border border-white/10 bg-[#00142D]/60 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FAE500] mb-2">Tip</p>
              <p className="font-body text-sm text-[#C6C6C7] leading-relaxed">B2B requests include size breakdowns, color, notes, and contact info—use them to confirm pricing and timelines.</p>
            </div>
          </aside>

          <main className="min-w-0">
            {activeTab === 'analytics' && (
              <div className="space-y-5">
                <Panel title="Analytics Overview" meta={ordersLoading ? 'Loading…' : `${analytics.orders} orders`}>
                  {ordersLoading ? <Loading /> : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <MiniStat label="Total Revenue" value={`${analytics.revenue.toFixed(2)} ETB`} />
                      <MiniStat label="Products Sold" value={analytics.units} />
                      <MiniStat label="Total Orders" value={analytics.orders} />
                      <MiniStat label="Avg. Order Value" value={`${analytics.aov.toFixed(2)} ETB`} />
                    </div>
                  )}
                </Panel>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <Panel title="Top Performing Products" meta={analytics.topProducts.length ? `Top ${Math.min(5, analytics.topProducts.length)}` : ''}>
                    {ordersLoading ? <Loading /> : analytics.topProducts.length === 0 ? <Empty icon="bar_chart" text="No sales data yet." /> : (
                      <div className="space-y-4">
                        {analytics.topProducts.slice(0, 5).map((p, i) => {
                          const max = analytics.topProducts[0].revenue || 1;
                          const pct = Math.round((p.revenue / max) * 100);
                          return (
                            <div key={p.name + i}>
                              <div className="flex items-start justify-between gap-3 mb-1.5">
                                <div className="min-w-0">
                                  <p className="font-headline font-bold text-white uppercase text-sm truncate">{i + 1}. {p.name}</p>
                                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#8e9099]">{p.units} sold · {p.orders} order{p.orders > 1 ? 's' : ''}</p>
                                </div>
                                <p className="font-headline font-black text-[#FAE500] whitespace-nowrap">{p.revenue.toFixed(2)} ETB</p>
                              </div>
                              <div className="h-1.5 bg-white/10 overflow-hidden">
                                <div className="h-full bg-[#FAE500]" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </Panel>

                  <Panel title="Order Status" meta="Breakdown">
                    {ordersLoading ? <Loading /> : analytics.orders === 0 ? <Empty icon="receipt_long" text="No orders yet." /> : (
                      <div className="space-y-3">
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => {
                          const count = analytics.byStatus[s] || 0;
                          if (!count) return null;
                          const pct = Math.round((count / analytics.orders) * 100);
                          return (
                            <div key={s} className="flex items-center gap-3">
                              <div className="w-28 shrink-0"><StatusBadge status={s} /></div>
                              <div className="flex-1 h-1.5 bg-white/10 overflow-hidden"><div className="h-full bg-[#FAE500]/80" style={{ width: `${pct}%` }} /></div>
                              <span className="font-mono text-[10px] uppercase tracking-widest text-[#C6C6C7] w-16 text-right">{count} ({pct}%)</span>
                            </div>
                          );
                        })}
                        {Object.keys(analytics.byStatus).length === 0 && <p className="font-mono text-xs text-[#8e9099]">No status data.</p>}
                      </div>
                    )}
                  </Panel>
                </div>

                <Panel title="All Products by Sales" meta={analytics.topProducts.length ? `${analytics.topProducts.length} with sales` : ''}>
                  {ordersLoading ? <Loading /> : analytics.topProducts.length === 0 ? <Empty icon="inventory_2" text="No sales recorded yet." /> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] pb-3 pr-4">Product</th>
                            <th className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] pb-3 pr-4">Units Sold</th>
                            <th className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] pb-3 pr-4">Orders</th>
                            <th className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] pb-3 text-right">Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {analytics.topProducts.map((p, i) => (
                            <tr key={p.name + i} className="border-b border-white/5 last:border-b-0">
                              <td className="py-3 pr-4 font-headline font-bold text-white uppercase text-sm">{p.name}</td>
                              <td className="py-3 pr-4 font-mono text-sm text-[#C6C6C7]">{p.units}</td>
                              <td className="py-3 pr-4 font-mono text-sm text-[#C6C6C7]">{p.orders}</td>
                              <td className="py-3 font-mono text-sm text-[#FAE500] text-right font-bold">{p.revenue.toFixed(2)} ETB</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Panel>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="bg-[#000d1e]/70 border border-white/10 p-5 sm:p-7 md:p-8">
                <div className="flex flex-wrap items-end justify-between gap-4 mb-6 border-b border-white/10 pb-5">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#FAE500] mb-1">{editingId ? 'Update' : 'Create'}</p>
                    <h2 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                  </div>
                  {editingId && <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] border border-white/10 px-3 py-1.5">Editing #{String(editingId).slice(-6)}</span>}
                </div>
                {message.text && <div className={`p-4 mb-6 font-mono text-xs uppercase tracking-widest border ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'}`}>{message.text}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    <Field label="Product Name"><input name="name" value={formData.name} onChange={handleInputChange} required className={inputCls} placeholder="e.g. Kinetic Hoodie" /></Field>
                    <Field label="URL Slug"><input name="slug" value={formData.slug} onChange={handleInputChange} required className={`${inputCls} text-[#C6C6C7]`} placeholder="e.g. kinetic-hoodie" /></Field>
                    <Field label="Category">
                      <select name="category" value={formData.category} onChange={handleInputChange} className={`${inputCls} appearance-none`}>
                        <option value="tshirt">T-Shirt</option><option value="sweater">Sweater</option><option value="hoodie">Hoodie</option><option value="mug">Mug</option><option value="totebag">Tote Bag</option>
                      </select>
                    </Field>
                    <Field label="Price (ETB)"><input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required className={inputCls} placeholder="0.00" /></Field>
                  </div>
                  <Field label={`Product Image ${editingId ? '(optional — keep current if empty)' : ''}`}>
                    <input id="image-upload" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required={!editingId} className="w-full bg-[#00142D] border border-white/10 focus:border-[#FAE500] p-3 text-sm font-body text-white outline-none transition-colors file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:uppercase file:tracking-[0.2em] file:font-bold file:bg-[#FAE500] file:text-[#001b3d] hover:file:bg-white" />
                  </Field>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button type="submit" disabled={saving} className="flex-1 bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] py-4 text-[11px] hover:bg-white transition-colors disabled:opacity-50 shadow-[0_8px_30px_rgba(250,229,0,0.15)]">{saving ? 'Saving…' : editingId ? 'Save Changes' : 'Upload Product'}</button>
                    {editingId && <button type="button" onClick={() => { setActiveTab('manage'); setEditingId(null); setFormData({name:'',slug:'',category:'tshirt',price:''}); setImageFile(null); }} className="flex-1 bg-transparent border border-[#FAE500] text-[#FAE500] font-headline font-black uppercase tracking-[0.2em] py-4 text-[11px] hover:bg-[#FAE500] hover:text-[#001B3D] transition-colors">Cancel Edit</button>}
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'manage' && (
              <Panel title="Manage Products" meta={`${products.length} items`}>
                {products.length === 0 ? (
                  <Empty icon="inventory_2" text="No products found." />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {products.map((product) => (
                      <div key={product._id} className="group bg-[#00142D]/70 border border-white/10 overflow-hidden hover:border-[#FAE500]/30 transition-colors">
                        <div className="flex gap-4 p-4">
                          <div className="w-20 h-20 bg-[#000d1e] border border-white/10 overflow-hidden shrink-0">
                            {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/20"><span className="material-symbols-outlined">image</span></div>}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#8e9099] mb-1">{product.category}</p>
                            <h4 className="font-headline font-bold text-white uppercase leading-tight truncate">{product.name}</h4>
                            <p className="font-mono text-xs text-[#FAE500] mt-1">{product.price} ETB</p>
                            <p className="font-mono text-[10px] text-[#6f7682] mt-1 truncate">/{product.slug}</p>
                          </div>
                        </div>
                        <div className="flex border-t border-white/10">
                          <button onClick={() => handleEdit(product)} className="flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#C6C6C7] hover:text-white hover:bg-white/[0.04] transition-colors"><span className="material-symbols-outlined text-[16px]">edit</span>Edit</button>
                          <div className="w-px bg-white/10" />
                          <button onClick={() => handleDelete(product._id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"><span className="material-symbols-outlined text-[16px]">delete</span>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            )}

            {activeTab === 'orders' && (
              <Panel title="Recent Orders" meta={ordersLoading ? 'Loading…' : `${ordersList.length} orders`}>
                {ordersLoading ? <Loading /> : ordersList.length === 0 ? <Empty icon="receipt_long" text="No orders found." /> : (
                  <div className="space-y-4">
                    {ordersList.map((order) => {
                      const orderTotal = (order.items || []).reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0);
                      return (
                        <div key={order.id} className="bg-[#00142D]/70 border border-white/10 p-5 flex flex-col xl:flex-row xl:items-start justify-between gap-5">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h4 className="font-headline font-bold text-xl text-white uppercase tracking-tight">Order #{String(order.id).slice(-6)}</h4>
                              <StatusBadge status={order.status} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mb-4">
                              <Info label="Customer" value={order.full_name} />
                              <Info label="Phone" value={order.phone} />
                              <Info label="Address" value={`${order.address}, ${order.city}`} className="sm:col-span-2" />
                            </div>
                            <div className="space-y-1.5 border-t border-white/10 pt-3">
                              {(order.items || []).map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-[#C6C6C7]">
                                  <span><span className="text-[#FAE500]">{item.product_name}</span> · {item.size === 'ONE' ? 'One Size' : item.size} · x{item.quantity}</span>
                                  <span className="text-white/70 whitespace-nowrap">{(Number(item.unit_price) * item.quantity).toFixed(2)} ETB</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="xl:text-right shrink-0 flex xl:flex-col items-center xl:items-end justify-between gap-3 border-t xl:border-t-0 xl:border-l border-white/10 pt-4 xl:pt-0 xl:pl-6">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] mb-1">Total</p>
                              <p className="font-headline text-2xl font-black text-[#FAE500] leading-none">{orderTotal.toFixed(2)} <span className="text-sm text-[#C6C6C7]">ETB</span></p>
                            </div>
                            <p className="font-mono text-[10px] text-[#6f7682] uppercase tracking-widest">{new Date(order.created_at).toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            )}

            {activeTab === 'b2b' && (
              <Panel title="B2B Requests" meta={b2bLoading ? 'Loading…' : `${b2bList.length} requests · ${stats.b2bUnits} units`}>
                {b2bLoading ? <Loading /> : b2bList.length === 0 ? <Empty icon="business_center" text="No B2B requests yet." /> : (
                  <div className="space-y-4">
                    {b2bList.map((req) => {
                      const totalUnits = (req.items || []).reduce((s, it) => s + (Number(it.quantity) || 0), 0);
                      return (
                        <div key={req.id} className="bg-[#00142D]/70 border border-white/10 p-5">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h4 className="font-headline font-bold text-xl text-white uppercase tracking-tight">B2B #{String(req.id).slice(-6)}</h4>
                                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border bg-yellow-500/10 text-yellow-400 border-yellow-500/30">{req.status}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-1">
                                <Info label="Company" value={req.company || '—'} />
                                <Info label="Contact" value={req.name || '—'} />
                                <Info label="Phone" value={req.phone || '—'} />
                              </div>
                            </div>
                            <div className="lg:text-right shrink-0 flex lg:flex-col items-center lg:items-end gap-4 lg:gap-1">
                              <div>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] lg:mb-1">Total units</p>
                                <p className="font-headline text-2xl font-black text-[#FAE500] leading-none">{totalUnits}</p>
                              </div>
                              <p className="font-mono text-[10px] text-[#6f7682] uppercase tracking-widest">{new Date(req.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border-t border-white/10 pt-4">
                            {(req.items || []).map((item, idx) => (
                              <div key={idx} className="bg-[#000d1e]/60 border border-white/10 p-4">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                                  <p className="font-headline font-bold text-base text-white uppercase leading-tight">{item.productName}</p>
                                  <span className="font-mono text-[9px] uppercase tracking-widest text-[#8e9099]">{item.kind}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  <Tag accent>{item.color}</Tag>
                                  <Tag>{item.quantity} {item.unit}</Tag>
                                </div>
                                {item.sizeBreakdown && item.sizeBreakdown.length ? (
                                  <div className="flex flex-wrap gap-1.5 mb-2">
                                    {item.sizeBreakdown.map((s) => (
                                      <span key={s.size} className="inline-flex items-center gap-1.5 border border-white/10 bg-[#00142D] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#C6C6C7]"><span className="text-[#FAE500]">{s.size}</span>{s.quantity}</span>
                                    ))}
                                  </div>
                                ) : item.size ? (
                                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#C6C6C7] mb-2">Option: <span className="text-white">{item.size}</span></p>
                                ) : null}
                                {item.notes && <p className="font-body text-xs text-[#8e9099] leading-relaxed border-t border-white/10 pt-2 mt-2"><span className="font-mono uppercase tracking-widest text-[9px] text-[#FAE500] mr-2">Notes</span>{item.notes}</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full bg-[#00142D] border border-white/10 focus:border-[#FAE500] p-3.5 text-sm font-body text-white outline-none transition-colors placeholder-white/25';

function Panel({ title, meta, children }) {
  return (
    <div className="bg-[#000d1e]/70 border border-white/10 p-5 sm:p-7 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6 border-b border-white/10 pb-5">
        <h2 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">{title}</h2>
        {meta ? <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#8e9099] border border-white/10 px-3 py-1.5">{meta}</span> : null}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#FAE500] font-bold">{label}</label>
      {children}
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-[#00142D]/70 border border-white/10 p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099] mb-2">{label}</p>
      <p className="font-headline text-xl sm:text-2xl font-black text-white leading-none break-words">{value}</p>
    </div>
  );
}

function Info({ label, value, className = '' }) {
  return (
    <p className={`font-mono text-[10px] uppercase tracking-widest text-[#8e9099] ${className}`}><span className="text-[#FAE500]">{label}:</span> <span className="text-[#C6C6C7]">{value}</span></p>
  );
}

function Tag({ children, accent }) {
  return <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-1 border ${accent ? 'text-[#FAE500] border-[#FAE500]/30 bg-[#FAE500]/[0.06]' : 'text-[#C6C6C7] border-white/10'}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const cls = status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/30' : status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  return <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border ${cls}`}>{status}</span>;
}

function Loading() {
  return (
    <div className="py-16 flex flex-col items-center gap-3 text-[#8e9099]">
      <div className="w-8 h-8 border-2 border-[#FAE500]/30 border-t-[#FAE500] rounded-full animate-spin" />
      <p className="font-mono text-[10px] uppercase tracking-[0.25em]">Loading</p>
    </div>
  );
}

function Empty({ icon, text }) {
  return (
    <div className="py-16 border border-dashed border-white/10 flex flex-col items-center gap-3 text-center px-4">
      <span className="material-symbols-outlined text-4xl text-white/20">{icon}</span>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#8e9099]">{text}</p>
    </div>
  );
}
