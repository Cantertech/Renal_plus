# Netlify Deployment Steps for Renal Care

## ✅ Your API Key is Configured!

**API Key:** `AIzaSyA2TN2B7PJGG-0NeYOVfIqzHJRDVU3RjwM`

---

## 🚀 Quick Deployment Steps

### Step 1: Push to Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for Netlify deployment"

# Push to your remote repository (GitHub/GitLab/Bitbucket)
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Deploy to Netlify

#### Option A: Via Netlify UI (Recommended)

1. **Go to [https://netlify.com](https://netlify.com)** and sign in

2. **Click "Add new site" → "Import an existing project"**

3. **Connect your Git provider** (GitHub/GitLab/Bitbucket) and select your repository

4. **Configure build settings:**
   - **Base directory:** (leave empty)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

5. **Click "Show advanced" → Add environment variable:**
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyA2TN2B7PJGG-0NeYOVfIqzHJRDVU3RjwM`

6. **Click "Deploy site"**

Your app will be live in 1-2 minutes at: `your-site-name.netlify.app`

#### Option B: Via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod

# Set environment variable
netlify env:set GEMINI_API_KEY AIzaSyA2TN2B7PJGG-0NeYOVfIqzHJRDVU3RjwM

# Redeploy with the new environment variable
netlify deploy --prod
```

---

## 📝 What's Already Configured

✅ **netlify.toml** - Build configuration  
✅ **public/_redirects** - SPA routing  
✅ **.gitignore** - Environment files excluded  
✅ **API Key** - Ready for Netlify environment variables  

---

## 🧪 Test Locally First

Your API key is configured in `.env.local` for local development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to test the app.

---

## ⚙️ Environment Variables on Netlify

After deploying, you can update environment variables by:

1. Go to your site in Netlify dashboard
2. Click **"Site settings"**
3. Go to **"Environment variables"**
4. Click **"Add a variable"**
5. Add:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** `AIzaSyA2TN2B7PJGG-0NeYOVfIqzHJRDVU3RjwM`
6. Click **"Save"**
7. Trigger a new deployment

---

## 🎉 Your App Features

- ✅ No Firebase setup required
- ✅ Uses localStorage for data persistence
- ✅ AI-powered food analysis
- ✅ Health tracking
- ✅ Hydration tracker
- ✅ Educational games
- ✅ Ready to deploy!

---

## 📞 Need Help?

Check the deployment logs in Netlify dashboard if you encounter any issues during deployment.

---

**Last Updated:** Configured with your Gemini API key

