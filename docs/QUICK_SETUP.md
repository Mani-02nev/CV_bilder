# 🚀 QUICK SETUP GUIDE

## ✅ What You Got

1. **Landing Page** with Features, Templates, Pricing
2. **WhatsApp Integration** for Pro upgrades ($29/month)
3. **Admin Login** to manage users
4. **Admin Dashboard** to upgrade users to Pro

---

## ⚡ 3-Step Setup

### **Step 1: Set Your WhatsApp Number** 📱

Edit: `/src/features/landing/LandingPage.tsx`

Find (around line 240):
```tsx
href="https://wa.me/YOUR_PHONE_NUMBER?text=..."
```

Replace with your number (no + or spaces):
```tsx
href="https://wa.me/919876543210?text=..."
```

**Example:**
- India: `919876543210`
- US: `14155551234`
- UK: `447700900123`

### **Step 2: Run Database Migration** 🗄️

**Option A - Supabase Dashboard:**
1. Go to your Supabase project
2. Click "SQL Editor"
3. Paste this:
```sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON profiles(is_pro);
```
4. Click "Run"

**Option B - Supabase CLI:**
```bash
supabase db push
```

### **Step 3: Test Everything** ✅

**Test Landing Page:**
```
http://localhost:5173
- Scroll to Templates section
- Scroll to Pricing section
- Click WhatsApp button (should open WhatsApp)
```

**Test Admin:**
```
http://localhost:5173/admin/login
Email: admin@ksresume.com
Password: admin123
- Should see dashboard
- Should see user list
```

---

## 🎯 How It Works

### **User Wants Pro:**
1. User clicks "Contact on WhatsApp" button
2. WhatsApp opens with message
3. User sends you message
4. You receive notification

### **You Activate Pro:**
1. Go to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Search for user email
4. Click "Upgrade to Pro"
5. Done! User is now Pro ✅

---

## 📋 URLs

```
Landing Page:     http://localhost:5173
Admin Login:      http://localhost:5173/admin/login
Admin Dashboard:  http://localhost:5173/admin/dashboard
```

---

## 🔑 Admin Credentials

```
Email:    admin@ksresume.com
Password: admin123
```

**To Change:**
Edit `/src/features/admin/AdminLoginPage.tsx` line 22

---

## 💰 Pricing

**Free Plan:**
- 3 Free Templates
- AI Content Generation
- ATS Optimization
- PDF Download

**Pro Plan - $29/month:**
- All Free Features
- 10 Premium Templates
- Unlimited Resumes
- Priority AI
- Profile Picture Upload
- Custom Branding

---

## 🎨 Templates

**Free (3):**
- Modern Blue
- Classic Black
- Minimal Gray

**Pro (5):**
- Creative Purple 👑
- Modern Green 👑
- Professional Teal 👑
- Executive Navy 👑
- Minimal Rose 👑

---

## ✅ Quick Checklist

**Before Launch:**
- [ ] Set WhatsApp number
- [ ] Run database migration
- [ ] Test landing page
- [ ] Test admin login
- [ ] Test Pro upgrade
- [ ] Change admin password (optional)

**After User Messages:**
- [ ] Receive WhatsApp message
- [ ] Login to admin dashboard
- [ ] Search user email
- [ ] Click "Upgrade to Pro"
- [ ] Confirm with user

---

## 🎉 You're Done!

**Your resume builder now has:**
- ✅ Beautiful landing page
- ✅ Templates showcase
- ✅ Pricing plans
- ✅ WhatsApp integration
- ✅ Admin system
- ✅ Pro upgrades

**Test it now:** http://localhost:5173

**Need help?** Check `LANDING_ADMIN_COMPLETE.md` for full docs!
