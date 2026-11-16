import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const imageUrl = (item) => item.image || 'https://via.placeholder.com/200x200/000d1e/FAE500?text=Arada';

function QtyStepper({ value, onChange, label }) {
  return (
    <div className="flex items-center h-9 border border-white/15">
      <button type="button" onClick={() => onChange(value - 1)} aria-label={`Decrease ${label}`} className="w-8 h-full flex items-center justify-center text-white/60 hover:text-[#FAE500] transition-colors">-</button>
      <span className="w-10 text-center font-mono text-sm text-white">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`} className="w-8 h-full flex items-center justify-center text-white/60 hover:text-[#FAE500] transition-colors">+</button>
    </div>
  );
}

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, count, subtotal } = useCart();

  return (
    <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] pb-20 pt-28 font-sans page-fade">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <nav className="font-mono text-xs md:text-sm text-[#8e9099] tracking-wide">
          <Link to="/" className="text-[#FAE500] hover:text-white transition-colors">Home</Link>
          <span className="mx-2">\</span>
          <span className="text-[#C6C6C7]">Cart</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-6 mb-10 mt-3">
          <h1 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">Your Cart</h1>
          {items.length > 0 && (
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C6C6C7]">
              {count} item{count > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 bg-[#000d1e] border border-white/10">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">shopping_bag</span>
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter text-white mb-2">Your Cart Is Empty</h2>
            <p className="font-mono text-sm text-[#8e9099] mb-6">Find something kinetic in our products first.</p>
            <Link to="/products" className="inline-block bg-[#FAE500] text-[#001B3D] px-8 py-3 font-headline font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-colors">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
            <div>
              <div className="border-t border-white/10">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4 py-5 border-b border-white/10">
                    <Link to={`/product/${item.productId}`} className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-[#000d1e] border border-white/10 overflow-hidden">
                      <img src={imageUrl(item)} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-4">
                        <div className="min-w-0">
                          <Link to={`/product/${item.productId}`} className="font-headline font-bold text-sm md:text-base text-white hover:text-[#FAE500] transition-colors line-clamp-1">{item.name}</Link>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-[#8e9099] mt-1">Size: {item.size === 'ONE' ? 'One Size' : item.size}</p>
                          <p className="font-mono text-xs text-[#FAE500] mt-1">{item.price} ETB</p>
                        </div>
                        <button onClick={() => removeItem(item.productId, item.size)} aria-label={`Remove ${item.name} ${item.size}`} className="shrink-0 h-8 w-8 flex items-center justify-center border border-white/10 text-[#8e9099] hover:text-red-400 hover:border-red-400/40 transition-colors">
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <QtyStepper value={item.quantity} onChange={(value) => updateQuantity(item.productId, item.size, value)} label={`${item.name} ${item.size}`} />
                        <span className="font-mono text-sm text-white">{(Number(item.price) * item.quantity).toFixed(2)} ETB</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Link to="/products" className="font-mono text-[10px] uppercase tracking-widest text-[#8e9099] hover:text-[#FAE500] transition-colors">? Continue Shopping</Link>
                <button onClick={clearCart} className="font-mono text-[10px] uppercase tracking-widest text-[#8e9099] hover:text-red-400 transition-colors">Clear Cart</button>
              </div>
            </div>
            <aside className="bg-[#000d1e] border border-white/10 p-6 lg:sticky lg:top-28">
              <h3 className="font-headline text-lg font-black uppercase tracking-tight text-white mb-5 pb-4 border-b border-white/10">Order Summary</h3>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between items-center"><span className="text-[#8e9099] uppercase text-xs">Items</span><span className="text-white">{count}</span></div>
                <div className="flex justify-between items-center"><span className="text-[#8e9099] uppercase text-xs">Subtotal</span><span className="text-white">{subtotal.toFixed(2)} ETB</span></div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10"><span className="text-[#8e9099] uppercase text-xs">Shipping</span><span className="text-white text-xs">Calculated at delivery</span></div>
                <div className="flex justify-between items-center pt-1"><span className="font-headline font-bold text-base uppercase text-white">Total</span><span className="font-headline font-black text-xl text-[#FAE500]">{subtotal.toFixed(2)} ETB</span></div>
              </div>
              <Link to="/checkout" className="block text-center w-full mt-6 bg-[#FAE500] text-[#001B3D] font-headline font-black uppercase tracking-[0.2em] py-4 text-[11px] hover:bg-white transition-all shadow-[0_5px_20px_rgba(250,229,0,0.15)]">Proceed to Checkout</Link>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
