# 🦈 FoodShark - Quick Start Guide

## ✅ Your App is Running!

The development server is running at: **http://localhost:5173**

## 🎯 What You Get

A complete, production-ready snacks & drinks ordering app with:
- Beautiful responsive UI 
- 8 products (drinks & snacks)
- Shopping cart system
- WhatsApp order integration
- Order ID generation
- Order history tracking

## ⚡ Start Using It Now

1. **Open the app**: http://localhost:5173
2. **Browse products**: Scroll and explore drinks & snacks
3. **Add to cart**: Click "Add to Cart" on any item
4. **Adjust quantities**: Use +/- buttons
5. **Checkout**: Click the cart icon or "Checkout Now" button
6. **Enter your name**: Provide customer details
7. **Place order**: Automatically sends to WhatsApp!

## 🔧 Quick Customization (30 seconds)

### Change WhatsApp Number
1. Open: `src/config.js`
2. Find: `phone: '2347064700736'`
3. Replace with your WhatsApp number (with country code, no +)
4. Save - Done! ✅

### Add/Remove Products
1. Open: `src/data/products.js`
2. Add new product object or delete existing
3. Save - Done! ✅

### Change Colors (Orange/Green)
1. Open: `tailwind.config.js`
2. Modify color values in theme section
3. Save - Done! ✅

## 📦 Useful Commands

```bash
# Start dev server (already running)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies (already done)
npm install
```

## 📁 Key Files to Customize

| File | Purpose | What to Change |
|------|---------|-----------------|
| `src/config.js` | Config settings | WhatsApp number, currency |
| `src/data/products.js` | Product list | Add/remove products |
| `tailwind.config.js` | Theme colors | Customize colors |
| `src/components/Header.jsx` | App header | Logo, brand name |
| `index.html` | HTML page | App title, meta tags |

## 🌐 Deploy to Internet

### Option 1: Vercel (Easiest)
```bash
npm install -g vercel
vercel
# Follow the prompts!
```

### Option 2: Netlify
```bash
npm run build
# Drag & drop 'dist' folder to netlify.com
```

### Option 3: Any Hosting
1. Run: `npm run build`
2. Upload `dist` folder to your hosting
3. Done! ✅

## 🧪 Test on Mobile

Open on your phone while on same WiFi:
```
http://YOUR_COMPUTER_IP:5173
```
Example: `http://192.168.1.100:5173`

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| WhatsApp link doesn't open | Check phone number format in `src/config.js` (include country code) |
| Products don't show | Restart server: `npm run dev` |
| Styles look wrong | Clear browser cache (Ctrl+Shift+Delete) |
| Port already in use | Change port: `npm run dev -- --port 3000` |

## 📚 Full Documentation

- **README.md** - Complete feature list and setup
- **CUSTOMIZATION.md** - Detailed customization guide
- **Code Comments** - All components have JSDoc comments

## 🚀 Next Steps

1. ✅ Test the app
2. ✅ Change WhatsApp number to yours
3. ✅ Customize products for your store
4. ✅ Modify colors to match your brand
5. ✅ Deploy to the internet
6. ✅ Share with customers!

## 💡 Pro Tips

- Use emoji for product images (copy from 🔎 emoji picker)
- Test WhatsApp flow on mobile first
- Keep product descriptions short (1-2 lines)
- Mark best sellers as "popular" for highlighted display
- Check order history in browser DevTools > Application > Local Storage

## 🎨 Design Features

- Orange & Green gradient theme
- Smooth hover animations
- Mobile-first responsive layout
- Cart counter badge
- Order ID generation (SNK-YYYY-XXXX)
- Success popup before WhatsApp sends
- Sticky cart summary on desktop
- Search and filter functionality

## 📊 Built-in Features

✅ Cart management  
✅ Product search  
✅ Category filtering  
✅ Order validation  
✅ WhatsApp integration  
✅ Order history (localStorage)  
✅ Responsive design  
✅ Smooth animations  
✅ Order confirmation  
✅ Date/time capture  

---

**That's it!** Your FoodShark is ready to go. 🦈

Questions? Check README.md or CUSTOMIZATION.md for more details!
