-- =====================================================
-- Living Rock CMS - Member Dashboard SQL Queries/Views
-- =====================================================
-- Assumes all referenced tables already exist in the schema
-- Use parameter placeholders (e.g., :user_id) for integration

-- 1. Profile & Personal Information
-----------------------------------------------------
-- a. View Profile
SELECT
  p.id,
  p.first_name,
  p.last_name,
  p.email,
  p.phone,
  p.address,
  p.gender,
  p.date_of_birth,
  p.photo_url,
  p.membership_status,
  p.membership_number,
  p.join_date
FROM profiles p
WHERE p.id = 'your-actual-user-id-here';

-- b. Edit Profile (example update)
-- UPDATE profiles
-- SET phone = :phone, email = :email, address = :address, emergency_contact = :emergency_contact
-- WHERE id = :user_id;

-- d. Sacraments Records
SELECT
  s.id,
  s.sacrament_type,
  s.date,
  s.place,
  s.notes
FROM sacraments s
WHERE s.user_id = 'your-actual-user-id-here';

-- 2. Ministry & Group Involvement
-----------------------------------------------------
-- a. Assigned Ministries
SELECT
  mgm.id,
  mgm.ministry_group_id,
  mg.name AS group_name,
  mgm.role AS group_role,
  mg.meeting_time,
  mg.location,
  mg.leader_id
FROM ministry_group_members mgm
JOIN ministry_groups mg ON mg.id = mgm.ministry_group_id
WHERE mgm.user_id = 'your-actual-user-id-here';

-- b. Group Details
SELECT
  mg.id,
  mg.name,
  mg.meeting_time,
  mg.location,
  mg.leader_id,
  p.first_name AS leader_first_name,
  p.last_name AS leader_last_name
FROM ministry_groups mg
LEFT JOIN profiles p ON p.id = mg.leader_id
WHERE mg.id = 'your-actual-group-id-here';

-- c. Join Requests (insert example)
-- INSERT INTO ministry_group_join_requests (user_id, ministry_group_id, status, requested_at)
-- VALUES (:user_id, :ministry_group_id, 'pending', NOW());
-- To view requests:
SELECT * FROM ministry_group_join_requests WHERE user_id = :user_id;

-- 3. Attendance & Events
-----------------------------------------------------
-- a. Event Calendar (Upcoming Events)
SELECT
  e.id,
  e.title,
  e.event_type,
  e.start_date,
  e.end_date,
  e.location,
  e.description
FROM events e
WHERE e.start_date >= CURRENT_DATE
ORDER BY e.start_date ASC;

-- b. My Attendance History
SELECT
  ar.id,
  ar.event_id,
  e.title,
  e.start_date,
  ar.attendance_status,
  ar.notes
FROM attendance_records ar
JOIN events e ON e.id = ar.event_id
WHERE ar.user_id = 'your-actual-user-id-here'
ORDER BY e.start_date DESC;

-- c. Event Sign up/RSVP (insert example)
-- INSERT INTO attendance_records (event_id, user_id, attendance_status, recorded_by, notes)
-- VALUES (:event_id, :user_id, 'present', :user_id, 'RSVP via dashboard')
-- ON CONFLICT (event_id, user_id) DO UPDATE
-- SET attendance_status = 'present', notes = 'RSVP updated via dashboard';

-- d. Volunteer Opportunities
SELECT
  v.id,
  v.event_id,
  e.title AS event_title,
  v.role_needed,
  v.description,
  v.status
FROM volunteer_opportunities v
JOIN events e ON e.id = v.event_id
WHERE v.status = 'open';
-- To sign up:
-- INSERT INTO volunteer_signups (volunteer_opportunity_id, user_id, status, signed_up_at)
-- VALUES (:volunteer_opportunity_id, :user_id, 'pending', NOW());

-- 4. Giving & Financial Overview
-----------------------------------------------------
-- a. My Contributions
SELECT
  ft.id,
  ft.amount,
  ft.transaction_type,
  ft.date,
  ft.account_id,
  fa.name AS account_name,
  ft.notes
FROM financial_transactions ft
JOIN financial_accounts fa ON fa.id = ft.account_id
WHERE ft.user_id = 'your-actual-user-id-here'
ORDER BY ft.date DESC;

-- b. Giving History Reports (Monthly)
SELECT
  DATE_TRUNC('month', ft.date) AS month,
  SUM(ft.amount) AS total_given
FROM financial_transactions ft
WHERE ft.user_id = 'your-actual-user-id-here'
GROUP BY month
ORDER BY month DESC;

-- b. Giving History Reports (Yearly)
SELECT
  DATE_TRUNC('year', ft.date) AS year,
  SUM(ft.amount) AS total_given
FROM financial_transactions ft
WHERE ft.user_id = 'your-actual-user-id-here'
GROUP BY year
ORDER BY year DESC;

