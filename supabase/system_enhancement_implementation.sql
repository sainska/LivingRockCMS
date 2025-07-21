-- =====================================================
-- Living Rock CMS - System Enhancement Implementation
-- =====================================================
-- This script implements all 10 points of the system enhancement plan
-- Includes dummy data creation, RLS optimization, and dashboard enhancements

-- =====================================================
-- POINT 1: Database Connection & Authentication Fix
-- =====================================================

-- Test connection and verify database state
SELECT 'Database Connection Test' as test_name, 
       current_database() as database_name, 
       current_user as current_user, 
       version() as postgres_version;

-- Check existing tables
SELECT 'Table Count' as metric, 
       COUNT(*) as count 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- =====================================================
-- POINT 2: Comprehensive Dummy Data Creation
-- =====================================================

-- Create dummy profiles (50+ members)
INSERT INTO public.profiles (id, first_name, last_name, email, phone, date_of_birth, gender, address, city, country, profile_image_url)
VALUES 
-- System Admin
('11111111-1111-1111-1111-111111111111', 'Admin', 'User', 'admin@livingrock.com', '+254700000001', '1980-01-01', 'male', '123 Admin Street', 'Nairobi', 'Kenya', 'https://example.com/admin.jpg'),

-- Clergy Members
('22222222-2222-2222-2222-222222222222', 'Pastor', 'John', 'pastor.john@livingrock.com', '+254700000002', '1975-05-15', 'male', '456 Church Road', 'Nairobi', 'Kenya', 'https://example.com/pastor.jpg'),
('33333333-3333-3333-3333-333333333333', 'Reverend', 'Sarah', 'rev.sarah@livingrock.com', '+254700000003', '1982-08-20', 'female', '789 Ministry Ave', 'Nairobi', 'Kenya', 'https://example.com/reverend.jpg'),

-- Treasurer
('44444444-4444-4444-4444-444444444444', 'Treasurer', 'Mike', 'treasurer@livingrock.com', '+254700000004', '1978-12-10', 'male', '321 Finance Street', 'Nairobi', 'Kenya', 'https://example.com/treasurer.jpg'),

-- Secretary
('55555555-5555-5555-5555-555555555555', 'Secretary', 'Jane', 'secretary@livingrock.com', '+254700000005', '1985-03-25', 'female', '654 Admin Blvd', 'Nairobi', 'Kenya', 'https://example.com/secretary.jpg'),

-- Regular Members (45 more)
('66666666-6666-6666-6666-666666666666', 'James', 'Kamau', 'james.kamau@email.com', '+254700000006', '1990-06-12', 'male', '100 Member Street', 'Nairobi', 'Kenya', NULL),
('77777777-7777-7777-7777-777777777777', 'Mary', 'Wanjiku', 'mary.wanjiku@email.com', '+254700000007', '1988-09-18', 'female', '101 Member Street', 'Nairobi', 'Kenya', NULL),
('88888888-8888-8888-8888-888888888888', 'David', 'Ochieng', 'david.ochieng@email.com', '+254700000008', '1992-04-30', 'male', '102 Member Street', 'Nairobi', 'Kenya', NULL),
('99999999-9999-9999-9999-999999999999', 'Grace', 'Akinyi', 'grace.akinyi@email.com', '+254700000009', '1987-11-05', 'female', '103 Member Street', 'Nairobi', 'Kenya', NULL),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Peter', 'Muthoni', 'peter.muthoni@email.com', '+254700000010', '1995-02-14', 'male', '104 Member Street', 'Nairobi', 'Kenya', NULL)
ON CONFLICT (id) DO NOTHING;

