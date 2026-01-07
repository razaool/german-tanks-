# Deployment Guide - German Tank Problem

This guide explains how to deploy the German Tank Problem application to Render using their free tier.

## Prerequisites

- GitHub account with the repository pushed
- Render account (free tier) - sign up at [render.com](https://render.com)
- All code committed and pushed to GitHub

## Architecture

The application consists of:
- **Backend**: Flask API running on Python 3.11
- **Frontend**: React/TypeScript SPA built with Vite

## Step-by-Step Deployment to Render

### Part 1: Deploy Backend API

1. **Go to Render Dashboard**
   - Log into [dashboard.render.com](https://dashboard.render.com)
   - Click the "New" button in the top right
   - Select "Web Service"

2. **Connect GitHub Repository**
   - Click "Connect GitHub" (if not already connected)
   - Authorize Render to access your repositories
   - Find and select `german-tanks-` repository
   - Click "Connect"

3. **Configure Service** (Important - Use These Settings):

   **Basic Settings:**
   - **Name**: `german-tanks-backend`
   - **Region**: Select Oregon (us-west) or Frankfurt (eu-central) for free tier
   - **Branch**: `main`

   **Build & Deploy Settings:**
   - **Runtime**: `Python 3` (click to see Python version selector)
   - **Build Command**: `pip install --no-cache-dir -r requirements.txt`
   - **Start Command**: `python app.py`

   **Root Directory** (Look for this field - it might be under "Advanced"):
   - Set to: `backend`

4. **Click "Create Web Service"** at the bottom
   - Render will deploy your backend
   - Wait for deployment to complete (click the "Logs" tab to watch progress)
   - Your backend URL will be something like: `https://german-tanks-backend.onrender.com`

### Part 2: Deploy Frontend

1. **Go to Render Dashboard**
   - Click the "New" button again
   - This time select "Static Site" (NOT Web Service)

2. **Configure Frontend Service**:

   **Basic Settings:**
   - **Name**: `german-tanks-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`

   **Build Settings:**
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

3. **Add Environment Variable**:
   - Look for "Environment" section
   - Click "+ Add Environment Variable"
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend URL from Part 1 (e.g., `https://german-tanks-backend.onrender.com`)
   - Click "Save"

4. **Click "Create Static Site"**
   - Render will build and deploy your frontend
   - Your frontend URL will be something like: `https://german-tanks-frontend.onrender.com`

## Troubleshooting Render Deployment

### Can't Find "Root Directory" Field

The "Root Directory" field might be hidden. Try these steps:

1. **Method 1: Advanced Settings**
   - Look for a "Advanced" or "More Settings" button/accordion
   - Click it to expand additional options
   - Root Directory should appear there

2. **Method 2: Use render.yaml (Already Configured)**
   - We've already created `render.yaml` in your repo
   - When you connect the repo, Render should auto-detect it
   - If it does, you'll see "Configuration detected from render.yaml"
   - Just click "Create Web Service"

### Build Command / Start Command Not Visible

If you don't see these fields:

1. Make sure you selected **"Web Service"** (not Static Site) for the backend
2. After selecting Python as runtime, the fields should appear
3. If still not visible, try refreshing the page
4. Or try connecting the repository again

### Alternative: Manual Configuration via Dashboard

If auto-detection doesn't work:

1. Go to your service in Render dashboard
2. Click "Settings" tab
3. Scroll to "Build & Deploy"
4. You can manually set:
   - Build Command
   - Start Command
   - Working Directory (this is where you put `backend`)

### Frontend Build Failing

If frontend build fails:

1. Make sure `package.json` exists in `frontend/` directory
2. Check that `npm run build` works locally first:
   ```bash
   cd frontend
   npm install
   npm run build
   ```
3. Check the build logs in Render dashboard for specific errors
4. Common issue: Node version mismatch - Render uses latest Node by default

## Important Notes for Free Tier

### Spin-Up Time
- Free tier services spin down after 15 minutes of inactivity
- Cold start can take 30-60 seconds
- This is normal for free tier!

### Service Limits
- **Free Web Service**: 750 hours/month (enough for full-time operation of 1 service)
- **Free Static Site**: Unlimited
- Your backend will sleep but frontend stays always-on

### Keeping Backend Alive (Optional)
To prevent the backend from spinning down:
- Use a cron job monitoring service (like uptimerobot.com)
- Set it to ping your `/health` endpoint every 10-14 minutes
- This keeps the backend active

## Testing Your Deployment

1. **Test Backend**:
   ```bash
   curl https://german-tanks-backend.onrender.com/health
   ```
   Should return: `{"status": "healthy", "service": "german-tanks-backend"}`

2. **Test Frontend**:
   - Open `https://german-tanks-frontend.onrender.com`
   - Try running a simulation
   - Check browser console for any API errors

3. **Test API Connection**:
   - Run a simulation in the UI
   - Verify charts render correctly
   - Check Network tab in DevTools for successful API calls

## Custom Domain (Optional)

If you want a custom domain:

1. **Purchase Domain** (from Namecheap, GoDaddy, etc.)

2. **Add Domain in Render**:
   - Go to your service settings
   - Scroll to "Custom Domains"
   - Click "Add Domain"
   - Enter your domain name

3. **Update DNS**:
   - Render will provide CNAME records
   - Add them to your domain's DNS settings
   - Wait for DNS propagation (usually minutes, up to 48 hours)

4. **HTTPS**:
   - Render automatically provisions SSL certificates
   - Your site will be served over HTTPS automatically

## Troubleshooting

### Backend Won't Start
- Check logs in Render dashboard
- Common issues:
  - Missing dependencies in `requirements.txt`
  - Python version mismatch
  - Port not properly configured

### Frontend Can't Reach Backend
- Verify `VITE_API_URL` is set correctly
- Check CORS configuration in backend (should allow all origins)
- Check browser console for specific error messages

### Build Fails
- Check that `package.json` has correct build scripts
- Verify TypeScript compiles without errors
- Check build logs in Render dashboard

### Services Keep Spinning Down
- Normal behavior for free tier
- Consider upgrading to paid tier ($7/month) for always-on
- Or use monitoring service to ping periodically

## Monitoring

Render provides:
- Real-time logs
- Metrics dashboard
- Error tracking
- Deployment history

Access these from your Render dashboard.

## Updates and Maintenance

### Updating the App
1. Commit changes to GitHub
2. Push to `main` branch
3. Render auto-deploys (if enabled)
4. Or manually deploy from Render dashboard

### Scaling Up (if needed)
- Go to service settings
- Change instance type from Free to Starter ($7/month)
- Benefits:
  - No spin-down
  - Better performance
  - More RAM
  - Faster builds

## Alternative Deployment Platforms

If Render doesn't work out, consider:
- **Railway** (railway.app) - Similar to Render, free tier available
- **Vercel** - Great for frontend, need separate backend hosting
- **Netlify** - Excellent for frontend static sites
- **DigitalOcean** - $5/month droplet, full control
- **AWS Elastic Beanstalk** - Enterprise scale, pay-as-you-go

## Security Considerations

- CORS is configured to allow all origins (`*`)
- For production, consider restricting to specific domains
- No authentication implemented (public API)
- Rate limiting not implemented (consider for production)
- No API keys or secrets needed

## Support

If you encounter issues:
1. Check Render logs first
2. Review this guide
3. Check Render documentation: [docs.render.com](https://docs.render.com)
4. Review GitHub issues for the project

---

**Congratulations!** Your German Tank Problem visualization is now live on Render! 🎉
