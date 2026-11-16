import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCart } from '../context/CartContext';

const imageUrl = (item) => item.image || 'https://via.placeholder.com/200x200/000d1e/FAE500?text=Arada';

export default function Checkout() {
  const { items, count, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrder = useMutation(api.orders.create);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ fullName: '', phone: '', address: '', city: 'Addis Ababa' });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await createOrder({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        items: items.map((item) => ({ productId: item.productId, size: item.size, quantity: item.quantity })),
      });
      setSuccess({ orderId: res.id, itemCount: count, total: subtotal.toFixed(2), fullName: formData.fullName, phone: formData.phone });
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] flex items-center justify-center font-sans px-4 pt-20 page-fade">
        <div className="bg-[#000d1e] p-8 md:p-16 border border-[#FAE500]/30 max-w-lg w-full text-center shadow-[0_0_50px_rgba(250,229,0,0.1)]">
          <span className="material-symbols-outlined text-[#FAE500] text-7xl mb-6">check_circle</span>
          <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-white mb-4">Order Received</h2>
          <p className="font-mono text-sm text-[#8e9099] mb-2 leading-relaxed">
            Thank you, <span className="text-[#FAE500]">{success.fullName}</span>! Order <span className="text-white">#{String(success.orderId).slice(-6)}</span> with {success.itemCount} item{success.itemCount > 1 ? 's' : ''} ({success.total} ETB) has been placed.
          </p>
          <p className="font-mono text-sm text-[#8e9099] mb-8 leading-relaxed">We will contact you at {success.phone} shortly.</p>
          <button onClick={() => navigate('/products')} className="bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] px-8 py-4 text-xs hover:bg-white transition-colors w-full">Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] pb-20 pt-28 font-sans page-fade">
        <div className="max-w-[1280px] mx-auto px-6 md:px-10">
          <nav className="font-mono text-xs md:text-sm text-[#8e9099] tracking-wide">
            <Link to="/" className="text-[#FAE500] hover:text-white transition-colors">Home</Link><span className="mx-2">\</span>
            <Link to="/cart" className="text-[#FAE500] hover:text-white transition-colors">Cart</Link><span className="mx-2">\</span>
            <span className="text-[#C6C6C7]">Checkout</span>
          </nav>
          <div className="text-center py-24 bg-[#000d1e] border border-white/10 mt-6">
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter text-white mb-2">Nothing to Check Out</h2>
            <p className="font-mono text-sm text-[#8e9099] mb-6">Your cart is empty.</p>
            <Link to="/products" className="inline-block bg-[#FAE500] text-[#001B3D] px-8 py-3 font-headline font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-colors">Browse Products</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] pb-20 pt-28 font-sans page-fade">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <nav className="font-mono text-xs md:text-sm text-[#8e9099] tracking-wide">
          <Link to="/" className="text-[#FAE500] hover:text-white transition-colors">Home</Link><span className="mx-2">\</span>
          <Link to="/cart" className="text-[#FAE500] hover:text-white transition-colors">Cart</Link><span className="mx-2">\</span>
          <span className="text-[#C6C6C7]">Checkout</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-b border-white/10 pb-6 mb-8 mt-3">
          <h1 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Checkout</h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8e9099]">{count} item{count > 1 ? 's' : ''} � {subtotal.toFixed(2)} ETB</p>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
          <div>
            <div className="flex items-baseline justify-between gap-2 mb-6">
              <h2 className="font-headline text-xl font-black uppercase tracking-tight text-white">Delivery Details</h2>
              <Link to="/cart" className="font-mono text-[10px] uppercase tracking-widest text-[#FAE500] hover:text-white transition-colors">Edit Cart</Link>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#FAE500] font-bold">Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full bg-[#00142D] border-none focus:ring-0 border-b-2 border-transparent focus:border-[#FAE500] focus:bg-[#001B3D] p-3 md:p-4 text-sm font-body text-white outline-none transition-all rounded-t-sm" placeholder="Enter your full name" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#FAE500] font-bold">Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-[#00142D] border-none focus:ring-0 border-b-2 border-transparent focus:border-[#FAE500] focus:bg-[#001B3D] p-3 md:p-4 text-sm font-body text-white outline-none transition-all rounded-t-sm" placeholder="+251 9XX XXX XXX" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#FAE500] font-bold">Delivery Address</label>
                <input name="address" value={formData.address} onChange={handleChange} required className="w-full bg-[#00142D] border-none focus:ring-0 border-b-2 border-transparent focus:border-[#FAE500] focus:bg-[#001B3D] p-3 md:p-4 text-sm font-body text-white outline-none transition-all rounded-t-sm" placeholder="Street, Building, or Area" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-widest text-[#FAE500] font-bold">City</label>
                <select name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#00142D] border-none focus:ring-0 border-b-2 border-transparent focus:border-[#FAE500] focus:bg-[#001B3D] p-3 md:p-4 text-sm font-body text-white outline-none transition-all appearance-none rounded-t-sm cursor-pointer">
                  <option>Addis Ababa</option><option>Hawassa</option><option>Bishoftu</option><option>Other</option>
                </select>
              </div>
            </div>
          </div>
          <aside className="bg-[#000d1e] border border-white/10 p-6 lg:sticky lg:top-28">
            <h3 className="font-headline text-lg font-black uppercase tracking-tight text-white mb-5 pb-4 border-b border-white/10">Order Summary</h3>
            <div className="space-y-4 mb-5">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex items-center gap-3">
                  <div className="w-12 h-12 shrink-0 bg-[#00142D] border border-white/10 overflow-hidden"><img src={imageUrl(item)} alt={item.name} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-headline font-bold text-xs text-white line-clamp-1">{item.name}</p>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#8e9099]">{item.size === 'ONE' ? 'One Size' : item.size} � {item.quantity}</p>
                  </div>
                  <span className="font-mono text-xs text-white whitespace-nowrap">{(Number(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 font-mono text-sm border-t border-white/10 pt-5">
              <div className="flex justify-between items-center"><span className="text-[#8e9099] uppercase text-xs">Subtotal</span><span className="text-white">{subtotal.toFixed(2)} ETB</span></div>
              <div className="flex justify-between items-center pb-4 border-b border-white/10"><span className="text-[#8e9099] uppercase text-xs">Shipping</span><span className="text-white text-xs">Calculated at delivery</span></div>
              <div className="flex justify-between items-center pt-1"><span className="font-headline font-bold text-base uppercase text-white">Total</span><span className="font-headline font-black text-xl text-[#FAE500]">{subtotal.toFixed(2)} ETB</span></div>
            </div>
            <button type="submit" disabled={submitting} className="w-full mt-6 bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] py-4 text-[11px] hover:bg-white transition-all shadow-[0_5px_20px_rgba(250,229,0,0.15)] disabled:opacity-50 disabled:hover:bg-[#FAE500]">
              {submitting ? 'Placing Order...' : 'Place Order Now'}
            </button>
          </aside>
        </form>
      </div>
    </div>
  );
}