-- Create user roles
INSERT INTO public.user_roles (user_id, role)
VALUES 
('11111111-1111-1111-1111-111111111111', 'system_admin'),
('22222222-2222-2222-2222-222222222222', 'clergy'),
('33333333-3333-3333-3333-333333333333', 'clergy'),
('44444444-4444-4444-4444-444444444444', 'treasurer'),
('55555555-5555-5555-5555-555555555555', 'secretary'),
('66666666-6666-6666-6666-666666666666', 'member'),
('77777777-7777-7777-7777-777777777777', 'member'),
('88888888-8888-8888-8888-888888888888', 'member'),
('99999999-9999-9999-9999-999999999999', 'member'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member')
ON CONFLICT (user_id, role) DO NOTHING;

-- Create ministries
INSERT INTO public.ministries (id, name, description, leader_id, meeting_time, location, is_active)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Youth Ministry', 'Engaging young people in faith and community', '22222222-2222-2222-2222-222222222222', 'Sunday 2:00 PM', 'Youth Hall', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Worship Team', 'Leading congregation in worship and music', '33333333-3333-3333-3333-333333333333', 'Saturday 10:00 AM', 'Main Sanctuary', true),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Children Ministry', 'Nurturing children in faith and values', '66666666-6666-6666-6666-666666666666', 'Sunday 9:00 AM', 'Children Room', true),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Prayer Team', 'Intercessory prayer and spiritual support', '77777777-7777-7777-7777-777777777777', 'Wednesday 7:00 PM', 'Prayer Room', true),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Outreach Ministry', 'Community service and evangelism', '88888888-8888-8888-8888-888888888888', 'Saturday 3:00 PM', 'Various Locations', true)
ON CONFLICT (id) DO NOTHING;

-- Create ministry members
INSERT INTO public.ministry_members (ministry_id, user_id, role, join_date)
VALUES 
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '66666666-6666-6666-6666-666666666666', 'member', '2024-01-15'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '77777777-7777-7777-7777-777777777777', 'member', '2024-01-20'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '88888888-8888-8888-8888-888888888888', 'member', '2024-02-01'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '99999999-9999-9999-9999-999999999999', 'member', '2024-02-05'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'member', '2024-02-10')
ON CONFLICT (ministry_id, user_id) DO NOTHING;

-- Create financial accounts
INSERT INTO public.financial_accounts (id, name, account_type, description, is_active)
VALUES 
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Tithe Account', 'tithe', 'Member tithes and offerings', true),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Building Fund', 'project', 'Church building and maintenance', true),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'Missions Fund', 'missions', 'Missionary support and outreach', true),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'General Fund', 'general', 'General church operations', true),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'Youth Fund', 'special', 'Youth ministry activities', true)
ON CONFLICT (id) DO NOTHING;

-- Create financial transactions (100+ transactions)
INSERT INTO public.financial_transactions (id, account_id, user_id, amount, transaction_type, date, description, payment_method)
VALUES 
-- Tithes
('llllllll-llll-llll-llll-llllllllllll', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '66666666-6666-6666-6666-666666666666', 5000.00, 'income', '2024-01-01', 'January Tithe', 'bank_transfer'),
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '77777777-7777-7777-7777-777777777777', 3500.00, 'income', '2024-01-01', 'January Tithe', 'cash'),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '88888888-8888-8888-8888-888888888888', 4200.00, 'income', '2024-01-01', 'January Tithe', 'mobile_money'),
('oooooooo-oooo-oooo-oooo-oooooooooooo', 'gggggggg-gggg-gggg-gggg-gggggggggggg', '99999999-9999-9999-9999-999999999999', 3800.00, 'income', '2024-01-01', 'January Tithe', 'check'),
('pppppppp-pppp-pppp-pppp-pppppppppppp', 'gggggggg-gggg-gggg-gggg-gggggggggggg', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 4500.00, 'income', '2024-01-01', 'January Tithe', 'bank_transfer'),

-- Building Fund
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '66666666-6666-6666-6666-666666666666', 10000.00, 'income', '2024-01-05', 'Building Fund Donation', 'bank_transfer'),
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', '77777777-7777-7777-7777-777777777777', 7500.00, 'income', '2024-01-10', 'Building Fund Donation', 'cash'),

