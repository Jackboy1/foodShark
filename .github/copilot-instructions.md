<!-- FoodShark - Snacks & Drinks Ordering App -->

## Project Overview
FoodShark is a modern, responsive React web application for ordering snacks and drinks with WhatsApp integration. Built with React.js, Vite, and Tailwind CSS.

## Key Technologies
- **Frontend**: React 18.2 (Functional Components with Hooks)
- **Build Tool**: Vite 5.0
- **Styling**: Tailwind CSS 3.4
- **State Management**: React useState Hook
- **Integration**: WhatsApp Click-to-Chat API

## Project Structure
```
src/
├── components/          # Reusable React components
├── data/               # Product data and utilities
├── App.jsx             # Main application component
├── config.js           # Configuration (WhatsApp, currency)
├── utils.js            # Helper functions
├── index.css           # Tailwind & custom styles
└── main.jsx            # React entry point
```

## Features Implemented
- ✅ Product catalog (8 products: 5 drinks + 3 snacks)
- ✅ Shopping cart with quantity controls
- ✅ Customer order form with validation
- ✅ Auto-generated Order IDs (SNK-YYYY-XXXX)
- ✅ WhatsApp integration with pre-filled messages
- ✅ Order history in localStorage
- ✅ Search and category filtering
- ✅ Responsive design (mobile-first)
- ✅ Smooth animations and transitions
- ✅ Success confirmation modal

## Quick Start Commands
- Development: `npm run dev` (http://localhost:5173)
- Build: `npm run build`
- Preview: `npm run preview`

## Configuration
1. **WhatsApp Number**: Edit `src/config.js` - change `WHATSAPP_CONFIG.phone`
2. **Products**: Edit `src/data/products.js` - add/remove products
3. **Colors**: Edit `tailwind.config.js` - customize theme
4. **Currency**: Edit `src/config.js` - change APP_CONFIG

## Component Breakdown
- **Header**: Logo, app name, cart counter with badge
- **ProductCard**: Individual product with image, price, quantity controls
- **ProductGrid**: Grid view with search and category filtering
- **Cart**: Modal showing cart items and summary
- **OrderForm**: Customer details and order review
- **OrderSuccess**: Confirmation before WhatsApp redirect
- **App**: Main component managing all state and logic

## State Management
- Cart items stored in state: `cart` array
- Modal visibility: `showCart`, `showOrderForm`, `showOrderSuccess`
- Order data: `lastOrderData` for success message
- All managed with `useState` hooks

## WhatsApp Integration
- Format: `https://wa.me/{phone}?text={encodedMessage}`
- Message includes: Order ID, customer name, items, total, date, time
- Easily configurable phone number in config file
- Works on both mobile and desktop

## Important Notes
- No backend required - runs entirely client-side
- Orders saved to localStorage for history
- Data only sent when user initiates WhatsApp message
- All components use Tailwind CSS utility classes
- Fully responsive with mobile-first approach

## For Modifications
When making changes, ensure:
1. Components remain reusable and focused
2. Maintain consistent folder structure
3. Update JSDoc comments when changing functions
4. Test responsive design on multiple screen sizes
5. Keep animation smooth with Tailwind transitions
6. Validate all form inputs before submission

## Production Ready
- Optimized build with Vite
- Minimal bundle size
- Fast page loads
- SEO-friendly HTML structure
- Mobile-friendly responsive design
