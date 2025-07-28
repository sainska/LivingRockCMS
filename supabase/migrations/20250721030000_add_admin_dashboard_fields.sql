-- Migration: Add require_2fa and session_version fields to profiles table for admin dashboard features
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS require_2fa BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS session_version INTEGER DEFAULT 0; 