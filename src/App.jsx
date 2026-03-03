import { useState, useCallback, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import OrderForm from './components/OrderForm';
import OrderSuccess from './components/OrderSuccess';
import SessionManager from './components/SessionManager';
import GroupSessionDisplay from './components/GroupSessionDisplay';
import GroupOrderForm from './components/GroupOrderForm';
import GroupUsersPanel from './components/GroupUsersPanel';
import {
  generateOrderId,
  sendToWhatsApp,
  saveOrderToHistory,
  createGroupSession,
  addUserToSession,
  getGroupSession,
  addItemToGroupCart,
  getGroupSessionItems,
  sendGroupOrderToWhatsApp,
  clearGroupSession,
  subscribeToSession,
} from './utils';

/**
 * Main App Component
 * Manages cart state, order flow, and UI state
 * Supports both solo and group ordering modes
 */
function App() {
  // Mode management
  const [modeSelected, setModeSelected] = useState(false);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [showSessionManager, setShowSessionManager] = useState(true);

  // Group mode state
  const [sessionCode, setSessionCode] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [groupSession, setGroupSession] = useState(null);

  // Solo mode state
  const [cart, setCart] = useState([]);

  // Modal state
  const [showCart, setShowCart] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [lastOrderData, setLastOrderData] = useState(null);

  // Real-time sync for group session data (Firebase)
  useEffect(() => {
    if (isGroupMode && sessionCode) {
      const unsubscribe = subscribeToSession(sessionCode, (sessionData) => {
        setGroupSession(sessionData);
      });

      return () => unsubscribe();
    }
  }, [isGroupMode, sessionCode]);

  // Handle session creation
  const handleCreateSession = async (code) => {
    const userNameInput = document.getElementById('groupUserName')?.value || 'User';
    if (!userNameInput.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      await createGroupSession(code);
      const userId = await addUserToSession(code, userNameInput);
      const session = await getGroupSession(code);

      setSessionCode(code);
      setCurrentUserId(userId);
      setUserName(userNameInput);
      setGroupSession(session);
      setIsGroupMode(true);
      setModeSelected(true);
      setShowSessionManager(false);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session. Please try again.');
    }
  };

  // Handle session joining
  const handleJoinSession = async (code) => {
    const userNameInput = document.getElementById('groupUserName')?.value || 'User';
    if (!userNameInput.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      const session = await getGroupSession(code);
      if (!session) {
        alert('Session not found. Check the code and try again.');
        return;
      }

      const userId = await addUserToSession(code, userNameInput);
      const updatedSession = await getGroupSession(code);

      setSessionCode(code);
      setCurrentUserId(userId);
      setUserName(userNameInput);
      setGroupSession(updatedSession);
      setIsGroupMode(true);
      setModeSelected(true);
      setShowSessionManager(false);
    } catch (error) {
      console.error('Error joining session:', error);
      alert('Failed to join session. Please try again.');
    }
  };

  // Handle solo mode
  const handleContinueSolo = () => {
    setIsGroupMode(false);
    setModeSelected(true);
    setShowSessionManager(false);
  };

  // Handle adding items to cart (solo mode)
  const handleAddToCart = useCallback((product, quantityChange = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.id === product.id);

      if (!existingItem) {
        if (quantityChange > 0) {
          return [
            ...prevCart,
            {
              ...product,
              quantity: quantityChange,
            },
          ];
        }
        return prevCart;
      }

      const newQuantity = existingItem.quantity + quantityChange;

      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== product.id);
      }

      return prevCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }, []);

  // Handle adding items to group cart
  const handleAddToGroupCart = useCallback(async (product, quantityChange = 1) => {
    if (!sessionCode || !currentUserId) {
      alert('Session error: Please refresh and try again');
      return;
    }

    try {
      await addItemToGroupCart(sessionCode, currentUserId, product, quantityChange);
    } catch (error) {
      console.error('Error adding to group cart:', error);
      alert('Failed to update cart. Please try again.');
    }
  }, [sessionCode, currentUserId]);

  // Handle removing item from solo cart
  const handleRemoveItem = useCallback((productId) => {
    setCart((prevCart) =>
      prevCart.filter(item => item.id !== productId)
    );
  }, []);

  // Handle removing item from group cart
  const handleRemoveGroupItem = useCallback(async (productId) => {
    if (!sessionCode || !currentUserId || !groupSession) return;

    try {
      const user = groupSession.users[currentUserId];
      if (!user || !user.items) return;

      const itemsArray = Array.isArray(user.items) ? user.items : Object.values(user.items);
      const item = itemsArray.find(i => i.id === productId);

      if (item) {
        await addItemToGroupCart(sessionCode, currentUserId, item, -item.quantity);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }, [sessionCode, currentUserId, groupSession]);

  // Handle quantity change in solo cart
  const handleQuantityChange = useCallback((productId, change) => {
    setCart((prevCart) => {
      const item = prevCart.find(i => i.id === productId);
      if (!item) return prevCart;

      const newQuantity = item.quantity + change;

      if (newQuantity <= 0) {
        return prevCart.filter(item => item.id !== productId);
      }

      return prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  }, []);

  // Handle quantity change in group cart
  const handleGroupQuantityChange = useCallback(async (productId, change) => {
    if (!sessionCode || !currentUserId || !groupSession) return;

    try {
      const user = groupSession.users[currentUserId];
      if (!user || !user.items) return;

      const itemsArray = Array.isArray(user.items) ? user.items : Object.values(user.items);
      const item = itemsArray.find(i => i.id === productId);

      if (item) {
        await addItemToGroupCart(sessionCode, currentUserId, item, change);
      }
    } catch (error) {
      console.error('Error changing quantity:', error);
    }
  }, [sessionCode, currentUserId, groupSession]);

  // Handle solo order submission
  const handleOrderSubmit = useCallback((orderData) => {
    const orderId = generateOrderId();

    const completeOrderData = {
      ...orderData,
      orderId,
    };

    saveOrderToHistory(completeOrderData);
    setLastOrderData(completeOrderData);
    setShowOrderForm(false);
    setShowOrderSuccess(true);

    setTimeout(() => {
      sendToWhatsApp(completeOrderData);
      setCart([]);
      setModeSelected(false);
      setShowSessionManager(true);
    }, 2000);
  }, []);

  // Handle group order submission
  const handleGroupOrderSubmit = useCallback(async (orderData) => {
    try {
      const orderId = generateOrderId();

      sendGroupOrderToWhatsApp(groupSession, {
        orderId,
        date: orderData.date,
        time: orderData.time,
        whatsappNumber: orderData.whatsappNumber,
      });

      setLastOrderData({
        orderId,
        type: 'group',
        userCount: Object.keys(groupSession.users).length,
      });

      setShowOrderSuccess(true);

      setTimeout(async () => {
        await clearGroupSession(sessionCode);
        setIsGroupMode(false);
        setModeSelected(false);
        setShowSessionManager(true);
        setSessionCode(null);
        setCurrentUserId(null);
        setGroupSession(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting group order:', error);
      alert('Failed to submit order. Please try again.');
    }
  }, [sessionCode, groupSession]);

  // Handle closing order success modal
  const handleCloseOrderSuccess = async () => {
    setShowOrderSuccess(false);
    
    // Reset to dashboard
    if (isGroupMode) {
      // Group mode: clear session and reset
      try {
        await clearGroupSession(sessionCode);
      } catch (error) {
        console.error('Error clearing session:', error);
      }
      setIsGroupMode(false);
      setSessionCode(null);
      setCurrentUserId(null);
      setUserName('');
      setGroupSession(null);
    } else {
      // Solo mode: clear cart
      setCart([]);
    }
    
    // Reset UI and show session manager
    setModeSelected(false);
    setShowOrderSuccess(false);
    setShowOrderForm(false);
    setShowCart(false);
    setShowSessionManager(true);
    setLastOrderData(null);
  };

  // Handle leaving group session
  const handleLeaveSession = async () => {
    if (window.confirm('Are you sure you want to leave this group session?')) {
      try {
        await clearGroupSession(sessionCode);
        setIsGroupMode(false);
        setModeSelected(false);
        setShowSessionManager(true);
        setSessionCode(null);
        setCurrentUserId(null);
        setUserName('');
        setGroupSession(null);
      } catch (error) {
        console.error('Error leaving session:', error);
      }
    }
  };

  // Handle home click
  const handleHomeClick = async () => {
    const confirmHome = window.confirm('Go back to home? (Your current session/cart will be reset)');
    if (confirmHome) {
      try {
        if (sessionCode) {
          await clearGroupSession(sessionCode);
        }
        setSessionCode(null);
        setCurrentUserId(null);
        setUserName('');
        setGroupSession(null);
        setIsGroupMode(false);
        setModeSelected(false);
        setCart([]);
        setShowCart(false);
        setShowOrderForm(false);
        setShowOrderSuccess(false);
        setShowSessionManager(true);
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
  };

  // Get current user's items for product display
  const currentUserItems = useMemo(() => {
    if (isGroupMode && groupSession && currentUserId) {
      const items = groupSession.users?.[currentUserId]?.items || [];
      // Convert Firebase object to array if needed
      return Array.isArray(items) ? items : Object.values(items);
    }
    return cart;
  }, [isGroupMode, groupSession, currentUserId, cart]);

  // Get cart count for header badge
  const cartItemCount = useMemo(() => {
    if (isGroupMode && groupSession && currentUserId) {
      const items = groupSession.users?.[currentUserId]?.items || [];
      // Convert Firebase object to array if needed
      const itemsArray = Array.isArray(items) ? items : Object.values(items);
      return itemsArray.reduce((sum, item) => sum + item.quantity, 0);
    }
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [isGroupMode, groupSession, currentUserId, cart]);

  // Get all items in group session for display
  const allGroupItems = isGroupMode && sessionCode ? getGroupSessionItems(sessionCode) : [];
  const totalGroupItems = allGroupItems.reduce((sum, item) => sum + item.quantity, 0);

  // Get group user count
  const groupUserCount = isGroupMode && groupSession
    ? Object.keys(groupSession.users).length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Session Manager (Initial Choice) */}
      {showSessionManager && !modeSelected && (
        <SessionManager
          onSessionCreate={handleCreateSession}
          onSessionJoin={handleJoinSession}
          onContinueSolo={handleContinueSolo}
          currentMode={isGroupMode ? 'group' : 'solo'}
        />
      )}

      {/* Group Session Display Bar */}
      {isGroupMode && modeSelected && sessionCode && (
        <GroupSessionDisplay
          sessionCode={sessionCode}
          userName={userName}
          userCount={groupUserCount}
          totalItems={totalGroupItems}
          onClose={handleLeaveSession}
          onCheckout={() => setShowOrderForm(true)}
        />
      )}

      {/* Header */}
      <Header
        cartCount={cartItemCount}
        onCartClick={() => setShowCart(!showCart)}
        onHomeClick={handleHomeClick}
        sessionCode={isGroupMode ? sessionCode : null}
        userName={isGroupMode ? userName : null}
      />

      {/* Group Users Panel - Shows all members and their orders */}
      {isGroupMode && modeSelected && groupSession && (
        <GroupUsersPanel
          session={groupSession}
          currentUserId={currentUserId}
        />
      )}

      {/* Main Content */}
      <div className={isGroupMode ? 'pb-72 md:pb-20 md:pr-84 pt-16' : 'pb-20'}>
        {modeSelected && (
          <ProductGrid
            cart={currentUserItems}
            onAddToCart={isGroupMode ? handleAddToGroupCart : handleAddToCart}
          />
        )}
      </div>

      {/* Sticky Cart Summary (Solo mode, desktop) */}
      {!isGroupMode && cart.length > 0 && (
        <div className="hidden md:block fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl p-6 max-w-sm border-2 border-orange-500 animate-slide-in">
          <h3 className="text-lg font-bold text-gray-800 mb-4">🛒 Cart Summary</h3>
          <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.name}</span>
                <span className="font-semibold">₦{(item.quantity * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-3 mb-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-orange-600">
                ₦{cart.reduce((sum, item) => sum + (item.quantity * item.price), 0).toLocaleString()}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setShowCart(false);
              setShowOrderForm(true);
            }}
            className="w-full btn-secondary"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* Cart Modal - Solo Mode */}
      {showCart && !isGroupMode && (
        <Cart
          cart={cart}
          onRemoveItem={handleRemoveItem}
          onQuantityChange={handleQuantityChange}
          onClose={() => {
            setShowCart(false);
            if (cart.length > 0) {
              setShowOrderForm(true);
            }
          }}
        />
      )}

      {/* Cart Modal - Group Mode */}
      {showCart && isGroupMode && (
        <Cart
          cart={currentUserItems}
          onRemoveItem={handleRemoveGroupItem}
          onQuantityChange={handleGroupQuantityChange}
          onClose={() => {
            setShowCart(false);
            if (currentUserItems.length > 0) {
              setShowOrderForm(true);
            }
          }}
        />
      )}

      {/* Solo Order Form Modal */}
      {showOrderForm && !isGroupMode && (
        <OrderForm
          cart={cart}
          onSubmit={handleOrderSubmit}
          onClose={() => setShowOrderForm(false)}
        />
      )}

      {/* Group Order Form Modal */}
      {showOrderForm && isGroupMode && sessionCode && (
        <GroupOrderForm
          sessionCode={sessionCode}
          onSubmit={handleGroupOrderSubmit}
          onClose={() => setShowOrderForm(false)}
        />
      )}

      {/* Order Success Modal */}
      {showOrderSuccess && lastOrderData && (
        <OrderSuccess
          orderData={lastOrderData}
          onClose={handleCloseOrderSuccess}
        />
      )}

      {/* Mobile-only floating action button for solo checkout */}
      <div className={!isGroupMode && cart.length > 0 ? 'md:hidden fixed bottom-6 left-6 right-6 z-40' : 'hidden'}>
        <button
          onClick={() => {
            setShowCart(false);
            setShowOrderForm(true);
          }}
          className="w-full btn-secondary py-4 text-lg font-bold shadow-lg"
        >
          ✅ Checkout Now
        </button>
      </div>
    </div>
  );
}

export default App;
