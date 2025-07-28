# Social Authentication Setup Guide for LivingRockCMS

## Overview
This guide provides step-by-step instructions for setting up social authentication providers (Google, Facebook, and WhatsApp) in your Supabase project for the LivingRockCMS application.

## 🚀 **Implemented Features**

### ✅ **Google Authentication**
- Full OAuth 2.0 integration
- Automatic user profile creation
- Role-based access control
- Secure token handling

### ✅ **Facebook Authentication**
- Facebook Login integration
- User data synchronization
- Profile picture and basic info import
- Privacy-compliant data handling

### ⚠️ **WhatsApp Authentication** (Coming Soon)
- Currently shows placeholder message
- Requires WhatsApp Business API setup
- Will be implemented in future updates

## 📋 **Prerequisites**

1. **Supabase Project**: Active Supabase project with authentication enabled
2. **Domain Configuration**: Configured domain for OAuth redirects
3. **Admin Access**: Supabase dashboard access for provider configuration

## 🔧 **Google Authentication Setup**

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
   - Also enable "Google Identity" API

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"

4. **Configure OAuth Consent Screen**
   - Add your application name: "LivingRockCMS"
   - Add authorized domains
   - Add scopes: `email`, `profile`, `openid`

5. **Configure Authorized Redirect URIs**
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for development)
   ```

6. **Save Credentials**
   - Copy the Client ID and Client Secret
   - Keep them secure for Supabase configuration

### Step 2: Configure Supabase Google Provider

1. **Open Supabase Dashboard**
   - Go to your project dashboard
   - Navigate to "Authentication" > "Providers"

2. **Enable Google Provider**
   - Find "Google" in the providers list
   - Toggle to enable it

3. **Add Credentials**
   - **Client ID**: Paste your Google OAuth Client ID
   - **Client Secret**: Paste your Google OAuth Client Secret

4. **Configure Redirect URL**
   - Set to: `https://your-project-ref.supabase.co/auth/v1/callback`

5. **Save Configuration**
   - Click "Save" to apply changes

## 📘 **Facebook Authentication Setup**

### Step 1: Create Facebook App

