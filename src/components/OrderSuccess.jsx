import React, { useEffect } from 'react';

/**
 * OrderSuccess Component
 * Shows order confirmation with Order ID before redirecting to WhatsApp
 */
const OrderSuccess = ({ orderData, onClose }) => {
  useEffect(() => {
    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slide-in overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 text-center">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
          <p className="text-green-100">Your order is being sent to WhatsApp</p>
        </div>

        {/* Order Details */}
        <div className="p-8 space-y-4">
          {/* Order ID */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl p-4 border-2 border-orange-300 text-center">
            <p className="text-sm text-orange-700 font-semibold mb-2">Order ID</p>
            <p className="text-2xl font-bold text-orange-800 font-mono">
              {orderData.orderId}
            </p>
          </div>

          {/* Customer Name */}
          <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
            <p className="text-xs text-blue-600 font-semibold mb-1">👤 Customer</p>
            <p className="text-lg font-bold text-blue-800">{orderData.customerName}</p>
          </div>

          {/* Items Count */}
          <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-400">
            <p className="text-xs text-purple-600 font-semibold mb-1">📦 Items</p>
            <p className="text-lg font-bold text-purple-800">
              {orderData.items.length} {orderData.items.length === 1 ? 'item' : 'items'}
            </p>
          </div>

          {/* Total */}
          <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
            <p className="text-xs text-green-600 font-semibold mb-1">💰 Total</p>
            <p className="text-2xl font-bold text-green-800">
              ₦{orderData.total.toLocaleString()}
            </p>
          </div>

          {/* Info Message */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg text-center">
            <p className="text-sm text-amber-700">
              🔄 WhatsApp will open automatically in a moment...
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full btn-primary mt-6"
          >
            Close ✕
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-600">
          ⏱️ Auto-closing in a few seconds...
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
