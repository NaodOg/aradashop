import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCart } from '../context/CartContext';

const APPAREL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const ONE_SIZE = ['ONE'];

const BLURBS = {
  tshirt: 'Premium cotton tee from The Drop � designed, printed and finished in Addis Ababa.',
  sweater: 'Brushed knit sweater from The Drop � designed, printed and finished in Addis Ababa.',
  hoodie: 'Everyday hoodie from The Drop � designed, printed and finished in Addis Ababa.',
  mug: 'Ceramic mug from The Drop � printed and finished in Addis Ababa.',
  totebag: 'Canvas tote from The Drop � designed, printed and finished in Addis Ababa.',
};

const CATEGORY_LABELS = {
  tshirt: 'T-Shirt', sweater: 'Sweater', hoodie: 'Hoodie', mug: 'Mug', totebag: 'Tote Bag',
};

function QtyStepper({ value, onChange, label }) {
  return (
    <div className="flex items-center h-9 border border-white/15">
      <button type="button" onClick={() => onChange(value - 1)} aria-label={`Decrease ${label}`} className="w-9 h-full flex items-center justify-center text-white/60 hover:text-[#FAE500] transition-colors">-</button>
      <input type="number" min="0" value={value} onChange={(e) => onChange(parseInt(e.target.value || '0', 10))} aria-label={`Quantity ${label}`} className="w-12 h-full bg-transparent text-center font-mono text-sm text-white outline-none" />
      <button type="button" onClick={() => onChange(value + 1)} aria-label={`Increase ${label}`} className="w-9 h-full flex items-center justify-center text-white/60 hover:text-[#FAE500] transition-colors">+</button>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = useQuery(api.products.get, { id });
  const [sizeQty, setSizeQty] = useState({ M: 1, ONE: 1 });
  const [feedback, setFeedback] = useState(null);
  const { addItems, count } = useCart();

  if (product === undefined) return <div className="min-h-screen bg-[#001b3d] pt-28 px-8 flex justify-center page-fade"><div className="w-10 h-10 border-2 border-[#FAE500]/30 border-t-[#FAE500] rounded-full animate-spin mt-20"></div></div>;
  if (!product) return <div className="min-h-screen bg-[#001b3d] pt-28 px-8 flex justify-center text-white page-fade">Product not found.</div>;

  const isApparel = ['tshirt', 'sweater', 'hoodie'].includes(product.category);
  const sizeOptions = isApparel ? APPAREL_SIZES : ONE_SIZE;
  const blurb = BLURBS[product.category] || 'Official Arada merchandise � designed, printed and finished in Addis Ababa.';

  const setQtyForSize = (size, value) => {
    setSizeQty((prev) => ({ ...prev, [size]: Math.max(0, isNaN(value) ? 0 : value) }));
    setFeedback(null);
  };

  const selectedRows = sizeOptions.map((size) => ({ size, quantity: sizeQty[size] || 0 })).filter((row) => row.quantity > 0);
  const selectedCount = selectedRows.reduce((sum, row) => sum + row.quantity, 0);
  const selectedTotal = (Number(product.price) * selectedCount).toFixed(2);

  const handleAddToCart = () => {
    if (selectedRows.length === 0) {
      setFeedback({ type: 'error', text: 'Set a quantity for at least one size.' });
      return;
    }
    addItems(product, selectedRows);
    setFeedback({ type: 'success', text: `Added ${selectedCount} item${selectedCount > 1 ? 's' : ''} (${selectedRows.map((r) => r.size).join(', ')}) to your cart.` });
    setSizeQty((prev) => { const next = { ...prev }; sizeOptions.forEach((size) => { next[size] = 0; }); return next; });
  };

  return (
    <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] pb-20 pt-28 font-sans page-fade">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <nav className="font-mono text-xs md:text-sm text-[#8e9099] tracking-wide">
          <Link to="/" className="text-[#FAE500] hover:text-white transition-colors">Home</Link>
          <span className="mx-2">\</span>
          <Link to="/products" className="text-[#FAE500] hover:text-white transition-colors">Products</Link>
          <span className="mx-2">\</span>
          <span className="text-[#C6C6C7]">{product.name}</span>
        </nav>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,45%)_minmax(0,1fr)] gap-10 lg:gap-12 items-start">
          <div className="relative aspect-square bg-[#000d1e] border border-white/10 overflow-hidden">
            <img src={product.image || 'https://via.placeholder.com/800x800/000d1e/FAE500?text=Arada'} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div>
            <h1 className="font-headline text-3xl md:text-[30px] md:leading-[1.1] font-bold text-white">{product.name}</h1>
            <p className="mt-4 font-mono text-base text-[#FAE500]">{product.price} ETB</p>
            <p className="mt-4 text-base leading-6 text-[#C6C6C7] max-w-xl font-body">{blurb}</p>

            <div className="mt-7">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#FAE500] mb-3">{isApparel ? 'Size & Quantity' : 'Quantity'}</p>
              <div className="divide-y divide-white/10 border border-white/10 max-w-md">
                {sizeOptions.map((size) => (
                  <div key={size} className="flex items-center justify-between px-4 py-2.5">
                    <span className="font-headline font-bold text-sm text-white">{isApparel ? size : 'One Size'}</span>
                    <QtyStepper value={sizeQty[size] || 0} onChange={(value) => setQtyForSize(size, value)} label={isApparel ? `size ${size}` : 'one size'} />
                  </div>
                ))}
              </div>
              {isApparel && <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#8e9099]">Want multiple sizes? Set a quantity on each row.</p>}
            </div>

            <div className="mt-6">
              <button type="button" onClick={handleAddToCart} disabled={selectedCount === 0} className="h-[42px] px-8 bg-[#FAE500] text-[#001B3D] font-headline font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-40 disabled:hover:bg-[#FAE500]">
                Add to Cart{selectedCount > 0 ? ` � ${selectedCount} item${selectedCount > 1 ? 's' : ''} � ${selectedTotal} ETB` : ''}
              </button>
              {feedback && (
                <div className={`mt-3 max-w-md px-4 py-3 font-mono text-[11px] uppercase tracking-widest border ${feedback.type === 'success' ? 'text-[#FAE500] border-[#FAE500]/40 bg-[#FAE500]/5' : 'text-red-400 border-red-400/40 bg-red-400/5'}`}>
                  {feedback.text}
                  {feedback.type === 'success' && <Link to="/cart" className="ml-2 underline underline-offset-4 text-white hover:text-[#FAE500]">View Cart ({count})</Link>}
                </div>
              )}
            </div>

            <p className={`mt-4 text-sm font-body ${product.is_available ? 'text-[#FAE500]/80' : 'text-red-400'}`}>{product.is_available ? 'In Stock' : 'Sold Out'}</p>
            <div className="mt-7 border-t border-white/10"></div>
            <div className="mt-5 space-y-1 font-mono text-[13px] text-[#8e9099] leading-6">
              <p>Category: <span className="text-[#C6C6C7] uppercase">{CATEGORY_LABELS[product.category] || product.category}</span></p>
              <p>Product Code: <span className="text-[#C6C6C7] uppercase">{product.slug}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
