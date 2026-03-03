# 🦈 FoodShark - Architecture & Code Flow Guide

## 📊 Application Architecture

```
┌─────────────────────────────────────────────┐
│         App.jsx (Main Component)            │
│    - Manages all app state                  │
│    - Handles cart operations                │
│    - Coordinates between screens            │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┼──────────┬──────────────┐
        │          │          │              │
        ▼          ▼          ▼              ▼
     Header    ProductGrid   Cart      OrderForm
     ┌────┐    ┌────────┐   ┌──┐     ┌────────┐
     │ 🦈 │    │📦📦📦│   │  │    │Customer│
     └────┘    └────────┘   └──┘     │  Form  │
                   │                  └────────┘
                   ▼                      │
            ProductCard                   ▼
            ┌────────────┐         OrderSuccess
            │Product Info│         ┌──────────┐
            │ + Controls │         │✅Success │
            └────────────┘         │ + WhatsApp
                                   └──────────┘
```

## 🔄 Application Flow

### 1. **Initial Load**
```
index.html
    ↓
main.jsx (React entry point)
    ↓
App.jsx (State initialization)
    ↓
Header + ProductGrid (Display products)
```

### 2. **User Adds Item to Cart**
```
ProductCard.onClick("Add to Cart")
    ↓
App.handleAddToCart(product)
    ↓
setCart(newCartArray)
    ↓
UI Updates (ProductCard shows quantity controls)
    ↓
Header updates cart counter
```

### 3. **User Clicks Cart**
```
Header.onClick(cart icon)
    ↓
App.setShowCart(true)
    ↓
Cart Modal Opens
    ↓
User can adjust quantities or proceed
```

### 4. **User Clicks "Checkout"**
```
Cart.onClick("Proceed to Checkout")
    ↓
App.setShowCart(false)
App.setShowOrderForm(true)
    ↓
OrderForm Modal Opens
    ↓
User enters name
```

### 5. **User Submits Order**
```
OrderForm.handleSubmit()
    ↓
App.handleOrderSubmit()
    ↓
generateOrderId() [SNK-YYYY-XXXX]
    ↓
saveOrderToHistory() [localStorage]
    ↓
setShowOrderSuccess(true)
    ↓
App shows success modal (5 second auto-close)
    ↓
After 2 seconds: sendToWhatsApp(orderData)
    ↓
WhatsApp opens with pre-filled message
    ↓
setCart([]) - Clear cart
```

---

## 💾 State Management (in App.jsx)

```javascript
const [cart, setCart] = useState([]);                    // Cart items array
const [showCart, setShowCart] = useState(false);         // Cart modal visibility
const [showOrderForm, setShowOrderForm] = useState(false); // Order form visibility
const [showOrderSuccess, setShowOrderSuccess] = useState(false); // Success modal
const [lastOrderData, setLastOrderData] = useState(null); // Last order details
```

### State Structure

```javascript
// cartItem structure
{
  id: 'fanta',
  name: 'Fanta',
  category: 'drinks',
  price: 500,
  image: '🥤',
  quantity: 2,  // Added by cart system
}

// orderData structure
{
  orderId: 'SNK-2026-1234',
  customerName: 'John Doe',
  items: [...cartItems],
  total: 5500,
  date: '03/03/2026',
  time: '2:45 PM',
  timestamp: '2026-03-03T14:45:00Z' // localStorage only
}
```

---

## 📁 File & Function Reference

### Core Components

#### `App.jsx` (Main Container)
- **handleAddToCart(product, quantityChange)** - Manages cart operations
- **handleRemoveItem(productId)** - Removes item from cart
- **handleQuantityChange(productId, changeAmount)** - Updates quantity
- **handleOrderSubmit(orderData)** - Processes order submission
- **handleCloseOrderSuccess()** - Closes success modal

#### `Header.jsx` (Navigation)
- Displays app logo/title
- Shows cart counter badge
- Triggers cart modal

