import React from 'react';

/**
 * Header Component
 * Displays the app logo, name, and cart counter
 */
const Header = ({ cartCount, onCartClick, onHomeClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform"
        >
          <span className="text-3xl">🦈</span>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold">FoodShark</h1>
            <p className="text-xs text-orange-100">Order Fresh Snacks & Drinks</p>
          </div>
        </div>

        {/* Cart Icon */}
        <button
          onClick={onCartClick}
          className="relative group"
          aria-label="Open cart"
        >
          <div className="text-4xl transform group-hover:scale-110 transition-transform">
            🛒
          </div>
          {/* Cart Counter Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs font-bold flex items-center justify-center animate-pulse">
              {cartCount > 99 ? '99+' : cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
