# FoodShark Setup & Customization Guide

## ✅ Project Setup Complete

Your modern snacks & drinks ordering app is now fully functional and running at `http://localhost:5173`!

## 🎯 What's Included

### Core Features
- ✅ Beautiful responsive UI with orange & green theme
- ✅ Product catalog with 8 items (5 drinks + 3 snacks)
- ✅ Shopping cart system with quantity controls
- ✅ Customer order form with validation
- ✅ Auto-generated Order IDs (SNK-YYYY-XXXX format)
- ✅ WhatsApp integration with pre-filled messages
- ✅ Order history saved to localStorage
- ✅ Mobile-first responsive design
- ✅ Search and category filtering
- ✅ Smooth animations and transitions

## 🚀 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

### 1. Change WhatsApp Number
Edit `src/config.js`:
```javascript
export const WHATSAPP_CONFIG = {
  phone: '2347064700736', // Replace with your WhatsApp number
  messagePrefix: '🛒',
};
```

**Format**: Country code + number without + or spaces
- **Example for Nigeria**: 2347064700736 (from +234 7064700736)
- **Example for US**: 12125551234 (from +1 212-555-1234)

### 2. Add or Remove Products
Edit `src/data/products.js`:

```javascript
{
  id: 'unique_id',
  name: 'Product Name',
  category: 'drinks', // 'drinks' or 'snacks'
  price: 1000,
  image: '🥤', // Emoji or Unicode character
  emoji: true,
  description: 'Short description',
  popular: true, // Optional: shows "⭐ Popular" badge
}
```

### 3. Customize Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#F97316',    // Orange (main color)
      secondary: '#10B981',  // Green (accent color)
      dark: '#1F2937',       // Dark text
      light: '#F9FAFB',      // Light background
    },
  },
},
```

### 4. Change App Name & Currency
Edit `src/config.js`:
```javascript
export const APP_CONFIG = {
  appName: 'FoodShark',
  currency: '₦', // Nigerian Naira (change to $ for USD, € for EUR, etc.)
  currencySymbol: 'NGN', // Currency abbreviation
};
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.jsx          # App header with logo and cart
│   ├── ProductCard.jsx     # Individual product card
│   ├── ProductGrid.jsx     # Products grid with search/filter
│   ├── Cart.jsx            # Shopping cart modal
│   ├── OrderForm.jsx       # Checkout form
│   └── OrderSuccess.jsx    # Success confirmation
├── data/
│   └── products.js         # Product list and helpers
├── App.jsx                 # Main application component
├── config.js               # Configuration (WhatsApp, currency)
├── utils.js                # Helper functions
├── index.css               # Tailwind CSS & custom styles
└── main.jsx                # React entry point
```

## 🎨 Customization Examples

### Add a New Product
```javascript
{
  id: 'bottled_water',
  name: 'Bottled Water',
  category: 'drinks',
  price: 300,
  image: '💧',
  emoji: true,
  description: 'Pure drinking water',
  popular: false,
}
```

### Change Theme Color
In `tailwind.config.js`, change primary color:
```javascript
primary: '#3B82F6', // Blue instead of Orange
```

Then update button colors in components as needed.

### Add More Categories
1. Add category to products: `category: 'desserts'`
2. Update filter buttons in `ProductGrid.jsx`:
```javascript
<button onClick={() => setFilter('desserts')}>
  🍰 Desserts
</button>
```

## 📱 Mobile Testing

### Test on Mobile Devices
1. Open `http://localhost:5173` on your mobile device
2. Replace `localhost` with your computer's IP address
3. Example: `http://192.168.1.100:5173`

### Test WhatsApp Integration
1. Add items to cart
2. Click "Checkout"
3. Enter your name
4. Click "Place Order"
5. WhatsApp will open with pre-filled message

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Build the project
npm run build

# Deploy the 'dist' folder to Netlify
```

### Deploy to Any Static Host
1. Run `npm run build`
2. Upload the `dist` folder to your hosting provider
3. Set up to serve `index.html` for all routes

## 🔐 Important Notes

- **No Backend Required**: App runs entirely client-side
- **WhatsApp Number**: Easy to change in config file
- **Order History**: Saved in browser's localStorage
- **Data Privacy**: Orders only sent when user clicks "Place Order"

## 🎯 Enhancement Ideas

- Add payment integration (Paystack, Flutterwave)
- Implement admin dashboard
- Add order tracking
- Customer reviews/ratings
- Loyalty points system
- Special promotions/discounts
- Email notifications
- Dark mode toggle
- Multi-language support

## 📞 Support & Tips

### If WhatsApp Link Doesn't Work
1. Verify phone number format in `src/config.js`
2. Ensure number includes country code
3. Test phone number on WhatsApp first

### If Products Don't Show
1. Check `src/data/products.js` for syntax errors
2. Ensure all required fields (id, name, category, price, image)
3. Restart dev server: `npm run dev`

### Performance Tips
- Keep product list under 50 items for best performance
- Use emoji or short Unicode for images
- Optimize for mobile-first design

## 📖 Code Quality

### File Commenting
All components and utilities have JSDoc comments explaining:
- Component purpose
- Props/parameters
- Return values
- Usage examples

### Clean Code Practices
- Functional components with React Hooks
- Reusable components
- Separation of concerns
- Clear naming conventions
- Organized folder structure

---

**Your FoodShark app is ready to use!** 🦈

For detailed features and usage, see README.md
