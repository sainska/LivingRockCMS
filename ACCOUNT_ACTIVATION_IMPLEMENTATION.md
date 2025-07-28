# Account Activation System Implementation

## 🎯 **Overview**

This implementation adds a comprehensive account activation system to LivingRockCMS that requires admin approval for new user accounts, while automatically activating social authentication users.

## ✅ **Features Implemented**

### **1. Admin Account Activation Workflow**
- New users require admin approval before accessing the system
- Admin dashboard with pending activation requests
- Approve/reject functionality with notes
- Activation statistics and monitoring

### **2. Social Authentication Integration**
- Google sign-in automatically extracts and saves user names
- Social auth users are auto-activated (no admin approval needed)
- Proper name extraction from Google metadata

### **3. Database Schema Updates**
- Added activation fields to `profiles` table
- Created `activation_requests` table for workflow tracking
- Added activation functions and views

## 🗄️ **Database Changes**

### **Profiles Table Updates**
```sql
-- Added activation fields
ALTER TABLE profiles ADD COLUMN is_activated BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN activation_requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE profiles ADD COLUMN activated_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN activated_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN activation_notes TEXT;
```

### **New Activation Requests Table**
```sql
CREATE TABLE activation_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES profiles(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status user_activation_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 **Admin Functions**

### **Approve User Activation**
```sql
SELECT approve_user_activation(
  target_user_id UUID,
  admin_user_id UUID,
  notes TEXT DEFAULT NULL
);
```

### **Reject User Activation**
```sql
SELECT reject_user_activation(
  target_user_id UUID,
  admin_user_id UUID,
  notes TEXT DEFAULT NULL
);
```

### **Get Pending Activations**
```sql
SELECT * FROM get_pending_activations();
```

### **Get Activation Statistics**
```sql
SELECT * FROM get_activation_stats();
```

## 🎨 **UI Components**

### **AccountActivation Component**
- **Location**: `src/components/admin/AccountActivation.jsx`
- **Features**:
  - List of pending activation requests
  - Approve/reject functionality
  - Search and filter capabilities
  - Activation statistics dashboard
  - User details modal

### **Admin Dashboard Integration**
- **Location**: `src/components/admin/AdminDashboard.jsx`
- **Added**: "Account Activation" quick action button
- **Route**: `/admin/account-activation`

## 🔐 **Authentication Updates**

### **AuthContext Enhancements**
- **Location**: `src/contexts/AuthContext.jsx`
- **Added Functions**:
  - `checkUserActivation()` - Check if user is activated
  - Enhanced `handleSocialAuthCallback()` - Auto-activate social users
  - Improved name extraction from Google metadata

### **Google Sign-In Name Extraction**
```javascript
// Extract user names from Google metadata
const firstName = user.user_metadata?.given_name || user.user_metadata?.first_name || '';
const lastName = user.user_metadata?.family_name || user.user_metadata?.last_name || '';
const fullName = user.user_metadata?.full_name || user.user_metadata?.name || '';

// Update profile with extracted names
await supabase.from('profiles').update({
  first_name: firstName || fullName.split(' ')[0] || '',
  last_name: lastName || fullName.split(' ').slice(1).join(' ') || '',
  // ... other fields
});
```

## 🚀 **Setup Instructions**

### **Step 1: Run the Migration**
```bash
node run-account-activation-setup.mjs
```

### **Step 2: Update Google OAuth Configuration**
1. Go to Google Cloud Console
2. Update authorized redirect URIs to include:
   ```
   http://localhost:8080/auth/callback
   http://localhost:3000/auth/callback
   https://xxfsnejccbszsjmtwnvj.supabase.co/auth/v1/callback
   ```

### **Step 3: Update Supabase Configuration**
1. Go to Supabase Dashboard
2. Set Site URL to: `http://localhost:8080`
3. Add redirect URL: `http://localhost:8080/auth/callback`

