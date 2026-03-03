# 🚀 FoodShark Deployment Guide for Netlify

## Prerequisites Checklist

**Before deploying, ensure you've completed:**
- ✅ Firebase project created
- ✅ Firebase Realtime Database enabled
- ✅ Firebase credentials added to `src/firebase.js`
- ✅ App tested locally with multi-device session sync
- ✅ Git repository initialized and code committed

---

## Step 1: Complete Firebase Setup

### 1.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Name it: `foodshark-app` (or your preferred name)
4. Disable Google Analytics (optional, not needed for this app)
5. Click "Create project"

### 1.2 Enable Realtime Database
1. In Firebase Console sidebar → Click "Realtime Database"
2. Click "Create Database"
3. Choose location: **United States** (us-central1) or nearest to your users
4. Start in **Test mode** (for initial development)
5. Click "Enable"

### 1.3 Configure Database Rules (Important!)

**For Development/Testing:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```
⚠️ Warning: This allows anyone to read/write. Only use during testing!

**For Production (Recommended):**
```json
{
  "rules": {
    "sessions": {
      "$sessionCode": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['code', 'createdAt', 'users'])",
        "users": {
          "$userId": {
            ".validate": "newData.hasChildren(['name', 'items', 'joinedAt'])"
          }
        }
      }
    }
  }
}
```

**Paste rules:**
1. In Realtime Database → Click "Rules" tab
2. Replace default rules with your chosen ruleset
3. Click "Publish"

### 1.4 Get Your Firebase Config Credentials
1. Click the **⚙️ Settings icon** (top-left) → "Project settings"
2. Scroll down to "Your apps" section
3. Click **</>** (Web platform icon)
4. Register app:
   - App nickname: `FoodShark Web`
   - Firebase Hosting: **No** (we're using Netlify)
   - Click "Register app"
5. Copy the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "foodshark-app.firebaseapp.com",
  databaseURL: "https://foodshark-app-default-rtdb.firebaseio.com",
  projectId: "foodshark-app",
  storageBucket: "foodshark-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

6. **Paste into `src/firebase.js`** (replace placeholder values)
7. **Save the file**
8. **Commit to Git:**
   ```bash
   git add src/firebase.js
   git commit -m "Add Firebase production credentials"
   ```

---

## Step 2: Test Firebase Locally

Before deploying, verify Firebase works:

### 2.1 Start Dev Server
```bash
npm run dev
```

### 2.2 Test Multi-Device Sync
1. Open app in **Browser 1** (Chrome): `http://localhost:5174`
2. Create group session with code: `TEST01`
3. Open app in **Browser 2** (Firefox/Edge): `http://localhost:5174`
4. Join session with code: `TEST01`
5. **Add items in Browser 1** → Should appear in Browser 2 instantly
6. **Add items in Browser 2** → Should appear in Browser 1 instantly

### 2.3 Check Firebase Console
1. Go to Firebase Console → Realtime Database → Data tab
2. You should see structure like:
```
sessions/
  └── TEST01/
      ├── code: "TEST01"
      ├── createdAt: "2024-01-15T10:30:00.000Z"
      └── users/
          ├── abc123/
          │   ├── name: "John"
          │   ├── items/
          │   │   └── 1: { id: 1, name: "Coke", quantity: 2, ... }
          │   └── joinedAt: "2024-01-15T10:30:05.000Z"
          └── def456/
              ├── name: "Sarah"
              ├── items/
              │   └── 3: { id: 3, name: "Pizza", quantity: 1, ... }
              └── joinedAt: "2024-01-15T10:31:10.000Z"
```

3. **If you see this structure** → Firebase is working correctly! ✅
4. **If data doesn't appear** → Check browser console for errors

---

## Step 3: Prepare for Deployment

### 3.1 Build the App Locally (Test)
```bash
npm run build
```

