# OAuth Setup Instructions

The GitHub and Google login buttons aren't working because the OAuth applications need to be configured with real client credentials. Here's how to set them up:

## 🔧 GitHub OAuth Setup

1. **Create GitHub OAuth App**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Fill in the details:
     - **Application name**: ProtoReady.ai
     - **Homepage URL**: `https://nextjs-protoready-2z17w1y1g-pierre-malbroughs-projects.vercel.app`
     - **Authorization callback URL**: `https://nextjs-protoready-2z17w1y1g-pierre-malbroughs-projects.vercel.app/api/auth/callback/github`

2. **Get Credentials**:
   - Copy the **Client ID**
   - Generate and copy the **Client Secret**

## 🌐 Google OAuth Setup

1. **Create Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the Google+ API

2. **Configure OAuth Consent Screen**:
   - Go to APIs & Services → OAuth consent screen
   - Choose "External" user type
   - Fill in app information:
     - **App name**: ProtoReady.ai
     - **User support email**: Your email
     - **App domain**: `nextjs-protoready-2z17w1y1g-pierre-malbroughs-projects.vercel.app`
     - **Authorized domains**: `vercel.app`

3. **Create OAuth Credentials**:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `https://nextjs-protoready-2z17w1y1g-pierre-malbroughs-projects.vercel.app/api/auth/callback/google`

4. **Get Credentials**:
   - Copy the **Client ID**
   - Copy the **Client Secret**

## 🔐 Vercel Environment Variables

Set these environment variables in your Vercel project settings:

```bash
# NextAuth
NEXTAUTH_SECRET=your-random-32-character-string
NEXTAUTH_URL=https://nextjs-protoready-2z17w1y1g-pierre-malbroughs-projects.vercel.app

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth  
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 🚀 Deploy After Setup

After setting the environment variables in Vercel, trigger a new deployment:

1. Push any small change to trigger deployment, or
2. Go to Vercel dashboard and redeploy

## ✅ Testing

Once configured, users can:
- Click GitHub/Google buttons on signin page
- Authenticate with their accounts
- Get redirected back to the app
- Access GitHub repo analysis features (with GitHub auth)
- Access Google Drive analysis features (with Google auth)

## 🔍 Troubleshooting

- **"Client ID not found"**: Check environment variables are set in Vercel
- **"Redirect URI mismatch"**: Ensure callback URLs match exactly
- **"App not approved"**: For Google, you may need to verify your app or add test users
- **NEXTAUTH_SECRET missing**: Generate a random 32-character string

## 📝 Current Status

- ✅ OAuth integration code is deployed and working
- ✅ Authentication flow is properly configured  
- ❌ OAuth applications need to be created and configured
- ❌ Environment variables need to be set in Vercel

The technical implementation is complete - only the OAuth app setup and environment variable configuration remain.