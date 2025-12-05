# Deployment Guide for Renal Care

## Deploying to Netlify

This guide will walk you through deploying your Renal Care app to Netlify.

### Step 1: Prepare Your Code

1. Make sure all changes are committed to Git:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   ```

2. Push to your Git repository (GitHub, GitLab, or Bitbucket):
   ```bash
   git push origin main
   ```

### Step 2: Connect to Netlify

#### Option A: Via Netlify UI (Recommended for beginners)

1. **Create a Netlify account** (if you don't have one):
   - Go to [https://netlify.com](https://netlify.com)
   - Sign up with your GitHub/GitLab/Bitbucket account

2. **Import your project**:
   - Click "Add new site" → "Import an existing project"
   - Select your Git provider and authorize Netlify
   - Choose your repository

3. **Configure build settings**:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. **Add environment variable**:
   - Click "Advanced" → "New variable"
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key
   
   Get your API key from: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

5. **Deploy**:
   - Click "Deploy site"
   - Wait for the deployment to complete
   - Your site will be live at a URL like `your-site-name.netlify.app`

#### Option B: Via Netlify CLI

1. **Install Netlify CLI globally**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Add environment variables**:
   ```bash
   netlify env:set GEMINI_API_KEY your_api_key_here
   ```

5. **Redeploy**:
   ```bash
   netlify deploy --prod
   ```

### Step 3: Configure Custom Domain (Optional)

1. Go to your site in Netlify dashboard
2. Click "Domain settings"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS

### Step 4: Enable Continuous Deployment

Your site will automatically redeploy whenever you push to your Git repository's main branch.

### Environment Variables

Required environment variables:

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | Google Gemini API key for AI features | [Google Makersuite](https://makersuite.google.com/app/apikey) |

### Important Notes

1. **No Firebase Required**: The app now uses localStorage for data persistence, so no Firebase configuration is needed.

2. **API Key Security**: 
   - Never commit your API key to Git
   - Always add it to Netlify's environment variables
   - The API key in `.env.local` is only for local development

3. **Build Output**: 
   - The build creates a `dist` folder
   - This is what Netlify will deploy

### Troubleshooting

**Build fails:**
- Check that your Node version is 18+ in `netlify.toml`
- Ensure `GEMINI_API_KEY` is set in Netlify environment variables
- Check the build logs in Netlify dashboard

**App doesn't work after deployment:**
- Verify the `GEMINI_API_KEY` environment variable is set
- Check browser console for errors
- Ensure you're using HTTPS (Netlify provides this automatically)

**Routing issues:**
- The `public/_redirects` file ensures all routes redirect to `index.html`
- The `netlify.toml` file configures SPA routing

### Support

For issues or questions:
- Check the [Netlify documentation](https://docs.netlify.com)
- Review your deployment logs in the Netlify dashboard

