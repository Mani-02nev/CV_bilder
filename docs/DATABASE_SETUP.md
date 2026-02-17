# 🗄️ DATABASE SETUP - IMPORTANT!

## ⚠️ You MUST Run This Migration

Before the admin system works, you need to add the `is_pro` column to your database.

---

## 🚀 Quick Method (Supabase Dashboard)

### **Step 1: Open Supabase**
1. Go to https://supabase.com
2. Open your project
3. Click "SQL Editor" in left sidebar

### **Step 2: Run This SQL**
Copy and paste this entire code:

```sql
-- Add is_pro column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_pro ON profiles(is_pro);

-- Update existing users to free plan
UPDATE profiles SET is_pro = FALSE WHERE is_pro IS NULL;
```

### **Step 3: Click "Run"**
- Should see "Success" message
- Column is now added!

---

## 🔍 Verify It Worked

### **Check in Supabase:**
1. Go to "Table Editor"
2. Click "profiles" table
3. You should see `is_pro` column
4. All values should be `false`

### **Test in Admin Dashboard:**
1. Go to http://localhost:5173/admin/login
2. Login as admin
3. You should see user list
4. Try upgrading a user
5. Should work! ✅

---

## 🛠️ Alternative Method (Supabase CLI)

If you have Supabase CLI installed:

```bash
# Make sure you're in project directory
cd /Users/gobinath/study/projects/resume-bilder

# Push migration
supabase db push
```

---

## ❌ Troubleshooting

### **Error: "column already exists"**
✅ This is fine! Column is already added.

### **Error: "relation profiles does not exist"**
❌ Your profiles table isn't created yet.

**Solution:**
1. Make sure you've signed up at least once
2. Check if profiles table exists in Supabase
3. If not, create it first

### **Admin dashboard shows no users**
**Check:**
1. Is migration run? ✓
2. Do you have users in profiles table? ✓
3. Are you logged in as admin? ✓

---

## 📊 What This Does

### **Adds Column:**
```
profiles table:
├─ id
├─ email
├─ created_at
└─ is_pro ← NEW! (default: false)
```

### **Creates Index:**
Makes searching by Pro status faster

### **Sets Defaults:**
All existing users → Free plan

---

## ✅ After Migration

**You can now:**
- ✅ View users in admin dashboard
- ✅ Upgrade users to Pro
- ✅ Downgrade users from Pro
- ✅ Search users
- ✅ See Pro status

---

## 🎯 Quick Test

### **1. Run Migration**
```sql
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
```

### **2. Check Table**
```sql
SELECT id, email, is_pro FROM profiles LIMIT 5;
```

Should show:
```
id  | email              | is_pro
----|--------------------|---------
1   | user@example.com   | false
2   | test@example.com   | false
```

### **3. Test Upgrade**
```sql
UPDATE profiles 
SET is_pro = TRUE 
WHERE email = 'user@example.com';
```

### **4. Verify**
```sql
SELECT email, is_pro FROM profiles WHERE email = 'user@example.com';
```

Should show:
```
email              | is_pro
-------------------|---------
user@example.com   | true
```

---

## 🎉 Done!

**After running migration:**
- ✅ Database is ready
- ✅ Admin system works
- ✅ Pro upgrades work
- ✅ You're all set!

**Next:** Go to http://localhost:5173/admin/login and test!
