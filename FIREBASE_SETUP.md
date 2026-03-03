# 🔥 Firebase Setup Guide for FoodShark

Follow these steps to enable real-time group ordering across devices.

---

## Step 1: Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `foodshark` (or any name you prefer)
4. Disable Google Analytics (optional, not needed for this app)
5. Click **"Create project"**
6. Wait for project creation (takes ~30 seconds)

---

## Step 2: Enable Realtime Database

1. In your Firebase project dashboard, click **"Realtime Database"** in the left menu
2. Click **"Create Database"**
3. Choose location: **United States** (or closest to your users)
4. Select **"Start in test mode"** (we'll secure it later)
5. Click **"Enable"**

---

## Step 3: Configure Database Rules

1. In Realtime Database, click the **"Rules"** tab
2. Replace the rules with this (allows read/write for 30 days during development):

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": true,
        ".indexOn": ["code", "createdAt"]
      }
    }
  }
}
```

3. Click **"Publish"**

**⚠️ SECURITY NOTE:** These rules are for development. See "Production Rules" section below before going live.

---

## Step 4: Get Your Firebase Config

1. In Firebase Console, click the **⚙️ gear icon** > **Project settings**
2. Scroll down to **"Your apps"** section
3. Click the **Web icon** (`</>`) to add a web app
4. Enter app nickname: `FoodShark Web`
5. **DON'T** check "Also set up Firebase Hosting"
6. Click **"Register app"**
7. Copy the `firebaseConfig` object that appears

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "foodshark-xxxxx.firebaseapp.com",
  databaseURL: "https://foodshark-xxxxx-default-rtdb.firebaseio.com",
  projectId: "foodshark-xxxxx",
  storageBucket: "foodshark-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

---

## Step 5: Update Your Code

1. Open `src/firebase.js`
2. Replace the placeholder config with YOUR values from Step 4
3. Save the file

**Example:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC_YOUR_ACTUAL_KEY_HERE",
  authDomain: "foodshark-12345.firebaseapp.com",
  databaseURL: "https://foodshark-12345-default-rtdb.firebaseio.com",
  projectId: "foodshark-12345",
  storageBucket: "foodshark-12345.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abc123def456"
};
```

---

## Step 6: Test Your Setup

1. Run your app: `npm run dev`
2. Open in **two different browsers** (Chrome + Firefox) or **two devices**
3. Create a group session in Browser 1
4. Copy the session code
5. Join from Browser 2 using that code
6. Add items in Browser 1 → You should see them appear in Browser 2 **instantly**! ✨

---

## 🔒 Production Database Rules (IMPORTANT!)

Before deploying to production, update your Firebase Realtime Database rules:

```json
{
  "rules": {
    "sessions": {
      "$sessionId": {
        ".read": true,
        ".write": "!data.exists() || data.child('createdAt').val() > (now - 86400000)",
        ".validate": "newData.hasChildren(['code', 'createdAt', 'users'])",
        "users": {
          "$userId": {
            ".validate": "newData.hasChildren(['name', 'items', 'joinedAt'])",
            "items": {
              "$itemId": {
                ".validate": "newData.hasChildren(['id', 'name', 'price', 'quantity'])"
              }
            }
          }
        }
      }
    }
  }
}
```

**How this works:**
- `.write` rule allows operations if:
  - `!data.exists()` - Creating a new session (allowed)
  - `||` - OR
  - `data.child('createdAt').val() > (now - 86400000)` - Session was created within 24 hours (allowed)
- After 24 hours, the session becomes read-only
- `.validate` rules ensure correct data structure

This ensures:
- ✅ Data validation
- ✅ Sessions auto-delete after 24 hours
- ✅ Proper data structure enforcement

---

## 📊 Free Tier Limits

**Firebase Spark Plan (FREE):**
- ✅ 1GB storage
- ✅ 10GB/month bandwidth
- ✅ 100 simultaneous connections
- ✅ No credit card required

**Estimated Usage:**
- Each session: ~5-50KB
- 1000 sessions/month = ~25MB storage
- You can handle **thousands of users** on the free tier!

---

## 🆘 Troubleshooting

### Error: "Permission denied"
- Check database rules in Firebase Console
- Make sure rules allow read/write
- Verify databaseURL is correct

### Error: "Firebase not initialized"
- Check that you updated `src/firebase.js` with YOUR config
- Restart dev server: `npm run dev`

### Sessions not syncing
- Open browser DevTools > Console
- Check for Firebase connection errors
- Verify databaseURL includes your project ID

### Can't see other users' items
- Make sure both users joined the SAME session code
- Check browser console for errors
- Clear localStorage and try again

---

## ✅ Success Checklist

- [ ] Firebase project created
- [ ] Realtime Database enabled
- [ ] Database rules published
- [ ] Firebase config copied to `src/firebase.js`
- [ ] App runs without errors
- [ ] Can create sessions
- [ ] Can join sessions from different devices
- [ ] Items sync in real-time between users

---

**Need help?** Check the console for detailed error messages or revisit the setup steps.
