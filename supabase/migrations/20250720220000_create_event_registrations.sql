create table if not exists event_registrations (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references events(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    registered_at timestamp with time zone default now(),
    status text default 'registered',
    unique (event_id, user_id)
); 