-- c. Pledge Tracking
SELECT
  p.id,
  p.project_name,
  p.amount_pledged,
  p.amount_fulfilled,
  p.due_date,
  p.status
FROM pledges p
WHERE p.user_id = 'your-actual-user-id-here';

-- 5. Pastoral Care
-----------------------------------------------------
-- a. Pastoral Visits
SELECT
  pv.id,
  pv.visit_date,
  pv.pastor_id,
  p.first_name AS pastor_first_name,
  p.last_name AS pastor_last_name,
  pv.status,
  pv.notes
FROM pastoral_visits pv
LEFT JOIN profiles p ON p.id = pv.pastor_id
WHERE pv.member_id = 'your-actual-user-id-here'
ORDER BY pv.visit_date DESC;

-- b. Counseling Sessions
SELECT
  cs.id,
  cs.session_date,
  cs.counselor_id,
  p.first_name AS counselor_first_name,
  p.last_name AS counselor_last_name,
  cs.status,
  cs.notes
FROM counseling_sessions cs
LEFT JOIN profiles p ON p.id = cs.counselor_id
WHERE cs.member_id = 'your-actual-user-id-here'
ORDER BY cs.session_date DESC;

-- c. Request Pastoral Support (insert example)
-- INSERT INTO pastoral_support_requests (user_id, request_type, details, status, requested_at)
-- VALUES (:user_id, :request_type, :details, 'pending', NOW());

-- 6. Messages & Announcements
-----------------------------------------------------
-- a. Announcements Feed
SELECT
  a.id,
  a.title,
  a.content,
  a.announcement_type,
  a.priority,
  a.start_date,
  a.end_date,
  a.is_active,
  a.created_at
FROM announcements a
WHERE a.is_active = TRUE
  AND (a.start_date IS NULL OR a.start_date <= CURRENT_DATE)
  AND (a.end_date IS NULL OR a.end_date >= CURRENT_DATE)
ORDER BY a.priority DESC, a.created_at DESC;

-- b. Inbox (Messages Received)
SELECT
  m.id,
  m.sender_id,
  p.first_name AS sender_first_name,
  p.last_name AS sender_last_name,
  m.subject,
  m.content,
  m.is_read,
  m.created_at
FROM messages m
LEFT JOIN profiles p ON p.id = m.sender_id
WHERE m.recipient_id = 'your-actual-user-id-here'
ORDER BY m.created_at DESC;

-- c. Sent Items (Messages Sent)
SELECT
  m.id,
  m.recipient_id,
  p.first_name AS recipient_first_name,
  p.last_name AS recipient_last_name,
  m.subject,
  m.content,
  m.is_read,
  m.created_at
FROM messages m
LEFT JOIN profiles p ON p.id = m.recipient_id
WHERE m.sender_id = 'your-actual-user-id-here'
ORDER BY m.created_at DESC;

-- d. Reply / Compose (insert example)
-- INSERT INTO messages (sender_id, recipient_id, subject, content, message_type, created_at)
-- VALUES (:user_id, :recipient_id, :subject, :content, 'general', NOW());

-- 7. System Settings (Member Level)
-----------------------------------------------------
-- a. Privacy Settings
SELECT
  privacy_settings
FROM profiles
WHERE id = 'your-actual-user-id-here';
-- To update:
-- UPDATE profiles SET privacy_settings = :privacy_settings WHERE id = :user_id;

-- 8. Gamification / Badges (Optional)
-----------------------------------------------------
SELECT
  b.id,
  b.name,
  b.description,
  b.icon_url,
  mb.earned_at
FROM member_badges mb
JOIN badges b ON b.id = mb.badge_id
WHERE mb.user_id = 'your-actual-user-id-here';

-- 9. Surveys & Feedback (Optional)
-----------------------------------------------------
SELECT
  s.id,
  s.title,
  s.description,
  s.status,
  s.start_date,
  s.end_date
FROM surveys s
WHERE s.status = 'active';
-- To submit feedback:
-- INSERT INTO survey_responses (survey_id, user_id, response, submitted_at)
-- VALUES (:survey_id, :user_id, :response, NOW()); 

-- Member Dashboard: Attendance & Events Tables

-- 1. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    event_type TEXT, -- e.g. 'service', 'bible_study', 'youth', etc.
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    attendance_status TEXT DEFAULT 'present' CHECK (attendance_status IN ('present', 'absent', 'late', 'excused', 'declined')),
    recorded_by UUID REFERENCES public.profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 3. Volunteer Opportunities Table
CREATE TABLE IF NOT EXISTS public.volunteer_opportunities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    event_title TEXT,
    role_needed TEXT,
    description TEXT,
    is_open BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Volunteer Signups Table
CREATE TABLE IF NOT EXISTS public.volunteer_signups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    signed_up_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(opportunity_id, user_id)
);

-- 5. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON public.attendance_records(user_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_opportunities_event_id ON public.volunteer_opportunities(event_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_signups_user_id ON public.volunteer_signups(user_id); 