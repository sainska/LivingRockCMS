# Google OAuth Setup Fix for LivingRockCMS

## 🚨 **Issue Identified**
Your Google OAuth is working correctly, but the redirect URL is pointing to Supabase's default callback instead of your application's callback page.

## 🔧 **Solution: Update Google OAuth Configuration**

### **Step 1: Update Google Cloud Console**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID for LivingRockCMS
   - Click on it to edit

3. **Update Authorized Redirect URIs**
   Add these URLs to the "Authorized redirect URIs" section:
   ```
   http://localhost:8080/auth/callback
   http://localhost:3000/auth/callback
   https://xxfsnejccbszsjmtwnvj.supabase.co/auth/v1/callback
   ```

4. **Save Changes**
   - Click "Save" to apply the changes

### **Step 2: Update Supabase Configuration**

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/xxfsnejccbszsjmtwnvj
   - Navigate to "Authentication" > "URL Configuration"

2. **Update Site URL**
   - Set "Site URL" to: `http://localhost:8080`
   - Set "Redirect URLs" to include: `http://localhost:8080/auth/callback`

3. **Update Google Provider Settings**
   - Go to "Authentication" > "Providers" > "Google"
   - Ensure "Redirect URL" is set to: `http://localhost:8080/auth/callback`

### **Step 3: Verify Your App Configuration**

Check your `src/contexts/AuthContext.jsx` to ensure the redirect URL is correct:

```javascript
const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google Sign In Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  } catch (error) {
    console.error('Unexpected error during Google sign in:', error);
  }
};
```

## 🧪 **Testing the Fix**

### **Test 1: Local Development**
1. Start your development server: `npm run dev`
2. Go to: `http://localhost:8080/auth`
3. Click "Continue with Google"
4. Complete the OAuth flow
5. Should redirect to: `http://localhost:8080/auth/callback`

### **Test 2: Check Browser Console**
Look for these successful messages:
```
✅ Google OAuth initiated
✅ Redirecting to Google...
✅ OAuth callback received
✅ User authenticated successfully
```

### **Test 3: Verify User Creation**
After successful login, check:
1. User appears in Supabase Auth dashboard
2. Profile created in `profiles` table
3. Role assigned in `user_roles` table
4. Redirected to appropriate dashboard

## 🔍 **Common Issues and Solutions**

### **Issue 1: "Invalid redirect_uri" Error**
**Solution**: Ensure the redirect URI in Google Console exactly matches what Supabase expects.

### **Issue 2: "redirect_uri_mismatch" Error**
**Solution**: Add all possible redirect URLs to Google Console:
- Development: `http://localhost:8080/auth/callback`
- Production: `https://yourdomain.com/auth/callback`
- Supabase: `https://xxfsnejccbszsjmtwnvj.supabase.co/auth/v1/callback`

### **Issue 3: Callback Page Not Found**
**Solution**: Ensure your `AuthCallback.jsx` component is properly routed in `App.jsx`:

```javascript
<Route path="/auth/callback" element={<AuthCallback />} />
```

## 📊 **Expected Flow After Fix**

1. **User clicks "Continue with Google"**
2. **Redirects to Google OAuth**: `https://accounts.google.com/oauth/authorize?...`
3. **User authorizes the app**
4. **Google redirects to**: `http://localhost:8080/auth/callback?code=...&state=...`
5. **AuthCallback component handles the response**
6. **User is authenticated and redirected to dashboard**

## ✅ **Verification Checklist**

- [ ] Google OAuth Client ID configured
- [ ] Redirect URIs updated in Google Console
- [ ] Supabase site URL set correctly
- [ ] AuthCallback route configured in App.jsx
- [ ] Test OAuth flow locally
- [ ] Verify user creation in database
- [ ] Check role assignment
- [ ] Test dashboard access

## 🚀 **Next Steps**

After fixing the redirect URL:

1. **Test the complete OAuth flow**
2. **Verify user data is properly stored**
3. **Check role-based access control**
4. **Test dashboard functionality**
5. **Monitor for any remaining issues**

The 302 status code you saw is actually a good sign - it means Google OAuth is working! The issue is just the redirect URL configuration. 