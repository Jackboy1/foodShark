# FoodShark 🦈 - Snacks & Drinks Ordering App

A modern, clean, and responsive web application for ordering snacks and drinks with WhatsApp integration.

## 🎯 Features

### ✨ Beautiful UI/UX
- **Premium Design**: Modern, clean interface with smooth animations
- **Responsive Layout**: Mobile-first design that works on all devices
- **Color Scheme**: Orange & Green theme with gradient elements
- **Smooth Transitions**: Hover effects, animations, and transitions

### 🛒 Shopping Cart System
- Add/remove items from cart
- Adjust quantities with + / - buttons
- Real-time cart updates
- Cart item counter in header
- Sticky cart summary on desktop
- Empty cart validation

### 📦 Product Management
- 8 Products: 5 Drinks + 3 Snacks
- Product images/emojis
- Product descriptions
- Price display with currency formatting
- Popular item badges
- Search functionality
- Category filtering (Drinks/Snacks)

### 📱 Order Management
- Customer name input
- Auto-generated Order IDs in format: `SNK-YYYY-XXXX`
- Order summary with date & time
- Real-time total calculation
- Order success confirmation

### 💬 WhatsApp Integration
- Click-to-chat WhatsApp integration
- Pre-filled order message with:
  - Order ID
  - Customer name
  - Detailed items list
  - Total price
  - Date & time
- Works on both mobile and desktop
- Easily configurable WhatsApp number

### 📊 Extra Features
- Order history saved in localStorage
- Loading animations
- Success popup before WhatsApp redirect
- Form validation
- Smooth modal transitions

## 🛠️ Tech Stack

- **Frontend**: React.js (Functional Components with Hooks)
- **Styling**: Tailwind CSS
- **State Management**: React useState Hook
- **Build Tool**: Vite
- **Integration**: WhatsApp Click-to-Chat API

## 📋 Products Included

### Drinks (🥤)
- **Fanta** - ₦500
- **Sprite** - ₦500
- **Coke** - ₦500
- **Orange Juice** - ₦800
- **Nescafé Coffee** - ₦1,000

### Snacks (🍪)
- **Coaster Biscuit** - ₦300
- **Chocolate Biscuit** - ₦400
- **Chin Chin** - ₦600

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd foodShark
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure WhatsApp Number**
   Edit `src/config.js` and update the WhatsApp phone number:
   ```javascript
   export const WHATSAPP_CONFIG = {
     phone: 'YOUR_PHONE_NUMBER', // e.g., '2347064700736'
   };
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Preview production build**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
foodShark/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # App header with cart counter
│   │   ├── ProductCard.jsx      # Individual product display
│   │   ├── ProductGrid.jsx      # Products grid with filter & search
│   │   ├── Cart.jsx             # Shopping cart modal
│   │   ├── OrderForm.jsx        # Order checkout form
│   │   └── OrderSuccess.jsx     # Order success confirmation
│   ├── data/
│   │   └── products.js          # Product data & helpers
│   ├── App.jsx                  # Main app component
│   ├── index.css                # Tailwind & custom styles
│   ├── main.jsx                 # React entry point
│   ├── config.js                # Configuration (WhatsApp, etc)
│   └── utils.js                 # Utility functions
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
└── README.md                    # This file
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#F97316',      // Orange
      secondary: '#10B981',    // Green
      dark: '#1F2937',         // Dark
      light: '#F9FAFB',        // Light
    },
  },
},
```

### Change WhatsApp Number
Edit `src/config.js`:
```javascript
export const WHATSAPP_CONFIG = {
  phone: '2347064700736', // Your WhatsApp number
};
```

### Add/Remove Products
Edit `src/data/products.js`:
```javascript
{
  id: 'unique_id',
  name: 'Product Name',
  category: 'drinks', // or 'snacks'
  price: 500,
  image: '🥤',
  emoji: true,
  description: 'Product description',
  popular: true, // Optional
}
```

### Customize App Name/Currency
Edit `src/config.js`:
```javascript
export const APP_CONFIG = {
  appName: 'FoodShark',
  currency: '₦',
  currencySymbol: 'NGN',
};
```

## 💻 Usage

1. **Browse Products**: Scroll through available drinks and snacks
2. **Filter Products**: Use category buttons to filter by Drinks or Snacks
3. **Search Products**: Use the search bar to find specific items
4. **Add to Cart**: Click "Add to Cart" on any product
5. **Adjust Quantity**: Use +/- buttons to change quantities
6. **View Cart**: Click the cart icon in the header
7. **Checkout**: Click "Proceed to Checkout"
8. **Enter Name**: Provide your name for the order
9. **Place Order**: Click "Place Order" to send to WhatsApp
10. **Confirm**: WhatsApp opens with your pre-filled order

## 🔐 Security & Configuration

- **WhatsApp Number**: Only changeable in `src/config.js` - easily configurable
- **Local Storage**: Orders are saved locally in your browser
- **No Backend**: Application runs entirely client-side
- **Data Privacy**: Order data is only sent when user clicks "Place Order"

## 📱 Responsive Design

- **Mobile**: Optimized for phones with touch controls
- **Tablet**: Perfect layout for tablet devices
- **Desktop**: Enhanced features like sticky cart summary
- **All Screen Sizes**: Flexible grid and responsive components

## ⚡ Performance

- Fast page loads with Vite
- Optimized React components
- CSS-in-JS with Tailwind (utility-first)
- Minimal bundle size
- No external API calls (except WhatsApp)

## 🐛 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Android)

## 📦 Dependencies

- **react**: ^18.2.0 - React library
- **react-dom**: ^18.2.0 - React DOM binding
- **tailwindcss**: ^3.4.1 - Utility CSS framework
- **vite**: ^5.0.8 - Build tool
- **@vitejs/plugin-react**: ^4.2.1 - Vite React plugin

## 🤝 Contributing

Feel free to customize and extend this application:
- Add more products
- Customize colors and fonts
- Add payment integration
- Implement order history view
- Add admin dashboard

## 📄 License

This project is free to use and modify.

## 🎯 Next Steps

1. Set your WhatsApp business number in `src/config.js`
2. Customize product list in `src/data/products.js`
3. Modify colors and branding as needed
4. Deploy to your preferred hosting (Vercel, Netlify, etc.)
5. Share the link with customers

---

**Made with ❤️ by FoodShark** 🦈