**Expected output:**
```
✓ 234 modules transformed.
dist/index.html                   0.45 kB │ gzip:  0.30 kB
dist/assets/index-abc123.css     45.67 kB │ gzip: 12.34 kB
dist/assets/index-def456.js     142.89 kB │ gzip: 48.56 kB
✓ built in 3.21s
```

If errors occur, fix them before deploying.

### 3.2 Preview Production Build
```bash
npm run preview
```

Open `http://localhost:4173` and test:
- ✅ Solo ordering flow (cart → form → WhatsApp)
- ✅ Group session creation
- ✅ Group session joining
- ✅ Multi-browser item sync
- ✅ Checkout flows

---

## Step 4: Deploy to Netlify

### Option A: Deploy via GitHub (Recommended)

#### 4.1 Push to GitHub
```bash
# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit with Firebase integration"

# Create GitHub repo at https://github.com/new
# Name: foodshark-app (or your choice)

# Link and push
git remote add origin https://github.com/YOUR_USERNAME/foodshark-app.git
git branch -M main
git push -u origin main
```

#### 4.2 Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → Authorize Netlify
4. Select `foodshark-app` repository
5. **Build settings** (should auto-detect from `netlify.toml`):
   - Base directory: `/`
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click **"Deploy site"**

#### 4.3 Monitor Deployment
- **Build log** shows real-time progress
- **Expected time:** 2-5 minutes
- **Status:** "Site is live" ✅

#### 4.4 Get Your Live URL
```
https://YOUR_SITE_NAME.netlify.app
```
Example: `https://foodshark-ordering.netlify.app`

---

### Option B: Deploy via Netlify CLI

#### 4.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

#### 4.2 Login to Netlify
```bash
netlify login
```
(Opens browser for authentication)

#### 4.3 Initialize Netlify Site
```bash
netlify init
```

Follow prompts:
- Create & configure a new site? **Yes**
- Team: Select your team
- Site name: `foodshark-app` (or custom name)
- Build command: `npm run build`
- Directory to deploy: `dist`
- Netlify functions folder: (leave empty)

#### 4.4 Deploy
```bash
netlify deploy --prod
```

Wait for deployment to complete. You'll get a live URL.

---

## Step 5: Post-Deployment Testing

### 5.1 Test on Production URL
1. Open `https://YOUR_SITE_NAME.netlify.app` on **Device 1** (e.g., your laptop)
2. Create group session: `PROD01`
3. Open same URL on **Device 2** (e.g., your phone)
4. Join session: `PROD01`
5. **Add items on Device 1** → Should sync to Device 2 in real-time
6. **Add items on Device 2** → Should sync to Device 1 in real-time

### 5.2 Test WhatsApp Integration
1. Complete an order (solo or group)
2. Click "Send to WhatsApp"
3. WhatsApp should open with pre-filled message:
```
🍕 FoodShark Order #SNK-2024-1234

📅 Date: 2024-01-15
⏰ Time: 2:30 PM

📦 Order Items:
• Coca Cola (x2) - ₦400
• Meat Pie (x1) - ₦500

💰 Total: ₦900

Thank you for your order! 🙏
```

### 5.3 Verify Firebase Data Persistence
1. Open Firebase Console → Realtime Database
2. Check sessions are being created with production data
3. Sessions persist across browser refreshes
4. Users can reconnect to existing sessions

---

## Step 6: Custom Domain (Optional)

