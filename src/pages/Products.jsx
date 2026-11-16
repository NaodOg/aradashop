import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'tshirt', label: 'T-Shirts' },
  { id: 'sweater', label: 'Sweaters' },
  { id: 'hoodie', label: 'Hoodies' },
  { id: 'mug', label: 'Mugs' },
  { id: 'totebag', label: 'Tote Bags' },
];

const imageUrl = (product) =>
  product?.image || 'https://via.placeholder.com/600x600/000d1e/FAE500?text=Arada';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();
  const products = useQuery(api.products.list, { category: selectedCategory });
  const loading = products === undefined;
  const list = products || [];

  const filteredProducts = useMemo(() => {
    return list
      .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [list, searchQuery, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-[#001b3d] text-[#e2e2e2] pb-20 pt-28 font-sans page-fade">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/10 pb-6 mb-8">
          <div>
            <nav className="font-mono text-xs text-[#8e9099] tracking-wide mb-3">
              <Link to="/" className="text-[#FAE500] hover:text-white transition-colors">Home</Link>
              <span className="mx-2">\</span>
              <span className="text-[#C6C6C7]">Products</span>
            </nav>
            <h1 className="font-headline text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
              Products
            </h1>
          </div>
          {!loading && (
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#C6C6C7]">
              Showing {filteredProducts.length} of {list.length} results
            </p>
          )}
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-10">
          <div className="flex items-center gap-x-6 gap-y-2 overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 font-headline font-bold text-xs md:text-sm uppercase tracking-widest transition-colors ${
                  selectedCategory === cat.id
                    ? 'text-[#FAE500] border-b-2 border-[#FAE500] pb-1'
                    : 'text-[#C6C6C7] hover:text-white pb-1 border-b-2 border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
            <div className="relative w-full sm:w-56">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="SEARCH..."
                className="w-full bg-[#000d1e] border border-white/15 focus:border-[#FAE500] pl-3 pr-9 py-2.5 font-mono text-xs uppercase tracking-widest text-white placeholder-white/30 outline-none transition-colors"
              />
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-white/30 text-[18px] pointer-events-none">search</span>
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent border-none border-b border-white/20 focus:border-[#FAE500] py-2 font-mono text-xs text-[#FAE500] uppercase tracking-widest outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="newest" className="bg-[#001B3D]">Newest</option>
                <option value="price-asc" className="bg-[#001B3D]">Price: Low - High</option>
                <option value="price-desc" className="bg-[#001B3D]">Price: High - Low</option>
                <option value="name-asc" className="bg-[#001B3D]">Name: A - Z</option>
                <option value="name-desc" className="bg-[#001B3D]">Name: Z - A</option>
              </select>
              <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-white/30 text-[18px] pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#FAE500]/30 border-t-[#FAE500] rounded-full animate-spin"></div>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-24 border border-white/10 bg-[#000d1e]">
            <h2 className="font-headline text-3xl font-black uppercase tracking-tighter text-white mb-4">Check Back Soon</h2>
            <p className="font-mono text-sm text-[#8e9099]">New products are dropping shortly. Nothing available at the moment.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-[#000d1e] border border-white/10">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">search_off</span>
            <h2 className="font-headline text-2xl font-black uppercase tracking-tighter text-white mb-2">No Matches Found</h2>
            <p className="font-mono text-sm text-[#8e9099]">Try adjusting your search query or category.</p>
            {hasActiveFilters && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="mt-6 border border-[#FAE500] text-[#FAE500] px-6 py-2 uppercase font-mono text-[10px] tracking-widest hover:bg-[#FAE500] hover:text-[#001B3D] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <div key={product._id} className="group flex flex-col premium-card p-2 -m-2 rounded-xl">
                <div
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="relative aspect-square bg-[#000d1e] border border-white/5 overflow-hidden cursor-pointer"
                >
                  <img
                    src={imageUrl(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[#001B3D]/10 group-hover:bg-transparent transition-colors duration-300 mix-blend-multiply" />
                  {!product.is_available && (
                    <div className="absolute top-3 left-3 bg-[#000d1e]/90 border border-white/10 px-2 py-1 rounded font-mono text-[9px] uppercase tracking-widest text-red-400">
                      Sold Out
                    </div>
                  )}
                </div>

                <h3 className="mt-3 font-headline font-bold text-sm leading-[1.3] text-white group-hover:text-[#FAE500] transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="mt-1.5 font-mono text-sm text-[#FAE500]">
                  {product.price} ETB
                </p>
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="mt-3 self-start h-[41px] px-6 bg-[#FAE500] text-[#001B3D] font-headline font-black text-[11px] uppercase tracking-widest hover:bg-white transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
