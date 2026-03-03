import React, { useState, useEffect } from 'react';
import { formatDate, formatTime } from '../utils';
import { getGroupSession } from '../utils';
import { WHATSAPP_CONFIG } from '../config';

/**
 * GroupOrderForm Component
 * Displays group order summary before checkout
 */
const GroupOrderForm = ({ sessionCode, onSubmit, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_CONFIG.phone);

  useEffect(() => {
    // Fetch session data asynchronously
    const loadSession = async () => {
      try {
        const sessionData = await getGroupSession(sessionCode);
        setSession(sessionData);

        // Calculate total
        if (sessionData && sessionData.users) {
          let total = 0;
          Object.values(sessionData.users).forEach(user => {
            // Convert Firebase object to array if needed
            const items = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
            items.forEach(item => {
              total += item.quantity * item.price;
            });
          });
          setTotalAmount(total);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      }
    };
    loadSession();
  }, [sessionCode]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!session || !session.users || Object.keys(session.users).length === 0) {
      alert('No sessions found');
      return;
    }

    let hasItems = false;
    Object.values(session.users).forEach(user => {
      // Convert Firebase object to array if needed
      const items = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
      if (items.length > 0) hasItems = true;
    });

    if (!hasItems) {
      alert('Cart is empty');
      return;
    }

    if (!whatsappNumber.trim()) {
      alert('Please enter a WhatsApp number');
      return;
    }

    // Basic phone number validation (at least 10 digits)
    const digitsOnly = whatsappNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      alert('Please enter a valid WhatsApp number (at least 10 digits)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        session,
        whatsappNumber: digitsOnly,
        totalAmount,
        date: formatDate(new Date()),
        time: formatTime(new Date()),
      });
      setIsSubmitting(false);
    }, 500);
  };

  if (!session || !session.users) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-in">
          <p className="text-center text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  const userList = Object.values(session.users);
  const now = new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold">👥 Group Order Summary</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:scale-110 transition-transform"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Session Info */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-300">
            <p className="text-sm text-blue-600 font-semibold mb-2">📱 Session Code</p>
            <p className="text-2xl font-bold text-blue-800 font-mono tracking-widest">
              {sessionCode}
            </p>
          </div>

          {/* WhatsApp Number Input */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              📱 Send Order To (WhatsApp Number)
            </label>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="234XXXXXXXXXX (without +)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors text-lg font-mono"
              disabled={isSubmitting}
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              Enter the recipient's WhatsApp number (country code + number, no spaces or +)
            </p>
          </div>

          {/* Users and Items */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-gray-800">📋 Order Details</h3>
            
            {userList.map((user, index) => {
              // Convert Firebase object to array if needed
              const userItems = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
              
              return (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-400"
              >
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  👤 {user.name}
                </h4>
                
                {userItems.length > 0 ? (
                  <div className="space-y-2 ml-4">
                    {userItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-2xl">{item.image}</span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold text-orange-600">
                          ₦{(item.quantity * item.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No items yet</p>
                )}
              </div>
            );
            })}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-400 text-center">
              <p className="text-xs text-purple-600 font-semibold mb-1">👥 People</p>
              <p className="text-2xl font-bold text-purple-800">{userList.length}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-3 border-l-4 border-pink-400 text-center">
              <p className="text-xs text-pink-600 font-semibold mb-1">📦 Items</p>
              <p className="text-2xl font-bold text-pink-800">
                {userList.reduce((sum, user) => {
                  const itemsArray = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
                  return sum + itemsArray.length;
                }, 0)}
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400 text-center">
              <p className="text-xs text-green-600 font-semibold mb-1">📅 Date</p>
              <p className="text-sm font-bold text-green-800">{formatDate(now)}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-400">
            <p className="text-sm text-amber-700">
              🕒 <span className="font-semibold">{formatTime(now)}</span>
            </p>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-orange-100 to-green-100 rounded-xl p-4 border-2 border-orange-300">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">Total Amount:</span>
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              ✅ After clicking "Send Order", WhatsApp will open with the complete group order summary!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              disabled={isSubmitting || totalAmount === 0}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  📱 Send Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupOrderForm;
