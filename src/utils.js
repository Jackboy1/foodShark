import { WHATSAPP_CONFIG } from './config';
import { database } from './firebase';
import { ref, set, get, update, onValue, off, remove } from 'firebase/database';

/**
 * Generate a unique Order ID in the format: SNK-YYYY-XXXX
 * Example: SNK-2026-4832
 */
export const generateOrderId = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `SNK-${year}-${randomNum}`;
};

/**
 * Format items for display in messages
 * @param {Array} items - Array of cart items with {name, quantity, price}
 * @returns {string} Formatted items string
 */
export const formatItemsForMessage = (items) => {
  return items
    .map(item => `- ${item.quantity}x ${item.name}`)
    .join('\n');
};

/**
 * Calculate total price from items
 * @param {Array} items - Array of cart items with {quantity, price}
 * @returns {number} Total price
 */
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
};

/**
 * Format date to readable format
 * @param {Date} date - Date object
 * @returns {string} Formatted date (DD/MM/YYYY)
 */
export const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Format time to readable format
 * @param {Date} date - Date object
 * @returns {string} Formatted time (HH:MM AM/PM)
 */
export const formatTime = (date) => {
  const options = { hour: '2-digit', minute: '2-digit', hour12: true };
  return date.toLocaleTimeString('en-US', options);
};

/**
 * Create WhatsApp message from order details
 * @param {Object} orderData - {orderId, customerName, items, total, date, time}
 * @returns {string} Formatted WhatsApp message
 */
export const createWhatsappMessage = (orderData) => {
  const { orderId, customerName, items, total, date, time } = orderData;
  
  const itemsList = formatItemsForMessage(items);
  
  const message = `🛒 New Snack Order

Order ID: ${orderId}
Name: ${customerName}

Items:
${itemsList}

Total: ₦${total.toLocaleString()}

Date: ${date}
Time: ${time}`;

  return message;
};

/**
 * Send order to WhatsApp
 * Opens WhatsApp with pre-filled message using click-to-chat format
 * @param {Object} orderData - {orderId, customerName, items, total, date, time, whatsappNumber}
 */
export const sendToWhatsApp = (orderData) => {
  const message = createWhatsappMessage(orderData);
  
  // URL encode the message for WhatsApp
  const encodedMessage = encodeURIComponent(message);
  
  // Use provided phone number or fall back to config
  const phone = orderData.whatsappNumber || WHATSAPP_CONFIG.phone;
  
  // WhatsApp Click-to-Chat URL format
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new window/tab
  window.open(whatsappUrl, '_blank');
};

/**
 * Save order to localStorage for history
 * @param {Object} orderData - Order data to save
 */
export const saveOrderToHistory = (orderData) => {
  try {
    const existingOrders = JSON.parse(localStorage.getItem('orderHistory')) || [];
    existingOrders.push({
      ...orderData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('orderHistory', JSON.stringify(existingOrders));
  } catch (error) {
    console.error('Error saving order to history:', error);
  }
};

/**
 * Get order history from localStorage
 * @returns {Array} Array of previous orders
 */
export const getOrderHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('orderHistory')) || [];
  } catch (error) {
    console.error('Error retrieving order history:', error);
    return [];
  }
};

/**
 * Create a new group ordering session (Firebase)
 * @param {string} sessionCode - Unique session code
 * @returns {Promise<Object>} Session object
 */
