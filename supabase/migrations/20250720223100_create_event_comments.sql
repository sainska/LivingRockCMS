create table if not exists event_comments (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references events(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    comment text,
    created_at timestamp with time zone default now(),
    is_moderated boolean default false
); 