import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';

/**
 * ProductGrid Component
 * Displays products with category filtering and search
 */
const ProductGrid = ({ cart, onAddToCart }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = filter === 'all' || product.category === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filter or search changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Get cart item by product id
  const getCartItem = (productId) => {
    return cart.find(item => item.id === productId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">{/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors text-lg"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-orange-500'
            }`}
          >
            🍽️ All Products
          </button>
          <button
            onClick={() => handleFilterChange('drinks')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'drinks'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-500'
            }`}
          >
            🥤 Drinks
          </button>
          <button
            onClick={() => handleFilterChange('snacks')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'snacks'
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-500'
            }`}
          >
            🍪 Snacks
          </button>
          <button
            onClick={() => handleFilterChange('fastfood')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'fastfood'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-500'
            }`}
          >
            🍔 Fast Food
          </button>
          <button
            onClick={() => handleFilterChange('pastries')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'pastries'
                ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-pink-500'
            }`}
          >
            🥐 Pastries
          </button>
          <button
            onClick={() => handleFilterChange('extras')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'extras'
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-green-500'
            }`}
          >
            🍟 Extras
          </button>
        </div>
      </div>

      {/* Products Grid */}
      {currentProducts.length > 0 ? (
        <>
          {/* Results info */}
          <div className="mb-4 text-center text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div key={product.id} className="animate-slide-in">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  cartItem={getCartItem(product.id)}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-semibold bg-white border-2 border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ⏮ First
              </button>
              
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-semibold bg-white border-2 border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              {/* Page numbers */}
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-300 hover:border-orange-500'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="px-2 py-2">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-semibold bg-white border-2 border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>

              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-semibold bg-white border-2 border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Last ⏭
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-2xl text-gray-500 mb-2">😅 No products found</p>
          <p className="text-gray-400">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
