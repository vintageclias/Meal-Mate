# Meal-Mate Deployment Guide (Render.com)

## Prerequisites
- Render.com account
- GitHub account with repository access

## Deployment Steps

1. **Push to GitHub**
   - Commit all changes
   - Push to your GitHub repository

2. **Create Render Service**
   - Go to Render Dashboard
   - Click "New" -> "Web Service"
   - Connect your GitHub repository
   - Select the repository
   - Configure with these settings:
     - Name: meal-mate-backend
     - Region: Choose closest to you
     - Branch: main
     - Build Command: (auto-detected from render.yaml)
     - Start Command: (auto-detected from render.yaml)
   - Add environment variables:
     - FLASK_ENV: production
     - SECRET_KEY: [generate a strong secret key]

3. **Wait for Deployment**
   - First build may take 5-10 minutes
   - Monitor logs for any errors

4. **Access Your App**
   - Once deployed, your app will be available at:
     - Backend: https://meal-mate-backend.onrender.com
     - Frontend: https://meal-mate-frontend.onrender.com

## Post-Deployment
- Check logs for any errors
- Test all API endpoints
- Verify frontend-backend communication

## Troubleshooting
- If frontend can't connect to backend:
  - Check CORS settings in app.py
  - Verify backend URL in frontend config
- For database issues:
  - Check if database file exists in instance/ folder
  - Verify database migrations ran successfully
