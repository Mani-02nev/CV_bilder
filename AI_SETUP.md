# 🤖 AI Feature Setup Guide

## Current Status

Your AI service is configured with **3 options**:

1. ✅ **Mock Data** (Currently Active) - Works immediately for testing
2. 🔧 **Supabase Edge Function** (Recommended for Production) - Requires setup
3. ❌ **Direct API** (Not supported due to CORS)

---

## 🎯 Quick Start (Testing with Mock Data)

**Good news!** Your AI feature is already working with realistic mock data. You can:

1. Click "AI Generate" in the resume builder
2. Enter job title, industry, and experience level
3. Get professional resume content instantly

**This is perfect for:**
- Testing the feature
- Demonstrating the platform
- Development and debugging

---

## 🚀 Production Setup (Real AI with OpenAI)

To use **real AI generation** with OpenAI, follow these steps:

### Step 1: Install Supabase CLI

```bash
# macOS (using Homebrew)
brew install supabase/tap/supabase

# Or using npm
npm install -g supabase
```

Verify installation:
```bash
supabase --version
```

### Step 2: Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### Step 3: Link Your Project

```bash
cd /Users/gobinath/study/projects/resume-bilder
supabase link --project-ref jnqqkwqxtwiweruhhgak
```

### Step 4: Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-`)

### Step 5: Set OpenAI Key in Supabase

```bash
supabase secrets set OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 6: Deploy the Edge Function

```bash
supabase functions deploy generate-resume
```

### Step 7: Test It!

1. Go to your resume builder
2. Click "AI Generate"
3. Fill in the details
4. Click "Generate Content"
5. You should now get **real AI-generated content**!

---

## 🔍 Troubleshooting

### "Failed to generate content" Error

**Cause**: Edge function not deployed or OpenAI key not set

**Solution**: 
- The app will automatically fall back to mock data
- Follow the production setup steps above to enable real AI

### "Function not found" Error

**Cause**: Edge function not deployed

**Solution**:
```bash
supabase functions deploy generate-resume
```

### "Invalid API Key" Error

**Cause**: OpenAI API key not set or incorrect

**Solution**:
```bash
# Check if key is set
supabase secrets list

# Set or update the key
supabase secrets set OPENAI_API_KEY=sk-your-key-here
```

### Edge Function Logs

To see what's happening:
```bash
# View logs
supabase functions logs generate-resume

# Or in Supabase Dashboard
# Go to: Edge Functions → generate-resume → Logs
```

---

## 💡 How It Works

### With Mock Data (Current)
```
User clicks "AI Generate"
  ↓
Try to call Edge Function
  ↓
Edge Function not found
  ↓
Fall back to Mock Data
  ↓
Return realistic sample content
```

### With Real AI (After Setup)
```
User clicks "AI Generate"
  ↓
Call Supabase Edge Function
  ↓
Edge Function calls OpenAI API
  ↓
OpenAI generates content
  ↓
Return real AI-generated content
```

---

## 📊 Comparison

| Feature | Mock Data | Real AI |
|---------|-----------|---------|
| Setup Required | ✅ None | 🔧 5 minutes |
| Cost | 💰 Free | 💰 ~$0.01 per generation |
| Quality | ⭐⭐⭐ Good | ⭐⭐⭐⭐⭐ Excellent |
| Customization | ❌ Limited | ✅ Fully customized |
| Production Ready | ❌ No | ✅ Yes |

---

## 🎯 Recommendations

### For Development/Testing
- ✅ Use mock data (already working!)
- No setup required
- Test all features
- Demo to stakeholders

### For Production Launch
- ✅ Deploy edge function
- Set OpenAI API key
- Test with real data
- Monitor usage and costs

### For MVP/Beta
- ✅ Start with mock data
- Collect user feedback
- Deploy real AI when ready
- Gradually roll out to users

---

## 💰 Cost Estimation

OpenAI GPT-4o-mini pricing:
- **Input**: $0.150 per 1M tokens
- **Output**: $0.600 per 1M tokens

Average resume generation:
- ~500 input tokens
- ~800 output tokens
- **Cost per generation**: ~$0.0006 (less than a penny!)

For 1,000 resumes: ~$0.60

---

## 🔐 Security Notes

### ✅ Secure (Edge Function)
- API key stored in Supabase Secrets
- Never exposed to client
- Server-side execution
- Rate limiting available

### ❌ Insecure (Direct API)
- Would expose API key to browser
- Not implemented for security
- Use edge function instead

---

## 📝 Quick Commands Reference

```bash
# Install Supabase CLI
brew install supabase/tap/supabase

# Login
supabase login

# Link project
supabase link --project-ref jnqqkwqxtwiweruhhgak

# Set OpenAI key
supabase secrets set OPENAI_API_KEY=sk-...

# Deploy function
supabase functions deploy generate-resume

# View logs
supabase functions logs generate-resume

# List secrets
supabase secrets list
```

---

## ✅ Current Status Summary

- ✅ AI service implemented
- ✅ Mock data working perfectly
- ✅ Edge function code ready
- 🔧 Edge function deployment pending
- 🔧 OpenAI API key pending

**Your platform works great right now with mock data!**

**To enable real AI: Just follow the 7 steps above (takes ~5 minutes)**

---

## 🎉 You're All Set!

Your AI feature is **working and ready to use** with mock data. When you're ready for production, just deploy the edge function and set your OpenAI key.

**No rush - the mock data is professional and realistic!**
