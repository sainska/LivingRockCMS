ALTER TABLE public.attendance_records
ADD CONSTRAINT fk_attendance_event
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE; 