### 6.1 Buy Domain
Purchase from:
- [Namecheap](https://www.namecheap.com)
- [Google Domains](https://domains.google.com)
- [Cloudflare](https://www.cloudflare.com/products/registrar/)

Example: `foodshark.app` or `orderfoodshark.com`

### 6.2 Add to Netlify
1. Netlify Dashboard → Your Site → **Domain settings**
2. Click **"Add custom domain"**
3. Enter domain: `foodshark.app`
4. Netlify provides DNS records:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: YOUR_SITE_NAME.netlify.app
```

### 6.3 Configure DNS at Domain Registrar
1. Login to Namecheap/Google Domains
2. Find DNS settings
3. Add A record and CNAME record (from Netlify)
4. Save changes

### 6.4 Enable HTTPS (Automatic)
- Netlify auto-provisions SSL certificate (Let's Encrypt)
- Takes 1-24 hours to activate
- Your site will be `https://foodshark.app`

---

## 🔧 Troubleshooting

### Issue: "Firebase not initialized" error
**Solution:**
- Check `src/firebase.js` has real credentials (not placeholder `YOUR_API_KEY_HERE`)
- Verify `databaseURL` is correct (should end in `.firebaseio.com`)
- Restart dev server: `npm run dev`

### Issue: "Permission denied" when writing to Firebase
**Solution:**
- Go to Firebase Console → Realtime Database → Rules
- Ensure rules allow `.write: true` for sessions
- Click "Publish" after changing rules

### Issue: Items not syncing across devices
**Solution:**
- Open browser console (F12) on both devices
- Look for Firebase errors
- Check network tab for failed requests
- Verify both devices use same session code (case-sensitive!)

### Issue: Build fails on Netlify
**Solution:**
- Check build log for specific error
- Common causes:
  - Missing dependencies: `npm install` not run
  - Syntax errors in code
  - Firebase credentials invalid
- Test build locally: `npm run build`

### Issue: "Module not found" error on Netlify
**Solution:**
- Verify `package.json` has all dependencies
- Ensure `firebase` is in `dependencies` NOT `devDependencies`
- Run `npm install` locally and commit `package-lock.json`

---

## 📊 Firebase Usage Monitoring

### Free Tier Limits (Spark Plan)
- **Storage:** 1 GB
- **Bandwidth:** 10 GB/month
- **Connections:** 100 simultaneous
- **Cost:** $0

### Check Usage
1. Firebase Console → ⚙️ Settings → Usage and billing
2. Monitor:
   - Database storage (should be <10 MB for typical usage)
   - Downloads (bandwidth)
   - Concurrent connections

### Estimate for 1000 Users/Month
- Average session: 5 users, 10 items each = ~5 KB
- 1000 sessions × 5 KB = 5 MB storage ✅
- Each user refresh = 5 KB download
- 1000 users × 10 refreshes × 5 KB = 50 MB bandwidth ✅

**You can handle 10,000+ monthly users on free tier!**

---

## 🚀 Going Live Checklist

- [ ] Firebase project created and database enabled
- [ ] Firebase credentials added to `src/firebase.js`
- [ ] Database rules configured (test or production)
- [ ] App tested locally with multi-device sync
- [ ] Build tested locally (`npm run build`)
- [ ] Code committed to Git
- [ ] Pushed to GitHub repository
- [ ] Connected repository to Netlify
- [ ] Deployment successful on Netlify
- [ ] Production URL tested on multiple devices
- [ ] WhatsApp integration verified
- [ ] Firebase data persistence checked
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (HTTPS)

---

## 🎉 Success!

Your FoodShark app is now live with:
- ✅ Real-time multi-device group ordering
- ✅ Cloud-synced sessions via Firebase
- ✅ WhatsApp integration for order delivery
- ✅ Fast global CDN via Netlify
- ✅ Automatic HTTPS encryption
- ✅ Continuous deployment (push to GitHub = auto-deploy)

**Share your live URL with customers and start taking orders!**

---

## 📞 Support Resources

- **Firebase Docs:** https://firebase.google.com/docs/database
- **Netlify Docs:** https://docs.netlify.com
- **React Docs:** https://react.dev
- **Vite Docs:** https://vitejs.dev

---

## 🔄 Future Updates

### To deploy updates in the future:
```bash
# Make code changes
git add .
git commit -m "Add new feature"
git push origin main
```

**Netlify automatically rebuilds and deploys!** 🚀

No manual steps needed. Changes go live in 2-5 minutes.