#### `ProductCard.jsx` (Product Display)
- Shows product image/emoji
- Displays price with currency
- Shows description
- Handles quantity controls
- Popular badge display

#### `ProductGrid.jsx` (Product List)
- Displays all products
- Search functionality
- Category filtering (All/Drinks/Snacks)
- Grid layout (responsive)

#### `Cart.jsx` (Cart Modal)
- Lists cart items
- Quantity controls
- Shows subtotal
- Checkout button
- Remove item button

#### `OrderForm.jsx` (Checkout)
- Customer name input
- Shows order summary
- Displays items with prices
- Date & time information
- Total amount
- Submit button

#### `OrderSuccess.jsx` (Confirmation)
- Shows Order ID
- Displays order summary
- Auto-closes after 5 seconds
- Triggers WhatsApp send

### Data & Configuration

#### `products.js` (Product Data)
- Product list array
- `getProductsByCategory(category)` - Filter by category
- `getProductById(id)` - Get single product

#### `config.js` (Configuration)
- `WHATSAPP_CONFIG` - WhatsApp settings
- `APP_CONFIG` - App settings (currency, name)

#### `utils.js` (Helper Functions)
- `generateOrderId()` - Creates SNK-YYYY-XXXX format
- `calculateTotal(items)` - Sum of all items
- `formatDate(date)` - DD/MM/YYYY format
- `formatTime(date)` - HH:MM AM/PM format
- `formatItemsForMessage(items)` - Format for WhatsApp
- `createWhatsappMessage(orderData)` - Build full message
- `sendToWhatsApp(orderData)` - Opens WhatsApp
- `saveOrderToHistory(orderData)` - Save to localStorage
- `getOrderHistory()` - Retrieve from localStorage

---

## 🔌 Component Props & APIs

### Header Props
```javascript
<Header 
  cartCount={number}              // Number of items in cart
  onCartClick={function}          // Callback when cart clicked
/>
```

### ProductCard Props
```javascript
<ProductCard 
  product={object}                // Product object
  onAddToCart={function}          // Callback for add/update/remove
  cartItem={object|null}          // Current cart item if exists
/>
```

### ProductGrid Props
```javascript
<ProductGrid 
  cart={array}                    // Current cart items
  onAddToCart={function}          // Callback for cart changes
/>
```

### Cart Props
```javascript
<Cart 
  cart={array}                    // Cart items
  onRemoveItem={function}         // Remove item callback
  onQuantityChange={function}     // Quantity change callback
  onClose={function}              // Close modal callback
/>
```

### OrderForm Props
```javascript
<OrderForm 
  cart={array}                    // Cart items
  onSubmit={function}             // Submit callback
  onClose={function}              // Close modal callback
/>
```

### OrderSuccess Props
```javascript
<OrderSuccess 
  orderData={object}              // Order details
  onClose={function}              // Close callback
/>
```

---

## 🎯 Key Algorithms

### Add to Cart Logic
```javascript
if item exists in cart:
  update quantity
  if quantity <= 0:
    remove item
else if quantityChange > 0:
  add item with quantity
```

### Order ID Generation
```javascript
const year = current year
const randomNum = random 0-9999 padded to 4 digits
return "SNK-" + year + "-" + randomNum
```

### WhatsApp Message Building
```javascript
Format:
🛒 New Snack Order

Order ID: [id]
Name: [customer name]

Items:
[formatted items list]

Total: ₦[formatted total]

Date: [formatted date]
Time: [formatted time]

Then URL encode and append to:
https://wa.me/[phone]?text=[encoded message]
```

---

## 🌍 WeatherWhatsApp Integration Details

### WhatsApp Click-to-Chat Format
```
https://wa.me/{phone_number}?text={url_encoded_message}

Components:
- phone_number: Country code + number (no + or spaces)
  Example: 2347064700736
  
- message: Pre-filled message text
  Must be URL encoded
```

