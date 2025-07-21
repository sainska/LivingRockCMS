# Living Rock CMS - Database Schema Analysis

## Overview
This document analyzes the database schema structure and RLS (Row Level Security) settings for the Living Rock CMS system.

## Database Structure

### 1. Core Tables Identified

#### **User Management**
- `profiles` - Extends auth.users with additional user information
- `members` - Church member specific information
- `user_roles` - Role assignments for users

#### **Ministry Management**
- `ministries` - Church ministries and groups
- `ministry_members` - Member assignments to ministries
- `ministry_groups` - Sub-groups within ministries
- `ministry_group_members` - Member assignments to ministry groups

#### **Financial Management**
- `financial_accounts` - Different financial accounts (tithe, offering, etc.)
- `financial_transactions` - All financial transactions
- `pledges` - Member pledges and commitments

#### **Event Management**
- `events` - Church events and activities
- `attendance_records` - Member attendance tracking
- `volunteer_opportunities` - Volunteer roles for events
- `volunteer_signups` - Volunteer signup tracking

#### **Pastoral Care**
- `pastoral_visits` - Pastoral visit records
- `counseling_sessions` - Counseling session records
- `pastoral_support_requests` - Support request tracking

#### **Communication**
- `announcements` - Church announcements
- `messages` - Internal messaging system
- `prayer_requests` - Prayer request tracking

#### **System Tables**
- `audit_logs` - System audit trail
- `church_settings` - Church configuration settings

### 2. Enum Types

```sql
-- User roles for access control
CREATE TYPE public.user_role AS ENUM (
  'system_admin', 
  'clergy', 
  'treasurer', 
  'secretary', 
  'member'
);

-- Member status tracking
CREATE TYPE public.member_status AS ENUM (
  'active', 
  'inactive', 
  'deceased', 
  'transferred'
);

-- Event categorization
CREATE TYPE public.event_type AS ENUM (
  'service', 
  'meeting', 
  'conference', 
  'social', 
  'outreach', 
  'other'
);

-- Financial transaction types
CREATE TYPE public.donation_type AS ENUM (
  'tithe', 
  'offering', 
  'special', 
  'project', 
  'missions'
);

-- Payment methods
CREATE TYPE public.payment_method AS ENUM (
  'cash', 
  'check', 
  'card', 
  'bank_transfer', 
  'mobile_money'
);
```

## Row Level Security (RLS) Analysis

### Current RLS Status
Based on the migration files examined, **RLS policies are not explicitly defined** in the current schema. This is a critical security gap that needs to be addressed.

### Required RLS Policies

#### 1. **Profiles Table RLS**
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- System admins can view all profiles
CREATE POLICY "System admins can view all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'system_admin'
    )
  );
```

#### 2. **Members Table RLS**
```sql
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Members can view their own member record
CREATE POLICY "Members can view own record" ON public.members
  FOR SELECT USING (user_id = auth.uid());

-- Clergy and admins can view all member records
CREATE POLICY "Clergy and admins can view all members" ON public.members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );
```

#### 3. **Financial Transactions RLS**
```sql
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;

-- Members can only see their own transactions
CREATE POLICY "Members can view own transactions" ON public.financial_transactions
  FOR SELECT USING (user_id = auth.uid());

-- Treasurers and admins can view all transactions
CREATE POLICY "Treasurers can view all transactions" ON public.financial_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'treasurer')
    )
  );
```

#### 4. **Events Table RLS**
```sql
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view events
CREATE POLICY "All users can view events" ON public.events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only clergy and admins can create/edit events
CREATE POLICY "Clergy and admins can manage events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );
```

#### 5. **Attendance Records RLS**
```sql
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

-- Members can view their own attendance
CREATE POLICY "Members can view own attendance" ON public.attendance_records
  FOR SELECT USING (user_id = auth.uid());

-- Clergy and admins can view all attendance
CREATE POLICY "Clergy and admins can view all attendance" ON public.attendance_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system_admin', 'clergy', 'secretary')
    )
  );
```

## Security Recommendations

### 1. **Immediate Actions Required**
- Enable RLS on all tables
- Implement role-based access policies
- Add audit logging for sensitive operations
- Implement data encryption for sensitive fields

### 2. **Role-Based Access Control**
- **System Admin**: Full access to all data
- **Clergy**: Access to member data, pastoral care, events
- **Treasurer**: Access to financial data only
- **Secretary**: Access to member management, events, communications
- **Member**: Access to own data only

### 3. **Data Privacy Considerations**
- Implement data retention policies
- Add GDPR compliance features
- Encrypt sensitive personal information
- Implement data export/deletion capabilities

### 4. **Audit and Monitoring**
- Log all data access attempts
- Monitor for suspicious activity
- Implement automated security alerts
- Regular security audits

## Next Steps

1. **Implement RLS Policies**: Add the security policies outlined above
2. **Test Access Control**: Verify that users can only access appropriate data
3. **Add Audit Logging**: Implement comprehensive audit trails
4. **Security Review**: Conduct a thorough security assessment
5. **Documentation**: Update user documentation with security guidelines

## Migration Script

The following migration should be created to implement these security measures:

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
-- ... (continue for all tables)

-- Add RLS policies as outlined above
-- ... (implement all policies)
```

This analysis provides a foundation for implementing proper security measures in the Living Rock CMS database. 