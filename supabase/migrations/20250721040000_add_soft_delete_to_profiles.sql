-- Migration: Add deleted_at field to profiles table for soft delete
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE; 