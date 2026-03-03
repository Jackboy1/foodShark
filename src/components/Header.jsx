import React, { useState } from 'react';

/**
 * Header Component
 * Displays the app logo, name, and cart counter
 */
const Header = ({ cartCount, onCartClick, onHomeClick, sessionCode = null, userName = null }) => {
  const [copied, setCopied] = useState(false);

  const copySessionCode = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
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

        {/* Session Code Badge - Group Mode */}
        {sessionCode && (
          <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 flex items-center gap-2 flex-1 md:flex-none min-w-[220px]">
            <span className="text-sm font-semibold text-white">Session: <span className="font-mono text-base">{sessionCode}</span></span>
            <button
              onClick={copySessionCode}
              className="bg-orange-400 hover:bg-orange-300 text-orange-900 font-bold py-1 px-2 rounded text-xs transition-colors whitespace-nowrap"
            >
              {copied ? '✅' : '📋'}
            </button>
            {userName && (
              <span className="text-xs text-orange-100 ml-1">({userName})</span>
            )}
          </div>
        )}

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