### **Step 4: Test the System**
1. Start your development server: `npm run dev`
2. Test Google sign-in - should auto-activate
3. Test email registration - should require admin approval
4. Access admin dashboard to approve/reject accounts

## 📊 **Workflow**

### **Email Registration Flow**
1. User registers with email/password
2. Account created with `is_activated = FALSE`
3. Activation request created in `activation_requests` table
4. User sees "Account pending approval" message
5. Admin receives notification in dashboard
6. Admin approves/rejects the account
7. User receives email notification
8. User can now access the system

### **Social Authentication Flow**
1. User clicks "Continue with Google"
2. Google OAuth redirects to callback
3. User profile created with extracted names
4. Account auto-activated (`is_activated = TRUE`)
5. User immediately redirected to dashboard

## 🔍 **Admin Dashboard Features**

### **Account Activation Page**
- **Statistics Cards**: Total users, activated, pending, activation rate
- **Pending Users Table**: List of users awaiting approval
- **Search & Filter**: Find users by name, email, or registration type
- **Action Buttons**: Approve, reject, view details
- **Notes System**: Add approval/rejection reasons

### **User Details Modal**
- Full user information
- Registration method (social vs email)
- Request timestamp
- Admin notes

## 🛡️ **Security Features**

### **Row Level Security (RLS)**
- Only admins can view all activation requests
- Users can only view their own activation requests
- Proper role-based access control

### **Admin Permissions**
- Only `system_admin` and `clergy` roles can approve/reject
- All actions are logged with admin user ID
- Audit trail maintained

## 📈 **Monitoring & Analytics**

### **Activation Statistics**
- Total users count
- Activated users count
- Pending users count
- Activation rate percentage
- Social vs email registration breakdown

### **Views for Reporting**
- `pending_activations_view` - Current pending requests
- `activation_history_view` - Complete activation history

## 🧪 **Testing Checklist**

### **Google Sign-In Testing**
- [ ] User names are properly extracted and saved
- [ ] Social users are auto-activated
- [ ] Profile data is correctly populated
- [ ] Redirect flow works properly

### **Email Registration Testing**
- [ ] New users require admin approval
- [ ] Activation requests are created
- [ ] Admin can approve/reject accounts
- [ ] Users receive proper notifications

### **Admin Dashboard Testing**
- [ ] Account activation page loads correctly
- [ ] Statistics are accurate
- [ ] Search and filter work
- [ ] Approve/reject functions work
- [ ] User details modal displays correctly

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Google OAuth Redirect Error**
   - **Solution**: Update redirect URIs in Google Console

2. **User Names Not Saving**
   - **Solution**: Check Google metadata structure in AuthContext

3. **Admin Can't Access Activation Page**
   - **Solution**: Verify user has `system_admin` or `clergy` role

4. **Activation Functions Not Working**
   - **Solution**: Run the migration script again

### **Debug Commands**
```sql
-- Check activation status
SELECT * FROM profiles WHERE is_activated = FALSE;

-- Check pending requests
SELECT * FROM activation_requests WHERE status = 'pending';

-- Check activation statistics
SELECT * FROM get_activation_stats();
```

## 🎉 **Success Indicators**

- ✅ Google sign-in extracts and saves user names
- ✅ Social auth users are auto-activated
- ✅ Email registration requires admin approval
- ✅ Admin dashboard shows pending activations
- ✅ Approve/reject functionality works
- ✅ Activation statistics are accurate
- ✅ RLS policies are enforced

## 📚 **Files Modified/Created**

### **New Files**
- `supabase/migrations/20250721095000_account_activation_system.sql`
- `src/components/admin/AccountActivation.jsx`
- `run-account-activation-setup.mjs`
- `ACCOUNT_ACTIVATION_IMPLEMENTATION.md`

### **Modified Files**
- `src/contexts/AuthContext.jsx` - Added activation functions
- `src/components/admin/AdminDashboard.jsx` - Added activation button
- `src/App.jsx` - Added activation route

The account activation system is now fully implemented and ready for use! 