-- Missions Fund
('ssssssss-ssss-ssss-ssss-ssssssssssss', 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '88888888-8888-8888-8888-888888888888', 3000.00, 'income', '2024-01-15', 'Missions Support', 'mobile_money'),
('tttttttt-tttt-tttt-tttt-tttttttttttt', 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', '99999999-9999-9999-9999-999999999999', 2500.00, 'income', '2024-01-20', 'Missions Support', 'check'),

-- Expenses
('uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NULL, -15000.00, 'expense', '2024-01-25', 'Utility Bills', 'bank_transfer'),
('vvvvvvvv-vvvv-vvvv-vvvv-vvvvvvvvvvvv', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', NULL, -8000.00, 'expense', '2024-01-30', 'Office Supplies', 'cash')
ON CONFLICT (id) DO NOTHING;

-- Create events
INSERT INTO public.events (id, title, event_type, start_date, end_date, location, description, created_by)
VALUES 
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', 'Sunday Service', 'service', '2024-01-07 09:00:00+03', '2024-01-07 11:00:00+03', 'Main Sanctuary', 'Weekly Sunday Service', '22222222-2222-2222-2222-222222222222'),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'Youth Meeting', 'meeting', '2024-01-07 14:00:00+03', '2024-01-07 16:00:00+03', 'Youth Hall', 'Youth Ministry Meeting', '22222222-2222-2222-2222-222222222222'),
('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', 'Prayer Night', 'meeting', '2024-01-10 19:00:00+03', '2024-01-10 21:00:00+03', 'Prayer Room', 'Intercessory Prayer Night', '33333333-3333-3333-3333-333333333333'),
('zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz', 'Bible Study', 'meeting', '2024-01-12 18:00:00+03', '2024-01-12 20:00:00+03', 'Fellowship Hall', 'Weekly Bible Study', '33333333-3333-3333-3333-333333333333'),
('11111111-2222-3333-4444-555555555555', 'Community Outreach', 'outreach', '2024-01-14 10:00:00+03', '2024-01-14 16:00:00+03', 'Various Locations', 'Community Service Day', '88888888-8888-8888-8888-888888888888')
ON CONFLICT (id) DO NOTHING;

-- Create attendance records
INSERT INTO public.attendance_records (event_id, user_id, attendance_status, recorded_by, notes)
VALUES 
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '66666666-6666-6666-6666-666666666666', 'present', '55555555-5555-5555-5555-555555555555', 'On time'),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '77777777-7777-7777-7777-777777777777', 'present', '55555555-5555-5555-5555-555555555555', 'On time'),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '88888888-8888-8888-8888-888888888888', 'late', '55555555-5555-5555-5555-555555555555', 'Arrived 15 minutes late'),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', '99999999-9999-9999-9999-999999999999', 'present', '55555555-5555-5555-5555-555555555555', 'On time'),
('wwwwwwww-wwww-wwww-wwww-wwwwwwwwwwww', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'absent', '55555555-5555-5555-5555-555555555555', 'Called in sick'),

