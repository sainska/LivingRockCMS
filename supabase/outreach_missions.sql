-- 1. Mission Trips Table
CREATE TABLE IF NOT EXISTS public.mission_trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    location TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Mission Trip Participants Table
CREATE TABLE IF NOT EXISTS public.mission_trip_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    mission_trip_id UUID REFERENCES public.mission_trips(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Community Service Projects Table
CREATE TABLE IF NOT EXISTS public.community_service_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    location TEXT,
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed', 'cancelled')),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Service Participation Table
CREATE TABLE IF NOT EXISTS public.service_participation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.community_service_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT,
    hours NUMERIC,
    status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'completed', 'cancelled')),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 