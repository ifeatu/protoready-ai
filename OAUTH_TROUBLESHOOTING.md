# OAuth Troubleshooting - Error 401: invalid_client

## Issue
Getting "Error 401: invalid_client" when trying to authenticate with Google OAuth.

## Possible Causes & Solutions

### 1. **Incorrect Redirect URI Configuration**

**Check Google Cloud Console**:
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to APIs & Services → Credentials
- Find your OAuth 2.0 Client ID
- Verify **Authorized redirect URIs** includes:
  ```
  https://nextjs-protoready-lkrv8y95t-pierre-malbroughs-projects.vercel.app/api/auth/callback/google
  ```

### 2. **Wrong Environment Variables**

**Current Configuration**:
- Client ID: Configured in Vercel environment variables
- Client Secret: Configured in Vercel environment variables

**Verify in Google Cloud Console** that these credentials match exactly.

### 3. **OAuth Consent Screen Issues**

**Check OAuth Consent Screen**:
- App must be properly configured
- Domain must be verified: `vercel.app` should be added to authorized domains
- App might need to be published (not in testing mode)

### 4. **NextAuth Configuration Issues**

**Check callback URL matches exactly**:
```
NEXTAUTH_URL=https://nextjs-protoready-lkrv8y95t-pierre-malbroughs-projects.vercel.app
```

## Quick Fix Steps

1. **Verify Google Cloud Console Settings**:
   - OAuth 2.0 Client ID configuration
   - Authorized redirect URIs
   - OAuth consent screen status

2. **Check Environment Variables in Vercel**:
   - Go to Vercel dashboard → Project → Settings → Environment Variables
   - Verify all values match Google Cloud Console

3. **Test with Explicit URL**:
   Try accessing: `https://nextjs-protoready-lkrv8y95t-pierre-malbroughs-projects.vercel.app/api/auth/signin/google`

## Current Deployment URLs

- **Main App**: https://nextjs-protoready-lkrv8y95t-pierre-malbroughs-projects.vercel.app
- **Auth Endpoint**: https://nextjs-protoready-lkrv8y95t-pierre-malbroughs-projects.vercel.app/api/auth
- **Google Callback**: https://nextjs-protoready-lkrv8y95t-pierre-malbroughs-projects.vercel.app/api/auth/callback/google

## Next Steps

1. Double-check Google Cloud Console configuration
2. Verify authorized redirect URIs
3. Ensure OAuth consent screen is properly configured
4. Test with the correct callback URL