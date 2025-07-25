create table if not exists event_feedback (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references events(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    rating integer check (rating >= 1 and rating <= 5),
    feedback text,
    submitted_at timestamp with time zone default now()
); 