1. **Go to Facebook Developers**
   - Visit [Facebook Developers](https://developers.facebook.com/)
   - Click "Create App"

2. **Choose App Type**
   - Select "Consumer" or "Business"
   - Enter app name: "LivingRockCMS"

3. **Add Facebook Login Product**
   - Go to "Products" > "Facebook Login"
   - Click "Set Up"

4. **Configure OAuth Settings**
   - Go to "Facebook Login" > "Settings"
   - Add Valid OAuth Redirect URIs:
   ```
   https://your-project-ref.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for development)
   ```

5. **Get App Credentials**
   - Go to "Settings" > "Basic"
   - Copy App ID and App Secret

### Step 2: Configure Supabase Facebook Provider

1. **Enable Facebook Provider**
   - In Supabase Dashboard > "Authentication" > "Providers"
   - Find "Facebook" and toggle to enable

2. **Add Credentials**
   - **Client ID**: Paste your Facebook App ID
   - **Client Secret**: Paste your Facebook App Secret

3. **Configure Redirect URL**
   - Set to: `https://your-project-ref.supabase.co/auth/v1/callback`

4. **Save Configuration**

## 📱 **WhatsApp Authentication Setup** (Future Implementation)

### Current Status
- Placeholder implementation in place
- Shows "coming soon" message
- Requires WhatsApp Business API integration

### Future Implementation Plan

1. **WhatsApp Business API Setup**
   - Register for WhatsApp Business API
   - Configure webhook endpoints
   - Set up phone number verification

2. **Supabase Integration**
   - Custom OAuth provider implementation
   - Phone number-based authentication
   - SMS verification flow

3. **Security Considerations**
   - Rate limiting for SMS
   - Phone number validation
   - Privacy compliance (GDPR, etc.)

## 🔐 **Security Configuration**

### 1. **Environment Variables**
Add to your `.env` file:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OAuth Redirect URLs
VITE_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback
VITE_PRODUCTION_REDIRECT_URL=https://yourdomain.com/auth/callback
```

### 2. **CORS Configuration**
In Supabase Dashboard > "Settings" > "API":
- Add your domain to allowed origins
- Configure CORS headers for OAuth

### 3. **Rate Limiting**
Configure rate limits in Supabase:
- Authentication attempts per minute
- OAuth callback handling
- User creation limits

## 🗄️ **Database Schema Updates**

### 1. **Profiles Table Enhancement**
```sql
-- Add social authentication fields to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_provider VARCHAR(50);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_id VARCHAR(255);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;

-- Create index for social authentication
CREATE INDEX IF NOT EXISTS idx_profiles_social ON profiles(social_provider, social_id);
```

### 2. **User Roles Integration**
```sql
-- Ensure social users get default role
CREATE OR REPLACE FUNCTION handle_social_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert default role for social users
  INSERT INTO user_roles (user_id, role, created_at)
  VALUES (NEW.id, 'member', NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for social authentication
CREATE TRIGGER trigger_social_auth
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_social_auth();
```

## 🧪 **Testing Social Authentication**

### 1. **Local Development Testing**
```bash
# Start development server
npm run dev

# Test Google Sign In
# 1. Click "Continue with Google"
# 2. Complete OAuth flow
# 3. Verify redirect to callback page
# 4. Check user creation in Supabase

# Test Facebook Sign In
# 1. Click "Continue with Facebook"
# 2. Complete OAuth flow
# 3. Verify user data import
# 4. Check profile creation
```

### 2. **Production Testing**
```bash
# Deploy to production
npm run build

# Test with production URLs
# 1. Verify OAuth redirects work
# 2. Test user creation flow
# 3. Check role assignment
# 4. Verify dashboard access
```

### 3. **Error Handling Testing**
- Test with invalid credentials
- Test network failures
- Test OAuth cancellation
- Test callback errors

## 🔍 **Troubleshooting**

### Common Issues

1. **OAuth Redirect Errors**
   - Verify redirect URIs in provider settings
   - Check Supabase callback URL configuration
   - Ensure HTTPS for production

2. **User Creation Failures**
   - Check database triggers and functions
   - Verify RLS policies
   - Check profile table constraints

3. **Role Assignment Issues**
   - Verify user_roles table structure
   - Check trigger function execution
   - Review role-based routing

### Debug Steps

1. **Check Browser Console**
   - Look for OAuth errors
   - Verify redirect URLs
   - Check network requests

2. **Supabase Logs**
   - Check authentication logs
   - Review user creation events
   - Monitor OAuth callbacks

3. **Database Queries**
   ```sql
   -- Check user creation
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
   
   -- Check profile creation
   SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;
   
   -- Check role assignment
   SELECT * FROM user_roles ORDER BY created_at DESC LIMIT 5;
   ```

## 📊 **Monitoring and Analytics**

### 1. **Authentication Metrics**
- Track social login success rates
- Monitor user creation patterns
- Analyze provider usage

### 2. **Error Tracking**
- Log OAuth failures
- Monitor callback errors
- Track user experience issues

### 3. **Security Monitoring**
- Monitor suspicious login patterns
- Track failed authentication attempts
- Review access logs regularly

## 🚀 **Deployment Checklist**

### Pre-Deployment
- [ ] All OAuth providers configured
- [ ] Environment variables set
- [ ] Database schema updated
- [ ] CORS configured
- [ ] Redirect URLs verified

### Post-Deployment
- [ ] Test all social login flows
- [ ] Verify user creation
- [ ] Check role assignment
- [ ] Test dashboard access
- [ ] Monitor error logs

## 📚 **Additional Resources**

### Documentation
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Guide](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)

### Support
- Supabase Community: [Discord](https://discord.supabase.com/)
- Google Cloud Support: [Support Portal](https://cloud.google.com/support)
- Facebook Developers: [Community](https://developers.facebook.com/community/)

## ✅ **Conclusion**

Social authentication is now fully integrated into LivingRockCMS with:

1. **Google Authentication**: Complete OAuth 2.0 implementation
2. **Facebook Authentication**: Full Facebook Login integration
3. **WhatsApp Authentication**: Placeholder for future implementation
4. **Security**: Proper error handling and validation
5. **User Experience**: Seamless login flow with role-based access

The implementation provides a modern, secure, and user-friendly authentication experience while maintaining the existing role-based access control system. 