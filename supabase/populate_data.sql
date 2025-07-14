-- =====================================================
-- Living Rock CMS - Populate Database with Initial Data
-- =====================================================
-- This script populates the database with sample data for testing
-- Run this after running the dashboard_schema.sql script

-- =====================================================
-- 1. POPULATE SYSTEM STATISTICS
-- =====================================================

INSERT INTO public.system_stats (stat_type, value, change_value, change_description) VALUES
('total_users', '247', '+12', '+12 this month'),
('active_sessions', '43', '43', 'Real-time'),
('system_health', '99.8%', '99.8', 'Uptime'),
('storage_used', '15.2 GB', '15.2', 'of 100 GB')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 2. POPULATE SYSTEM EVENTS
-- =====================================================

INSERT INTO public.system_events (event_type, action, user_name, details) VALUES
('user_added', 'New user registered', 'System', '{"email": "john.doe@example.com", "role": "member"}'),
('backup_completed', 'System backup completed successfully', 'System', '{"backup_size": "2.5GB", "duration": "15 minutes"}'),
('security_scan', 'Security scan completed', 'System', '{"threats_found": 0, "scan_duration": "5 minutes"}'),
('church_info_updated', 'Church information updated', 'Admin', '{"updated_fields": ["phone", "email"]}'),
('role_changed', 'User role updated', 'Admin', '{"user_id": "123", "old_role": "member", "new_role": "clergy"}'),
('system_maintenance', 'System maintenance completed', 'System', '{"maintenance_type": "database_optimization"}'),
('user_added', 'New member joined', 'System', '{"email": "jane.smith@example.com", "role": "member"}'),
('backup_completed', 'Daily backup completed', 'System', '{"backup_size": "2.3GB", "duration": "12 minutes"}'),
('security_scan', 'Weekly security scan', 'System', '{"threats_found": 0, "scan_duration": "8 minutes"}'),
('church_info_updated', 'Service times updated', 'Admin', '{"updated_fields": ["service_times"]}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 3. POPULATE MEMBERS
-- =====================================================

-- First, ensure we have some profiles to reference
-- Note: In a real scenario, these would be created when users register
INSERT INTO public.profiles (id, first_name, last_name, email, phone) VALUES
(gen_random_uuid(), 'John', 'Doe', 'john.doe@example.com', '+254 700 000 001'),
(gen_random_uuid(), 'Jane', 'Smith', 'jane.smith@example.com', '+254 700 000 002'),
(gen_random_uuid(), 'Michael', 'Johnson', 'michael.johnson@example.com', '+254 700 000 003'),
(gen_random_uuid(), 'Sarah', 'Williams', 'sarah.williams@example.com', '+254 700 000 004'),
(gen_random_uuid(), 'David', 'Brown', 'david.brown@example.com', '+254 700 000 005')
ON CONFLICT DO NOTHING;

-- Then insert members (you'll need to replace the profile_id with actual UUIDs from your profiles table)
-- For now, we'll use placeholder UUIDs
INSERT INTO public.members (profile_id, member_number, date_joined, membership_status, baptism_date, marital_status, children_count, ministry_involvement, skills, notes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'M001', '2023-01-15', 'active', '2023-02-20', 'married', 2, ARRAY['youth_ministry', 'worship_team'], ARRAY['music', 'teaching'], 'Active member with strong leadership skills'),
('550e8400-e29b-41d4-a716-446655440002', 'M002', '2023-03-10', 'active', '2023-04-15', 'single', 0, ARRAY['children_ministry'], ARRAY['arts', 'crafts'], 'Creative and patient with children'),
('550e8400-e29b-41d4-a716-446655440003', 'M003', '2023-02-28', 'active', '2023-03-30', 'married', 1, ARRAY['ushering_team'], ARRAY['hospitality', 'organization'], 'Great at welcoming new visitors'),
('550e8400-e29b-41d4-a716-446655440004', 'M004', '2023-04-05', 'active', '2023-05-10', 'single', 0, ARRAY['prayer_team'], ARRAY['intercession', 'counseling'], 'Has a heart for prayer and counseling'),
('550e8400-e29b-41d4-a716-446655440005', 'M005', '2023-01-20', 'active', '2023-02-25', 'married', 3, ARRAY['men_brotherhood'], ARRAY['leadership', 'mentoring'], 'Experienced leader and mentor')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. POPULATE EVENTS
-- =====================================================

INSERT INTO public.events (title, description, event_type, date, start_time, end_time, location, speaker, topic, scripture, expected_attendance, actual_attendance, status) VALUES
('Sunday Morning Service', 'Weekly Sunday service', 'service', '2024-06-16', '09:00:00', '11:00:00', 'Main Sanctuary', 'Pastor John Doe', 'Walking in Faith', 'Hebrews 11:1-6', 450, 425, 'completed'),
('Wednesday Bible Study', 'Midweek Bible study', 'bible_study', '2024-06-19', '19:00:00', '20:30:00', 'Fellowship Hall', 'Pastor John Doe', 'The Power of Prayer', 'James 5:13-18', 85, 78, 'scheduled'),
('Youth Service', 'Youth ministry meeting', 'youth_service', '2024-06-22', '18:00:00', '20:00:00', 'Youth Center', 'Youth Pastor', 'Living for Christ', '1 Timothy 4:12', 120, 0, 'scheduled'),
('Women Fellowship', 'Monthly women meeting', 'meeting', '2024-06-25', '14:00:00', '16:00:00', 'Fellowship Hall', 'Sarah Williams', 'Women of Faith', 'Proverbs 31:10-31', 60, 0, 'scheduled'),
('Men Brotherhood', 'Monthly men meeting', 'meeting', '2024-06-28', '19:00:00', '21:00:00', 'Conference Room', 'David Brown', 'Men of Integrity', '1 Timothy 3:1-13', 40, 0, 'scheduled')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. POPULATE FINANCIAL TRANSACTIONS
-- =====================================================

-- Get category IDs (you'll need to replace these with actual UUIDs from your financial_categories table)
-- For now, we'll use placeholder UUIDs
INSERT INTO public.financial_transactions (transaction_date, category_id, amount, type, description, payment_method, donor_name, recorded_by) VALUES
('2024-06-01', '550e8400-e29b-41d4-a716-446655440010', 50000.00, 'income', 'Sunday offering', 'cash', NULL, '550e8400-e29b-41d4-a716-446655440001'),
('2024-06-01', '550e8400-e29b-41d4-a716-446655440011', 15000.00, 'income', 'Special offering for missions', 'mobile_money', NULL, '550e8400-e29b-41d4-a716-446655440001'),
('2024-06-02', '550e8400-e29b-41d4-a716-446655440012', 25000.00, 'expense', 'Utility bills payment', 'bank_transfer', NULL, '550e8400-e29b-41d4-a716-446655440001'),
('2024-06-03', '550e8400-e29b-41d4-a716-446655440013', 80000.00, 'expense', 'Staff salaries', 'bank_transfer', NULL, '550e8400-e29b-41d4-a716-446655440001'),
('2024-06-05', '550e8400-e29b-41d4-a716-446655440010', 45000.00, 'income', 'Wednesday offering', 'cash', NULL, '550e8400-e29b-41d4-a716-446655440001'),
('2024-06-08', '550e8400-e29b-41d4-a716-446655440010', 52000.00, 'income', 'Sunday offering', 'cash', NULL, '550e8400-e29b-41d4-a716-446655440001'),
('2024-06-10', '550e8400-e29b-41d4-a716-446655440014', 15000.00, 'expense', 'Building maintenance', 'check', NULL, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 6. POPULATE ANNOUNCEMENTS
-- =====================================================

INSERT INTO public.announcements (title, content, priority, target_audience, start_date, end_date, is_active, created_by) VALUES
('Welcome to New Members', 'We warmly welcome our new members who joined us this month. Please introduce yourselves and make them feel at home.', 'normal', ARRAY['all'], '2024-06-01', '2024-06-30', true, '550e8400-e29b-41d4-a716-446655440001'),
('Youth Ministry Meeting', 'All youth are invited to our special meeting this Friday at 6 PM. We will have games, worship, and Bible study.', 'high', ARRAY['youth'], '2024-06-15', '2024-06-22', true, '550e8400-e29b-41d4-a716-446655440001'),
('Women Fellowship', 'Ladies, join us for our monthly fellowship meeting. We will have prayer, sharing, and refreshments.', 'normal', ARRAY['women'], '2024-06-20', '2024-06-25', true, '550e8400-e29b-41d4-a716-446655440001'),
('Men Brotherhood', 'Gentlemen, our monthly brotherhood meeting is scheduled. Come for fellowship, prayer, and accountability.', 'normal', ARRAY['men'], '2024-06-25', '2024-06-28', true, '550e8400-e29b-41d4-a716-446655440001'),
('Church Cleanup Day', 'We need volunteers for our monthly church cleanup. Please sign up at the information desk.', 'normal', ARRAY['all'], '2024-06-10', '2024-06-15', true, '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 7. POPULATE NOTIFICATIONS
-- =====================================================

INSERT INTO public.notifications (user_id, title, message, type, action_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Welcome to Living Rock Church', 'Thank you for joining our church family. We are excited to have you with us!', 'info', '/welcome'),
('550e8400-e29b-41d4-a716-446655440002', 'Bible Study Reminder', 'Don''t forget about tonight''s Bible study at 7 PM.', 'info', '/events'),
('550e8400-e29b-41d4-a716-446655440003', 'New Announcement', 'There is a new announcement posted. Please check it out.', 'info', '/announcements'),
('550e8400-e29b-41d4-a716-446655440004', 'Prayer Request', 'Someone has requested prayer. Please keep them in your prayers.', 'info', '/prayer-requests'),
('550e8400-e29b-41d4-a716-446655440005', 'Event Update', 'The youth service time has been changed to 6:30 PM.', 'warning', '/events')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 8. POPULATE SECURITY LOGS
-- =====================================================

INSERT INTO public.security_logs (user_id, action, ip_address, user_agent, success, details) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'login', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', true, '{"login_method": "password"}'),
('550e8400-e29b-41d4-a716-446655440002', 'login', '192.168.1.101', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', true, '{"login_method": "password"}'),
('550e8400-e29b-41d4-a716-446655440003', 'logout', '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', true, '{"session_duration": "2h 15m"}'),
('550e8400-e29b-41d4-a716-446655440004', 'password_change', '192.168.1.103', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15', true, '{"change_method": "forgot_password"}'),
('550e8400-e29b-41d4-a716-446655440005', 'role_change', '192.168.1.104', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', true, '{"old_role": "member", "new_role": "clergy", "changed_by": "admin"}')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. POPULATE USER ACTIVITY
-- =====================================================

INSERT INTO public.user_activity (user_id, activity_type, description, module, session_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'login', 'User logged into the system', 'auth', 'session_001'),
('550e8400-e29b-41d4-a716-446655440001', 'view_dashboard', 'User viewed admin dashboard', 'dashboard', 'session_001'),
('550e8400-e29b-41d4-a716-446655440001', 'view_members', 'User viewed members list', 'members', 'session_001'),
('550e8400-e29b-41d4-a716-446655440002', 'login', 'User logged into the system', 'auth', 'session_002'),
('550e8400-e29b-41d4-a716-446655440002', 'view_events', 'User viewed events calendar', 'events', 'session_002'),
('550e8400-e29b-41d4-a716-446655440003', 'login', 'User logged into the system', 'auth', 'session_003'),
('550e8400-e29b-41d4-a716-446655440003', 'view_finances', 'User viewed financial reports', 'finances', 'session_003'),
('550e8400-e29b-41d4-a716-446655440004', 'login', 'User logged into the system', 'auth', 'session_004'),
('550e8400-e29b-41d4-a716-446655440004', 'send_message', 'User sent a message', 'communication', 'session_004'),
('550e8400-e29b-41d4-a716-446655440005', 'login', 'User logged into the system', 'auth', 'session_005'),
('550e8400-e29b-41d4-a716-446655440005', 'view_reports', 'User viewed system reports', 'reports', 'session_005')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. POPULATE BACKUP LOGS
-- =====================================================

INSERT INTO public.backup_logs (backup_type, status, file_size, file_url, started_by) VALUES
('full', 'completed', 2684354560, 'https://backup.example.com/backup_2024_06_01.zip', '550e8400-e29b-41d4-a716-446655440001'),
('incremental', 'completed', 536870912, 'https://backup.example.com/backup_2024_06_02.zip', '550e8400-e29b-41d4-a716-446655440001'),
('full', 'completed', 2684354560, 'https://backup.example.com/backup_2024_06_03.zip', '550e8400-e29b-41d4-a716-446655440001'),
('incremental', 'completed', 536870912, 'https://backup.example.com/backup_2024_06_04.zip', '550e8400-e29b-41d4-a716-446655440001'),
('manual', 'completed', 2684354560, 'https://backup.example.com/backup_2024_06_05.zip', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. POPULATE INTEGRATIONS
-- =====================================================

INSERT INTO public.integrations (name, type, provider, config, is_active) VALUES
('SMS Gateway', 'sms', 'Twilio', '{"account_sid": "AC1234567890abcdef", "auth_token": "your_auth_token", "phone_number": "+1234567890"}', false),
('Email Service', 'email', 'SendGrid', '{"api_key": "your_sendgrid_api_key", "from_email": "noreply@livingrockchurch.org"}', false),
('Payment Gateway', 'payment', 'M-Pesa', '{"consumer_key": "your_consumer_key", "consumer_secret": "your_consumer_secret", "passkey": "your_passkey"}', false),
('Social Media', 'social_media', 'Facebook', '{"page_id": "your_page_id", "access_token": "your_access_token"}', false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. POPULATE REPORT TEMPLATES
-- =====================================================

INSERT INTO public.report_templates (name, description, report_type, parameters, created_by) VALUES
('Monthly Attendance Report', 'Report showing monthly attendance statistics', 'attendance', '{"include_guests": true, "group_by_week": true}', '550e8400-e29b-41d4-a716-446655440001'),
('Financial Summary Report', 'Monthly financial summary with income and expenses', 'financial', '{"include_categories": true, "show_trends": true}', '550e8400-e29b-41d4-a716-446655440001'),
('Member Growth Report', 'Report showing member growth and demographics', 'membership', '{"include_demographics": true, "show_trends": true}', '550e8400-e29b-41d4-a716-446655440001'),
('Activity Log Report', 'System activity and user engagement report', 'activity', '{"include_user_details": true, "filter_by_date": true}', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DATA POPULATION COMPLETE
-- =====================================================

-- This script has populated the database with:
-- 1. System statistics for dashboard display
-- 2. Recent system events for activity feed
-- 3. Sample members with profiles
-- 4. Upcoming and past events
-- 5. Financial transactions
-- 6. Announcements
-- 7. User notifications
-- 8. Security logs
-- 9. User activity logs
-- 10. Backup logs
-- 11. Integration configurations
-- 12. Report templates

-- Note: Some records use placeholder UUIDs for foreign key references.
-- In a real implementation, you would need to:
-- 1. Replace placeholder UUIDs with actual UUIDs from your tables
-- 2. Ensure all foreign key relationships are valid
-- 3. Adjust data according to your specific church needs

-- The dashboard should now display real data from the database! 