export const createGroupSession = async (sessionCode) => {
  try {
    const session = {
      code: sessionCode,
      createdAt: new Date().toISOString(),
      users: {},
    };
    
    const sessionRef = ref(database, `sessions/${sessionCode}`);
    await set(sessionRef, session);
    
    return session;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

/**
 * Add user to group session (Firebase)
 * @param {string} sessionCode - Session code
 * @param {string} userName - User's name
 * @returns {Promise<string>} User ID
 */
export const addUserToSession = async (sessionCode, userName) => {
  try {
    const sessionRef = ref(database, `sessions/${sessionCode}`);
    const snapshot = await get(sessionRef);
    
    if (!snapshot.exists()) {
      throw new Error('Session not found');
    }
    
    // Create user entry
    const userId = Math.random().toString(36).substring(2, 10);
    const userRef = ref(database, `sessions/${sessionCode}/users/${userId}`);
    
    await set(userRef, {
      name: userName,
      items: [],
      joinedAt: new Date().toISOString(),
    });
    
    // Store locally for quick access
    localStorage.setItem('current_user_id', userId);
    localStorage.setItem('current_session_code', sessionCode);
    
    return userId;
  } catch (error) {
    console.error('Error adding user to session:', error);
    throw error;
  }
};

/**
 * Get group session data (Firebase)
 * @param {string} sessionCode - Session code
 * @returns {Promise<Object|null>} Session object
 */
export const getGroupSession = async (sessionCode) => {
  try {
    const sessionRef = ref(database, `sessions/${sessionCode}`);
    const snapshot = await get(sessionRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

/**
 * Subscribe to real-time session updates (Firebase)
 * @param {string} sessionCode - Session code
 * @param {Function} callback - Callback function to receive updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToSession = (sessionCode, callback) => {
  const sessionRef = ref(database, `sessions/${sessionCode}`);
  
  onValue(sessionRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error subscribing to session:', error);
    callback(null);
  });
  
  // Return unsubscribe function
  return () => off(sessionRef);
};

/**
 * Add item to group session cart (Firebase)
 * @param {string} sessionCode - Session code
 * @param {string} userId - User ID
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity change
 */
export const addItemToGroupCart = async (sessionCode, userId, product, quantity) => {
  try {
    const userItemsRef = ref(database, `sessions/${sessionCode}/users/${userId}/items`);
    const snapshot = await get(userItemsRef);
    
    let items = [];
    if (snapshot.exists()) {
      items = Object.entries(snapshot.val()).map(([key, value]) => ({ key, ...value }));
    }
    
    const existingItemIndex = items.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      const existingItem = items[existingItemIndex];
      existingItem.quantity += quantity;
      
      if (existingItem.quantity <= 0) {
        // Remove item
        const itemRef = ref(database, `sessions/${sessionCode}/users/${userId}/items/${existingItem.key}`);
        await remove(itemRef);
      } else {
        // Update quantity
        const itemRef = ref(database, `sessions/${sessionCode}/users/${userId}/items/${existingItem.key}`);
        await update(itemRef, { quantity: existingItem.quantity });
      }
    } else if (quantity > 0) {
      // Add new item
      const newItemRef = ref(database, `sessions/${sessionCode}/users/${userId}/items/${product.id}`);
      await set(newItemRef, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error adding item to group cart:', error);
    return false;
  }
};

/**
 * Get all items in group session
 * @param {Object} session - Session object
 * @returns {Array} Array of items from all users
 */
export const getGroupSessionItems = (session) => {
  try {
    if (!session || !session.users) return [];
    
    const items = [];
    Object.values(session.users).forEach(user => {
      if (user.items) {
        const userItems = Object.values(user.items);
        items.push(...userItems);
      }
    });
    return items;
  } catch (error) {
    console.error('Error getting group items:', error);
    return [];
  }
};

/**
 * Create group order message
 * @param {Object} session - Group session object
 * @param {string} orderId - Order ID
 * @param {Object} orderData - Additional order data (total, date, time)
 * @returns {string} Formatted WhatsApp message
 */
export const createGroupWhatsappMessage = (session, orderId, orderData) => {
  let message = `🛒 Group Order - ${orderId}\n\n`;
  message += `👥 Order from ${Object.keys(session.users).length} ${Object.keys(session.users).length === 1 ? 'person' : 'people'}\n\n`;
  
  let totalAmount = 0;
  
  // Add items by user
  Object.entries(session.users).forEach(([userId, user]) => {
    // Convert Firebase object to array if needed
    const userItems = Array.isArray(user.items) ? user.items : (user.items ? Object.values(user.items) : []);
    
    if (userItems.length > 0) {
      message += `📋 ${user.name}:\n`;
      userItems.forEach(item => {
        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;
        message += `  • ${item.quantity}x ${item.name} (₦${itemTotal.toLocaleString()})\n`;
      });
      message += '\n';
    }
  });
  
  message += `━━━━━━━━━━━━━━━━━\n`;
  message += `💰 Total: ₦${totalAmount.toLocaleString()}\n`;
  message += `📅 Date: ${orderData.date}\n`;
  message += `🕒 Time: ${orderData.time}\n`;
  
  return message;
};

/**
 * Send group order to WhatsApp
 * @param {Object} session - Group session object
 * @param {Object} orderData - Order data (orderId, date, time, whatsappNumber)
 */
export const sendGroupOrderToWhatsApp = (session, orderData) => {
  const message = createGroupWhatsappMessage(session, orderData.orderId, orderData);
  
  // URL encode the message for WhatsApp
  const encodedMessage = encodeURIComponent(message);
  
  // Use provided phone number
  const phone = orderData.whatsappNumber;
  
  // WhatsApp Click-to-Chat URL format
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new window/tab
  window.open(whatsappUrl, '_blank');
};

/**
 * Clear group session (Firebase)
 * @param {string} sessionCode - Session code
 */
export const clearGroupSession = async (sessionCode) => {
  try {
    // Remove from Firebase
    const sessionRef = ref(database, `sessions/${sessionCode}`);
    await remove(sessionRef);
    
    // Clear local storage
    localStorage.removeItem('current_session_code');
    localStorage.removeItem('current_user_id');
    
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};
