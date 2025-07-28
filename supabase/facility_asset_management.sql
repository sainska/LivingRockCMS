-- 1. Facilities Table
CREATE TABLE IF NOT EXISTS public.facilities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    description TEXT
);

-- 2. Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    facility_id UUID REFERENCES public.facilities(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER,
    description TEXT
);

-- 3. Room Bookings Table
CREATE TABLE IF NOT EXISTS public.room_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    booked_by UUID REFERENCES public.profiles(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    purpose TEXT,
    status TEXT DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Assets Table
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    facility_id UUID REFERENCES public.facilities(id),
    room_id UUID REFERENCES public.rooms(id),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired')),
    value NUMERIC,
    acquired_at TIMESTAMP WITH TIME ZONE
);

-- 5. Asset Assignments Table
CREATE TABLE IF NOT EXISTS public.asset_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    returned_at TIMESTAMP WITH TIME ZONE
); 