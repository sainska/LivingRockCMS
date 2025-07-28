-- Migration: Create audit_logs table for user activity history
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_id UUID,
    target_type TEXT,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id); 