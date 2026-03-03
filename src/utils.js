import { WHATSAPP_CONFIG } from './config';

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
 * Create a new group ordering session
 * @param {string} sessionCode - Unique session code
 * @returns {Object} Session object
 */
export const createGroupSession = (sessionCode) => {
  const session = {
    code: sessionCode,
    createdAt: new Date().toISOString(),
    users: {},
  };
  localStorage.setItem(`group_session_${sessionCode}`, JSON.stringify(session));
  return session;
};

/**
 * Add user to group session
 * @param {string} sessionCode - Session code
 * @param {string} userName - User's name
 * @returns {boolean} Success status
 */
export const addUserToSession = (sessionCode, userName) => {
  try {
    const sessionKey = `group_session_${sessionCode}`;
    const session = JSON.parse(localStorage.getItem(sessionKey));
    
    if (!session) {
      return false;
    }
    
    // Create user entry
    const userId = Math.random().toString(36).substring(2, 10);
    session.users[userId] = {
      name: userName,
      items: [],
      joinedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(sessionKey, JSON.stringify(session));
    localStorage.setItem('current_user_id', userId);
    localStorage.setItem('current_session_code', sessionCode);
    
    return true;
  } catch (error) {
    console.error('Error adding user to session:', error);
    return false;
  }
};

/**
 * Get group session data
 * @param {string} sessionCode - Session code
 * @returns {Object|null} Session object
 */
export const getGroupSession = (sessionCode) => {
  try {
    const sessionKey = `group_session_${sessionCode}`;
    return JSON.parse(localStorage.getItem(sessionKey));
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
};

/**
 * Add item to group session cart
 * @param {string} sessionCode - Session code
 * @param {string} userId - User ID
 * @param {Object} product - Product to add
 * @param {number} quantity - Quantity
 */
export const addItemToGroupCart = (sessionCode, userId, product, quantity) => {
  try {
    const sessionKey = `group_session_${sessionCode}`;
    const session = JSON.parse(localStorage.getItem(sessionKey));
    
    if (!session || !session.users[userId]) {
      return false;
    }
    
    const existingItem = session.users[userId].items.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      
      if (existingItem.quantity <= 0) {
        session.users[userId].items = session.users[userId].items.filter(
          item => item.id !== product.id
        );
      }
    } else if (quantity > 0) {
      const newItem = {
        ...product,
        quantity,
      };
      session.users[userId].items.push(newItem);
    }
    
    localStorage.setItem(sessionKey, JSON.stringify(session));
    return true;
  } catch (error) {
    console.error('Error adding item to group cart:', error);
    return false;
  }
};

/**
 * Get all items in group session
 * @param {string} sessionCode - Session code
 * @returns {Array} Array of items from all users
 */
export const getGroupSessionItems = (sessionCode) => {
  try {
    const session = getGroupSession(sessionCode);
    if (!session) return [];
    
    const items = [];
    Object.values(session.users).forEach(user => {
      items.push(...user.items);
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
    if (user.items.length > 0) {
      message += `📋 ${user.name}:\n`;
      user.items.forEach(item => {
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
  const encodedMessage = encodeURIComponent(message);
  
  // Use provided phone number or fall back to config
  const phone = orderData.whatsappNumber || WHATSAPP_CONFIG.phone;
  
  const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

/**
 * Clear group session
 * @param {string} sessionCode - Session code
 */
export const clearGroupSession = (sessionCode) => {
  try {
    localStorage.removeItem(`group_session_${sessionCode}`);
    localStorage.removeItem('current_session_code');
    localStorage.removeItem('current_user_id');
    return true;
  } catch (error) {
    console.error('Error clearing session:', error);
    return false;
  }
};
