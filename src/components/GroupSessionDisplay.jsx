import React, { useState, useEffect } from 'react';

/**
 * GroupSessionDisplay Component
 * Shows current group session info and allows group management
 */
const GroupSessionDisplay = ({ sessionCode, userName, userCount, totalItems, onClose, onCheckout }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        {/* Session Info */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs text-blue-100 font-semibold">Group Ordering Session</p>
            <p className="text-lg font-bold">Code: {sessionCode}</p>
          </div>
          <button
            onClick={copyToClipboard}
            className="bg-blue-400 hover:bg-blue-300 text-blue-900 font-semibold py-2 px-3 rounded-lg transition-colors text-sm"
          >
            {copied ? '✅ Copied!' : '📋 Copy Code'}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="text-blue-100 text-xs">People</p>
            <p className="text-2xl font-bold">{userCount}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-100 text-xs">Items</p>
            <p className="text-2xl font-bold">{totalItems}</p>
          </div>
          <div className="text-center">
            <p className="text-blue-100 text-xs">You</p>
            <p className="font-bold truncate max-w-[100px]">{userName}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCheckout}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors transform hover:scale-105 active:scale-95"
          >
            📤 Send Order
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors transform hover:scale-105 active:scale-95"
          >
            ✕ Leave Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupSessionDisplay;
