create table if not exists event_media (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references events(id) on delete cascade,
    url text,
    type text, -- 'photo' or 'video'
    uploaded_by uuid references profiles(id),
    uploaded_at timestamp with time zone default now()
); 