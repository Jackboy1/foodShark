import React from 'react';
import { calculateTotal } from '../utils';

/**
 * Cart Component
 * Displays cart items and summary
 */
const Cart = ({ cart, onRemoveItem, onQuantityChange, onClose }) => {
  const total = calculateTotal(cart);

  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center md:justify-end transition-all">
        <div className="bg-white w-full md:w-96 rounded-t-2xl md:rounded-2xl shadow-2xl p-6 animate-slide-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🛒 Cart</h2>
            <button
              onClick={onClose}
              className="text-2xl text-gray-600 hover:text-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Empty Cart Message */}
          <div className="text-center py-8">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-xl text-gray-600 font-semibold mb-2">Cart is Empty</p>
            <p className="text-gray-500">Add some delicious snacks or drinks to get started!</p>
          </div>

          <button
            onClick={onClose}
            className="w-full btn-primary mt-6"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center md:justify-end transition-all">
      <div className="bg-white w-full md:w-96 rounded-t-2xl md:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">🛒 Cart ({cart.length})</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-6 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 rounded-lg p-4 border-l-4 border-orange-500 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{item.image}</span>
                  <div>
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 text-xl transition-colors"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg">
                  <button
                    onClick={() => onQuantityChange(item.id, -1)}
                    className="px-2 py-1 text-orange-500 hover:bg-orange-50 font-bold"
                  >
                    −
                  </button>
                  <span className="px-3 font-bold text-gray-800">{item.quantity}</span>
                  <button
                    onClick={() => onQuantityChange(item.id, 1)}
                    className="px-2 py-1 text-green-500 hover:bg-green-50 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="font-bold text-gray-800">
                  ₦{(item.quantity * item.price).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 space-y-4">
          {/* Subtotal */}
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span className="font-semibold">₦{total.toLocaleString()}</span>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded text-sm text-blue-700">
            💡 You'll complete the order on the next step
          </div>

          {/* Checkout Button */}
          <button
            onClick={onClose}
            className="w-full btn-secondary"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
