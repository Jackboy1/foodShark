import React, { useState } from 'react';

/**
 * SessionManager Component
 * Allows users to create or join group ordering sessions
 */
const SessionManager = ({ onSessionCreate, onSessionJoin, onContinueSolo, currentMode }) => {
  const [sessionCode, setSessionCode] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [error, setError] = useState('');

  const handleCreateSession = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    onSessionCreate(code);
  };

  const handleJoinSession = () => {
    if (!sessionCode.trim()) {
      setError('Please enter a session code');
      return;
    }
    if (sessionCode.length < 6) {
      setError('Session code must be 6 characters');
      return;
    }
    onSessionJoin(sessionCode.toUpperCase());
    setSessionCode('');
    setError('');
  };

  if (currentMode === 'solo') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-in">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">🦈 FoodShark</h2>
            <p className="text-gray-600">Choose how you want to order</p>
          </div>

          <div className="space-y-4">
            {/* Solo Order */}
            <button
              onClick={onContinueSolo}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95"
            >
              👤 Order Alone
              <p className="text-xs text-orange-100 mt-1">Quick checkout for yourself</p>
            </button>

            {/* Group Order */}
            <button
              onClick={() => setShowJoin(!showJoin)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 active:scale-95"
            >
              👥 Group Order
              <p className="text-xs text-green-100 mt-1">Order together with friends</p>
            </button>
          </div>

          {/* Group Options */}
          {showJoin && (
            <div className="mt-6 space-y-4 border-t pt-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="groupUserName"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Create New Session */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Create New Session</p>
                <button
                  onClick={handleCreateSession}
                  className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  ➕ Create Session
                </button>
              </div>

              {/* Join Existing Session */}
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">Join Existing Session</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={sessionCode}
                    onChange={(e) => {
                      setSessionCode(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none uppercase"
                    maxLength="6"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    onClick={handleJoinSession}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                    disabled={!sessionCode.trim()}
                  >
                    🔗 Join Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default SessionManager;