### Message Flow
```javascript
1. User submits order
2. System generates Order ID
3. System creates formatted message
4. Message is URL encoded
5. WhatsApp URL is generated
6. window.open(url) opens WhatsApp
7. User sends message manually (app doesn't send)
8. Order saved to localStorage
```

---

## 📦 localStorage Schema

### Key: `orderHistory`
```javascript
[
  {
    orderId: 'SNK-2026-1234',
    customerName: 'John Doe',
    items: [...],
    total: 5500,
    date: '03/03/2026',
    time: '2:45 PM',
    timestamp: '2026-03-03T14:45:00Z'
  },
  // More orders...
]
```

### How to Access
```javascript
// Get history
const history = JSON.parse(localStorage.getItem('orderHistory')) || [];

// Add order
const orders = JSON.parse(localStorage.getItem('orderHistory')) || [];
orders.push(newOrder);
localStorage.setItem('orderHistory', JSON.stringify(orders));

// Clear history
localStorage.removeItem('orderHistory');
```

---

## 🎨 Styling Architecture

### Tailwind CSS Framework
- Utility-first CSS approach
- Custom theme in `tailwind.config.js`
- Responsive classes (sm:, md:, lg:)
- Custom animations in `index.css`

### Key Custom Classes
- `.card` - Product card styling
- `.btn-primary` - Orange gradient button
- `.btn-secondary` - Green button
- `.animate-slide-in` - Modal animation

### Color System
```javascript
primary: '#F97316'    // Orange - Main color
secondary: '#10B981'  // Green - Accent color
dark: '#1F2937'       // Dark - Text color
light: '#F9FAFB'      // Light - Background color
```

---

## 🔄 Responsive Breakpoints

```javascript
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

---

## 🚀 Performance Optimizations

1. **Code Splitting** - Vite handles automatically
2. **Lazy Loading** - Images are instants
3. **memoization** - useCallback prevents unnecessary renders
4. **CSS Optimization** - Tailwind purges unused styles
5. **Bundle Size** - ~150KB gzipped
6. **Caching** - Browser caches static assets

---

## 📱 Mobile Optimizations

- Touch-friendly button sizes (44px minimum)
- Optimized viewport settings
- Mobile-optimized checkout flow
- Bottom-aligned action buttons
- Stacked layout for small screens
- No horizontal scroll

---

## 🔒 Security Considerations

1. **No Backend Required** - All processing client-side
2. **No Data Collection** - Data stays local
3. **localStorage Only** - Order history in browser only
4. **WhatsApp API** - Only URL parameters, no API key
5. **Input Validation** - Form inputs validated
6. **XSS Protection** - React escapes content by default

---

## 📊 Testing Checklist

- [ ] Add product to cart
- [ ] Adjust quantity
- [ ] Remove from cart
- [ ] Search products
- [ ] Filter by category
- [ ] View cart summary
- [ ] Proceed to checkout
- [ ] Enter customer name
- [ ] Submit order
- [ ] See order ID
- [ ] WhatsApp message opens
- [ ] Check localStorage order history
- [ ] Test on mobile device
- [ ] Test on tablet
- [ ] Test on desktop
- [ ] Try all products
- [ ] Clear cart
- [ ] Empty cart state

---

## 🎯 Debugging Tips

### Check App State
```javascript
// In browser console
Open DevTools > Application > Local Storage
Look for 'orderHistory' key to see past orders
```

### Check Component Renders
```javascript
// React DevTools (install extension)
Shows component tree and state changes
```

### Check Network Calls
```javascript
// DevTools > Network tab
Should only see WhatsApp requests (external)
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| No products showing | Check products.js syntax |
| Cart doesn't update | Refresh page, check console |
| WhatsApp doesn't open | Verify phone number format |
| Styles broken | Clear cache, restart dev server |
| Buttons not responding | Check browser console for errors |

---

**Happy Coding! 🚀**

This guide covers the complete architecture and code flow of FoodShark.
