import React from 'react';

/**
 * ProductCard Component
 * Displays individual product with image, price, and quantity controls
 */
const ProductCard = ({ product, onAddToCart, cartItem = null }) => {
  const quantity = cartItem?.quantity || 0;

  return (
    <div className="card overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image/Emoji Area */}
      <div className="bg-gradient-to-br from-orange-100 to-green-100 h-40 flex items-center justify-center relative overflow-hidden group">
        <span className="text-7xl transform group-hover:scale-125 transition-transform duration-300">
          {product.image}
        </span>
        {product.popular && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
            ⭐ Popular
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{product.description}</p>

        {/* Price */}
        <div className="text-center mb-4">
          <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
            ₦{product.price.toLocaleString()}
          </span>
        </div>

        {/* Quantity Controls & Add to Cart */}
        {quantity === 0 ? (
          <button
            onClick={() => onAddToCart(product)}
            className="btn-primary w-full"
          >
            ➕ Add to Cart
          </button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
              <button
                onClick={() => onAddToCart(product, -1)}
                className="text-xl font-bold text-orange-500 hover:text-orange-700 transition-colors"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="text-lg font-bold text-gray-800 min-w-[30px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => onAddToCart(product, 1)}
                className="text-xl font-bold text-green-500 hover:text-green-700 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => onAddToCart(product, 0)}
              className="w-full py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors text-sm"
            >
              🗑️ Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
