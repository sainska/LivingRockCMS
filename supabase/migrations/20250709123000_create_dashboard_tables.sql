-- Dashboard Tables Migration

-- Members Table
CREATE TABLE IF NOT EXISTS members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50),
    joined_at DATE,
    status VARCHAR(20) DEFAULT 'active'
);

-- Donations Table
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    name VARCHAR(255), -- fallback if not a member
    amount DECIMAL(12,2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Tithe', 'Offering', 'Campaign', 'Building Fund', etc.
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'completed', -- 'completed', 'pending', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups Table
CREATE TABLE IF NOT EXISTS groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(50),
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    goal_amount DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pledges Table
CREATE TABLE IF NOT EXISTS pledges (
    id SERIAL PRIMARY KEY,
    member_id INTEGER REFERENCES members(id),
    campaign_id INTEGER REFERENCES campaigns(id),
    amount DECIMAL(12,2) NOT NULL,
    pledge_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 