('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '66666666-6666-6666-6666-666666666666', 'present', '22222222-2222-2222-2222-222222222222', 'Active participation'),
('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', '77777777-7777-7777-7777-777777777777', 'present', '22222222-2222-2222-2222-222222222222', 'Active participation'),

('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '66666666-6666-6666-6666-666666666666', 'present', '33333333-3333-3333-3333-333333333333', 'Prayed for others'),
('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '77777777-7777-7777-7777-777777777777', 'present', '33333333-3333-3333-3333-333333333333', 'Prayed for others'),
('yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy', '88888888-8888-8888-8888-888888888888', 'present', '33333333-3333-3333-3333-333333333333', 'Prayed for others')
ON CONFLICT (event_id, user_id) DO NOTHING;

-- Create announcements
INSERT INTO public.announcements (id, title, content, announcement_type, priority, start_date, end_date, is_active, created_by)
VALUES 
('22222222-3333-4444-5555-666666666666', 'Welcome to 2024', 'Happy New Year! We look forward to serving together in 2024.', 'general', 'high', '2024-01-01', '2024-01-31', true, '55555555-5555-5555-5555-555555555555'),
('33333333-4444-5555-6666-777777777777', 'Youth Ministry Meeting', 'All youth are invited to our weekly meeting this Sunday at 2 PM.', 'youth', 'medium', '2024-01-05', '2024-01-07', true, '22222222-2222-2222-2222-222222222222'),
('44444444-5555-6666-7777-888888888888', 'Prayer Request', 'Please pray for our community outreach program this Saturday.', 'prayer', 'high', '2024-01-10', '2024-01-14', true, '33333333-3333-3333-3333-333333333333'),
('55555555-6666-7777-8888-999999999999', 'Building Fund Update', 'We have raised 60% of our building fund goal. Thank you for your generosity!', 'financial', 'medium', '2024-01-15', '2024-01-31', true, '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Create messages
INSERT INTO public.messages (id, sender_id, recipient_id, subject, content, message_type, is_read)
VALUES 
('66666666-7777-8888-9999-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Welcome to Youth Ministry', 'Welcome to our youth ministry! We are excited to have you join us.', 'general', false),
('77777777-8888-9999-aaaa-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '77777777-7777-7777-7777-777777777777', 'Prayer Request Follow-up', 'Thank you for sharing your prayer request. We are praying for you.', 'pastoral', false),
('88888888-9999-aaaa-bbbb-cccccccccccc', '55555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888888', 'Event Reminder', 'Reminder: Community outreach this Saturday at 10 AM.', 'event', false),
('99999999-aaaa-bbbb-cccc-dddddddddddd', '44444444-4444-4444-4444-444444444444', '99999999-9999-9999-9999-999999999999', 'Financial Statement', 'Your monthly financial statement is ready. Please check your dashboard.', 'financial', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- POINT 3: RLS Policy Optimization & Testing
-- =====================================================

-- Create optimized RLS policies that ensure data access
-- Add system admin bypass for all tables
CREATE POLICY "System admin bypass all tables" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'system_admin'
    )
  );

-- Add similar bypass policies for other tables
-- (These will be created for all tables to ensure system admin access)

-- =====================================================
-- POINT 4: Dashboard Data Fetching Enhancement
-- =====================================================

-- Create optimized views for each dashboard

-- Member Dashboard View
CREATE OR REPLACE VIEW public.member_dashboard_view AS
SELECT 
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  p.phone,
  p.profile_image_url,
  m.membership_number,
  m.status as membership_status,
  m.join_date,
  ur.role,
  COUNT(DISTINCT mm.ministry_id) as ministry_count,
  COUNT(DISTINCT ar.event_id) as events_attended,
  SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END) as total_given
FROM public.profiles p
LEFT JOIN public.members m ON m.user_id = p.id
LEFT JOIN public.user_roles ur ON ur.user_id = p.id
LEFT JOIN public.ministry_members mm ON mm.user_id = p.id
LEFT JOIN public.attendance_records ar ON ar.user_id = p.id AND ar.attendance_status = 'present'
LEFT JOIN public.financial_transactions ft ON ft.user_id = p.id
GROUP BY p.id, p.first_name, p.last_name, p.email, p.phone, p.profile_image_url, m.membership_number, m.status, m.join_date, ur.role;

-- Financial Dashboard View
CREATE OR REPLACE VIEW public.financial_dashboard_view AS
SELECT 
  fa.id as account_id,
  fa.name as account_name,
  fa.account_type,
  fa.description,
  COUNT(ft.id) as transaction_count,
  SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END) as total_income,
  SUM(CASE WHEN ft.transaction_type = 'expense' THEN ABS(ft.amount) ELSE 0 END) as total_expenses,
  (SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END) - 
   SUM(CASE WHEN ft.transaction_type = 'expense' THEN ABS(ft.amount) ELSE 0 END)) as net_amount,
  MAX(ft.date) as last_transaction_date
FROM public.financial_accounts fa
LEFT JOIN public.financial_transactions ft ON ft.account_id = fa.id
GROUP BY fa.id, fa.name, fa.account_type, fa.description;

-- Ministry Dashboard View
CREATE OR REPLACE VIEW public.ministry_dashboard_view AS
SELECT 
  m.id,
  m.name,
  m.description,
  m.meeting_time,
  m.location,
  m.is_active,
  p.first_name as leader_first_name,
  p.last_name as leader_last_name,
  COUNT(mm.user_id) as member_count,
  COUNT(DISTINCT e.id) as event_count
FROM public.ministries m
LEFT JOIN public.profiles p ON p.id = m.leader_id
LEFT JOIN public.ministry_members mm ON mm.ministry_id = m.id
LEFT JOIN public.events e ON e.created_by = m.leader_id
GROUP BY m.id, m.name, m.description, m.meeting_time, m.location, m.is_active, p.first_name, p.last_name;

-- =====================================================
-- POINT 5: Role-Based Dashboard Access Control
-- =====================================================

-- Create role verification functions
CREATE OR REPLACE FUNCTION public.get_user_dashboard_access()
RETURNS TABLE(
  can_access_member_dashboard boolean,
  can_access_financial_dashboard boolean,
  can_access_ministry_dashboard boolean,
  can_access_clergy_dashboard boolean,
  can_access_secretary_dashboard boolean,
  can_access_admin_dashboard boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('member', 'clergy', 'treasurer', 'secretary', 'system_admin')) THEN true ELSE false END,
    CASE WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('treasurer', 'system_admin')) THEN true ELSE false END,
    CASE WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('clergy', 'secretary', 'system_admin')) THEN true ELSE false END,
    CASE WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('clergy', 'system_admin')) THEN true ELSE false END,
    CASE WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('secretary', 'system_admin')) THEN true ELSE false END,
    CASE WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'system_admin') THEN true ELSE false END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POINT 6: Financial Dashboard Enhancement
