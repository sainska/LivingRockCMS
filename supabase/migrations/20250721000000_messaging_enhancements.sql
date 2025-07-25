-- Messaging enhancements migration
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS deleted_by_recipient BOOLEAN DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS deleted_by_sender BOOLEAN DEFAULT false;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS thread_id UUID;
ALTER TABLE public.messages ADD COLUMN IF NOT EXISTS attachment_url TEXT; 