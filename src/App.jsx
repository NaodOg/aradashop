import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import VFinal from './pages/VFinal';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import B2B from './pages/B2B';
import About from './pages/About';
import OwnerDashboard from './pages/OwnerDashboard';
import Navbar from './components/Navbar';

const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH || '/owner-dashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<VFinal />} />
        <Route path="/products" element={<Products />} />
        <Route path="/b2b" element={<B2B />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path={ADMIN_PATH} element={<OwnerDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