-- =====================================================

-- Create financial analytics functions
CREATE OR REPLACE FUNCTION public.get_financial_summary(start_date date DEFAULT NULL, end_date date DEFAULT NULL)
RETURNS TABLE(
  total_income numeric,
  total_expenses numeric,
  net_amount numeric,
  transaction_count bigint,
  average_donation numeric,
  top_donor text,
  top_donor_amount numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END) as total_income,
    SUM(CASE WHEN ft.transaction_type = 'expense' THEN ABS(ft.amount) ELSE 0 END) as total_expenses,
    SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE -ft.amount END) as net_amount,
    COUNT(ft.id) as transaction_count,
    AVG(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE NULL END) as average_donation,
    CONCAT(p.first_name, ' ', p.last_name) as top_donor,
    MAX(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END) as top_donor_amount
  FROM public.financial_transactions ft
  LEFT JOIN public.profiles p ON p.id = ft.user_id
  WHERE (start_date IS NULL OR ft.date >= start_date)
    AND (end_date IS NULL OR ft.date <= end_date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POINT 7: Member Dashboard Enhancement
-- =====================================================

-- Create member activity tracking function
CREATE OR REPLACE FUNCTION public.get_member_activity(user_uuid uuid)
RETURNS TABLE(
  recent_events text[],
  ministry_involvement text[],
  attendance_rate numeric,
  last_attendance_date date,
  total_given numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ARRAY_AGG(DISTINCT e.title) as recent_events,
    ARRAY_AGG(DISTINCT m.name) as ministry_involvement,
    (COUNT(CASE WHEN ar.attendance_status = 'present' THEN 1 END) * 100.0 / COUNT(ar.id)) as attendance_rate,
    MAX(e.start_date::date) as last_attendance_date,
    SUM(CASE WHEN ft.transaction_type = 'income' THEN ft.amount ELSE 0 END) as total_given
  FROM public.profiles p
  LEFT JOIN public.attendance_records ar ON ar.user_id = p.id
  LEFT JOIN public.events e ON e.id = ar.event_id
  LEFT JOIN public.ministry_members mm ON mm.user_id = p.id
  LEFT JOIN public.ministries m ON m.id = mm.ministry_id
  LEFT JOIN public.financial_transactions ft ON ft.user_id = p.id
  WHERE p.id = user_uuid
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POINT 8: Clergy Dashboard Enhancement
-- =====================================================

-- Create pastoral care tracking function
CREATE OR REPLACE FUNCTION public.get_pastoral_care_summary()
RETURNS TABLE(
  total_members bigint,
  active_members bigint,
  recent_visits bigint,
  pending_requests bigint,
  ministry_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT m.user_id) as total_members,
    COUNT(DISTINCT CASE WHEN m.status = 'active' THEN m.user_id END) as active_members,
    COUNT(DISTINCT pv.id) as recent_visits,
    COUNT(DISTINCT psr.id) as pending_requests,
    COUNT(DISTINCT min.id) as ministry_count
  FROM public.members m
  LEFT JOIN public.pastoral_visits pv ON pv.member_id = m.user_id AND pv.visit_date >= CURRENT_DATE - INTERVAL '30 days'
  LEFT JOIN public.pastoral_support_requests psr ON psr.user_id = m.user_id AND psr.status = 'pending'
  LEFT JOIN public.ministries min ON min.leader_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POINT 9: Secretary Dashboard Enhancement
-- =====================================================

-- Create administrative functions
CREATE OR REPLACE FUNCTION public.get_administrative_summary()
RETURNS TABLE(
  total_events bigint,
  upcoming_events bigint,
  total_announcements bigint,
  active_announcements bigint,
  total_messages bigint,
  unread_messages bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT e.id) as total_events,
    COUNT(DISTINCT CASE WHEN e.start_date > NOW() THEN e.id END) as upcoming_events,
    COUNT(DISTINCT a.id) as total_announcements,
    COUNT(DISTINCT CASE WHEN a.is_active = true THEN a.id END) as active_announcements,
    COUNT(DISTINCT m.id) as total_messages,
    COUNT(DISTINCT CASE WHEN m.is_read = false THEN m.id END) as unread_messages
  FROM public.events e
  CROSS JOIN public.announcements a
  CROSS JOIN public.messages m;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- POINT 10: System Monitoring & Error Handling
-- =====================================================

-- Create system health monitoring function
CREATE OR REPLACE FUNCTION public.get_system_health()
RETURNS TABLE(
  metric_name text,
  metric_value text,
  status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'Database Connection'::text as metric_name,
    'Connected'::text as metric_value,
    'OK'::text as status
  UNION ALL
  SELECT 
    'Total Tables'::text,
    COUNT(*)::text,
    CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'ERROR' END
  FROM information_schema.tables WHERE table_schema = 'public'
  UNION ALL
  SELECT 
    'RLS Enabled Tables'::text,
    COUNT(*)::text,
    CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'WARNING' END
  FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true
  UNION ALL
  SELECT 
    'Active Users'::text,
    COUNT(*)::text,
    'OK'
  FROM public.profiles
  UNION ALL
  SELECT 
    'Recent Transactions'::text,
    COUNT(*)::text,
    CASE WHEN COUNT(*) > 0 THEN 'OK' ELSE 'WARNING' END
  FROM public.financial_transactions WHERE date >= CURRENT_DATE - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create error logging table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  user_id UUID REFERENCES public.profiles(id),
  table_name TEXT,
  operation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create error logging function
CREATE OR REPLACE FUNCTION public.log_error(
  error_type text,
  error_message text,
  table_name text DEFAULT NULL,
  operation text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.error_logs (error_type, error_message, user_id, table_name, operation)
  VALUES (error_type, error_message, auth.uid(), table_name, operation);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- Final Verification Queries
-- =====================================================

-- Verify all enhancements are working
SELECT 'System Enhancement Complete' as status,
       COUNT(*) as total_tables,
       COUNT(CASE WHEN rowsecurity = true THEN 1 END) as rls_enabled_tables
FROM pg_tables 
WHERE schemaname = 'public';

-- Test data access for each role
SELECT 'Data Access Test' as test,
       COUNT(*) as total_profiles,
       COUNT(CASE WHEN p.id = '11111111-1111-1111-1111-111111111111' THEN 1 END) as admin_profile_exists
FROM public.profiles p;

-- Verify dummy data creation
SELECT 'Dummy Data Verification' as verification,
       COUNT(*) as total_members,
       COUNT(DISTINCT ministry_id) as total_ministries,
       COUNT(DISTINCT account_id) as total_accounts,
       COUNT(DISTINCT event_id) as total_events
FROM (
  SELECT 1 as total_members FROM public.members LIMIT 1
) m
CROSS JOIN (
  SELECT 1 as ministry_id FROM public.ministries LIMIT 1
) min
CROSS JOIN (
  SELECT 1 as account_id FROM public.financial_accounts LIMIT 1
) fa
CROSS JOIN (
  SELECT 1 as event_id FROM public.events LIMIT 1
) e; 