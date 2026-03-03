import React, { useState } from 'react';
import { calculateTotal, formatDate, formatTime } from '../utils';
import { WHATSAPP_CONFIG } from '../config';

/**
 * OrderForm Component
 * Collects customer details and displays order summary before checkout
 */
const OrderForm = ({ cart, onSubmit, onClose }) => {
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_CONFIG.phone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const total = calculateTotal(cart);
  const now = new Date();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!customerName.trim()) {
      alert('Please enter your name');
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

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsSubmitting(true);

    // Simulate processing delay
    setTimeout(() => {
      onSubmit({
        customerName: customerName.trim(),
        whatsappNumber: digitsOnly,
        items: cart,
        total,
        date: formatDate(now),
        time: formatTime(now),
      });
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold">📋 Order Summary</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:scale-110 transition-transform"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Customer Name Input */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              👤 Your Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-lg"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* WhatsApp Number Input */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              📱 WhatsApp Number
            </label>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="234XXXXXXXXXX (without +)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-lg font-mono"
              disabled={isSubmitting}
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              Enter the recipient's WhatsApp number (country code + number, no spaces or +)
            </p>
          </div>

          {/* Order Items Summary */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <h3 className="font-bold text-lg text-gray-800 mb-4">📦 Items in Your Order</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.image}</span>
                    <span className="font-semibold text-gray-700">
                      {item.quantity}x {item.name}
                    </span>
                  </div>
                  <span className="font-semibold text-orange-600">
                    ₦{(item.quantity * item.price).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
              <p className="text-xs text-blue-600 font-semibold mb-1">📅 Date</p>
              <p className="text-lg font-bold text-blue-800">{formatDate(now)}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-400">
              <p className="text-xs text-purple-600 font-semibold mb-1">🕒 Time</p>
              <p className="text-lg font-bold text-purple-800">{formatTime(now)}</p>
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-orange-100 to-green-100 rounded-xl p-4 border-2 border-orange-300">
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-800">Total Amount:</span>
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">
                ₦{total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
            <p className="text-sm text-green-700">
              ✅ After clicking "Place Order", WhatsApp will open with your order details ready to send!
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
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
              disabled={isSubmitting || !customerName.trim()}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Processing...
                </>
              ) : (
                <>
                  📱 Place Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
