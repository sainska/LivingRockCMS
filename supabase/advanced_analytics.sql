-- 1. Engagement Analytics View
CREATE OR REPLACE VIEW public.engagement_analytics AS
SELECT
  p.id AS user_id,
  p.first_name,
  p.last_name,
  COUNT(DISTINCT ar.event_id) AS events_attended,
  COUNT(DISTINCT mg.ministry_group_id) AS groups_joined,
  COUNT(DISTINCT pr.id) AS prayer_requests,
  COUNT(DISTINCT d.id) AS donations
FROM profiles p
LEFT JOIN attendance_records ar ON ar.user_id = p.id
LEFT JOIN ministry_group_members mg ON mg.user_id = p.id
LEFT JOIN prayer_requests pr ON pr.user_id = p.id
LEFT JOIN financial_transactions d ON d.user_id = p.id
GROUP BY p.id, p.first_name, p.last_name;

-- 2. Giving Analytics View
CREATE OR REPLACE VIEW public.giving_analytics AS
SELECT
  p.id AS user_id,
  p.first_name,
  p.last_name,
  SUM(CASE WHEN ft.transaction_type = 'tithe' THEN ft.amount ELSE 0 END) AS total_tithes,
  SUM(CASE WHEN ft.transaction_type = 'offering' THEN ft.amount ELSE 0 END) AS total_offerings,
  SUM(CASE WHEN ft.transaction_type = 'donation' THEN ft.amount ELSE 0 END) AS total_donations,
  COUNT(ft.id) AS giving_transactions
FROM profiles p
LEFT JOIN financial_transactions ft ON ft.user_id = p.id
GROUP BY p.id, p.first_name, p.last_name;

-- 3. Predictive Analytics Table (for storing forecasts)
CREATE TABLE IF NOT EXISTS public.predictive_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric TEXT NOT NULL,
    forecast_value NUMERIC,
    forecast_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 