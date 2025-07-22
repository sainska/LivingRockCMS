-- Dashboard Full Schema for Living Rock CMS
-- This file creates all tables needed for all dashboards and modules

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    gender TEXT,
    date_of_birth DATE,
    photo_url TEXT,
    membership_status TEXT,
    membership_number TEXT,
    join_date DATE,
    privacy_settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    event_type TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Attendance Records
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    attendance_status TEXT DEFAULT 'present',
    recorded_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 5. Financial Accounts
CREATE TABLE IF NOT EXISTS public.financial_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT,
    balance NUMERIC(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Financial Transactions
CREATE TABLE IF NOT EXISTS public.financial_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    account_id UUID REFERENCES public.financial_accounts(id),
    amount NUMERIC(12,2) NOT NULL,
    transaction_type TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    status TEXT,
    receipt_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Donations
CREATE TABLE IF NOT EXISTS public.donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id UUID REFERENCES public.profiles(id),
    amount NUMERIC(12,2) NOT NULL,
    donation_type TEXT,
    donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- 8. Pledges
CREATE TABLE IF NOT EXISTS public.pledges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    project_name TEXT,
    amount_pledged NUMERIC(12,2),
    amount_fulfilled NUMERIC(12,2),
    due_date DATE,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year INT,
    total_amount NUMERIC(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Budget Categories
CREATE TABLE IF NOT EXISTS public.budget_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID REFERENCES public.budgets(id),
    name TEXT,
    allocated_amount NUMERIC(12,2),
    spent_amount NUMERIC(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    budget_year INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Ministry Groups
CREATE TABLE IF NOT EXISTS public.ministry_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    meeting_time TEXT,
    location TEXT,
    leader_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Ministry Group Members
CREATE TABLE IF NOT EXISTS public.ministry_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ministry_group_id UUID REFERENCES public.ministry_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Sacraments
CREATE TABLE IF NOT EXISTS public.sacraments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    sacrament_type TEXT,
    date DATE,
    place TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. Pastoral Visits
CREATE TABLE IF NOT EXISTS public.pastoral_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.profiles(id),
    pastor_id UUID REFERENCES public.profiles(id),
    visit_date DATE,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Counseling Sessions
CREATE TABLE IF NOT EXISTS public.counseling_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.profiles(id),
    counselor_id UUID REFERENCES public.profiles(id),
    session_date DATE,
    status TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES public.profiles(id),
    recipient_id UUID REFERENCES public.profiles(id),
    subject TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. Announcements
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    content TEXT,
    announcement_type TEXT,
    priority INT,
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. Badges
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. Member Badges
CREATE TABLE IF NOT EXISTS public.member_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_id UUID REFERENCES public.badges(id),
    user_id UUID REFERENCES public.profiles(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. Surveys
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    description TEXT,
    status TEXT,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. Survey Responses
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES public.surveys(id),
    user_id UUID REFERENCES public.profiles(id),
    response TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. Transaction Logs
CREATE TABLE IF NOT EXISTS public.transaction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT,
    user_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT,
    user_id UUID REFERENCES public.profiles(id),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 24. Backups
CREATE TABLE IF NOT EXISTS public.backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 25. Document Templates
CREATE TABLE IF NOT EXISTS public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. Settings
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 27. Roles
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 28. Expense Approvals
CREATE TABLE IF NOT EXISTS public.expense_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expense_name TEXT,
    amount NUMERIC(12,2),
    requested_by UUID REFERENCES public.profiles(id),
    status TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 29. Recurring Expenses
CREATE TABLE IF NOT EXISTS public.recurring_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    amount NUMERIC(12,2),
    frequency TEXT,
    next_due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 30. Donation Campaigns
CREATE TABLE IF NOT EXISTS public.donation_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 31. Ministry Members (for useMinistries.js)
CREATE TABLE IF NOT EXISTS public.ministry_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ministry_id UUID REFERENCES public.ministry_groups(id),
    member_id UUID REFERENCES public.profiles(id),
    is_active BOOLEAN DEFAULT TRUE,
    joined_date DATE,
    role TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add any additional tables as needed for your app
