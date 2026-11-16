import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-none rounded-none bg-[#001B3D]/80 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-4 sm:px-6 lg:px-8 h-20 text-[#e2e2e2] font-body">
        <Link to="/" className="flex items-center">
          <img src="/aradalogo.png" alt="Arada" className="h-10 sm:h-11 w-auto object-contain" />
        </Link>
        <div className="hidden lg:flex gap-6 xl:gap-10 items-center h-full">
          <a className={`font-headline font-bold tracking-tighter uppercase transition-colors ${location.hash === '#shop' && location.pathname === '/' ? 'text-[#FAE500] border-b-2 border-[#FAE500] pb-1' : 'text-[#C6C6C7] hover:text-[#FAE500]'}`} href="/#shop">Home</a>
          <Link to="/products" className={`font-headline font-bold tracking-tighter uppercase transition-colors ${location.pathname === '/products' ? 'text-[#FAE500] border-b-2 border-[#FAE500] pb-1' : 'text-[#C6C6C7] hover:text-[#FAE500]'}`}>Products</Link>
          <Link to="/b2b" className={`font-headline font-bold tracking-tighter uppercase transition-colors ${location.pathname === '/b2b' ? 'text-[#FAE500] border-b-2 border-[#FAE500] pb-1' : 'text-[#C6C6C7] hover:text-[#FAE500]'}`}>B2B Services</Link>
          <a className="font-headline font-bold tracking-tighter uppercase text-[#C6C6C7] hover:text-[#FAE500] transition-colors" href="/#portfolio">Portfolio</a>
          <Link to="/about" className={`font-headline font-bold tracking-tighter uppercase transition-colors ${location.pathname === '/about' ? 'text-[#FAE500] border-b-2 border-[#FAE500] pb-1' : 'text-[#C6C6C7] hover:text-[#FAE500]'}`}>About</Link>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          <Link to="/cart" className="relative text-[#C6C6C7] hover:text-[#FAE500] transition-all duration-200 p-2 scale-95 active:scale-90">
            <span className="material-symbols-outlined">shopping_bag</span>
            {count > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FAE500] text-[#001B3D] text-[9px] font-bold font-mono flex items-center justify-center leading-none">{count}</span>}
          </Link>
          <button className="lg:hidden text-[#FAE500] z-[60]" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </nav>

      <div className={`fixed inset-0 bg-[#001B3D]/95 backdrop-blur-xl z-[45] transition-all duration-500 ease-[var(--ease-premium)] flex flex-col justify-center items-center overflow-y-auto py-24 motion-reduce:transition-none ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'} lg:hidden`}>
        <div className="flex flex-col gap-6 sm:gap-8 text-center px-6">
          <a className="font-headline font-bold text-2xl uppercase text-white hover:text-[#FAE500] transition-colors" href="/#shop" onClick={closeMenu}>Home</a>
          <Link to="/products" className="font-headline font-bold text-2xl uppercase text-white hover:text-[#FAE500] transition-colors" onClick={closeMenu}>Products</Link>
          <Link to="/cart" className="font-headline font-bold text-2xl uppercase text-white hover:text-[#FAE500] transition-colors" onClick={closeMenu}>Cart{count > 0 ? ` (${count})` : ''}</Link>
          <Link to="/b2b" className="font-headline font-bold text-2xl uppercase text-white hover:text-[#FAE500] transition-colors" onClick={closeMenu}>B2B Services</Link>
          <a className="font-headline font-bold text-2xl uppercase text-white hover:text-[#FAE500] transition-colors" href="/#portfolio" onClick={closeMenu}>Portfolio</a>
          <Link to="/about" className="font-headline font-bold text-2xl uppercase text-white hover:text-[#FAE500] transition-colors" onClick={closeMenu}>About</Link>
        </div>
      </div>
    </>
  );
}
