create table if not exists event_reminders (
    id uuid primary key default gen_random_uuid(),
    event_id uuid references events(id) on delete cascade,
    user_id uuid references profiles(id) on delete cascade,
    reminder_time timestamp with time zone,
    method text default 'email'
); 