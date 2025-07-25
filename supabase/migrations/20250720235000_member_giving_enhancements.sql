-- Migration: Member Giving Enhancements

-- 1. Pledges Table
CREATE TABLE IF NOT EXISTS pledges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id uuid REFERENCES users(id),
    amount numeric NOT NULL,
    purpose text,
    start_date date NOT NULL,
    end_date date,
    fulfilled_amount numeric DEFAULT 0,
    status text DEFAULT 'active',
    created_at timestamptz DEFAULT now()
);

-- 2. Giving Goals Table
CREATE TABLE IF NOT EXISTS giving_goals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_id uuid REFERENCES users(id),
    goal_amount numeric NOT NULL,
    period text NOT NULL, -- e.g. 'year', 'month', 'custom'
    start_date date NOT NULL,
    end_date date,
    created_at timestamptz DEFAULT now()
);

-- 3. Add is_anonymous to donations
ALTER TABLE donations ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;

-- 4. Add show_giving_details to users (or profiles)
ALTER TABLE users ADD COLUMN IF NOT EXISTS show_giving_details boolean DEFAULT true; 